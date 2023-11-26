export class Article {

	constructor(partial: Partial<Article>) {
		Object.assign(this, partial);
	}
}
