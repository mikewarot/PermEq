# PermEq

A vibe-coded implementation of the PermEq language.

## Overview

PermEq is an experimental programming language that blends declarative and imperative styles. Its standout feature is the *persistent/magic equals* operator, which allows you to declare that a value should always track the result of an expression throughout the program's lifetime. This enables safe, coherent mixing of declarative and imperative code in a single environment.

## Features

- Traditional assignment operator (`=`)
- Persistent/magic equals operator (`≡`) — values always reflect the result of an expression
- Designed for both browser and server environments (TypeScript)

## Getting Started

Clone this repository and run:

```bash
npm install
npm run build
```

## License

GPL-3.0-or-later
