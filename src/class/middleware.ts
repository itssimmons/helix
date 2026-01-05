/** biome-ignore-all lint/suspicious/noConfusingVoidType: <TODO> */
import type { Ctx, MiddlewareType } from '../types/middleware';
import type Request from './request';
import type Response from './response';

export default abstract class Middleware<TArgs extends unknown[] = []> {
	static isGlobal = false;
	static before: MiddlewareType[] = [];
	static depends: MiddlewareType[] = [];

	public runPromise: Promise<void>;
	private runResolve!: () => void;
	public continuePromise: Promise<void>;
	private continueResolve!: () => void;

	private shouldRunPromise!: Promise<void[]>;
	private shouldContinuePromise!: Promise<void[]>;

	constructor() {
		this.runPromise = new Promise((runResolve) => {
			this.runResolve = runResolve;
		});
		this.continuePromise = new Promise((continueResolve) => {
			this.continueResolve = continueResolve;
		});
	}

	prepare(middlewares: Middleware[]): void {
		const LocalClass = this.constructor as MiddlewareType;
		const isMain = LocalClass.name === 'Main';

		// PRE
		this.shouldRunPromise = Promise.all(
			middlewares
				.filter((middleware) => {
					if (middleware instanceof this.constructor) return false;
					const MidClass = middleware.constructor as MiddlewareType;
					if (isMain) return true;
					if (!LocalClass.isGlobal && MidClass.isGlobal) return true;
					if (LocalClass.depends.includes(MidClass)) return true;
					if (MidClass.before.includes(LocalClass)) return true;
					return false;
				})
				.map((m) => m.runPromise)
		);

		// POST
		this.shouldContinuePromise = Promise.all(
			middlewares
				.filter((middleware) => {
					if (middleware instanceof this.constructor) return false;
					const MidClass = middleware.constructor as MiddlewareType;
					if (isMain) return false;
					if (MidClass.name === 'Main') return true;
					if (LocalClass.isGlobal && !MidClass.isGlobal) return true;
					if (LocalClass.before.includes(MidClass)) return true;
					if (MidClass.depends.includes(LocalClass)) return true;
					return false;
				})
				.map((m) => m.continuePromise)
		);
	}

	async run(req: Request, res: Response, args?: any[]): Promise<void> {
		await this.shouldRunPromise;
		let nextCalled = false;
		await this.handle(
			{ req, res },
			async () => {
				nextCalled = true;
				this.runResolve();
				await this.shouldContinuePromise;
			},
			...((args as TArgs) ?? ([] as unknown as TArgs))
		);
		if (!nextCalled) {
			this.runResolve();
		}
		this.continueResolve();
	}

	abstract handle(
		ctx: Ctx,
		next: () => Promise<void>,
		...args: TArgs
	): Promise<void>;
}
