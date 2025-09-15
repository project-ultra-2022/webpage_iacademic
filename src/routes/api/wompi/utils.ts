import crypto from 'crypto';

/**
 * Genera la firma de integridad para Wompi según la documentación oficial
 * Formato: "<Referencia><Monto><Moneda><SecretoIntegridad>"
 * @param reference - Referencia única de la transacción
 * @param amountInCents - Monto en centavos
 * @param currency - Moneda (COP)
 * @param integrityKey - Clave de integridad de Wompi
 * @param expirationTime - Fecha de expiración opcional en formato ISO8601
 * @returns Firma SHA256 en hexadecimal
 */
export function generateIntegritySignature(
	reference: string,
	amountInCents: number,
	currency: string,
	integrityKey: string,
	expirationTime?: string
): string {
	// Formato oficial de Wompi según documentación:
	// SIN expiration: "<Referencia><Monto><Moneda><SecretoIntegridad>"
	// CON expiration: "<Referencia><Monto><Moneda><FechaExpiracion><SecretoIntegridad>"

	let concatenatedString: string;

	if (expirationTime) {
		concatenatedString = `${reference}${amountInCents}${currency}${expirationTime}${integrityKey}`;
	} else {
		concatenatedString = `${reference}${amountInCents}${currency}${integrityKey}`;
	}

	const signature = crypto.createHash('sha256').update(concatenatedString, 'utf8').digest('hex');

	console.log('Firma de integridad generada para referencia:', reference);

	return signature;
}

/**
 * Valida una firma de integridad recibida de Wompi
 * @param receivedSignature - Firma recibida
 * @param reference - Referencia de la transacción
 * @param amountInCents - Monto en centavos
 * @param currency - Moneda
 * @param integrityKey - Clave de integridad
 * @returns true si la firma es válida
 */
export function validateIntegritySignature(
	receivedSignature: string,
	reference: string,
	amountInCents: number,
	currency: string,
	integrityKey: string
): boolean {
	const expectedSignature = generateIntegritySignature(
		reference,
		amountInCents,
		currency,
		integrityKey
	);
	const isValid = receivedSignature === expectedSignature;

	console.log('Validando firma de integridad:', {
		receivedSignature,
		expectedSignature,
		isValid
	});

	return isValid;
}
