/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-28 18:56:13

* Last updated on: 2023-11-28 18:56:13
* Last updated by: Tien Tran
*------------------------------------------------------- */

import csrf from '@fastify/csrf-protection';

export default async function configCsrf(app) {
	await app.register(csrf);
}
