<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let name = 'Workout';

	function handleBack() {
		dispatch('back');
	}
</script>

<nav class="w-full grid grid-cols-2">
	<div class="flex items-center justify-start">
		<img src="/arrow.svg" alt="go back arrow" class="w-5" on:click={handleBack} />
	</div>
	<div class="flex justify-end items-center">
		<p class="text-xl ">{name}</p>
	</div>
</nav>
