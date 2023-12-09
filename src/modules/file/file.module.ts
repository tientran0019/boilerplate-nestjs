/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-11-23 23:19:40

* Last updated on: 2023-11-23 23:19:40
* Last updated by: Tien Tran
*------------------------------------------------------- */

import { Global, Module } from '@nestjs/common';
import { FileUploadService } from './file.service';

@Global() // 👈 global module
@Module({
	providers: [FileUploadService],
	exports: [FileUploadService],
})
export class FileModule { }
