export interface Otp {
	createdAt: number;
	ttl: string;
	code: string;
	action: string;
	used: boolean;
}
