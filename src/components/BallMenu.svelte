<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let isOpen = false;

	function handleOpen() {
		isOpen = !isOpen;
	}

	function handleExercise() {
		isOpen = false;
		dispatch('createExercise');
	}
</script>

<div class=" fixed bottom-14 right-8 flex flex-col-reverse items-end">
	<div
		class="w-11 h-11 mt-3 bg-red-500 flex items-center justify-center rounded-full drop-shadow-2xl "
		on:click={handleOpen}
	>
		<img
			class="w-5 transition duration-100 ease-in-out"
			class:rotate-45={isOpen}
			alt="Add menu"
			src="../static/add.svg"
		/>
	</div>
	{#if isOpen}
		<div class="flex items-center justify-center" on:click={handleExercise}>
			<p class="text-sm bg-red-500 rounded-full px-2">Add exercise</p>
			<div
				class="w-11 h-11 ml-3 bg-red-500 flex items-center justify-center rounded-full drop-shadow-2xl "
			>
				<img class="w-10" alt="Add menu" src="../static/favicon.svg" />
			</div>
		</div>
	{/if}
</div>
