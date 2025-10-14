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

<main class="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 pt-20">
	<section class="mx-auto max-w-7xl px-4">
		<!-- Header de categorías mejorado -->
		<div class="mb-6 pt-8 text-center">
			<h2
				class="mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-3xl font-bold text-transparent"
			>
				Explora Nuestros Cursos
			</h2>
			<p class="text-gray-300">Selecciona una categoría para encontrar el curso perfecto para ti</p>
		</div>

		<!-- Contenedor de categorías rediseñado -->
		<div class="-mx-4 mb-8 overflow-x-auto px-4">
			<div class="flex min-w-max justify-center gap-4 py-4 sm:flex-wrap sm:justify-center">
				{#each categories as { categoryName: catName, categoryKey: catKey }}
					<CategoryButton
						categoryName={catName}
						categoryKey={catKey}
						isActive={categoryKey === catKey}
						on:categorySelect={handleCategoryClick}
					/>
				{/each}
			</div>
		</div>
	</section>
	<Category {filteredCourses} />
</main>
