---
title: "Math Examples"
description: "Examples of LaTeX math rendering with KaTeX"
created: 2026-01-06
tags: ["math", "latex", "examples"]
---

## Basic Math

This page demonstrates LaTeX math support using KaTeX.

### Inline Math

The famous equation $E = mc^2$ describes mass-energy equivalence.

The derivative of $f(x) = x^2$ is $f'(x) = 2x$.

### Fractions

$$
\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}
$$

### Summations

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

### Integrals

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

### Limits

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

## Advanced Math

### Matrices

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$

### Greek Letters

$$
\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \iota, \kappa, \lambda, \mu
$$

$$
\nu, \xi, \pi, \rho, \sigma, \tau, \upsilon, \phi, \chi, \psi, \omega
$$

### Set Notation

$$
A \cup B, \quad A \cap B, \quad A \setminus B, \quad A \subseteq B
$$

### Logic

$$
\forall x \in \mathbb{R}, \quad \exists y \in \mathbb{N}, \quad p \implies q, \quad p \iff q
$$

## Physics Examples

### Maxwell's Equations

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_0}
$$

$$
\nabla \cdot \mathbf{B} = 0
$$

$$
\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}
$$

$$
\nabla \times \mathbf{B} = \mu_0 \mathbf{J} + \mu_0 \epsilon_0 \frac{\partial \mathbf{E}}{\partial t}
$$

### Schrödinger Equation

$$
i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r}, t) = \hat{H} \Psi(\mathbf{r}, t)
$$

## Related Notes

- [[getting-started]] - Getting started guide
- [[advanced-features]] - Advanced features
