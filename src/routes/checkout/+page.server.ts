import type { Actions } from './$types';
import { env } from '$env/dynamic/private';
import { generateRandomPassword } from '$lib/helper/PasswordHelper';
import { createToken } from '$lib/helper/TokenAuth';

export const actions: Actions = {
	createStudent: async ({ request }) => {
		try {
			const formData = await request.formData();

			// 🔍 DEBUG: Ver todos los campos que llegan
			console.log('📨 Campos recibidos en FormData:');
			for (const [key, value] of formData.entries()) {
				console.log(`  ${key}: "${value}"`);
			}

			const email = formData.get('email') as string;
			const fullname = formData.get('fullname') as string;
			const typeDocument = formData.get('typeDocument') as string;
			const numberDocument = formData.get('numberDocument') as string;
			const phone = formData.get('phone') as string;
			const dateBirth = formData.get('dateBirth') as string;
			const habeasData = formData.get('habeasData') as string;
			const keyBaseCourse = formData.get('keyBaseCourse') as string;
			const date = formData.get('date') as string;
			const amount = formData.get('amount') as string;
			const numberTransaction = formData.get('numberTransaction') as string;

			if (!email) {
				return {
					success: false,
					error: 'Email es requerido'
				};
			}

			console.log('🚀 Creando estudiante desde servidor con datos:', {
				email,
				password: '[GENERADA]',
				fullname,
				typeDocument,
				numberDocument,
				phone,
				dateBirth,
				habeasData,
				keyBaseCourse,
				date,
				amount,
				numberTransaction
			});

			// 🔍 DEBUG: Verificar si dateBirth tiene valor
			if (!dateBirth) {
				console.error('❌ PROBLEMA: dateBirth está vacío o nulo:', dateBirth);
				return {
					success: false,
					error: 'Fecha de nacimiento es requerida'
				};
			}

			// 🔐 Generar contraseña aleatoria
			const generatedPassword = generateRandomPassword();
			console.log('🔑 Contraseña generada exitosamente');

			// Usar variable del .env (corregido)
			const ORCHESTRATOR_URL = env.PUBLIC_ORCHESTRATOR_URL;
			const endpoint = `https://whiteapiprod.com:3000/v2/iacademic-enrollment`;

			// ✅ Estructura que coincide EXACTAMENTE con lo que espera tu API
			const userBody = {
				//keyRol: 'RO-LE-0007',
				email: email,
				password: generatedPassword,
				fullname: fullname,
				typeDocument: typeDocument,
				numberDocument: numberDocument,
				phone: phone,
				dateBirth: dateBirth,
				habeasData: habeasData,
				keyBaseCourse: keyBaseCourse,
				date: date,
				amount: amount,
				numberTransaction: numberTransaction
			};

			console.log('📝 Datos para crear estudiante:', {
				...userBody,
				password: '[GENERADA]' // No mostrar la contraseña en logs
			});
			console.log('🌐 Endpoint:', endpoint);

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					authentication: createToken()
				},
				body: JSON.stringify(userBody)
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('❌ Error del servidor:', response.status, errorText);
				return {
					success: false,
					error: `Error ${response.status}: ${errorText}`
				};
			}

			const data = await response.json();
			console.log('✅ Estudiante creado exitosamente:', data);

			return {
				success: true,
				data: data
			};
		} catch (error) {
			console.error('❌ Error creando estudiante:', error);
			return {
				success: false,
				error: error.message || 'Error interno del servidor'
			};
		}
	}
};
