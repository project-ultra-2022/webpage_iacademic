<script lang="ts">
	import { onMount } from 'svelte';
	const VITE_CAPTCHA_SITE_KEY = import.meta.env.VITE_CAPTCHA_SITE_KEY;
	const VITE_API_URL = import.meta.env.VITE_API_URL;
	const courses = [
		{
			category: 'Scrum',
			items: [{ name: 'Scrum' }]
		},
		{
			category: 'Cobit 2019',
			items: [{ name: 'Cobit 2019' }]
		},
		{
			category: 'Agile',
			items: [
				{ name: 'Agile Leader Professional Certification - ALPC™' },
				{ name: 'Agile HR Certified Professional - AHRCP™' },
				{ name: 'Agile Coach Professional Certificate - ACPC®' }
			]
		},
		{
			category: 'ITIL',
			items: [
				{ name: 'ITIL 4 Fundamentos' },
				{ name: 'ITIL 4 Specialist (Create, Deliver & Support)' },
				{ name: 'ITIL 4 Specialist (High Velocity IT)' },
				{ name: 'ITIL 4 Specialist: Drive Stakeholder Value' },
				{ name: 'ITIL 4 (Direct, Plan & Improve)' },
				{ name: 'ITIL 4 Strategist (Digital & IT Strategy)' }
			]
		},
		{
			category: 'ISO',
			items: [
				{ name: 'ISO 22301' },
				{ name: 'ISO/IEC 27001:2022' },
				{ name: 'Auditor Líder ISO 9001:2015' }
			]
		}
	];
	let successMessage = '';
	let errorMessage = '';
	let formSubmitted: boolean;
	let captchaToken = '';

	onMount(() => {
		successMessage = '';
		errorMessage = '';
		formSubmitted = false;

		const script = document.createElement('script');
		script.src = 'https://www.google.com/recaptcha/api.js';
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);

		window.onCaptchaSuccess = function (token: string) {
			captchaToken = token;
		};
	});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		if (!captchaToken) {
			errorMessage = 'Por favor, completa el captcha.';
			return;
		}

		const formElement = event.target as HTMLFormElement;
		const formData = new FormData(formElement);
		const data = Object.fromEntries(formData.entries());

		data['g-recaptcha-response'] = captchaToken;
		try {
			const response = await fetch(VITE_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			const result = await response.json();

			if (result?.data == true) {
				successMessage = '¡Proceso exitoso!';
				errorMessage = '';
				formElement.reset();
				formSubmitted = true;

				if (window.grecaptcha) {
					window.grecaptcha.reset();
				}
				captchaToken = '';

				let whatsappMessage = `Hola, mi nombre es ${data['fullname']}.`;
				if (data['company']) {
					whatsappMessage += ` Trabajo en ${data['company']}.`;
				}
				whatsappMessage += ` Estoy interesado en el siguiente curso: ${data['courses']}.`;
				if (data['message']) {
					whatsappMessage += ` Además, me gustaría agregar: ${data['message']}.`;
				}
				const whatsappURL = `https://api.whatsapp.com/send?phone=+573125443868&text=${encodeURIComponent(
					whatsappMessage
				)}`;
				window.open(whatsappURL, '_blank');
			} else {
				errorMessage = 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.';
				successMessage = '';
			}
		} catch (error) {
			console.error('Error al enviar el formulario:', error);
			errorMessage = 'Hubo un error de red. Por favor, inténtalo más tarde.';
			successMessage = '';
		}
	};
</script>

<main
	id="contact"
	class="flex h-full flex-col items-center justify-center bg-gradient-to-b from-[#121b1d] to-[#271164]"
	style="background-image: url('/footer-bg.webp'); background-size: cover; background-position: center;"
