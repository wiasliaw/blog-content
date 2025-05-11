---
title: "[context] chainlink vrf v2 integration"
description: chainlink vrf v2 snippet
permalink: 
tags:
  - context
  - defi/oracle
  - protocol/chainlink
draft: false
created: 2025-05-11, 03:48
updated: 2025-05-11, 04:18
---
## dependencies

```json
{
  "dependencies": {
    "@chainlink/contracts": "^1.3.0",
    "@openzeppelin/contracts": "^5.3.0"
  },
  "devDependencies": {
    "forge-std": "github:foundry-rs/forge-std"
  }
}
```

## snippet

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

import {RequestStatus, SubscriptionConfig} from "../interfaces/IDataType.sol";
import {ErrorsLib} from "../libraries/ErrorsLib.sol";
import {EventsLib} from "../libraries/EventsLib.sol";

/// @title ChainlinkVRF
/// @notice Wrapper for Chainlink VRF V2
contract ChainlinkVRF is VRFConsumerBaseV2 {
    ////////////////////////////////////////////////////////////////////////
    // State Variables
    ////////////////////////////////////////////////////////////////////////

    /// @notice Chainlink VRF V2 Coordinator
    VRFCoordinatorV2Interface internal s_coordinator;

    /// @notice Chainlink VRF V2 Subscription Config
    SubscriptionConfig internal s_subscriptionConfig;

    /// @notice Chainlink Subscription Id
    uint64 internal s_subscriptionId;

    /// @notice past requests Id
    uint256[] internal s_requestIds;

    /// @notice `requestId` => `RequestStatus`
    mapping(uint256 => RequestStatus) internal s_requestStatus;

    ////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////

    /// @param _subscriptionId The subscription ID used for funding requests.
    /// @param _coordinator The address of the VRF Coordinator contract.
    constructor(uint64 _subscriptionId, address _coordinator) VRFConsumerBaseV2(_coordinator) {
        s_subscriptionId = _subscriptionId;
        s_coordinator = VRFCoordinatorV2Interface(_coordinator);
    }

    ////////////////////////////////////////////////////////////////////////
    // Core
    ////////////////////////////////////////////////////////////////////////

    function requestRandomWords() external returns (uint256 requestId) {
        requestId = _requestRandomWords();
    }

    function setSubscriptionConfig(
        bytes32 _keyHash,
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        uint32 _numberOfWords
    ) external {
        _setSubscriptionConfig(_keyHash, _callbackGasLimit, _requestConfirmations, _numberOfWords);
    }

    /// @notice Request for randomness.
    /// @return requestId A unique identifier of the request from coordinator.
    function _requestRandomWords() internal returns (uint256 requestId) {
        // interact: request random words
        requestId = s_coordinator.requestRandomWords(
            s_subscriptionConfig.keyHash,
            s_subscriptionId,
            s_subscriptionConfig.requestConfirmations,
            s_subscriptionConfig.callbackGasLimit,
            s_subscriptionConfig.numberOfWords
        );

        // effect: record requestId
        s_requestIds.push(requestId);
        s_requestStatus[requestId] = RequestStatus({randomWords: new uint256[](0), exists: true, fulfilled: false});
        emit EventsLib.RequestSent(requestId, s_subscriptionConfig.numberOfWords);
    }

    /// @notice Set the Subscription Config.
    /// @param _keyHash See https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    /// @param _callbackGasLimit Depends on the number of requested values that you want sent to the fulfillRandomWords() function.
    ///   Storing each word costs about 20,000 gas.
    /// @param _requestConfirmations The minimum confirmations is 3.
    /// @param _numberOfWords The number of words for `fulfillRandomWords()`.
    function _setSubscriptionConfig(
        bytes32 _keyHash,
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        uint32 _numberOfWords
    ) internal {
        // effect: record config
        s_subscriptionConfig.keyHash = _keyHash;
        s_subscriptionConfig.callbackGasLimit = _callbackGasLimit;
        s_subscriptionConfig.requestConfirmations = _requestConfirmations;
        s_subscriptionConfig.numberOfWords = _numberOfWords;
        emit EventsLib.ConfigSet(_keyHash, _callbackGasLimit, _requestConfirmations, _numberOfWords);
    }

    ////////////////////////////////////////////////////////////////////////
    // Override
    ////////////////////////////////////////////////////////////////////////

    /// @notice Handles the VRF response.
    /// @param _requestId A unique identifier of the request from coordinator.
    /// @param _randomWords The VRF output expanded to the requested number of words.
    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords)
        internal
        virtual
        override(VRFConsumerBaseV2)
    {
        // check: request is existent
        require(s_requestStatus[_requestId].exists, ErrorsLib.RequestNotFound(_requestId));

        // effect: record fulfilled data
        s_requestStatus[_requestId].fulfilled = true;
        s_requestStatus[_requestId].randomWords = _randomWords;
        emit EventsLib.RequestFulfilled(_requestId, _randomWords);
    }

    ////////////////////////////////////////////////////////////////////////
    // View
    ////////////////////////////////////////////////////////////////////////

    /// @notice Get the Chainlink VRF Coordinator address.
    /// @return The Coordinator address.
    function getCoordinator() external view returns (address) {
        return address(s_coordinator);
    }

    /// @notice Get the Subscription Id.
    /// @return The Subscription Id.
    function getSubscriptionId() external view returns (uint64) {
        return s_subscriptionId;
    }

    /// @notice Get the Subscription Config.
    /// @return config The Subscription Config.
    function getSubscriptionConfig() external view returns (SubscriptionConfig memory config) {
        config = s_subscriptionConfig;
    }

    /// @notice Get the Request Id by index.
    /// @param _index The index position in the request IDs array.
    /// @return requestId A unique identifier of the request from coordinator.
    function getRequestId(uint256 _index) external view returns (uint256 requestId) {
        requestId = s_requestIds[_index];
    }

    /// @notice Get the Request Status by request id.
    /// @param _requestId A unique identifier of the request from coordinator.
    /// @return status The Request Status.
    function getRequestStatus(uint256 _requestId) external view returns (RequestStatus memory status) {
        status = s_requestStatus[_requestId];
    }
}
```

## testing

deploy and setup `VRFCoordinatorV2Mock.sol` for testing
1. call `CoordinatorV2#createSubscription()` for new subscription.
2. call `CoordinatorV2#fundSubscription()` for funding subscription.
3. deploy consumer contract.
4. call `CoordinatorV2#addConsumer()` to add consumer contract to subscription.

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

