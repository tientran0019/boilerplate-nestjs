/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 22:54:37

* Last updated on: 2023-11-23 22:54:37
* Last updated by: Tien Tran
*------------------------------------------------------- */

/**
 * The function `padTo2Digits` takes a number or string as input and returns a string with the input
 * padded to 2 digits with leading zeros if necessary.
 * @param {string | number} num - The `num` parameter can be either a string or a number.
 * @returns a string with the input number padded to 2 digits with leading zeros.
 */
function padTo2Digits(num: string | number): string {
	return num.toString().padStart(2, '0');
}

/**
 * The function converts milliseconds to minutes and seconds, with an option to include seconds in the
 * output.
 * @param {string | number} milliseconds - The `milliseconds` parameter is the duration in milliseconds
 * that you want to convert to minutes and seconds. It can be either a string or a number.
 * @param {boolean} [showSeconds=true] - The `showSeconds` parameter is a boolean that determines
 * whether or not to include the seconds in the output string. If `showSeconds` is `true`, the output
 * will include the minutes and seconds separated by a colon (e.g., "3:45"). If `showSeconds` is `
 * @returns a string representation of the given milliseconds converted to minutes and seconds. If the
 * `showSeconds` parameter is set to `true`, the string will be in the format "minutes:seconds" with
 * the seconds padded to 2 digits. If `showSeconds` is set to `false`, the string will only contain the
 * minutes. If the seconds value is exactly 60, the minutes
 */
function convertMsToMinutesSeconds(milliseconds: string | number, showSeconds: boolean = true): string {
	const minutes = Math.floor(+milliseconds / 60000);
	const seconds = Math.round((+milliseconds % 60000) / 1000);

	if (!showSeconds) {
		return seconds === 60
			? `${minutes + 1}`
			: `${minutes}`;
	}

	return seconds === 60
		? `${minutes + 1}:00`
		: `${minutes}:${padTo2Digits(seconds)}`;
}

export default convertMsToMinutesSeconds;
