import type Middleware from '../class/middleware'
import type Request from '../class/request'
import type Response from '../class/response'

export type MiddlewareType = Omit<typeof Middleware, 'new'> & {
	new (): Middleware
}

export type DeepMiddleware = {
	middleware: MiddlewareType
	dependencies: DeepMiddleware[]
}

export type FullMiddleware = {
	middleware: MiddlewareType
	dependsOn: string[]
}

export interface Ctx {
	req: Request
	res: Response
}
