<script lang="ts">
	export let filteredCourses: any[] = [];

	let currentIndex = 0;
	let autoplayInterval: any = null;
	let slidesToShow = 4; // always target 4 slides (desktop)
	const GAP = 16; // matches CSS gap in .carousel-inner

	$: totalSlides = filteredCourses.length;
	let slideWidth = 240; // px computed based on container width
	let carouselEl: HTMLDivElement | null = null;
	let slideOffset = 0; // px to scroll per step

	function updateSlidesToShow() {
		// keep slidesToShow 4 for wide screens, but reduce on smaller devices
		if (typeof window !== 'undefined') {
			const width = window.innerWidth;
			if (width >= 1280) slidesToShow = 4;
			else if (width >= 1024) slidesToShow = 3;
			else if (width >= 768) slidesToShow = 2;
			else slidesToShow = 1;
		}
	}

	// compute slide width so exactly `slidesToShow` are visible inside the .carousel wrapper
	function setSlideOffset() {
		if (!carouselEl) return;
		const visible = Math.min(slidesToShow, Math.max(1, totalSlides));
		// use parent (.carousel) width which is the visible viewport for slides
		const carouselWrapper = carouselEl.parentElement as HTMLElement | null;
		const containerWidth = carouselWrapper ? carouselWrapper.clientWidth : carouselEl.clientWidth;
		const totalGap = GAP * (visible - 1);
		const available = Math.max(0, containerWidth - totalGap - 16); // small padding buffer
		// make cards identical: floor division, always divide by 4 to maintain width consistency
		slideWidth = Math.max(250, Math.floor(available / 4));
		slideOffset = slideWidth + GAP;
		// set inline widths for each slide (in case nodes changed)
		const nodes = carouselEl.querySelectorAll('.slide');
		nodes.forEach((n: Element) => (n as HTMLElement).style.width = `${slideWidth}px`);
	}

	function startAutoplay() {
		if (autoplayInterval) clearInterval(autoplayInterval);
		autoplayInterval = setInterval(() => {
			scrollNext();
		}, 3000);
	}

	function stopAutoplay() {
		if (autoplayInterval) {
			clearInterval(autoplayInterval);
			autoplayInterval = null;
		}
	}

	function scrollPrev() {
		if (!carouselEl) return;
		if (carouselEl.scrollLeft <= 0) {
			// wrap to end
			carouselEl.scrollTo({ left: carouselEl.scrollWidth, behavior: 'smooth' });
		} else {
			carouselEl.scrollBy({ left: -slideOffset, behavior: 'smooth' });
		}
	}

	function scrollNext() {
		if (!carouselEl) return;
		const maxScrollLeft = carouselEl.scrollWidth - carouselEl.clientWidth;
		if (carouselEl.scrollLeft >= maxScrollLeft - 1) {
			// wrap to start
			carouselEl.scrollTo({ left: 0, behavior: 'smooth' });
		} else {
			carouselEl.scrollBy({ left: slideOffset, behavior: 'smooth' });
		}
	}

	// Initialize on mount
	import { onMount } from 'svelte';
	let ro: ResizeObserver | null = null;
	onMount(() => {
		updateSlidesToShow();
		// measure after next paint
		requestAnimationFrame(() => setSlideOffset());
		window.addEventListener('resize', () => {
			updateSlidesToShow();
			setSlideOffset();
		});

		// observe carousel size changes and recalc when images load
		if (typeof ResizeObserver !== 'undefined') {
			ro = new ResizeObserver(() => setSlideOffset());
			if (carouselEl && carouselEl.parentElement) ro.observe(carouselEl.parentElement);
			else if (carouselEl) ro.observe(carouselEl);
		}

		// when images load, recalc widths to avoid layout shifts
		const imgs = carouselEl ? Array.from(carouselEl.querySelectorAll('img')) as HTMLImageElement[] : [];
		imgs.forEach((img) => img.addEventListener('load', setSlideOffset));

		setTimeout(() => startAutoplay(), 1000);
		return () => {
			window.removeEventListener('resize', setSlideOffset);
			if (ro) ro.disconnect();
			stopAutoplay();
		};
	});
</script>

<div class="carousel-container bg-gradient" role="region" on:mouseenter={stopAutoplay} on:mouseleave={startAutoplay}>
	{#if filteredCourses.length > 0}
		<button class="nav-button prev" on:click={scrollPrev} aria-label="Previous">
			&lt;
		</button>
		<div class="carousel">
			<div
				bind:this={carouselEl}
				class="carousel-inner"
			>
				{#each filteredCourses as course}
					<div class="slide" style="width: {slideWidth}px">
						<div class="card">
							<img class="card-image" src="/courseImages/{course.keyWord}.webp" alt="{course.name}" />
							<h3 class="card-title">{course.name}</h3>
							<p class="card-description">{course.shortDescriptionEcommerce}</p>
							<div class="card-tags">
								<span class="tag">{course.duration} horas</span>
								<span class="tag">{course.certifiedEntityEcommerce}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<button class="nav-button next" on:click={scrollNext} aria-label="Next">
			&gt;
		</button>
	{:else}
		<p class="no-courses">No hay cursos disponibles para esta categoría.</p>
	{/if}
</div>

<style>
	.carousel-container {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		width: 100%;
	}

	/* Tailwind-like gradient background as requested */
	.bg-gradient {
		background: linear-gradient(135deg, #0f1724 0%, #111827 40%, #0f1724 100%); /* fallback */
		/* the precise Tailwind gradient: from-slate-900 via-gray-900 to-slate-800 */
		background: linear-gradient(135deg, #0f1724 0%, #111827 40%, #1f2937 100%);
		padding: 80px 0;
	}

	.nav-button {
		background: white;
		border: none;
		border-radius: 50%;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		font-size: 24px;
		font-weight: bold;
		color: black;
		margin: 0 16px;
		transition: background-color 0.3s;
	}

	.nav-button:hover {
		background: #f0f0f0;
	}

	.carousel {
		flex: 1;
		overflow: hidden;
		/* center content so exactly 4 fit */
		padding: 0 8px;
	}

	.carousel-inner {
		display: flex;
		gap: 16px;
		scroll-behavior: smooth;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		/* hide scrollbar for webkit */
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.carousel-inner::-webkit-scrollbar {
		display: none;
	}

	.slide {
		flex-shrink: 0;
		padding: 8px;
		box-sizing: border-box;
		scroll-snap-align: start;
		/* width set inline from slideWidth variable */
	}

	.card {
		background: #374151;
		border-radius: 16px;
		padding: 20px;
		color: #e5e7eb;
		box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
		transition: box-shadow 0.3s;
		height: 360px; /* enforce consistent card height */
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.card:hover {
		box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
	}

	.card-image {
		width: 100%;
		height: 120px;
		object-fit: cover;
		border-radius: 12px;
		margin-bottom: 16px;
	}

	.card-title {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 12px;
		color: white;
	}

	.card-description {
		font-size: 14px;
		margin-bottom: 16px;
		flex-grow: 1;
	}

	.card-tags {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.tag {
		background: #6b7280;
		color: white;
		padding: 4px 8px;
		border-radius: 8px;
		font-size: 12px;
		font-weight: 500;
	}

	.no-courses {
		text-align: center;
		color: #6b7280;
		font-size: 16px;
		margin: 32px 0;
		width: 100%;
	}

	@media (max-width: 640px) {
		.carousel-inner {
			gap: 0;
		}
		.carousel {
			padding: 0;
		}
		.nav-button {
			margin: 0 8px;
		}
	}
</style>