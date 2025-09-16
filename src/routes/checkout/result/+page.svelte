<script lang="ts">
	import { Heading, Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { cart } from '$lib/stores/cart';
	import { formatCurrency } from '$lib/utils/format';
	import type { PageData } from './$types';

	export let data: PageData;

	$: transaction = data.transaction;
	$: error = data.error;

	function handleContinue() {
		if (transaction?.status === 'APPROVED') {
			// Limpiar el carrito si el pago fue exitoso
			cart.clear();
		}
		goto('/courses');
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'APPROVED':
				return 'text-green-400';
			case 'DECLINED':
				return 'text-red-400';
			case 'PENDING':
				return 'text-yellow-400';
			default:
				return 'text-gray-400';
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'APPROVED':
				return '✅';
			case 'DECLINED':
				return '❌';
			case 'PENDING':
				return '⏳';
			default:
				return '❓';
		}
	}

	function getStatusMessage(status: string) {
		switch (status) {
			case 'APPROVED':
				return '¡Tu pago ha sido procesado exitosamente!';
			case 'DECLINED':
				return 'Tu pago fue rechazado. Por favor, verifica tu información e intenta nuevamente.';
			case 'PENDING':
				return 'Tu pago está siendo procesado. Te notificaremos cuando se complete.';
			default:
				return 'Estado de pago desconocido.';
		}
	}
</script>

<svelte:head>
	<title>Resultado del Pago - IAcademic</title>
</svelte:head>

<main class="min-h-screen bg-[#0d0d0e] pb-8 pt-20">
	<div class="mx-auto max-w-2xl px-4">
		<div class="rounded-lg bg-[#121b1d] p-8 text-center">
			{#if error}
				<!-- Error al verificar transacción -->
				<div class="mb-6">
					<div class="mb-4 text-6xl">❌</div>
					<Heading tag="h1" class="mb-4 text-white" customSize="text-2xl font-bold">
						Error al Verificar el Pago
					</Heading>
					<p class="text-gray-300">{error}</p>
				</div>
			{:else if transaction}
				<!-- Resultado de la transacción -->
				<div class="mb-6">
					<div class="mb-4 text-6xl">{getStatusIcon(transaction.status)}</div>
					<Heading tag="h1" class="mb-4 text-white" customSize="text-2xl font-bold">
						Resultado del Pago
					</Heading>
					<p class="mb-4 text-lg {getStatusColor(transaction.status)}">
						{getStatusMessage(transaction.status)}
					</p>
				</div>

				<!-- Detalles de la transacción -->
				<div class="mb-6 rounded-lg bg-gray-700 p-4 text-left">
					<h3 class="mb-3 text-lg font-semibold text-white">Detalles de la Transacción</h3>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-400">Referencia:</span>
							<span class="text-white">{transaction.reference}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-400">Monto:</span>
							<span class="text-white">{formatCurrency(transaction.amount_in_cents / 100)}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-400">Estado:</span>
							<span class={getStatusColor(transaction.status)}>{transaction.status}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-400">Email:</span>
							<span class="text-white">{transaction.customer_email}</span>
						</div>
						{#if transaction.created_at}
							<div class="flex justify-between">
								<span class="text-gray-400">Fecha:</span>
								<span class="text-white">
									{new Date(transaction.created_at).toLocaleString('es-CO')}
								</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Mensajes específicos por estado -->
				{#if transaction.status === 'APPROVED'}
					<div class="mb-6 rounded-lg bg-green-900/20 p-4">
						<p class="text-green-200">
							🎉 ¡Excelente! Tu curso ha sido activado. Pronto recibirás un correo con las
							instrucciones de acceso.
						</p>
					</div>
				{:else if transaction.status === 'DECLINED'}
					<div class="mb-6 rounded-lg bg-red-900/20 p-4">
						<p class="text-red-200">
							💳 El pago fue rechazado por tu entidad financiera. Puedes intentar con otra tarjeta o
							contactar a tu banco.
						</p>
					</div>
				{:else if transaction.status === 'PENDING'}
					<div class="mb-6 rounded-lg bg-yellow-900/20 p-4">
						<p class="text-yellow-200">
							⏳ Tu pago está en proceso. Te notificaremos por correo cuando se complete la
							transacción.
						</p>
					</div>
				{/if}
			{:else}
				<!-- No hay información -->
				<div class="mb-6">
					<div class="mb-4 text-6xl">❓</div>
					<Heading tag="h1" class="mb-4 text-white" customSize="text-2xl font-bold">
						Información No Disponible
					</Heading>
					<p class="text-gray-300">No se pudo obtener la información de la transacción.</p>
				</div>
			{/if}

			<!-- Botones de acción -->
			<div class="space-y-3">
				<Button on:click={handleContinue} class="w-full bg-[#5b49d1] hover:bg-[#5b49d1]/80">
					{transaction?.status === 'APPROVED' ? 'Ver Mis Cursos' : 'Volver a Cursos'}
				</Button>

				{#if transaction?.status === 'DECLINED'}
					<Button on:click={() => goto('/checkout')} class="w-full bg-gray-600 hover:bg-gray-500">
						Intentar Nuevamente
					</Button>
				{/if}

				<a
					href="/contact"
					class="block w-full rounded-lg border border-gray-600 bg-transparent px-4 py-2 text-center text-white hover:bg-gray-700"
				>
					¿Tienes dudas? Contáctanos
				</a>
			</div>
		</div>
	</div>
</main>
