<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import {
		BadgeCheckOutline,
		CartOutline,
		CashOutline,
		ClockOutline,
		DesktopPcOutline
	} from 'flowbite-svelte-icons';
	import type { BaseCourse } from '$lib/types';
	import { formatCurrency } from '$lib/utils/format';
	import { cart, cartDrawerOpen } from '$lib/stores/cart';
	import { afterUpdate, onMount } from 'svelte';

	export let courseTitle: string;
	export let courseDescription: string;
	export let duration: string;
	export let certifiedEntity: string;
	export let price: number;
	export let course: BaseCourse;
	let isInCart = false;

	function checkCartStatus() {
		isInCart = $cart.some((item) => item.key === course.key);
	}

	onMount(() => {
		checkCartStatus();

		const unsubscribe = cart.subscribe(() => {
			checkCartStatus();
		});

		return () => {
			unsubscribe();
		};
	});

	afterUpdate(() => {
		checkCartStatus();
	});

	function handleAddToCart() {
		// Con el nuevo comportamiento, siempre añadimos/reemplazamos el curso en el carrito
		cart.addItem(course);
		checkCartStatus();
		// Abrir el carrito automáticamente
		cartDrawerOpen.set(true);
	}
</script>

<body class="mb-0 mt-0 bg-cover bg-center" style="background-image: url('/background-hero.webp');">
	<main class="md:pt-[3rem]">
		<section class="mx-auto mb-0 w-3/5 max-w-[90%] pb-16 pt-20">
			<div class="mx-auto">
				<Heading
					tag="h1"
					class="mb-4 text-neutral-50"
					customSize="text-xl font-black sm:text-2xl md:text-3xl xl:text-4xl pt-8"
				>
					{courseTitle}
				</Heading>
				<p class="text-md mb-4 font-normal text-neutral-100 lg:text-base xl:text-xl">
					{courseDescription}
				</p>
				<button
					class="relative flex items-center gap-2 rounded-lg border border-gray-500 bg-black/60 px-6 py-2
				text-base font-semibold text-white shadow-md backdrop-blur-md
				transition-all duration-300 ease-in-out before:absolute before:inset-0 before:-z-10
				before:bg-gradient-to-r before:from-gray-800 before:to-indigo-800 before:opacity-40 before:blur-lg before:transition-opacity
				before:duration-300 hover:border-indigo-400 hover:shadow-xl hover:brightness-125 before:hover:opacity-50"
					on:click={handleAddToCart}
				>
					{#if isInCart}
						<BadgeCheckOutline class="ms-1 h-6 w-6" />
						Curso en el carrito
					{:else}
						Comprar curso
						<CartOutline class="ms-1 h-6 w-6" />
					{/if}
				</button>
			</div>
		</section>

		<section class="max-w-5/5 w-5/5 bg-[#121b1d] shadow-md">
			<div
				class="max-w-4/5 mx-auto mb-0 flex w-4/5 flex-col space-y-4 p-6 text-neutral-50 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:flex lg:flex-row lg:space-y-0"
			>
				<div class="flex w-full items-start md:w-full lg:w-1/4">
					<div class="mr-2"><CashOutline size="xl" /></div>
					<div>
						<span class="text-base font-light">Precio</span>

						<Heading
							tag="h3"
							customSize="text-base font-black sm:text-lg xl:text-xl"
							class="mb-4 text-neutral-50"
						>
							{formatCurrency(price)}
						</Heading>
					</div>
				</div>
				<div class="flex w-full items-start md:w-full lg:w-1/4">
					<div class="mr-2"><BadgeCheckOutline size="xl" /></div>
					<div>
						<span class="text-base font-light">Certificado por</span>
						<Heading
							tag="h3"
							class="mb-4 text-neutral-50"
							customSize="text-lg font-black sm:text-xl xl:text-2xl"
						>
							{certifiedEntity}
						</Heading>
					</div>
				</div>

				<div class="flex w-full items-start md:w-full lg:w-1/4">
					<div class="mr-2"><ClockOutline size="xl" /></div>
					<div>
						<span class="text-base font-light">Duración</span>
						<Heading
							tag="h3"
							class="mb-4 text-neutral-50"
							customSize="text-lg font-black sm:text-xl xl:text-2xl"
						>
							{duration}
						</Heading>
					</div>
				</div>

				<div class="flex w-full items-start md:w-full lg:w-1/4">
					<div class="mr-2"><DesktopPcOutline size="xl" /></div>
					<div>
						<span class="text-base font-light">Clases en vídeo</span>
						<Heading tag="h3" customSize="text-lg font-black sm:text-xl xl:text-2xl">IA</Heading>
					</div>
				</div>
			</div>
		</section>
	</main>
</body>
