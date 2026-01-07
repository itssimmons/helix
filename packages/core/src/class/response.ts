import { HTTP_STATUS_TEXT } from '../lib/literals/status'

type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue }

type ResponseBody = Bun.BodyInit | null

class HelixResponse {
	#headers: Headers
	#body: ResponseBody
	#status: number
	#statusText?: string

	private constructor(
		body: ResponseBody = null,
		status: number = 200,
		headers: Headers = new Headers(),
		statusText?: string,
	) {
		this.#body = body
		this.#status = status
		this.#headers = headers
		this.#statusText = statusText
	}

	// ─── Factory Methods ───────────────────────────────────────────────

	static create(status: number = 200): HelixResponse {
		return new HelixResponse(null, status)
	}

	static json<T extends JsonValue>(
		data: T,
		status: number = 200,
	): HelixResponse {
		const headers = new Headers({ 'content-type': 'application/json' })
		return new HelixResponse(JSON.stringify(data), status, headers)
	}

	static text(data: string, status: number = 200): HelixResponse {
		const headers = new Headers({ 'content-type': 'text/plain' })
		return new HelixResponse(data, status, headers)
	}

	static html(data: string, status: number = 200): HelixResponse {
		const headers = new Headers({ 'content-type': 'text/html' })
		return new HelixResponse(data, status, headers)
	}

	static redirect(url: string, status: number = 302): HelixResponse {
		const headers = new Headers({ location: url })
		return new HelixResponse(null, status, headers)
	}

	static noContent(): HelixResponse {
		return new HelixResponse(null, 204)
	}

	static fromResponse(
		response: ResponseInit & { body?: ResponseBody },
	): HelixResponse {
		return new HelixResponse(
			response.body ?? null,
			response.status ?? 200,
			new Headers(response.headers as Bun.HeadersInit),
			response.statusText,
		)
	}

	// ─── Builder Methods ───────────────────────────────────────────────

	setHeader(key: string, value: string): this {
		this.#headers.set(key, value)
		return this
	}

	appendHeader(key: string, value: string): this {
		this.#headers.append(key, value)
		return this
	}

	removeHeader(key: string): this {
		this.#headers.delete(key)
		return this
	}

	setStatus(status: number, statusText?: string): this {
		this.#status = status
		this.#statusText = statusText
		return this
	}

	setBody(body: ResponseBody): this {
		this.#body = body
		return this
	}

	setJsonBody<T extends JsonValue>(data: T): this {
		this.#body = JSON.stringify(data)
		if (!this.#headers.has('content-type')) {
			this.#headers.set('content-type', 'application/json')
		}
		return this
	}

	// ─── Getters ───────────────────────────────────────────────────────

	get status(): number {
		return this.#status
	}

	get statusText(): string {
		return this.#statusText ?? HTTP_STATUS_TEXT[this.#status] ?? 'Unknown'
	}

	get headers(): Headers {
		return this.#headers
	}

	get body(): ResponseBody {
		return this.#body
	}

	// ─── Export ────────────────────────────────────────────────────────

	toResponse(): Response {
		return new Response(this.#body, {
			status: this.#status,
			statusText: this.statusText,
			headers: this.#headers,
		})
	}
}

export default HelixResponse
