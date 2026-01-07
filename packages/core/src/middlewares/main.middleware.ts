import Middleware from '../class/middleware'
import type { Ctx } from '../types/middleware'

export class Main extends Middleware {
	private endpoint!: (data: Ctx) => Promise<void>

	static create(endpoint: (data: Ctx) => Promise<void>): Main {
		const instance = new Main()
		instance.endpoint = endpoint
		return instance
	}

	override async handle(ctx: Ctx): Promise<void> {
		await this.endpoint(ctx)
	}

	// biome-ignore lint/suspicious/useAdjacentOverloadSignatures: <TODO>
	create(): Main {
		const instance = new Main()
		instance.endpoint = this.endpoint
		console.log('f96b4075-6319-4ffb-a7b4-e75031b4f63c')
		return instance
	}
}
