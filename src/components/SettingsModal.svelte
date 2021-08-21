<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let name = 'Gym 2';

	function handleEdit() {
		dispatch('edit');
	}
	function handleDuplicate() {
		dispatch('duplicate');
	}
	function handleDelete() {
		dispatch('delete');
	}
	function handleExit() {
		dispatch('exit');
	}
</script>

<div
	class="w-full min-h-screen mx-auto bg-gray-700 opacity-75 fixed top-0 "
	on:click={handleExit}
/>

<div class="bg-bgBlue w-10/12 mx-auto rounded-lg fixed top-32 p-5">
	<p class="text-2xl mb-3 font-semibold">{name}</p>
	<ul>
		<li class="text-lg mb-3" on:click={handleEdit}>Edit</li>
		<li class="text-lg mb-3" on:click={handleDuplicate}>Dulpicate</li>
		<li class="text-lg mb-3" on:click={handleDelete}>Delete</li>
	</ul>
</div>
