type RequestBody = Record<string, unknown>;

class HelixRequest {
	readonly #req: Request;
	readonly #query: URLSearchParams;
	readonly #routeParams: Map<string, string>;
	readonly #body: RequestBody;
	readonly #customHeaders: Headers;

	private constructor(
		req: Request,
		query: URLSearchParams,
		routeParams: Map<string, string>,
		body: RequestBody
	) {
		this.#req = req;
		this.#customHeaders = new Headers(req.headers);
		this.#query = query;
		this.#routeParams = routeParams;
		this.#body = body;
	}

	static async create(
		req: Request,
		routeParams: Record<string, string> = {}
	): Promise<HelixRequest> {
		const url = new URL(req.url);
		const query = url.searchParams;
		const body = await this.parseBody(req);
		const params = new Map(Object.entries(routeParams));

		return new HelixRequest(req, query, params, body);
	}

	private static async parseBody(req: Request): Promise<RequestBody> {
		const contentType = req.headers.get('content-type') ?? '';

		if (contentType.includes('application/json')) {
			return req.json();
		}

		if (
			contentType.includes('application/x-www-form-urlencoded') ||
			contentType.includes('multipart/form-data')
		) {
			const formData = await req.formData();
			return Object.fromEntries(formData.entries());
		}

		return {};
	}

	// Getters para acceso controlado
	get originalRequest(): Request {
		return this.#req;
	}

	get method(): string {
		return this.#req.method;
	}

	get url(): URL {
		return new URL(this.#req.url);
	}

	// Query params
	getQuery(key: string): string | null {
		return this.#query.get(key);
	}

	getAllQuery(key: string): string[] {
		return this.#query.getAll(key);
	}

	get queryParams(): URLSearchParams {
		return this.#query;
	}

	// Route params
	getParam(key: string): string | undefined {
		return this.#routeParams.get(key);
	}

	hasParam(key: string): boolean {
		return this.#routeParams.has(key);
	}

	// Body
	getBody<T = RequestBody>(): T {
		return this.#body as T;
	}

	getBodyField<T = unknown>(key: string): T | undefined {
		return this.#body[key] as T | undefined;
	}

	get headers(): Headers {
		return this.#customHeaders;
	}

	setHeader(key: string, value: string): this {
		this.#customHeaders.set(key, value);
		return this;
	}

	appendHeader(key: string, value: string): this {
		this.#customHeaders.append(key, value);
		return this;
	}
}

export default HelixRequest;
