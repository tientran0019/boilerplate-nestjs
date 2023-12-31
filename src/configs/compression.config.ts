/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-28 18:56:13

* Last updated on: 2023-11-28 18:56:13
* Last updated by: Tien Tran
*------------------------------------------------------- */

import compression from '@fastify/compress';

export default async function configCompression(app) {
	await app.register(compression, { encodings: ['gzip', 'deflate'] });
}
