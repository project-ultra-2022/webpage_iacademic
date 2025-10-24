<script lang="ts">
	import CourseCarousel from './courseCarousel.svelte';

	export let filteredCourses = [];
	const spots = [
		{ cx: '20%', cy: '30%', r: '15%', opacity: 0.6 },
		{ cx: '50%', cy: '50%', r: '25%', opacity: 0.4 },
		{ cx: '80%', cy: '70%', r: '20%', opacity: 0.4 },
		{ cx: '30%', cy: '90%', r: '12%', opacity: 0.5 }
	];
</script>

<main class="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 lg:overflow-visible lg:px-0">
	<!-- full-width container so the section background covers entire area -->
	<div class="w-full pb-12 pt-0">
		<div class="w-full">
			<CourseCarousel {filteredCourses} />
		</div>
	</div>
</main>


