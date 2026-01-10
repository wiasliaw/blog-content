# Math Support

This site supports LaTeX math formulas using [KaTeX](https://katex.org/).

## Inline Math

Wrap formulas with single dollar signs `$...$`:

```markdown
The equation $E = mc^2$ describes mass-energy equivalence.
```

Renders: The equation $E = mc^2$ describes mass-energy equivalence.

## Block Math

Wrap formulas with double dollar signs on separate lines:

```markdown
$$
\int_{a}^{b} f(x) \, dx = F(b) - F(a)
$$
```

Renders as a centered block equation.

## Common Symbols

### Greek Letters

| Syntax | Output |
|--------|--------|
| `\alpha`, `\beta`, `\gamma` | Greek letters |
| `\Delta`, `\Sigma`, `\Omega` | Uppercase Greek |

### Operators

| Syntax | Description |
|--------|-------------|
| `\sum_{i=1}^{n}` | Summation |
| `\prod_{i=1}^{n}` | Product |
| `\int_{a}^{b}` | Integral |
| `\lim_{x \to \infty}` | Limit |

### Fractions and Roots

| Syntax | Description |
|--------|-------------|
| `\frac{a}{b}` | Fraction a/b |
| `\sqrt{x}` | Square root |
| `\sqrt[n]{x}` | nth root |

### Subscripts and Superscripts

| Syntax | Description |
|--------|-------------|
| `x^2` | Superscript |
| `x_i` | Subscript |
| `x_i^2` | Combined |

### Matrices

```markdown
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$
```

### Aligned Equations

```markdown
$$
\begin{aligned}
a &= b + c \\
d &= e + f
\end{aligned}
$$
```

## Examples

**Quadratic formula:**

```markdown
$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

**Euler's identity:**

```markdown
$$
e^{i\pi} + 1 = 0
$$
```

**Summation:**

```markdown
$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$
```

## KaTeX Limitations

KaTeX supports most LaTeX math syntax but has some limitations. For unsupported features, refer to the [KaTeX documentation](https://katex.org/docs/supported.html).

## See Also

- [Writing Posts](writing-posts.md) - General Markdown syntax
