<script lang="ts">
	import Category from '$lib/components/category.svelte';
	import CategoryButton from '$lib/components/categoryButton.svelte';

	export let data;
	const courses = data.courses;
	console.log(courses);
	let categoryName = 'Todos los cursos';
	let categoryKey = '';
	let filteredCourses = [];

	const categories = [
		{ categoryName: 'Todos los cursos', categoryKey: '' },
		{ categoryName: 'ITIL® 4', categoryKey: 'itil' },
		{ categoryName: 'Scrum', categoryKey: 'scrum' },
		{ categoryName: 'Agile', categoryKey: 'agile' },
		{ categoryName: 'Cobit 2019 Fundaments', categoryKey: 'cobit' },
		{ categoryName: 'ISO', categoryKey: 'iso' }
	];

	function handleCategoryClick(event: { detail: { categoryName: string; categoryKey: string } }) {
		const { categoryName: name, categoryKey: key } = event.detail || {
			categoryName: 'Todos los cursos',
			categoryKey: ''
		};
		categoryName = name;
		categoryKey = key;

		filteredCourses = courses
			.filter((course) => key === '' || course.keyWord.includes(key))
			.map((course) => ({
				name: course.name,
				keyWord: course.keyWord,
				shortDescriptionEcommerce: course.shortDescriptionEcommerce,
				duration: course.duration,
				certifiedEntityEcommerce: course.certifiedEntityEcommerce
			}));
	}

	handleCategoryClick({ detail: { categoryName, categoryKey } });
</script>

<main class="bg-[#202121] pt-20">
	<section class="mx-auto max-w-[80%]">
		<div class="mb-4 flex flex-wrap gap-12 justify-center rounded-lg shadow-sm">
			{#each categories as { categoryName, categoryKey }}
				<CategoryButton {categoryName} {categoryKey} on:categorySelect={handleCategoryClick} />
			{/each}
		</div>
	</section>
	<Category {filteredCourses} />
</main>
