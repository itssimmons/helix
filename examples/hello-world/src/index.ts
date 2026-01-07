import helix from '@helix-server/core';

helix.get({
	route: '/',
	async handler(ctx) {
		ctx.res.setBody('hello world');
	},
});

helix.run(3000, '127.0.0.1');
