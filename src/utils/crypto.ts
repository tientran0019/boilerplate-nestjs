/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 00:50:01

* Last updated on: 2023-11-23 00:50:01
* Last updated by: Tien Tran
*------------------------------------------------------- */

import CryptoJS from 'crypto-js';

/**
 * The `encrypt` function encrypts a payload using a secret key and returns the encrypted result as a
 * string.
 * @param {string | object} payload - The `payload` parameter can be either a string or an object. It
 * represents the data that you want to encrypt.
 * @param {string} secretKey - The `secretKey` parameter is a string that is used as the encryption
 * key. It is used to encrypt and decrypt the payload.
 * @returns a Promise that resolves to a string.
 */
export const encrypt = async (payload: string | object, secretKey: string): Promise<string> => {
	if (!payload || !secretKey) {
		throw new Error('SecretKey and payload are required');
	}

	return await CryptoJS.AES.encrypt(JSON.stringify(payload), secretKey).toString();
};

/**
 * The function decrypts a token using a secret key and returns the decrypted value as a string.
 * @param {string} token - The `token` parameter is a string that represents the encrypted data that
 * you want to decrypt.
 * @param {string} secretKey - The `secretKey` parameter is a string that represents the secret key
 * used for decryption. It is a required parameter and must be provided in order to decrypt the token.
 * @returns a Promise that resolves to a string.
 */
export const decrypt = async (token: string, secretKey: string): Promise<object> => {
	if (!token || !secretKey) {
		throw new Error('SecretKey and token are required');
	}

	const bytes = await CryptoJS.AES.decrypt(token, secretKey);

	return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