>
	<div class="flex h-full w-full flex-wrap">
		<!-- Cambiar de hidden a block para mostrar el lado izquierdo -->
		<div class="flex w-full items-start justify-center md:block md:w-3/5">
			<div
				class="glass-effect mx-auto max-w-xl rounded-lg py-10 pl-12 pr-8 md:py-20 lg:my-20 lg:ml-[12%] lg:mr-auto xl:ml-[15%]"
			>
				<h2 class="font-base mb-7 text-center text-lg text-white sm:text-xl md:text-2xl">
					Conéctate con un asesor para más información
				</h2>
				<form method="POST" on:submit={handleSubmit} class="mx-auto mt-8 w-full max-w-2xl sm:mt-4">
					<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
						<div>
							<label for="fullname" class="block text-sm font-semibold leading-6 text-white">
								Nombre
							</label>
							<div class="mt-2.5">
								<input
									type="text"
									name="fullname"
									id="fullname"
									autocomplete="given-name"
									class="block w-full rounded-md border-0 bg-transparent px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-100 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
									required
								/>
							</div>
						</div>
						<div>
							<label for="company" class="block text-sm font-semibold leading-6 text-white">
								Empresa (opcional)
							</label>
							<div class="mt-2.5">
								<input
									type="text"
									name="company"
									id="company"
									autocomplete="organization"
									class="block w-full rounded-md border-0 bg-transparent px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-100 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
						<div>
							<label for="email" class="block text-sm font-semibold leading-6 text-white">
								Correo
							</label>
							<div class="mt-2.5">
								<input
									type="email"
									name="email"
									id="email"
									autocomplete="email"
									placeholder="tucorreo@gmail.com"
									class="block w-full rounded-md border-0 bg-transparent px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-100 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
									required
								/>
							</div>
						</div>
						<div>
							<label for="phone" class="block text-sm font-semibold leading-6 text-white">
								Teléfono
							</label>
							<div class="mt-2.5">
								<input
									type="tel"
									name="phone"
									id="phone"
									autocomplete="tel"
									placeholder="+573001234567"
									pattern="^\+?[0-9]+$"
									class="block w-full rounded-md border-0 bg-transparent px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-100 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
									required
								/>
								<p class="mt-1 text-sm text-gray-200">
									Ingrese un número válido sin espacios. El símbolo "+" es opcional. Ejemplo:
									+573001234567.
								</p>
							</div>
						</div>
						<div class="sm:col-span-2">
							<label for="participants" class="block text-sm font-semibold leading-6 text-white">
								Curso de interés
							</label>
							<select
								name="courses"
								id="courses"
								class="bg-dark block w-full rounded-md border-0 bg-gray-700 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-100 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
								required
							>
								{#each courses as courses}
									<optgroup label={courses.category}>
										{#each courses.items as item}
											<option value={item.name}>{item.name}</option>
										{/each}
									</optgroup>
								{/each}
							</select>
						</div>
						<div class="sm:col-span-2">
							<label for="message" class="block text-sm font-semibold leading-6 text-white">
								Detalles adicionales (opcional)
							</label>
							<div class="mt-2.5">
								<textarea
									name="message"
									id="message"
									rows="4"
									placeholder="Escribe más información que consideres relevante"
									class="block w-full rounded-md border-0 bg-transparent px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-100 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
								></textarea>
							</div>
						</div>
						<div class="sm:col-span-2">
							<label class="flex items-center text-sm font-semibold leading-6 text-white">
								<input
									type="checkbox"
									name="habeasData"
									value="true"
									required
									class="h-4 w-4 rounded border-gray-600 text-gray-600 focus:ring-gray-200"
								/>
								<span class="ml-2">Acepto el tratamiento de mis datos personales</span>
							</label>
						</div>
					</div>

					<div class="mt-4">
						<div
							class="g-recaptcha"
							data-sitekey={VITE_CAPTCHA_SITE_KEY}
							data-callback="onCaptchaSuccess"
						></div>
					</div>

					<div class="mt-10">
						<button
							type="submit"
							class="block w-full rounded-md bg-[#5b49d1] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#5b49d1]/60"
						>
							Enviar
						</button>
					</div>

					{#if successMessage}
						<p class="mt-4 text-center text-green-500">{successMessage}</p>
					{/if}

					{#if errorMessage}
						<p class="mt-4 text-center text-[#ffffff]">{errorMessage}</p>
					{/if}
				</form>
			</div>
		</div>

		<!-- Ocultar la segunda mitad en escritorio para mover el formulario a la izquierda -->
		<div class="hidden md:block md:w-2/5"></div>
	</div>
</main>

<style>
	/* .background {
		height: auto;
		background-size: cover;
		background-position: top;
		background-attachment: scroll, local;
		background-image: url('/background-hero.webp');
	}

	@media (max-width: 768px) {
		.background {
			background-attachment: fixed;
			background-position: right;
		}
	} */
	.glass-effect {
		background: rgba(138, 127, 127, 0.248);
		backdrop-filter: blur(10px);
		border: none;
		border-radius: 10px; /* Agrega un borde redondeado */
	}
	@media (max-width: 768px) {
		.glass-effect {
			background: rgb(59 59 59 / 70%);
			backdrop-filter: blur(10px);
			border: none;
			border-radius: 0;
		}
	}

	select {
		background-color: transparent;
		color: #ffffff;
	}

	select option {
		background-color: #ffffff;
		color: #2d2d2d;
	}
</style>
