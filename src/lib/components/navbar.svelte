<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem,
		Drawer,
		Heading,
		CloseButton
	} from 'flowbite-svelte';
	import { CartOutline, ChevronDownOutline } from 'flowbite-svelte-icons';
	import RegisterMark from './registerMark.svelte';
	import { cart, cartDrawerOpen } from '../stores/cart';
	import { onMount } from 'svelte';
	import { sineIn } from 'svelte/easing';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import { navigating } from '$app/stores';
	import { Image } from '@unpic/svelte';
	import type { BaseCourse } from '$lib/types';

	let hideNavMenu = true;
	let hidden = true; // Estado para el Drawer del carrito

	let transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	let cartCount = 0;
	let cartItems: BaseCourse[] = [];
	let cartTotal = '';

	// Alterna la visibilidad del menú hamburguesa
	const onNavHamburgerClick = (toggleFn: () => void) => {
		toggleFn();
		hideNavMenu = !hideNavMenu;
	};

	// Cierra el menú cuando se hace clic en un enlace
	const onNavLinkClick = () => {
		hideNavMenu = true;
	};

	// Detecta navegación y cierra el menú automáticamente
	$: if ($navigating) {
		hideNavMenu = true;
	}

	// Función para hacer scroll a la sección de contacto
	function scrollToContact() {
		const contactSection = document.getElementById('contact');
		if (contactSection) {
			contactSection.scrollIntoView({ behavior: 'smooth' });
		}
	}

	onMount(() => {
		cart.subscribe((items) => {
			cartItems = items;
			cartCount = items.length;
			cartTotal = calculateTotal(items);
		});

		// Sincronizar el store del drawer con la variable local
		cartDrawerOpen.subscribe((isOpen) => {
			hidden = !isOpen;
		});
	});

	function calculateTotal(items: BaseCourse[]): string {
		const total = items.reduce((sum, item) => {
			const price = parseInt(item.price);
			return sum + price;
		}, 0);
		return formatCurrency(total);
	}
</script>

<Navbar
	let:toggle
	class="glass-effect fixed left-1/2 top-0 z-50 w-full max-w-[100%] -translate-x-1/2 transform !rounded-none px-4 !text-white shadow-lg md:py-0"
