/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-14 23:54:32

* Last updated on: 2023-11-14 23:54:32
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello from Boilerplate Nestjs!';
	}
}
