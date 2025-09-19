<script lang="ts">
	import type { ScheduledCourse } from '$lib/types';
	import { AngleLeftOutline, AngleRightOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	export let courses: ScheduledCourse[] = [];

	let currentIndex = 0;
	let translateXValue = 1;
	let cardsVisible = 1;

	const prev = () => {
		currentIndex = currentIndex > 0 ? currentIndex - cardsVisible : courses.length - cardsVisible;
	};

	const next = () => {
		if (currentIndex < courses.length) {
			currentIndex += cardsVisible;
		} else {
			currentIndex = 0;
		}
	};

	onMount(() => {
		if (window.innerWidth >= 1280) {
			translateXValue = 2;
			cardsVisible = 2;
		} else {
			translateXValue = 1;
			cardsVisible = 1;
		}
	});

	$: inscriptionLink = (course: ScheduledCourse) => {
		const message = `Hola, me gustaría inscribirme en el curso "${course.name}" que inicia el ${course.startDate}.`;
		return `https://wa.me/3125443868?text=${encodeURIComponent(message)}`;
	};

	$: inquiryLink = (course: ScheduledCourse) => {
		const message = `Hola, ¿hay fechas disponibles para después del curso "${course.name}"?`;
		return `https://wa.me/3125443868?text=${encodeURIComponent(message)}`;
	};
</script>

<div class="relative mx-auto w-full max-w-4xl overflow-hidden px-4">
	<div
		class="flex transition-transform duration-500 ease-in-out"
		style="transform: translateX(-{(currentIndex * 100) / translateXValue}%)"
	>
		{#each courses as course (course.key)}
			<div class="min-w-full p-4 xl:min-w-[50%]">
				<div
					class="rounded-3xl bg-gradient-to-br from-gray-700 to-gray-800 p-6 text-gray-200 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
				>
					<div class="mb-5 flex items-center border-b border-[#5b49d1] pb-5">
						<div>
							<span class="block text-lg font-semibold">Próxima apertura de curso: </span>
							<span class="font-medium text-gray-300">
								{course.startDate}
							</span>
						</div>
					</div>
					<a
						href={inscriptionLink(course)}
						target="_blank"
						class="flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-[#f4f6fa] transition-all duration-500 hover:bg-red-700"
					>
						Inscribirse
					</a>
				</div>
			</div>
		{/each}

		<div class="min-w-full p-4 xl:min-w-[50%]">
			<div
				class="rounded-3xl bg-gradient-to-br from-gray-700 to-gray-800 p-6 text-gray-200 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
			>
				<div class="mb-5 flex items-center border-b border-[#5b49d1] pb-5">
					<div>
						<span class="block text-lg font-semibold">¿No encuentras la fecha que buscas?</span>
					</div>
				</div>
				{#if courses.length > 0}
					<a
						href={inquiryLink(courses[0])}
						target="_blank"
						class="flex items-center justify-center gap-2 rounded-full border border-white px-5 py-2 text-xs font-semibold text-[#f4f6fa] transition-all duration-500 hover:bg-white/10"
					>
						Preguntar
					</a>
				{/if}
			</div>
		</div>
	</div>

	<button
		on:click={prev}
		class="absolute left-0 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-700 p-2 text-[#f4f6fa] hover:bg-gray-600 active:bg-gray-500"
	>
		<AngleLeftOutline size="lg" />
	</button>
	<button
		on:click={next}
		class="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-700 p-2 text-[#f4f6fa] hover:bg-gray-600 active:bg-gray-500"
	>
		<AngleRightOutline size="lg" />
	</button>
</div>
