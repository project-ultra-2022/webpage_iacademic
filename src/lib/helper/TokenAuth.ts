import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';
import moment from 'moment';

export function createToken() {
	const time = String(moment().format('YYYY-MM-DDTHH:mm:ssZ'));
	const owner = env.OWNER_ECOMMERCE;
	const role = env.ROLE_STUDENT;
	const jwtSecretKey = env.AUTHENTICATION_ENCRYPTOR_SECRET_KEY;
	const payload = role + '|' + owner + '|' + time;

	return jwt.sign(payload, jwtSecretKey);
}
