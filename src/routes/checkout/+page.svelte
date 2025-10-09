<script lang="ts">
	import { cart } from '$lib/stores/cart';
	import { formatCurrency } from '$lib/utils/format';
	import { Heading, Input, Label, Select, Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { BaseCourse } from '$lib/types';
	import { env } from '$env/dynamic/public';

	let cartItems: BaseCourse[] = [];
	let cartTotal = '';
	let totalAmount = 0;

	let collectedData = {};
	// Datos del formulario
	let formData = {
		fullname: '',
		typeDocument: '',
		numberDocument: '',
		phone: '',
		email: '',
		dateBirth: '',
		habeasData: '',
		keyBaseCourse: '',
		date: '',
		amount: '',
		numberTransaction: ''
	};

	// Opciones para tipo de documento
	const documentTypes = [
		{ value: 'C', name: 'Cédula de Ciudadanía' },
		{ value: 'E', name: 'Cédula de Extranjería' },
		{ value: 'P', name: 'Pasaporte' },
		{ value: 'T', name: 'Tarjeta de Identidad' }
	];

	let isSubmitting = false;
	let errorMessage = '';

	onMount(() => {
		const unsubscribe = cart.subscribe((items) => {
			cartItems = items;
			if (items.length === 0) {
				// Si no hay items en el carrito, redirigir a la página de cursos
				goto('/courses');
			}
		});

		// Calcular total
		const total = cartItems.reduce((sum, item) => {
			const price = parseInt(item.price);
			return sum + price;
		}, 0);
		totalAmount = total;
		cartTotal = formatCurrency(total);
		formData.keyBaseCourse = cartItems[0].key;
		formData.amount = total.toString();
		console.log('<<cartItems:', cartItems);
		return unsubscribe;
	});

	async function handleSubmit() {
		isSubmitting = true;
		errorMessage = '';

		// Validación básica
		if (
			!formData.fullname ||
			!formData.typeDocument ||
			!formData.numberDocument ||
			!formData.phone ||
			!formData.email ||
			!formData.dateBirth ||
			!formData.habeasData
		) {
			errorMessage = 'Por favor completa todos los campos';
			isSubmitting = false;
			return;
		}

		try {
			console.log('Enviando datos al backend...');

			// Enviar datos al backend para crear la transacción
			const response = await fetch('/api/wompi/create-transaction', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					customerData: formData,
					cartItems: cartItems,
					totalAmount: totalAmount
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Error al procesar el pago');
			}

			console.log('Transacción creada exitosamente:', result);

			if (result.checkoutUrl) {
				// Si Wompi devuelve una URL de checkout, redirigir
				window.location.href = result.checkoutUrl;
			} else {
				// Si tenemos los datos del widget, usar el widget embebido
				await initializePaymentWidget(result);
			}
		} catch (error) {
			console.error('Error al procesar el pago:', error);
			errorMessage = error.message || 'Error al procesar la información. Inténtalo de nuevo.';
			isSubmitting = false;
		}
	}

	async function initializePaymentWidget(transactionData: any) {
		try {
			// Cargar el script de Wompi si no está cargado
			await loadWompiScript();

			console.log('Inicializando widget de pago para referencia:', transactionData.reference);

			// Configurar el widget con los datos del backend
			const widgetConfig: Record<string, any> = {
				currency: transactionData.currency || 'COP',
				amountInCents: transactionData.amountInCents,
				reference: transactionData.reference,
				publicKey: transactionData.publicKey,
				redirectUrl: transactionData.redirectUrl,
				customerData: transactionData.customerData
			};

			// Agregar acceptance token si está disponible
			if (transactionData.acceptanceToken) {
				widgetConfig.acceptanceToken = transactionData.acceptanceToken;
				console.log('Acceptance token agregado');
			}

			// Agregar firma de integridad (CRÍTICO - formato específico de Wompi)
			if (transactionData.signature) {
				// Según documentación de Wompi, la firma debe ir en este formato:
				widgetConfig.signature = {
					integrity: transactionData.signature
				};
				console.log('Firma de integridad agregada en formato correcto:', {
					integrity: transactionData.signature
				});
			} else {
				console.error('⚠️ FIRMA DE INTEGRIDAD FALTANTE - esto causará error');
			}

			// Asegurar que tenemos todos los campos requeridos
			const requiredFields = ['publicKey', 'amountInCents', 'reference', 'currency'];
			const missingFields = requiredFields.filter((field) => !widgetConfig[field]);

			if (missingFields.length > 0) {
				throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
			}

			console.log('Widget config final:', widgetConfig);

			const checkout = new (window as any).WidgetCheckout(widgetConfig);
			//RESULTADO DEL PAGO------------------------------------------------------------
			checkout.open((result: any) => {
				console.log('Resultado del pago:', result);
				handlePaymentResult(result);
			});
		} catch (error) {
			console.error('Error al inicializar widget:', error);
			errorMessage = 'Error al cargar el sistema de pago. Inténtalo de nuevo.';
			isSubmitting = false;
		}
	}

	async function handlePaymentResult(result: any) {
		if (result.transaction?.status === 'APPROVED') {
			formData.date = result.transaction.finalizedAt;
			formData.numberTransaction = result.transaction.reference;
			// ✅ AQUÍ es donde debe ir - solo cuando el pago sea exitoso
			console.log('💳 Pago APROBADO - Creando estudiante...');
			// Pasar todos los datos necesarios explícitamente
			console.log('CREO QUE AQUI ESTAN LOS DATOS', result);
			console.log('DATOS de FORMDATA', formData);

			try {
				// 🚀 CRÍTICO: Crear estudiante ANTES de mostrar éxito y redireccionar
				await handleCreateStudent(formData);
				console.log('✅ Proceso completo: Pago exitoso Y estudiante creado');

				// Solo después de crear el estudiante, mostrar éxito y redireccionar
				alert('¡Pago realizado exitosamente! Se ha enviado la confirmación a tu correo.');
				cart.clear();
				goto('/courses');
			} catch (error) {
				console.error('❌ Error crítico: Pago exitoso pero falló creación de estudiante:', error);
				// Mostrar mensaje específico para este caso crítico
				alert(
					'Pago procesado exitosamente, pero hubo un problema creando tu acceso. Contacta soporte con esta referencia: ' +
						result.transaction.reference
				);
			}
		} else if (result.transaction?.status === 'DECLINED') {
			// Pago rechazado
			alert('El pago fue rechazado. Por favor, verifica tus datos e intenta nuevamente.');
			isSubmitting = false;
		} else {
			// Pago cancelado o pendiente
			console.log('Pago cancelado o pendiente:', result);
			isSubmitting = false;
		}
	}

	async function handleCreateStudent(studentData: typeof formData) {
		console.log(
			'🚀 Llamando action del servidor para crear estudiante con todos los datos:',
			studentData
		);

		try {
			// Llamar a la action del servidor con TODOS los datos del formulario
			const formDataToSend = new FormData();
			formDataToSend.append('email', studentData.email);
			formDataToSend.append('fullname', studentData.fullname);
			formDataToSend.append('typeDocument', studentData.typeDocument);
			formDataToSend.append('numberDocument', studentData.numberDocument);
			formDataToSend.append('phone', studentData.phone);
			formDataToSend.append('dateBirth', studentData.dateBirth);
			formDataToSend.append('habeasData', studentData.habeasData);
			formDataToSend.append('keyBaseCourse', studentData.keyBaseCourse);
			formDataToSend.append('date', studentData.date);
			formDataToSend.append('amount', studentData.amount);
			formDataToSend.append('numberTransaction', studentData.numberTransaction);

			const response = await fetch('?/createStudent', {
				method: 'POST',
				body: formDataToSend
			});

			const resultServer = await response.json();

			if (resultServer.type === 'success') {
				console.log('✅ Estudiante creado exitosamente desde servidor:', resultServer.data);
				return resultServer.data;
			} else {
				console.error('❌ Error desde servidor:', resultServer.error);
				throw new Error(resultServer.error || 'Error creando estudiante');
			}
		} catch (error) {
			console.error('❌ Error llamando action del servidor:', error);
			throw error;
		}
	}
	function loadWompiScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			// Verificar si el script ya está cargado
			if (typeof (window as any).WidgetCheckout !== 'undefined') {
				resolve();
				return;
			}

			// Si ya existe el script, esperar a que cargue
			if (document.getElementById('wompi-widget-script')) {
				const checkInterval = setInterval(() => {
					if (typeof (window as any).WidgetCheckout !== 'undefined') {
						clearInterval(checkInterval);
						resolve();
					}
				}, 100);
				return;
			}

			const script = document.createElement('script');
			script.id = 'wompi-widget-script';
			script.src = 'https://checkout.wompi.co/widget.js';
			script.async = true;

			script.onload = () => {
				setTimeout(() => {
					if (typeof (window as any).WidgetCheckout !== 'undefined') {
						resolve();
					} else {
						reject(new Error('Widget no disponible'));
					}
				}, 300);
			};

			script.onerror = () => reject(new Error('Error al cargar script'));
			document.head.appendChild(script);
		});
	}
