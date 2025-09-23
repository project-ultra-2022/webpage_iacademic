<script lang="ts">
	import { Image } from '@unpic/svelte';
	import defaultImageUrl from '$lib/assets/detail-course-2.jpg';

	export let name = 'Comprehensive Course Library';
	export let shortDescriptionEcommerce =
		'The place is close to Barceloneta Beach and bus stop just 2 min by walk and near to Naviglio where you can enjoy the main night life in Barcelona.';

	export let tags = ['Dynamic', 'Smart'];
	export let keyWord = 'course-keyword';
	export let imageBottom = true;

	$: truncatedDescription =
		shortDescriptionEcommerce.length > 100
			? shortDescriptionEcommerce.slice(0, 97) + '...'
			: shortDescriptionEcommerce;

	let imageUrl = `/courseImages/${keyWord}.webp`;

	function checkImage(url: string, callback: (exists: boolean) => void) {
		if (typeof window !== 'undefined') {
			const img = new window.Image();
			img.onload = () => callback(true);
			img.onerror = () => callback(false);
			img.src = url;
		} else {
			callback(false);
		}
	}

	$: checkImage(imageUrl, (exists) => {
		if (!exists) {
			imageUrl = defaultImageUrl;
		}
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="glass-effect my-6 flex w-80 cursor-pointer flex-col rounded-xl shadow-sm"
	on:click={() => {
		if (typeof window !== 'undefined') {
			window.location.href = `/courses/${keyWord}`;
		}
	}}
>
	{#if !imageBottom}
		<div class="m-4 flex h-64 items-center justify-center overflow-hidden rounded-lg">
			<Image
				class="m-4 h-full w-full object-cover p-0"
				src={imageUrl}
				layout="fullWidth"
				style="border-radius: 0.5rem;"
			/>
		</div>
	{/if}
	<div class="p-4 text-center">
		<div class="flex h-12 items-center justify-center">
			<h4 class="text-lg font-semibold leading-tight text-slate-200">
				{name}
			</h4>
		</div>
		<p class="mt-4 text-base font-light text-slate-300">
			{truncatedDescription}
		</p>
		<div class="mt-4 flex flex-wrap justify-center gap-2">
			{#each tags as tag}
				<span
					class="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-300"
					>{tag}</span
				>
			{/each}
		</div>
	</div>
	{#if imageBottom}
		<div class="m-4 flex h-64 items-center justify-center overflow-hidden rounded-lg">
			<Image
				class="m-4 h-full w-full object-cover p-0"
				src={imageUrl}
				layout="fullWidth"
				style="border-radius: 0.5rem;"
			/>
		</div>
	{/if}
</div>
