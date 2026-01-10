# 🐥 Helix Server

A lightweight and high-performance fully extensible and minimalist web server framework for Bun.js.

## Table of Contents
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Create Your First Server](#create-your-first-server)
- [Run Your Server](#run-your-server)
- [For More Examples](#for-more-examples)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Getting Started

This guide will help you create your first Helix server application.

### Prerequisites

- [Bun](https://bun.sh) installed on your system

### Installation

First, install the Helix server package:

```bash
bun add @helix-server/core
```

### Create Your First Server

Create a new file called `index.ts`:

```bash
touch index.ts
```

Add the following code to `index.ts`:

```typescript
import helix from '@helix-server/core';

helix.get({
	route: '/',
	async handler(ctx) {
		ctx.res.setBody('hello world');
	},
});

helix.run(3000, '127.0.0.1');
```

### Run Your Server

Start the server with:

```bash
bun run index.ts
```

You should see the message:

```
Server running at http://127.0.0.1:3000
```

Visit [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser to see "hello world".

### For More Examples

Check out the [examples repository](https://github.com/helix-server/core/tree/main/apps/examples) for more sample applications.

## Documentation

For detailed documentation, visit the [Helix Server Documentation](#).

## Contributing

Contributions are welcome! Please read the [contributing guidelines](/CONTRIBUTING.md) to get started.
