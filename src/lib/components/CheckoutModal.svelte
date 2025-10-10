<script lang="ts">
	import { Modal } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { cart } from '$lib/stores/cart';

	export let showModal = false;
	export let modalType = '';
	export let modalTitle = '';
	export let modalMessage = '';
	export let nextSteps = '';
</script>

<!-- Modal de resultado -->
<Modal bind:open={showModal} size="md" placement="center" class="max-w-md h-auto mt-12 rounded-2xl shadow-2xl border-2 border-gray-700 bg-[#121b1d]">
	<div class="text-center p-6">
		<!-- Ícono grande y llamativo -->
		{#if modalType === 'success'}
			<div class="fade-in-delay-100 mb-6 flex justify-center">
				<div class="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
					<span class="text-4xl text-white">✅</span>
				</div>
			</div>
		{:else}
			<div class="fade-in-delay-100 mb-6 flex justify-center">
				<div class="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
					<span class="text-4xl text-white">❌</span>
				</div>
			</div>
		{/if}

		<!-- Título con gradiente -->
		<h2 class="fade-in-delay-200 text-2xl font-bold mb-4 bg-gradient-to-r from-[#5b49d1] to-[#7c3aed] bg-clip-text text-transparent">
			{modalTitle}
		</h2>

		<!-- Mensaje principal -->
		<p class="fade-in-delay-300 text-gray-300 text-lg mb-6 leading-relaxed">
			{modalMessage}
		</p>

		<!-- Próximos pasos para éxito -->
		{#if modalType === 'success'}
			<div class="fade-in-delay-400 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-4 mb-6 border border-blue-500/20">
				<h3 class="text-lg font-semibold text-blue-300 mb-3 flex items-center justify-center gap-2">
					<span class="text-xl">📧</span>
					Próximos Pasos
				</h3>
				<p class="text-sm text-gray-300 leading-relaxed">
					{nextSteps}
				</p>
			</div>
		{/if}

		<!-- Botones con gradientes y efectos -->
		{#if modalType === 'success'}
			<div class="fade-in-delay-500 flex flex-col gap-3 sm:flex-row sm:gap-4">
				<button
					on:click={() => { showModal = false; cart.clear(); goto('/'); }}
					class="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-none outline-none"
				>
					🏠 Ir a Inicio
				</button>
				<button
					on:click={() => { showModal = false; cart.clear(); goto('/courses'); }}
					class="flex-1 shine-effect bg-gradient-to-r from-[#5b49d1] to-[#7c3aed] hover:from-[#4c3bc7] hover:to-[#6b21a8] text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-none outline-none"
				>
					📚 Ver Cursos
				</button>
			</div>
		{:else}
			<div class="fade-in-delay-400">
				<button
					on:click={() => { showModal = false; }}
					class="w-full bg-gradient-to-r from-[#5b49d1] to-[#7c3aed] hover:from-[#4c3bc7] hover:to-[#6b21a8] text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
				>
					🔄 Intentar de Nuevo
				</button>
			</div>
		{/if}
	</div>
</Modal>

<style>
	.animate-pulse-slow {
		animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse-slow {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	.shine-effect {
		position: relative;
		overflow: hidden;
	}

	.shine-effect::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 50%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		animation: shine 4.5s infinite;
	}

	@keyframes shine {
		0% {
			left: -100%;
		}
		100% {
			left: 100%;
		}
	}

	.fade-in-delay-100 {
		animation: fade-in 0.5s ease-out 0.1s both;
	}

	.fade-in-delay-200 {
		animation: fade-in 0.5s ease-out 0.2s both;
	}

	.fade-in-delay-300 {
		animation: fade-in 0.5s ease-out 0.3s both;
	}

	.fade-in-delay-400 {
		animation: fade-in 0.5s ease-out 0.4s both;
	}

	.fade-in-delay-500 {
		animation: fade-in 0.5s ease-out 0.5s both;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>