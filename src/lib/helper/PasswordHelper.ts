export function generateRandomPassword() {
	const randomPasswordSize = Math.floor(Math.random() * (16 - 8)) + 8;
	const allowedCharacters =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789![]{}()%&*$#^<>.~@|';
	let newPassword = '';

	for (let i = 0; i <= randomPasswordSize; i++) {
		newPassword += allowedCharacters.charAt(Math.floor(Math.random() * allowedCharacters.length));
	}

	if (
		newPassword.match(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/
		)
	) {
		return newPassword;
	} else {
		return generateRandomPassword();
	}
}
