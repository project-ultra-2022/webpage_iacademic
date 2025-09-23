<script lang="ts">
	import LongCardImage from './longCardImage.svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import { CaretLeftSolid, CaretRightSolid } from 'flowbite-svelte-icons';

	export let filteredCourses = [];
	const spots = [
		{ cx: '20%', cy: '30%', r: '15%', opacity: 0.6 },
		{ cx: '50%', cy: '50%', r: '25%', opacity: 0.4 },
		{ cx: '80%', cy: '70%', r: '20%', opacity: 0.4 },
		{ cx: '30%', cy: '90%', r: '12%', opacity: 0.5 }
	];

	let emblaApi;

	function onInit(event) {
		emblaApi = event.detail;
	}

	function scrollPrev() {
		if (emblaApi) emblaApi.scrollPrev();
	}

	function scrollNext() {
		if (emblaApi) emblaApi.scrollNext();
	}
</script>

<main
	class="relative isolate overflow-hidden bg-[#121b1d] lg:overflow-visible lg:px-0"
	style="background-image: url('/background-hero.webp'); background-size: cover; background-position: center;"
>
	<div class="mx-[5%] !max-w-[90%] xl:pb-[1rem] xl:pt-10">
		{#if filteredCourses.length > 0}
			<div class="relative">
				<button
					class="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 text-black shadow-lg hover:bg-gray-200"
					on:click={scrollPrev}
					aria-label="Previous"
				>
					<CaretLeftSolid class="h-6 w-6" />
				</button>
				<div class="embla" use:emblaCarouselSvelte on:emblaInit={onInit}>
					<div class="embla__container">
						{#each filteredCourses as course}
							<div class="embla__slide">
								<LongCardImage
									name={course.name}
									keyWord={course.keyWord}
									shortDescriptionEcommerce={course.shortDescriptionEcommerce}
									tags={[`${course.duration} horas`, course.certifiedEntityEcommerce]}
								/>
							</div>
						{/each}
					</div>
				</div>
				<button
					class="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 text-black shadow-lg hover:bg-gray-200"
					on:click={scrollNext}
					aria-label="Next"
				>
					<CaretRightSolid class="h-6 w-6" />
				</button>
			</div>
		{:else}
			<p class="mt-8 text-center text-[#2a2c2d]">No hay cursos disponibles para esta categoría.</p>
		{/if}
	</div>
</main>

<style>
	.glow-background {
		filter: blur(50px);
	}

	.embla {
		overflow: hidden;
	}

	.embla__container {
		display: flex;
		gap: 0.5rem;
	}

	.embla__slide {
		flex: 0 0 calc(20% - 0.5rem);
		min-width: 0;
		scroll-snap-align: start;
	}

	@media (max-width: 1280px) {
		.embla__slide {
			flex: 0 0 calc(25% - 0.5rem);
		}
	}

	@media (max-width: 1024px) {
		.embla__slide {
			flex: 0 0 calc(33.33% - 0.5rem);
		}
	}

	@media (max-width: 768px) {
		.embla__slide {
			flex: 0 0 calc(50% - 0.5rem);
		}
	}

	@media (max-width: 640px) {
		.embla__slide {
			flex: 0 0 calc(100% - 0.5rem);
		}
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		color: black;
		font-size: 1.25rem;
		cursor: pointer;
	}

	button:hover {
		background: #f0f0f0;
	}
</style>
