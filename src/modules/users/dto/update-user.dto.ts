/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:23:13

* Last updated on: 2023-11-23 23:23:13
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

// PickType(DTOObject, ['field_name'] as const), IntersectionType(DTO1, DTO2)
export class UpdateUserDto extends PartialType(
	OmitType(CreateUserDto, ['email', 'password', 'sendEmail'] as const),
) { }
