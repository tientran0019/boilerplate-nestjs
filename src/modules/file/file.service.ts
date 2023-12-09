import { S3 } from 'aws-sdk';
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
	async upload(file) {
		const { originalname } = file;
		const bucketS3 = process.env.BUCKET_S3;
		await this.uploadS3(file.buffer, bucketS3, originalname);
	}

	async uploadS3(file, bucket, name) {
		const s3 = this.getS3();
		const params = {
			Bucket: bucket,
			Key: String(name),
			Body: file,
		};
		return new Promise((resolve, reject) => {
			s3.upload(params, (err, data) => {
				if (err) {
					Logger.error(err);
					reject(err.message);
				}
				resolve(data);
			});
		});
	}

	getS3() {
		return new S3({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		});
	}
}
