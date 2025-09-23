import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('complete-name');
		const company = data.get('company');
		const email = data.get('email');
		const phone = data.get('phone');
		const message = data.get('message');

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'centic.ultra@gmail.com',
				pass: 'psdibzoxacbxbhlv'
			}
		});

		const mailOptions = {
			from: 'centic.ultra@gmail.com',
			to: 'info@centicsas.com.co',
			subject: `Mensaje de contacto de ${name}`,
			text: `Nombre: ${name}\nEmpresa: ${company}\nCorreo: ${email}\nTeléfono: ${phone} \nMensaje: ${message}`
		};

		try {
			await transporter.sendMail(mailOptions);
			return { success: true };
		} catch (error) {
			console.error('Error al enviar el correo:', error);
			return fail(500, { error: 'Error al enviar el correo' });
		}
	}
};