</script>

<svelte:head>
	<title>Checkout - IAcademic</title>
</svelte:head>

<main class="min-h-screen bg-[#0d0d0e] pb-8 pt-20">
	<div class="mx-auto max-w-4xl px-4">
		<div class="mb-8 text-center">
			<Heading tag="h1" class="mb-4 text-white" customSize="text-3xl font-bold">
				Finalizar Compra
			</Heading>
		</div>

		<div class="grid gap-8 lg:grid-cols-2">
			<!-- Formulario de datos -->
			<div class="rounded-lg bg-[#121b1d] p-6">
				<Heading tag="h2" class="mb-6 text-white" customSize="text-xl font-semibold">
					Información Personal
				</Heading>

				<form on:submit|preventDefault={handleSubmit} class="space-y-4">
					<div>
						<Label for="fullname" class="mb-2 text-white">Nombre Completo *</Label>
						<Input
							id="fullname"
							bind:value={formData.fullname}
							placeholder="Ingresa tu nombre completo"
							required
							class="bg-gray-700 text-white"
						/>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<Label for="typeDocument" class="mb-2 text-white">Tipo de Documento *</Label>
							<Select
								id="typeDocument"
								bind:value={formData.typeDocument}
								items={documentTypes}
								placeholder="Selecciona tipo"
								required
								class="bg-gray-700 text-white"
							/>
						</div>
						<div>
							<Label for="numberDocument" class="mb-2 text-white">Número de Documento *</Label>
							<Input
								id="numberDocument"
								bind:value={formData.numberDocument}
								placeholder="Número de documento"
								required
								class="bg-gray-700 text-white"
							/>
						</div>
					</div>

					<div>
						<Label for="phone" class="mb-2 text-white">Teléfono *</Label>
						<Input
							id="phone"
							bind:value={formData.phone}
							placeholder="Número de teléfono"
							required
							class="bg-gray-700 text-white"
						/>
					</div>

					<div>
						<Label for="email" class="mb-2 text-white">Correo Electrónico *</Label>
						<Input
							id="email"
							type="email"
							bind:value={formData.email}
							placeholder="tu@email.com"
							required
							class="bg-gray-700 text-white"
						/>
					</div>

					<div>
						<Label for="dateBirth" class="mb-2 text-white">Fecha de Nacimiento *</Label>
						<input
							id="dateBirth"
							type="date"
							bind:value={formData.dateBirth}
							required
							class="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
					<div>
						<Label for="habeasData" class="mb-2 flex items-center text-white">
							<input
								id="habeasData"
								type="checkbox"
								on:change={(e) => {
									formData.habeasData = e.currentTarget.checked ? 'acepto' : '';
								}}
								required
								class="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
							/>
							Acepto el tratamiento de mis datos personales
						</Label>
					</div>

					<Button
						type="submit"
						disabled={isSubmitting}
						class="mt-6 w-full bg-[#5b49d1] hover:bg-[#5b49d1]/80 disabled:opacity-50"
					>
						{isSubmitting ? 'Procesando...' : 'Continuar al Pago'}
					</Button>

					{#if errorMessage}
						<div class="mt-4 rounded-lg bg-red-900/20 p-4 text-center">
							<p class="text-sm text-red-200">
								❌ {errorMessage}
							</p>
						</div>
					{/if}

					{#if isSubmitting}
						<div class="mt-4 rounded-lg bg-blue-900/20 p-4 text-center">
							<p class="text-sm text-blue-200">
								� Procesando tu información y preparando el pago...
							</p>
						</div>
					{/if}
				</form>
			</div>

			<!-- Resumen del pedido -->
			<div class="rounded-lg bg-[#121b1d] p-6">
				<Heading tag="h2" class="mb-6 text-white" customSize="text-xl font-semibold">
					Resumen del Pedido
				</Heading>

				{#if cartItems.length > 0}
					<div class="space-y-4">
						{#each cartItems as item}
							<div class="rounded-lg bg-gray-600 p-4">
								<h3 class="mb-2 text-lg font-semibold text-white">{item.name}HOLAA</h3>
								<p class="text-gray-300">{item.shortDescriptionEcommerce || 'Curso profesional'}</p>
								<div class="mt-2 flex items-center justify-between">
									<span class="text-sm text-gray-400">Duración: {item.duration || 'N/A'} horas</span
									>
								</div>
							</div>
						{/each}

						<hr class="border-gray-600" />

						<div class="flex items-center justify-between">
							<span class="text-lg font-semibold text-white">Total:</span>
							<span class="text-2xl font-bold text-[#5b49d1]">{cartTotal}</span>
						</div>
					</div>
				{:else}
					<p class="text-gray-400">No hay items en el carrito</p>
				{/if}

				<div class="mt-6">
					<a
						href="/courses"
						class="block w-full rounded-lg border border-gray-600 bg-transparent px-4 py-2 text-center text-white hover:bg-gray-700"
					>
						Volver a Cursos
					</a>
				</div>
			</div>
		</div>
	</div>
</main>
