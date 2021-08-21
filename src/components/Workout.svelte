<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let props;
	let time = translateTime(props.duration);

	/* 	function calculateTime(time: number): string {
		if (time < 10) {
			return `0${time}`;
		}
		return `${time}`;
	} */
	function translateTime(time): string {
		let hours = Math.floor(time / 3600);
		let minutes = Math.floor((time - Number(hours) * 3600) / 60);
		if (hours === 0) return `${minutes}min`;
		if (minutes === 0) return `${hours}h`;
		return `${hours}h ${minutes}min`;
	}
	function handleLongPress() {
		dispatch('longPress');
	}
</script>

<div
	class="w-full flex justify-between bg-bgBluelight rounded p-3 mb-5"
	on:contextmenu|preventDefault={handleLongPress}
>
	<p class="text-md font-medium translate-y-1">{props.name}</p>
	<div class="flex items-center justify-around">
		<div
			class="bg-green-transparent flex  rounded w-auto px-2 py-2 items-center justify-around"
		>
			<img class="w-3.5 mr-1" src=" /stopwatch.svg" alt="stopwatch" />
			<p class="text-green-500 text-xs ">{time}</p>
		</div>
		<img src=" /three-dots.svg" alt="Three dots options" class="w-4 ml-2" on:click />
	</div>
</div>

<style>
	.bg-green-transparent {
		background-color: rgba(29, 201, 132, 0.3);
	}
</style>
