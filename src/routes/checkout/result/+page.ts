import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
	const reference = url.searchParams.get('reference');
	const id = url.searchParams.get('id');

	if (!reference && !id) {
		return {
			transaction: null,
			error: 'No se encontró información de la transacción'
		};
	}

	try {
		let queryParams = '';
		if (reference) {
			queryParams = `?reference=${reference}`;
		} else if (id) {
			queryParams = `?id=${id}`;
		}

		const response = await fetch(`/api/wompi/verify-transaction${queryParams}`);

		if (!response.ok) {
			throw new Error('Error al verificar la transacción');
		}

		const result = await response.json();

		return {
			transaction: result.transaction,
			error: null
		};
	} catch (error) {
		console.error('Error verificando transacción:', error);
		return {
			transaction: null,
			error: 'Error al verificar el estado del pago'
		};
	}
};