>
	<NavBrand href="/">
		<Image alt="Logo Iacademic" src="/logos/desktop.svg" width={220} height={55} role="figure" />
	</NavBrand>
	<div class="flex items-center space-x-4 md:order-2">
		<button
			class="relative flex items-center"
			on:click={() => cartDrawerOpen.set(true)}
			aria-label="Carrito de compras"
		>
			<CartOutline class="h-8 w-8 text-white" />
			{#if cartCount > 0}
				<span
					class="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white"
				>
					{cartCount}
				</span>
			{/if}
		</button>
		<NavHamburger onClick={() => onNavHamburgerClick(toggle)} class="hover:bg-transparent" />
	</div>
	<NavUl hidden={hideNavMenu}>
		<NavLi href="/" on:click={onNavLinkClick} class="relative">Inicio</NavLi>
		<NavLi on:click={onNavLinkClick} class="relative">
			<a href="#contact" on:click|preventDefault={scrollToContact}>Contáctanos</a>
		</NavLi>
		<NavLi class="relative hover:cursor-pointer">
			Cursos<ChevronDownOutline class="inline h-6 w-6 text-white" />
		</NavLi>
		<Dropdown>
			<DropdownItem href="/courses" on:click={onNavLinkClick}>Todos los cursos</DropdownItem>
			<DropdownItem href="/courses/scrum" on:click={onNavLinkClick}>Scrum</DropdownItem>
			<DropdownItem href="/courses/cobit-2019-fundaments" on:click={onNavLinkClick}
				>Cobit 2019</DropdownItem
			>
			<DropdownItem class="flex items-center justify-between">
				Agile <ChevronDownOutline class="text-primary-700 ms-2 h-6 w-10" />
			</DropdownItem>
			<Dropdown class="!w-max">
				<DropdownItem href="/courses/agile-leader" on:click={onNavLinkClick}>
					Agile Leader Professional Certification - ALPC™
				</DropdownItem>
				<DropdownItem href="/courses/agile-hr" on:click={onNavLinkClick}>
					Agile HR Certified Professional - AHRCP™
				</DropdownItem>
				<DropdownItem href="/courses/agile-coach" on:click={onNavLinkClick}>
					Agile Coach Professional Certificate - ACPC®
				</DropdownItem>
			</Dropdown>

			<DropdownItem class="flex items-center justify-between">
				ITIL <RegisterMark /> 4 <ChevronDownOutline class="text-primary-700 ms-2 h-6 w-10" />
			</DropdownItem>
			<Dropdown class="!w-max">
				<DropdownItem href="/courses/itil-4-fundamentos" on:click={onNavLinkClick}>
					ITIL <RegisterMark /> 4 Fundamentos
				</DropdownItem>
				<DropdownItem href="/courses/itil-4-create-deliver-support" on:click={onNavLinkClick}>
					ITIL <RegisterMark /> 4 Specialist (Create, Deliver & Support)
				</DropdownItem>
				<DropdownItem href="/courses/itil-4-high-velocity-it" on:click={onNavLinkClick}>
					ITIL <RegisterMark /> 4 Specialist (High Velocity IT)
				</DropdownItem>
				<DropdownItem href="/courses/itil-4-drive-stakeholder-value" on:click={onNavLinkClick}>
					ITIL <RegisterMark /> 4 Specialist: Drive Stakeholder Value
				</DropdownItem>
				<DropdownItem href="/courses/itil-4-direct-plan-improve" on:click={onNavLinkClick}>
					ITIL <RegisterMark /> 4 (Direct, Plan & Improve)
				</DropdownItem>
				<DropdownItem href="/courses/itil-4-digital-it-strategy" on:click={onNavLinkClick}>
					ITIL <RegisterMark /> 4 Strategist (Digital & IT Strategy)
				</DropdownItem>
			</Dropdown>

			<DropdownItem class="flex items-center justify-between">
				ISO <ChevronDownOutline class="text-primary-700 ms-2 h-6 w-10" />
			</DropdownItem>
			<Dropdown class="!w-max">
				<DropdownItem href="/courses/certified-iso-22301" on:click={onNavLinkClick}>
					ISO 22301
				</DropdownItem>
				<DropdownItem href="/courses/certified-iso-27001" on:click={onNavLinkClick}>
					ISO/IEC 27001:2022
				</DropdownItem>
				<DropdownItem href="/courses/auditor-lider-iso-9001" on:click={onNavLinkClick}>
					Auditor Líder ISO 9001:2015
				</DropdownItem>
			</Dropdown>
		</Dropdown>

		<NavLi href="/about" on:click={onNavLinkClick} class="relative">Sobre nosotros</NavLi>
	</NavUl>
</Navbar>

<Drawer
	placement="right"
	transitionType="fly"
	transitionParams={transitionParamsRight}
	bind:hidden
	class="flex h-full w-full flex-col !text-white md:w-[40%]"
>
	<div class="flex items-center justify-between border-b border-gray-800 p-4">
		<Heading tag="h2" customSize="text-lg">
			{cartCount > 0 ? 'Curso agregado' : 'Carrito vacío'}
		</Heading>
		<CloseButton on:click={() => cartDrawerOpen.set(false)} />
	</div>

	{#if cartCount > 0}
		<div class="flex-grow space-y-4 overflow-y-auto p-4">
			{#each cartItems as item}
				<div class="relative space-y-0">
					<div class="relative flex items-center rounded-t-sm bg-gray-600 p-4 pt-10 shadow">
						<div class="flex-grow space-y-2">
							<h3 class="text-lg font-bold">{item.name}</h3>
							<p class="text-lg text-gray-100">{formatCurrency(parseInt(item.price))}</p>
						</div>
						<button
							on:click={() => cart.removeItem(item.key)}
							class="absolute right-2 top-2 rounded border border-white bg-transparent px-2 py-1 text-xs text-white hover:bg-white hover:text-black"
						>
							Cancelar
						</button>
					</div>
				</div>
			{/each}
		</div>

		<div class="border-t border-gray-800 p-4">
			<p class="text-base font-normal">Total: {cartTotal} ({cartCount})</p>
			<a
				href="/checkout"
				on:click={() => cartDrawerOpen.set(false)}
				class="mt-6 block rounded-lg bg-[#5b49d1] px-4 py-2 text-center text-base font-semibold text-white hover:bg-[#5b49d1]/70"
			>
				Continuar compra
			</a>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center p-8 text-center">
			<p class="text-lg font-semibold text-gray-300">Tu carrito está vacío</p>
			<p class="text-sm text-gray-400">Aún no has agregado ningún curso.</p>
			<a
				on:click={() => cartDrawerOpen.set(false)}
				href="/courses"
				class="mt-6 rounded-lg bg-[#5b49d1] px-4 py-2 text-base font-semibold text-white hover:bg-[#5b49d1]/80"
			>
				Ver Cursos
			</a>
		</div>
	{/if}
</Drawer>

<style>
	:global(.glass-effect) {
		background: rgba(0, 0, 0, 0.432);
		backdrop-filter: blur(30px);
		border: 1px solid rgba(64, 64, 64, 0.057);
		border-radius: 15px;
	}
</style>
