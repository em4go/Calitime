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
	import WorkoutFinished from '../../components/WorkoutFinished.svelte';
	import Playnav from '../../components/Playnav.svelte';
	import StatsText from '../../components/StatsText.svelte';
	import Timer from '../../components/Timer.svelte';
	import { onMount } from 'svelte';
	import WorkoutPreparation from '../../components/WorkoutPreparation.svelte';
	import { createSpeech, speak } from '../../tts';
	import TopNavbar from '../../components/TopNavbar.svelte';
	import ExitModal from '../../components/ExitModal.svelte';
	import { goto } from '$app/navigation';

	export let id;
	let speech;
	let settings;
	onMount(async () => {
		await loadWorkout(id);
		await updateExercises();
		await loadSettings();
		updateStats();
		speech = createSpeech(settings.voiceRate, settings.voicePitch);
		console.log(speech);
		speak(speech, 'Prepárate');
	});
	async function loadWorkout(id) {
		let db = new PouchDB('workouts');
		let allDocs = await db.find({
			selector: {
				_id: { $eq: id }
			}
		});
		workout = allDocs.docs[0];
		totalLaps = workout.laps;
		totalTime = workout.duration;
	}
	async function loadSettings() {
		let db = new PouchDB('settings');
		const allDocs = await db.allDocs({ include_docs: true });
		settings = allDocs.rows[0].doc;
	}
	let exercises = [];
	let workout;
	async function updateExercises() {
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
	}

	let preparationTrue = true;
	let totalTime = 10;
	let actualLap = 1;
	let totalLaps;

	let currentIndex = 0;
	let currentExercise;
	let nextExercise;
	let nextExerciseText: string;
	/* 	$: currentExercise = exercises[currentIndex];
	$: nextUpExercise = exercises[currentIndex + 1] ?? exercises[0];
	$: nextExerciseText = nextUpExercise.name;
	$: {
		if (currentIndex === exercises.length - 1 && actualLap === totalLaps)
			nextExerciseText = 'Finish!';
	} */
	function updateStats() {
		updateCurrentExercise();
		updatePercentages();
	}
	function updateCurrentExercise() {
		currentExercise = exercises[currentIndex];
		nextExercise = exercises[currentIndex + 1] ?? exercises[0];
		nextExerciseText = nextExercise.name;
		if (currentIndex === exercises.length - 1 && actualLap === totalLaps) {
			nextExerciseText = 'Finish!';
		}
	}

	let workoutTime = 0;
	let exerciseTime = 0;
	let exerciseTimeText;
	$: elapsedTimeText = translateTime(workoutTime);
	$: timeLeftText = translateTime(totalTime - workoutTime);
	/* 	$: exerciseTimeText = currentExercise.repsMode
		? translateTime(exerciseTime)
		: translateTime(currentExercise.time - exerciseTime);
 */
	let showFinished = false;
	$: if (workoutTime === totalTime) showFinished = true;
	let timeRunning = false;
	let workoutTimer = null;
	let exerciseTimer = null;

	let percentageOuter: number;
	let percentageInner: number;
	function updatePercentages() {
		percentageOuter = (workoutTime / totalTime) * 100;
		percentageInner = (exerciseTime / currentExercise.time) * 100;
		exerciseTimeText = currentExercise.repsMode
			? translateTime(exerciseTime)
			: translateTime(currentExercise.time - exerciseTime);
	}

	function stopTimer() {
		clearInterval(workoutTimer);
		clearInterval(exerciseTimer);
		timeRunning = false;
	}
	function startTimer() {
		timeRunning = true;
		workoutTimer = setInterval(updateWorkoutCountdown, 1000);
		exerciseTimer = setInterval(updateExerciseCountdown, 1000);
	}
	function handleStartStop() {
		if (percentageOuter < 100) {
			if (!timeRunning) {
				startTimer();
			} else {
				stopTimer();
			}
		}
	}
	function handleTimer() {
		if (currentExercise.repsMode && timeRunning) {
			handleNextExercise();
		} else if (percentageOuter < 100) {
			if (!timeRunning) {
				startTimer();
			} else {
				stopTimer();
			}
		}
	}
	function updateWorkoutCountdown() {
		workoutTime++;
		if (workoutTime >= totalTime) {
			stopTimer();
			speak(speech, 'Has termiado gulugulugulu');
			showFinished = true;
			exerciseTime = 0;
			actualLap = totalLaps;
		}
		updateStats();
	}
	function updateExerciseCountdown() {
		exerciseTime++;
		let timeLeft = currentExercise.time - exerciseTime;
		if (!currentExercise.repsMode) {
			if (timeLeft === 1) speak(speech, '1');
			if (timeLeft === 2) speak(speech, '2');
			if (timeLeft === 3) speak(speech, '3');
			if (timeLeft === 6) speak(speech, `Siguiente ejercicio ${nextExerciseText}`);
		}

		if (exerciseTime >= currentExercise.time) {
			if (!currentExercise.repsMode) handleNextExercise();
			else {
				currentExercise.time++;
				totalTime++;
			}
		}
		updateStats();
	}
	function isLastExercise() {
		return currentIndex === exercises.length;
	}
	function isLast() {
		return isLastExercise && actualLap === totalLaps;
	}
	function handleNextExercise() {
		stopTimer();
		totalTime -= currentExercise.time - exerciseTime;
		exerciseTime = 0;
		currentIndex++;
		if (isLastExercise()) {
			currentIndex = 0;
			actualLap++;
		}
		updateStats();
		if (!(actualLap > totalLaps)) {
			speak(speech, currentExercise.name);
		}
		startTimer();
	}
	function isFirstExercise() {
		return currentIndex < 0;
	}
	function handlePreviousExercise() {
		if (!(actualLap === 1 && currentIndex === 0)) {
			stopTimer();
			totalTime += exerciseTime;
			exerciseTime = 0;
			currentIndex--;
			if (isFirstExercise()) {
				currentIndex = exercises.length - 1;
				actualLap--;
			}
			updateStats();
			totalTime += currentExercise.time;
			startTimer();
		} else {
			totalTime += exerciseTime;
			exerciseTime = 0;
			updateStats();
		}
	}
	function calculateTime(time: number): string {
		if (time < 10) {
			return `0${time}`;
		}
		return `${time}`;
	}
	function translateTime(time: number): string {
		let minutes = calculateTime(Math.floor(time / 60));
		let seconds = calculateTime(time % 60);

		return `${minutes}:${seconds}`;
	}
	function handlePreparationEnd() {
		preparationTrue = false;
		speak(speech, 'Empecemos');
		handleTimer();
	}
	let showExitModal = false;
	function handleBack() {
		if (timeRunning) {
			showExitModal = true;
		} else {
			handleExit();
		}
		stopTimer();
	}
	function handleExit() {
		goto('/');
	}
	function handleStay() {
		showExitModal = false;
		startTimer();
	}
	let timeToAdd = 10;
	function addBreakTime() {
		totalTime += timeToAdd;
		currentExercise.time += timeToAdd;
		updateStats();
	}
	function minusBreakTime() {
		totalTime -= timeToAdd;
		currentExercise.time -= timeToAdd;
		updateStats();
	}
