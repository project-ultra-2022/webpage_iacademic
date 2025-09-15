import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const WOMPI_PRIVATE_KEY = env.WOMPI_PRIVATE_KEY || env.VITE_WOMPI_PRIVATE_KEY;
const WOMPI_BASE_URL = 'https://sandbox.wompi.co/v1';

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Debug: Verificar variables de entorno
		console.log('WOMPI_PRIVATE_KEY:', WOMPI_PRIVATE_KEY ? 'Configurada' : 'NO configurada');

		const reference = url.searchParams.get('reference');
		const transactionId = url.searchParams.get('id');

		if (!reference && !transactionId) {
			return json({ error: 'Se requiere reference o transaction ID' }, { status: 400 });
		}

		if (!WOMPI_PRIVATE_KEY) {
			console.error('WOMPI_PRIVATE_KEY no configurada');
			return json({ error: 'Configuración de pago no disponible' }, { status: 500 });
		}

		let searchUrl = `${WOMPI_BASE_URL}/transactions`;

		if (transactionId) {
			searchUrl = `${WOMPI_BASE_URL}/transactions/${transactionId}`;
		} else if (reference) {
			searchUrl = `${WOMPI_BASE_URL}/transactions?reference=${reference}`;
		}

		console.log('Verificando transacción:', { reference, transactionId });

		const response = await fetch(searchUrl, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			console.error('Error al consultar Wompi:', response.status);
			return json({ error: 'Error al verificar el estado del pago' }, { status: 500 });
		}

		const result = await response.json();

		// Si buscamos por referencia, puede devolver un array
		const transaction = transactionId ? result.data : result.data?.[0];

		if (!transaction) {
			return json({ error: 'Transacción no encontrada' }, { status: 404 });
		}

		return json({
			success: true,
			transaction: {
				id: transaction.id,
				reference: transaction.reference,
				status: transaction.status,
				amount_in_cents: transaction.amount_in_cents,
				currency: transaction.currency,
				customer_email: transaction.customer_email,
				created_at: transaction.created_at,
				finalized_at: transaction.finalized_at,
				payment_method: transaction.payment_method
			}
		});
	} catch (error) {
		console.error('Error en verify-transaction:', error);
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
