# Getting Started with Helix Server

This guide will help you create your first Helix server application.

## Prerequisites

- [Bun](https://bun.sh) installed on your system

## Installation

First, install the Helix server package:

```bash
bun add @helix-server/core
```

## Create Your First Server

Create a new file called `index.ts`:

```bash
touch index.ts
```

Add the following code to `index.ts`:

```typescript
import { createServer } from "@helix-server/core";

const helix = createServer({
	port: 3000,
	host: "localhost",
});

helix.get({
	route: "/",
	async handler(ctx) {
		ctx.res.setBody("hello world");
	},
});

helix.listen((address) => {
	console.log(`Helix server is running at http://${address}`);
});
```

## Run Your Server

Start the server with:

```bash
bun run index.ts
```

You should see the message:

```
Helix server is running at http://localhost:3000
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to see "hello world".

## Next Steps

- Learn about [routing](./routing.md)
- Explore [middleware](./middleware.md)
- Check out the [API reference](./api-reference.md)
