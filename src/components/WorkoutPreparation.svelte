<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let time = 5;
	let countdown;
	onMount(() => {
		countdown = setInterval(updateCountdown, 1000);
	});
	function updateCountdown() {
		time--;
		if (time <= 0) {
			setTimeout(() => {
				clearInterval(countdown);
				dispatch('preparationEnd');
			}, 200);
		}
	}
</script>

<div class="w-full h-screen fixed top-0 left-0 bg-bgBluedark opacity-90" />
<div class="w-full h-screen fixed top-0 left-0 flex flex-col items-center justify-center">
	<p class="text-3xl">Preparation time</p>
	<p class="font-teko text-7xl">{time}</p>
</div>
