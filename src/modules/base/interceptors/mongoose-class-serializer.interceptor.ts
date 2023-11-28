import {
	ClassSerializerInterceptor,
	PlainLiteralObject,
	Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

function Serializer(
	classToIntercept: Type,
): typeof ClassSerializerInterceptor {
	return class Interceptor extends ClassSerializerInterceptor {
		private changePlainObjectToClass(document: PlainLiteralObject) {
			if (!(document instanceof Document)) {
				return plainToClass(classToIntercept, { ...document, id: document._id?.toString() }, { excludePrefixes: ['_'] });
			}

			return plainToClass(classToIntercept, { ...document.toJSON(), id: document.id }, { excludePrefixes: ['_'] });
		}

		private prepareResponse(
			response:
				| PlainLiteralObject
				| PlainLiteralObject[]
				| { items: PlainLiteralObject[]; count: number },
		) {
			if (!Array.isArray(response) && response?.items) {
				const items = this.prepareResponse(response.items);
				return {
					...response,
					items,
				};
			}

			if (Array.isArray(response)) {
				return response.map(this.changePlainObjectToClass);
			}

			return this.changePlainObjectToClass(response);
		}

		serialize(
			response: PlainLiteralObject | PlainLiteralObject[],
			options: ClassTransformOptions,
		) {
			return super.serialize(this.prepareResponse(response), options);
		}
	};
}

export default Serializer;
