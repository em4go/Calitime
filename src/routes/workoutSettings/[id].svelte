<script context="module">
	export function load({ page }) {
		const { id } = page.params;
		return {
			props: {
				id
			}
		};
	}
</script>

<script lang="ts">
	import Exercise from '../../components/Exercise.svelte';
	import NumberCounter from '../../components/NumberCounter.svelte';
	import ExerciseSettings from '../../components/ExerciseSettings.svelte';
	import BallMenu from '../../components/BallMenu.svelte';
	import SettingsModal from '../../components/SettingsModal.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let id;
	let props: any = {
		name: '',
		laps: ''
	};

	let workoutName;
	let workoutLaps;

	let showModalSettings = false;

	overrideItemIdKeyNameBeforeInitialisingDndZones('_id');

	onMount(async () => {
		await loadWorkout(id);
		await updateExercises();
	});
	async function loadWorkout(id: string) {
		let db = new PouchDB('workouts');
		/* 		await db.createIndex({
			index: { fields: ['_id', 'workout'] }
		}); */

		let allDocs = await db.find({
			selector: {
				_id: { $eq: id }
			}
		});
		console.log(allDocs.docs[0]);
		props = allDocs.docs[0] || {};
		workoutName = props.name || '';
		workoutLaps = props.laps || 1;
	}

	let dropTargetStyle: {};
	let dragDisabled = true;

	function handleSort(e) {
		exercises = e.detail.items;
		dropTargetStyle = {
			'background-color': '#344568',
			'border-radius': '5px'
		};
	}

	function toggleDragDisabled() {
		dragDisabled = !dragDisabled;
	}
	let exercises = [];

	async function saveWorkout() {
		for (let i = 0; i < exercises.length; i++) {
			exercises[i].order = i;
		}
		await addAllExercises(exercises);
		await addWorkout();
		goto('/');
	}
	async function addAllExercises(exercises) {
		let db = new PouchDB('exercises');
		await db.bulkDocs(exercises);
	}
	async function addWorkout() {
		const workout = {
			_id: id,
			_rev: props._rev,
			name: workoutName || 'untitled',
			duration: workoutDuration,
			laps: workoutLaps,
			lastUpdate: Date.now()
		};
		let db = new PouchDB('workouts');
		const addition = await db.put(workout);
		if (addition.ok) {
			console.log('added succesfully', workout);
		}
	}

	let exerciseModifiying = false;

	async function handleAdd() {
		exerciseModifiying = false;
		await updateExercises();
		currentExercise = null;
	}

	let workoutDurationOneLap = 0;
	let workoutDuration = 0;
	$: workoutDuration = workoutLaps * workoutDurationOneLap;
	$: workoutTime = translateTime(workoutDuration);
	function calculateTime(time: number): string {
		if (time < 10) {
			return `0${time}`;
		}
		return `${time}`;
	}
	function translateTime(time): string {
		let hours = calculateTime(Math.floor(time / 3600));
		let minutes = calculateTime(Math.floor((time - Number(hours) * 3600) / 60));
		let seconds = calculateTime(time % 60);

		return `${hours}:${minutes}:${seconds}`;
	}

	async function updateExercises() {
		workoutDurationOneLap = 0;
		let db = new PouchDB('exercises');
		await db.createIndex({
			index: { fields: ['order', 'workout'] }
		});

		let allDocs = await db.find({
			selector: {
				order: { $gte: null },
				workout: { $eq: id }
			}
		});
		exercises = allDocs.docs;
		exercises.forEach((e) => (workoutDurationOneLap += e.time));
		workoutDuration = workoutLaps * workoutDurationOneLap;
	}

	let currentExercise;
	function handleManageExercise(e) {
		currentExercise = e;
		exerciseModifiying = true;
	}
	function handleCancelExercise() {
		exerciseModifiying = false;
		currentExercise = {};
	}
	async function handleDeleteExercise() {
		let db = new PouchDB('exercises');
		const removal = await db.put({ ...currentExercise, _deleted: true });
		if (removal.ok) {
			exercises = exercises.filter((todo) => {
				return todo._id !== currentExercise._id;
			});
		}
		handleCancelExercise();
	}
	async function handleCancelWorkout() {
		if (!props._rev) {
			for (let i = 0; i < exercises.length; i++) {
				exercises[i]._deleted = true;
			}
			let db = new PouchDB('exercises');
			await db.bulkDocs(exercises);
			console.log('removed exercises which were not in this workout', exercises);
		}
		goto('/');
	}
	async function handleDuplicateExercise(exercise) {
		const duplicated = { ...exercise };
		duplicated._id = Date.now().toString();
		duplicated._rev = undefined;
		duplicated.order = Date.now();
		let db = new PouchDB('exercises');
		const addition = await db.put(duplicated);
		if (addition.ok) {
			await updateExercises();
			console.log('Duplicated has gone well');
		}
	}
	function cancelSettingsModal() {
		showModalSettings = false;
	}
	function handleLongPress(exercise) {
		currentExercise = exercise;
		showModalSettings = true;
	}
	let defaultBreak = {
		color: 0,
		isRest: true,
		name: 'Descanso',
		repsMode: false,
		time: 30
	};
	function handleAddBreak() {
		exerciseModifiying = true;
		currentExercise = defaultBreak;
	}
