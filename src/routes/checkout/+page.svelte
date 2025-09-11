<script lang="ts">
	import { cart } from '$lib/stores/cart';
	import { formatCurrency } from '$lib/utils/format';
	import { Heading, Input, Label, Select, Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { BaseCourse } from '$lib/types';

	let cartItems: BaseCourse[] = [];
	let cartTotal = '';

	// Datos del formulario
	let formData = {
		fullname: '',
		typeDocument: '',
		numberDocument: '',
		phone: '',
		email: '',
		dateBirth: ''
	};

	// Opciones para tipo de documento
	const documentTypes = [
		{ value: 'C', name: 'Cédula de Ciudadanía' },
		{ value: 'E', name: 'Cédula de Extranjería' },
		{ value: 'P', name: 'Pasaporte' },
		{ value: 'T', name: 'Tarjeta de Identidad' }
	];

	let isSubmitting = false;

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
		cartTotal = formatCurrency(total);

		return unsubscribe;
	});

	async function handleSubmit() {
		isSubmitting = true;

		// Validación básica
		if (
			!formData.fullname ||
			!formData.typeDocument ||
			!formData.numberDocument ||
			!formData.phone ||
			!formData.email ||
			!formData.dateBirth
		) {
			alert('Por favor completa todos los campos');
			isSubmitting = false;
			return;
		}

		try {
			// Aquí puedes agregar la lógica para enviar los datos al servidor
			console.log('Datos del formulario:', formData);
			console.log('Fecha en formato correcto:', formData.dateBirth); // Formato: "YYYY-MM-DD"
			console.log('Curso:', cartItems[0]);

			// Simulamos un delay de envío
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirigir a página de confirmación o payment
			alert('Datos guardados correctamente. Redirigiendo al pago...');
			// goto('/payment'); // Si tienes una página de pago
		} catch (error) {
			console.error('Error al enviar el formulario:', error);
			alert('Error al procesar la información. Inténtalo de nuevo.');
		} finally {
			isSubmitting = false;
		}
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

					<Button
						type="submit"
						disabled={isSubmitting}
						class="mt-6 w-full bg-[#5b49d1] hover:bg-[#5b49d1]/80"
					>
						{isSubmitting ? 'Procesando...' : 'Continuar al Pago'}
					</Button>
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
								<h3 class="mb-2 text-lg font-semibold text-white">{item.name}</h3>
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
