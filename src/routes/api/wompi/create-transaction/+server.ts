import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { generateIntegritySignature } from '../utils.js';

// Variables de entorno del servidor
const WOMPI_PUBLIC_KEY = env.WOMPI_PUBLIC_KEY || env.VITE_WOMPI_PUBLIC_KEY;
const WOMPI_PRIVATE_KEY = env.WOMPI_PRIVATE_KEY || env.VITE_WOMPI_PRIVATE_KEY;
const WOMPI_INTEGRITY_KEY = env.WOMPI_INTEGRITY_KEY;

interface CustomerData {
	fullname: string;
	typeDocument: string;
	numberDocument: string;
	phone: string;
	email: string;
	dateBirth: string;
}

interface CartItem {
	id: string;
	name: string;
	price: string;
	duration?: string;
	shortDescriptionEcommerce?: string;
}

interface CreateTransactionRequest {
	customerData: CustomerData;
	cartItems: CartItem[];
	totalAmount: number;
}

function generateReference(): string {
	const timestamp = Date.now();
	const random = Math.floor(Math.random() * 1000);
	return `IACADEMIC-${timestamp}-${random}`;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Debug: Verificar variables de entorno
		console.log('WOMPI_PUBLIC_KEY:', WOMPI_PUBLIC_KEY ? 'Configurada' : 'NO configurada');
		console.log('WOMPI_PRIVATE_KEY:', WOMPI_PRIVATE_KEY ? 'Configurada' : 'NO configurada');
		console.log('WOMPI_INTEGRITY_KEY:', WOMPI_INTEGRITY_KEY ? 'Configurada' : 'NO configurada');
		console.log('Valor de PUBLIC_KEY:', WOMPI_PUBLIC_KEY); // Log explícito del valor

		// Validar que tenemos las llaves de Wompi
		if (!WOMPI_PUBLIC_KEY || !WOMPI_PRIVATE_KEY) {
			console.error('Variables de entorno de Wompi no configuradas');
			console.error('PUBLIC_KEY existe:', !!WOMPI_PUBLIC_KEY);
			console.error('PRIVATE_KEY existe:', !!WOMPI_PRIVATE_KEY);
			return json({ error: 'Configuración de pago no disponible' }, { status: 500 });
		}

		// Validar que tenemos la clave de integridad
		if (!WOMPI_INTEGRITY_KEY) {
			console.error('WOMPI_INTEGRITY_KEY no configurada');
			return json({ error: 'Configuración de integridad no disponible' }, { status: 500 });
		}

		const data: CreateTransactionRequest = await request.json();

		// Validar datos requeridos
		if (!data.customerData || !data.cartItems || !data.totalAmount) {
			return json({ error: 'Datos incompletos para crear la transacción' }, { status: 400 });
		}

		// Validar que el carrito no esté vacío
		if (data.cartItems.length === 0) {
			return json({ error: 'El carrito está vacío' }, { status: 400 });
		}

		// Validar monto
		if (data.totalAmount <= 0) {
			return json({ error: 'El monto debe ser mayor a cero' }, { status: 400 });
		}

		// Generar referencia única
		const reference = generateReference();

		// Para el widget de Wompi, no necesitamos crear una transacción previa
		// Solo necesitamos devolver los datos necesarios para el widget
		console.log('Preparando datos para el widget de Wompi:', {
			reference,
			amount: data.totalAmount,
			email: data.customerData.email
		});

		// Generar firma de integridad (REQUERIDA) - Formato oficial de Wompi
		const amountInCents = data.totalAmount * 100;
		const currency = 'COP';

		console.log('Preparando transacción:', {
			reference,
			amount: data.totalAmount,
			email: data.customerData.email
		});

		const integritySignature = generateIntegritySignature(
			reference,
			amountInCents,
			currency,
			WOMPI_INTEGRITY_KEY
		);

		// Responder con los datos mínimos necesarios para el widget
		console.log('✅ Enviando respuesta con firma:', {
			reference,
			publicKey: WOMPI_PUBLIC_KEY?.substring(0, 15) + '...',
			amountInCents,
			currency,
			signatureLength: integritySignature.length,
			signature: integritySignature.substring(0, 10) + '...'
		});

		return json({
			success: true,
			reference: reference,
			publicKey: WOMPI_PUBLIC_KEY,
			amountInCents: amountInCents,
			currency: currency,
			signature: integritySignature,
			// Temporalmente sin acceptance token para simplificar
			// acceptanceToken: acceptanceToken,
			customerData: {
				email: data.customerData.email,
				fullName: data.customerData.fullname,
				phoneNumber: data.customerData.phone,
				phoneNumberPrefix: '+57'
			},
			redirectUrl: `${request.url.split('/api')[0]}/checkout/result?reference=${reference}`
		});
	} catch (error) {
		console.error('Error en create-transaction:', error);
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
