<script>
	import Workout from '../components/Workout.svelte';
	import SettingsBar from '../components/SettingsBar.svelte';
	import BallMenu from '../components/BallMenu.svelte';
	import SettingsModal from '../components/SettingsModal.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let workouts = [];
	onMount(async () => {
		await updateWorkouts();
		if (localStorage.getItem('hasSettings') == null) {
			await updateSettings();
			localStorage.setItem('hasSettings', 'true');
		}
	});
	async function updateSettings() {
		let db = new PouchDB('settings');
		const allDocs = await db.allDocs({ include_docs: true });
		if (allDocs.rows[0] === undefined) {
			await db.put({
				_id: 'ajustes',
				darkTheme: true,
				voicePitch: 1,
				voiceRate: 1
			});
		}
	}

	async function updateWorkouts() {
		let db = new PouchDB('workouts');
		await db.createIndex({
			index: { fields: ['lastUpdate'] }
		});

		let allDocs = await db.find({
			selector: { lastUpdate: { $gte: null } },
			sort: [{ lastUpdate: 'desc' }]
		});
		workouts = allDocs.docs;
	}

	function createWorkout() {
		goto(`/workoutSettings/${Date.now()}`);
	}
	let currentWorkout;
	let showSettings = false;
	function handleEditCurrent() {
		goto(`/workoutSettings/${currentWorkout._id}`);
	}
	function handleEditWorkout(w) {
		currentWorkout = w;
		showSettings = true;
	}
	async function handleDeleteWorkout(workout) {
		let db = new PouchDB('workouts');
		const removal = await db.put({ ...workout, _deleted: true });
		if (removal.ok) {
			console.log('removed workout', workout);
			workouts = workouts.filter((todo) => {
				return todo._id !== workout._id;
			});
		}
	}
</script>

<main class="w-full">
	<div class="flex items-center justify-center p-4 text-2xl">
		<p class="text-md">My Workouts</p>
		<!-- 		<div class="flex items-center">
			<p class="text-md mr-2">Sort by</p>
			<img class="w-5" src=" /sort-down.svg" alt="Sort by icon" />
		</div> -->
	</div>
	<div class="w-full px-5">
		{#each workouts as w}
			<a href="/workout/{w._id}">
				<Workout props={w} on:longPress={() => handleEditWorkout(w)} />
			</a>
		{/each}
	</div>
	<nav class="fixed bottom-0 w-full">
		<SettingsBar settings={false} />
	</nav>
	<BallMenu on:createFirstBall={createWorkout} firstBallText={'Create workout'} />
</main>
{#if showSettings}
	<SettingsModal
		name={currentWorkout.name}
		on:edit={handleEditCurrent}
		on:exit={() => (showSettings = false)}
		on:delete={() => {
			handleDeleteWorkout(currentWorkout);
			showSettings = false;
		}}
	/>
{/if}
