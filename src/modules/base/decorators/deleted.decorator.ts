/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-12-01 18:25:31

* Last updated on: 2023-12-01 18:25:31
* Last updated by: Tien Tran
*------------------------------------------------------- */
import { TransformFnParams, TransformOptions, Transform } from 'class-transformer';

/**
 * The `Deleted` function is a TypeScript decorator that transforms a value based on whether an object
 * has a `_isDeleted` property.
 * @param options - The `options` parameter is an object that contains additional configuration options
 * for the `Deleted` function. It is of type `TransformOptions & { message?: string }`, which means it
 * can accept any properties defined in the `TransformOptions` interface, as well as an optional
 * `message` property of
 * @returns either `null` if `obj._isDeleted` is falsy, or it is returning the `value` parameter passed
 * to the function.
 */
export function Deleted(
	options: TransformOptions & { message?: string } = { toPlainOnly: true }
) {
	return Transform(({ obj, value }: TransformFnParams) => {
		if (!value) {
			return;
		}

		if (obj?._isDeleted) {
			return options.message || null;
		}
		return value;
	}, options);
}
