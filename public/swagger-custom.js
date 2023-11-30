async function postData(url, data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: { 'Content-Type': 'application/json' },
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(data),
	});

	if (response.status >= 400) {
		throw new Error('invalid credentials');
	}
	return response.json();
}

const AUTH_CREDENTIALS = {
	email: 'admin@gmail.com',
	password: 'string',
};

postData('/v1/auth/login', AUTH_CREDENTIALS)
	.then((data) => {
		console.log('DEV ~ file: swagger-custom.js:26 ~ .then ~ data:', data);
		setTimeout(() => {
			window.ui.preauthorizeApiKey('bearer', data.backendTokens?.accessToken);
			console.log('preauth success');
		}, 1000);
	})
	.catch((e) => {
		console.error(`preauth failed: ${e}`);
	});
