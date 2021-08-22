<script lang="ts">
	import { colorsArray } from '../colors';
	import TimeCounter from '../components/TimeCounter.svelte';
	import NumberCounter from './NumberCounter.svelte';
	import type { ExerciseForm, Exercise } from '../types';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	/* 	export let finished = false; */

	/* 	export let props = {
		color: 0,
		name: 'Interval 1',
		repsMode: false,
		time: 30,
		reps: 0,
		isRest: false
	}; */
	export let props: any;
	export let workoutId;
	let actualColor = props.color || Math.floor(Math.random() * 8);
	$: exerColor = colorsArray[actualColor];
	function changeColor(): void {
		actualColor++;
		if (actualColor > colorsArray.length - 1) {
			actualColor = 0;
		}
	}
	let exerName: string = props.name || 'Interval 1';
	let exerRepsMode: boolean = props.repsMode || false;
	let exerReps: number = props.reps || 0;
	let exerTime = props.time || 30;
	let exerIsRest: boolean = props.isRest || false;

	async function handleSubmit() {
		var db = new PouchDB('exercises');
		const exercise = createExercise({
			name: exerName,
			color: actualColor,
			isRest: exerIsRest,
			repsMode: exerRepsMode,
			reps: exerReps,
			time: exerTime
		});
		const addition = await db.put(exercise);
		if (addition.ok) console.log('added correctly', exercise);

		dispatch('exerciseAdded');
	}
	function createExercise(exerciseForm: ExerciseForm): Exercise {
		let order = props.order === undefined ? Date.now() : props.order;
		const exercise = {
			_id: props._id || Date.now().toString(),
			_rev: props._rev,
			workout: workoutId,
			order,
			...exerciseForm
		};
		console.log(exercise);
		return exercise;
	}
	function handleForReps(): void {
		exerRepsMode = true;
	}
	function handleForTime(): void {
		exerRepsMode = false;
		exerReps = 0;
	}
	function handleActive(): void {
		exerIsRest = false;
	}
	function handleRest(): void {
		exerIsRest = true;
	}
	function handleCancel() {
		dispatch('cancel');
	}
	function handleDelete() {
		dispatch('delete');
	}
</script>

<div
	class="w-full min-h-screen mx-auto bg-special opacity-75 fixed top-0 "
	style="--bgColor: {exerColor}"
/>
<div class="bg-bgBlue w-10/12 m-auto rounded-xl fixed top-24">
	<div class="w-full flex items-center justify-around mt-4">
		<p class="text-md" on:click={handleCancel}>Cancel</p>
		<div
			on:click={changeColor}
			class="circle w-8 h-8 rounded-full mx-4 bg-special"
			style="--bgColor: {exerColor}"
		/>
		<p class="text-md" on:click={handleDelete}>Delete</p>
	</div>
	<div class="flex items-center justify-around py-4">
		<input
			bind:value={exerName}
			type="text"
			placeholder="Exercise name"
			class="border-b border-gray-300 outline-none bg-transparent text-center font-semibold"
		/>
	</div>
	<TimeCounter bind:time={exerTime} />
	{#if exerRepsMode && !exerIsRest}
		<NumberCounter bind:counter={exerReps} />
	{/if}
	<div class="my-5 ">
		<div
			class="flex items-center justify-evenly  border my-2 border-purple-700 w-3/4 mx-auto rounded-full"
		>
			<div
				class="bg-purple-700 rounded-l-full w-full"
				class:bg-purple-700={!exerRepsMode}
				on:click={handleForTime}
			>
				<p class="text-sm uppercase text-white text-center">for time</p>
			</div>
			<div
				class="rounded-r-full w-full"
				class:bg-purple-700={exerRepsMode}
				on:click={handleForReps}
			>
				<p class="text-sm uppercase text-center">for reps</p>
			</div>
		</div>
		<div
			class="flex items-center justify-evenly my-2  border border-purple-700 w-3/4 mx-auto rounded-full"
		>
			<div
				class="bg-purple-700 rounded-l-full w-full"
				class:bg-purple-700={!exerIsRest}
				on:click={handleActive}
			>
				<p class="text-sm uppercase text-white text-center">active</p>
			</div>
			<div
				class="rounded-r-full w-full"
				class:bg-purple-700={exerIsRest}
				on:click={handleRest}
			>
				<p class="text-sm uppercase text-center">rest</p>
			</div>
		</div>
	</div>
	<div
		on:click={handleSubmit}
		class="rounded-full border border-white px-3 py-2 w-24 mx-auto mb-5"
	>
		<p class="uppercase text-sm text-center">done</p>
	</div>
</div>

<style>
	.bg-special {
		background-color: var(--bgColor);
	}
</style>
