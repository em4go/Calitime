<script lang="ts">
	import { colorsArray } from '../colors';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let props: any = {
		name: 'Untitled',
		color: 6,
		isRest: false,
		repsMode: false,
		reps: 5,
		time: 20
	};
	export let isGroup = false;
	$: bgColor = colorsArray[props.color];

	function calculateTime(time: number): string {
		if (time < 10) {
			return `0${time}`;
		}
		return `${time}`;
	}
	function translateTime(time): string {
		let minutes = calculateTime(Math.floor(time / 60));
		let seconds = calculateTime(time % 60);

		return `${minutes}:${seconds}`;
	}
	$: time = translateTime(props.time);

	function handleLongPress() {
		dispatch('longPress');
	}
</script>

<div
	class="w-full h-12 px-4 flex flex-row items-center rounded "
	class:group={isGroup}
	style="--bgColor: {bgColor}"
	on:contextmenu|preventDefault={handleLongPress}
>
	<div class="w-full flex items-center">
		<div>
			{#if !isGroup}
				<div class="circle w-8 h-8 rounded-full mr-4" style="--bgColor: {bgColor}" />
			{/if}
		</div>
		<p class="text-md">{props.name}</p>
	</div>
	<p class="text-gray-300">{time}</p>
	<div class="w-6 ml-4 opacity-75">
		<img src=" /vertical-move-white.svg" alt="" />
	</div>
</div>

<style>
	.group {
		background-color: var(--bgColor);
	}
	.circle {
		background-color: var(--bgColor);
	}
</style>
