<script>
	import { Heading, Button, Span, Li, List, P } from 'flowbite-svelte';
	import { CheckOutline } from 'flowbite-svelte-icons';
	import { Image } from '@unpic/svelte';
	import AbstractShapes from './abstractShapes.svelte';

	function scrollToBestCourses() {
		const bestCoursesSection = document.getElementById('best-courses');
		if (bestCoursesSection) {
			const offset = 100;
			const sectionPosition =
				bestCoursesSection.getBoundingClientRect().top + window.scrollY - offset;
			window.scrollTo({ top: sectionPosition, behavior: 'smooth' });
		}
	}
	const VITE_PUBLIC_IACADEMIC_URL = import.meta.env.VITE_PUBLIC_IACADEMIC_URL;
	function getIacademicURL() {
		return VITE_PUBLIC_IACADEMIC_URL + '/es/auth/sign-in';
	}
</script>

<div
	class="hero-section flex flex-col items-center justify-start text-center md:items-start md:justify-center md:text-start"
>
	<!-- Imagen de fondo -->
	<Image
		src="/background-hero.webp"
		layout="fullWidth"
		alt="Hero background image"
		class="absolute inset-0 h-full w-full object-cover"
		breakpoints={[480, 768, 1024, 1280, 1920]}
		aspectRatio={16 / 9}
		loading="eager"
	/>

	<!-- Figuras animadas -->
	<!-- <div class="absolute right-0 hidden h-[60vh] w-[60vw] -translate-y-1/2 transform md:block">
	</div> -->
	<AbstractShapes />

	<!-- Contenido principal -->
	<div
		class="lg:ml-30 relative z-10 mt-[78%] flex max-w-[80%] flex-col items-center md:ml-32 md:mt-0 2xl:ml-72"
	>
		<Heading
			tag="h1"
			class="mb-10 md:mb-6"
			customSize="font-black text-4xl sm:text-3xl md:text-4xl xl:text-5xl"
		>
			<Span
				gradient
				gradientClass="text-transparent bg-clip-text bg-gradient-to-l to-emerald-200 from-white"
			>
				EDUCACIÓN<br /> DEL FUTURO CON <br /> IACADEMIC
			</Span>
		</Heading>
		<List tag="ul" class="mb-8 space-y-4 text-gray-200" list="none">
			<Li icon class="gap-3">
				<CheckOutline class="h-5 w-5 text-gray-200 " />
				<P class="text-gray-200 md:text-lg xl:text-xl">
					Clases en vídeo con <strong>nivel de producción premium</strong>
				</P>
			</Li>
			<Li icon class="gap-3">
				<CheckOutline class="h-5 w-5 text-gray-200 " />
				<P class="text-gray-200 md:text-lg xl:text-xl">
					Chat con <strong>IA experta</strong> en cada curso.
				</P>
			</Li>
			<Li icon class="gap-3">
				<CheckOutline class="h-5 w-5 text-gray-200 " />
				<P class="text-gray-200 md:text-lg xl:text-xl">
					Pregunta por <strong>voz</strong>, la IA responde.
				</P>
			</Li>
		</List>
		<div class="flex items-stretch gap-2 md:gap-4 lg:-ml-16 xl:-ml-24">
			<Button class="mr-2 w-auto !bg-[#10796ce0] text-white hover:!bg-[#1cf2d8]/70">
				<a
					href="#best-courses"
					class="block h-full w-full md:hidden"
					on:click|preventDefault={scrollToBestCourses}
				>
					¡Explorar!
				</a>
				<a
					href="#best-courses"
					class="hidden h-full w-full md:block"
					on:click|preventDefault={scrollToBestCourses}
				>
					¡Explorar IAcademic!
				</a>
			</Button>
			<Button class="w-auto !bg-zinc-200 !text-gray-800 hover:!bg-zinc-300">
				<a
					href={getIacademicURL()}
					target="_blank"
					rel="noopener noreferrer"
					class="hidden md:block"
				>
					Ingresar a la plataforma
				</a>
				<a
					href="https://www.iacademic.net/es/auth/sign-in"
					target="_blank"
					rel="noopener noreferrer"
					class="block md:hidden"
				>
					Ingresar
				</a>
			</Button>
		</div>
	</div>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	.hero-section {
		position: relative;
		height: 100vh;
	}
</style>
