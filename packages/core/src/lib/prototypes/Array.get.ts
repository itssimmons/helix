declare global {
	interface Array<T> {
		get(this: T[], index: number, defaultValue: T): T;
		get(this: T[], index: number): T | undefined;
	}
}

Array.prototype.get = function <T>(
	this: T[],
	index: number,
	defaultValue?: T,
): T | undefined {
	const len = this.length;
	let idx = index;

	if (idx < 0) idx = len + idx;

	if (idx >= 0 && idx < len) {
		return this[idx];
	}

	return defaultValue;
};
