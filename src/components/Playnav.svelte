<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let timeRunning = false;
	$: playButton = !timeRunning
		? '../static/play-button.svg'
		: '../static/pause-button.svg';

	function handlePlayPause() {
		dispatch('playPause');
	}
	function handleNext() {
		dispatch('next');
	}
	function handlePrevious() {
		dispatch('previous');
	}
</script>

<div class="w-full flex items center justify-around pt-5 fixed bottom-0 pb-5">
	<img
		src="../static/next-arrow.svg"
		alt="Next exercise button"
		class="w-6 cursor-pointer transform rotate-180"
		on:click={handlePrevious}
	/>
	<img
		src={playButton}
		alt="Play Button"
		class="w-10 cursor-pointer active:scale-90"
		on:click={handlePlayPause}
	/>
	<img
		src="../static/next-arrow.svg"
		alt="Next exercise button"
		class="w-6 cursor-pointer"
		on:click={handleNext}
	/>
</div>
