import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
} from '@nestjs/common';
import isEmpty from 'tily/is/empty';

@Injectable()
export class RequiredValuePipe implements PipeTransform<any> {
	async transform(value: any, metadata: ArgumentMetadata) {

		if (isEmpty(value)) {
			throw new BadRequestException(metadata.data + ' is required');
		}

		return value;
	}
}