// test utils
import "forge-std/Test.sol";
// test instance
import "../src/interfaces/IDataType.sol";
import "./mocks/ChainlinkVRFMock.sol";
// mock
import "@chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2Mock.sol";

contract BaseTest is Test {
    // mock instance
    VRFCoordinatorV2Mock internal coordinatorV2Mock;

    // test instance
    bytes32 config_keyhash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint32 config_callbackGasLimit = 100000;
    uint16 config_requestConfirmations = 3;
    uint32 config_numberOfWords = 2;
    uint64 internal subscriptionId;
    ChainlinkVRFMock internal vrf_instance;

    function setUp() public virtual {
        // mock instance
        uint96 baseFee = 100000000000000000;
        uint96 gasPriceLink = 0;
        coordinatorV2Mock = new VRFCoordinatorV2Mock(baseFee, gasPriceLink);

        // vrf instance
        // - create subscription
        subscriptionId = coordinatorV2Mock.createSubscription();
        // - fund subscription
        coordinatorV2Mock.fundSubscription(subscriptionId, 10000000000000000000000);
        // - deploy consumer contract
        vrf_instance = new ChainlinkVRFMock(subscriptionId, address(coordinatorV2Mock));
        // - add consumer
        coordinatorV2Mock.addConsumer(subscriptionId, address(vrf_instance));
        // - set config
        vrf_instance.setSubscriptionConfig(
            config_keyhash, config_callbackGasLimit, config_requestConfirmations, config_numberOfWords
        );
    }
}
```

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import "../Base.t.sol";

contract ChainlinkVRFTest is BaseTest {
    function test_unit_deployment() external view {
        assertEq(vrf_instance.getCoordinator(), address(coordinatorV2Mock));
        assertEq(vrf_instance.getSubscriptionId(), subscriptionId);
    }

    function test_unit_config() external view {
        SubscriptionConfig memory config = vrf_instance.getSubscriptionConfig();
        assertEq(config.keyHash, config_keyhash);
        assertEq(config.callbackGasLimit, config_callbackGasLimit);
        assertEq(config.requestConfirmations, config_requestConfirmations);
        assertEq(config.numberOfWords, config_numberOfWords);
    }

    function test_unit_requestRandomWords() external {
        RequestStatus memory status;

        // request randomness
        uint256 requestId = vrf_instance.requestRandomWords();
        status = vrf_instance.getRequestStatus(requestId);
        assertEq(status.randomWords.length, 0);
        assertTrue(status.exists);
        assertFalse(status.fulfilled);

        // fulfill randomness
        coordinatorV2Mock.fulfillRandomWords(requestId, address(vrf_instance));
        status = vrf_instance.getRequestStatus(requestId);
        assertEq(status.randomWords.length, 2);
        assertTrue(status.exists);
        assertTrue(status.fulfilled);
    }
}
```

## reference

- https://docs.chain.link/vrf/v2-5/migration-from-v2
