export class OtpEntity {
	readonly createdAt: number;
	readonly ttl: string;
	readonly code: string;
	readonly action: string;
	readonly used: boolean;

	constructor(partial: Partial<OtpEntity>) {
		Object.assign(this, partial);
	}
}
