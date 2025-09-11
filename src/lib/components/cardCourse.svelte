<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { cart, cartDrawerOpen } from '../stores/cart';
	import { onMount } from 'svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils/format';

	export let nameCourse = '';
	export let AI = false;
	export let initialDate = new Date();
	export let finishDate = new Date();
	export let price = '0';
	export let id = '';

	let isInCart = false;

	onMount(() => {
		cart.subscribe((items) => {
			isInCart = items.some((item) => item.id === id);
		});
	});

	const removeFromCart = () => {
		cart.removeItem(id);
	};

	const addToCart = () => {
		cart.addItem({ id, nameCourse, price, AI, initialDate, finishDate });
		// Abrir el carrito automáticamente
		cartDrawerOpen.set(true);
	};
</script>

<div class="group relative rounded-lg bg-black transition hover:z-[1] hover:shadow-2xl xl:block">
	<div
		class="relative space-y-8 rounded-lg border border-gray-700 bg-gray-900 bg-opacity-30 p-8 backdrop-blur-lg backdrop-filter transition duration-300 group-hover:scale-90 group-hover:bg-red-950"
	>
		<span
			class="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
			>{AI ? 'IA' : 'Con IA experta'}</span
		>

		<div class="space-y-2">
			<h5 class="text-xl font-medium text-gray-200 transition group-hover:text-red-600">
				{nameCourse}
			</h5>
			<p class="text-sm text-gray-300">
				Empieza el {formatDate(initialDate.toString())}
			</p>
		</div>
		<div class="flex items-center justify-between">
			{#if isInCart}
				<Button on:click={removeFromCart}>
					{AI ? 'Quitar del carrito' : 'Cancelar inscripción'}
				</Button>
			{:else}
				<Button on:click={addToCart}>
					{AI ? 'Comprar curso' : 'Inscríbete ahora'}
				</Button>
			{/if}
			<span>
				<a href="/" class="text-sm text-gray-300"><ArrowRightOutline /></a>
			</span>
		</div>
	</div>
</div>