</script>

<div class="flex flex-col items-center text-gray-200 w-full min-h-screen mx-auto">
	<div class="my-3 w-full px-3">
		<TopNavbar on:back={handleBack} />
	</div>
	<div class="w-full grid grid-cols-3 px-2 py-2 mx-auto">
		<StatsText
			props={{
				statName: 'elapsed time',
				statContent: elapsedTimeText,
				position: 'start'
			}}
		/>
		<StatsText
			props={{
				statName: 'laps',
				statContent: `${actualLap}/${totalLaps}`,
				position: 'center'
			}}
		/>
		<StatsText
			props={{ statName: 'time left', statContent: timeLeftText, position: 'end' }}
		/>
	</div>
	<div class="w-full mx-auto ">
		<p class="text-center text-sm text-gray-400 uppercase">next up</p>
		<p class="text-center text-xl text-red-500">{nextExerciseText}</p>
	</div>
	<div class="w-full mx-auto mt-6">
		<Timer
			timerText={exerciseTimeText}
			{percentageOuter}
			{percentageInner}
			exerciseProps={currentExercise}
			on:click={handleTimer}
		/>
	</div>
	<Playnav
		on:playPause={handleStartStop}
		on:next={handleNextExercise}
		on:previous={handlePreviousExercise}
		{timeRunning}
	/>
	{#if showFinished}
		<WorkoutFinished duration={elapsedTimeText} />
	{/if}
	{#if preparationTrue}
		<WorkoutPreparation on:preparationEnd={handlePreparationEnd} />
	{/if}
	{#if showExitModal}
		<ExitModal on:agree={handleExit} on:deny={handleStay} />
	{/if}
</div>
