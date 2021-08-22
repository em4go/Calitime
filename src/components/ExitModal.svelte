<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let exitText = 'You are going to exit the workout';

	function handleAgree() {
		dispatch('agree');
	}
	function handleDeny() {
		dispatch('deny');
	}
</script>

<div class="w-full min-h-screen mx-auto bg-gray-700 opacity-75 fixed top-0 " />

<div class="bg-bgBlue w-10/12 mx-auto rounded-lg fixed top-32 p-5">
	<p class="text-xl mb-1 ">{exitText}</p>
	<p class="text-xl font-semibold mb-3">Are you sure?</p>
	<div class="w-full h-full flex justify-around items-center">
		<button class="w-2/5 bg-red-500 rounded" on:click={handleAgree}>Exit</button>
		<button class="w-2/5 bg-green-500 rounded" on:click={handleDeny}>Stay here</button>
	</div>
</div>