</script>

<div class="flex flex-col text-gray-200 w-full min-h-screen mx-auto items-center">
	<div class="w-full mt-3 px-3 flex flex-col ">
		<div class="w-full grid grid-cols-2">
			<div class="flex items-center justify-start">
				<img
					on:click={handleCancelWorkout}
					src=" /arrow.svg"
					alt="go back arrow"
					class="w-5"
				/>
			</div>
			<div class="flex justify-end items-center">
				<p class="text-sm uppercase" on:click={saveWorkout}>save</p>
			</div>
		</div>
		<div class="w-full flex items-center justify-center py-2">
			<input
				bind:value={workoutName}
				type="text"
				placeholder="Workout Title"
				class="border-b border-red-500 outline-none bg-transparent text-center font-semibold"
			/>
		</div>
	</div>
	<div class="w-full flex items-center justify-center flex-col my-4">
		<p class="text-xs uppercase text-gray-400">duration</p>
		<p class="font-teko text-3xl">{workoutTime}</p>
	</div>
	<div class="w-full border-b border-red-500 flex justify-center px-4">
		<input
			type="text"
			placeholder="Enter description"
			class="outline-none bg-transparent text-center w-full"
		/>
	</div>
	<div class="w-full bg-bgBlue flex items-center justify-between px-4 sticky top-0">
		<p class="text-md my-4">Exercises</p>
		<div class="flex items-center">
			<div
				class=" w-20 rounded-full p-0.5 flex items-center {dragDisabled
					? ' bg-red-900'
					: 'justify-end bg-green-800'}"
				on:click={toggleDragDisabled}
			>
				<div class=" rounded-full px-1.5 {dragDisabled ? 'bg-red-500' : 'bg-green-500'}">
					<p class="text-sm">Drag</p>
				</div>
			</div>
		</div>
	</div>
	<div
		class="w-full"
		use:dndzone={{
			items: exercises,
			dropTargetStyle: dropTargetStyle,
			dragDisabled: dragDisabled
		}}
		on:consider={handleSort}
		on:finalize={handleSort}
	>
		{#each exercises as e (e._id)}
			<div
				class="outline-none border-none select-none"
				on:click={() => handleManageExercise(e)}
			>
				<Exercise props={e} on:longPress={() => handleLongPress(e)} />
			</div>
		{/each}
	</div>
	<NumberCounter bind:counter={workoutLaps} />
	{#if exerciseModifiying}
		<ExerciseSettings
			props={currentExercise || {}}
			workoutId={id}
			on:exerciseAdded={handleAdd}
			on:cancel={handleCancelExercise}
			on:delete={handleDeleteExercise}
		/>
	{/if}
	{#if !exerciseModifiying}
		<BallMenu
			on:createFirstBall={() => {
				exerciseModifiying = true;
			}}
			on:secondBallClick={handleAddBreak}
			firstBallText={'Add exercise'}
			secondBallText={'Add break'}
		/>
	{/if}
	{#if showModalSettings}
		<SettingsModal
			name={currentExercise.name}
			on:edit={() => {
				handleManageExercise(currentExercise);
				cancelSettingsModal();
			}}
			on:delete={() => {
				handleDeleteExercise();
				cancelSettingsModal();
			}}
			on:duplicate={() => {
				handleDuplicateExercise(currentExercise);
				cancelSettingsModal();
			}}
			on:exit={cancelSettingsModal}
		/>
	{/if}
</div>
