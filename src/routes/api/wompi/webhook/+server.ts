import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import crypto from 'crypto';

const WOMPI_INTEGRITY_KEY = env.WOMPI_INTEGRITY_KEY;

export const POST: RequestHandler = async ({ request }) => {
	try {
		console.log('Webhook de Wompi recibido');

		if (!WOMPI_INTEGRITY_KEY) {
			console.error('WOMPI_INTEGRITY_KEY no configurada para webhook');
			return json({ error: 'Configuración no disponible' }, { status: 500 });
		}

		const signature = request.headers.get('x-wompi-signature');
		const body = await request.text();

		console.log('Headers del webhook:', {
			signature,
			contentType: request.headers.get('content-type')
		});

		// Validar la firma del webhook
		if (signature) {
			// La firma del webhook se genera de manera diferente
			// Wompi envía: signature = sha256(cuerpo_del_webhook + integrity_key)
			const expectedSignature = generateWebhookSignature(body, WOMPI_INTEGRITY_KEY);

			if (signature !== expectedSignature) {
				console.error('Firma del webhook inválida');
				return json({ error: 'Firma inválida' }, { status: 401 });
			}
		}

		const event = JSON.parse(body);
		console.log('Evento de Wompi:', event);

		// Procesar el evento según su tipo
		switch (event.event) {
			case 'transaction.updated':
				await handleTransactionUpdate(event.data);
				break;
			case 'transaction.created':
				await handleTransactionCreated(event.data);
				break;
			default:
				console.log('Evento no manejado:', event.event);
		}

		// Responder 200 OK para que Wompi sepa que recibimos el webhook
		return json({ received: true });
	} catch (error) {
		console.error('Error procesando webhook de Wompi:', error);
		return json({ error: 'Error interno' }, { status: 500 });
	}
};

function generateWebhookSignature(body: string, integrityKey: string): string {
	return crypto
		.createHash('sha256')
		.update(body + integrityKey, 'utf8')
		.digest('hex');
}

async function handleTransactionUpdate(transaction: Record<string, unknown>) {
	console.log('Transacción actualizada:', {
		id: transaction.id,
		reference: transaction.reference,
		status: transaction.status,
		amount: transaction.amount_in_cents
	});

	// Aquí puedes agregar lógica para:
	// - Actualizar el estado en tu base de datos
	// - Enviar emails de confirmación
	// - Activar cursos, etc.
}

async function handleTransactionCreated(transaction: Record<string, unknown>) {
	console.log('Transacción creada:', {
		id: transaction.id,
		reference: transaction.reference,
		status: transaction.status
	});

	// Lógica para transacciones recién creadas
}
