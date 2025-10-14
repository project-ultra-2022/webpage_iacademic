<script lang="ts">
	export let categoryName: string;
	export let categoryKey: string;
	export let isActive: boolean = false;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('categorySelect', { categoryName, categoryKey });
	}
</script>

<button
	on:click={handleClick}
	type="button"
	class="group relative overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#5b49d1] focus:ring-offset-2 focus:ring-offset-slate-900 {isActive
		? 'bg-gradient-to-r from-[#5b49d1] to-[#4b3ab7] text-white shadow-lg shadow-[#5b49d1]/30'
		: 'border border-slate-600/50 bg-slate-800/70 text-gray-200 backdrop-blur-sm hover:border-slate-500 hover:bg-slate-700/80 hover:text-white'}"
>
	<!-- Efecto de brillo en hover -->
	<div
		class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"
	></div>

	<!-- Contenido del botón -->
	<span class="relative z-10 whitespace-nowrap">
		{categoryName}
	</span>
</button>
