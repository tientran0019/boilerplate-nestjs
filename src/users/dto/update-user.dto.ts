/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:23:13

* Last updated on: 2023-11-23 23:23:13
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
	@IsNotEmpty()
	@IsString()
	readonly fullName: string;

	@IsString()
	readonly phone: string;

	@IsString()
	readonly country: string;
}
