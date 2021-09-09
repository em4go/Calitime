<script lang="ts">
	import SettingsBar from '../components/SettingsBar.svelte';
	import VoiceSettings from '../components/settings/VoiceSettings.svelte';
	import ThemeSettings from '../components/settings/ThemeSettings.svelte';
	import { onMount } from 'svelte';

	let db;
	let settings: any;
	let darkTheme;
	let pitch;
	let rate;
	let preparation = true;

	onMount(async () => {
		await updateSettings();
		darkTheme = settings.darkTheme;
		rate = settings.voiceRate;
		pitch = settings.voicePitch;
		preparation = settings.preparation;
	});
	async function updateSettings() {
		db = new PouchDB('settings');
		const allDocs = await db.allDocs({ include_docs: true });
		settings = allDocs.rows[0].doc;
	}
	function togglePreparation() {
		preparation = !preparation;
	}

	let showAdded = false;
	async function handleSave() {
		await db.put({
			_id: 'ajustes',
			_rev: settings._rev || undefined,
			darkTheme,
			voicePitch: pitch,
			voiceRate: rate,
			preparation: preparation
		});
		await updateSettings();
		showAdded = true;
		setTimeout(() => (showAdded = false), 2000);
	}
</script>

<div class="w-10/12">
	<div class="w-full mt-3 flex items-center justify-end">
		<p
			on:click={handleSave}
			class="text-sm uppercase px-3 py-0.5 bg-red-500 rounded-full "
		>
			Save
		</p>
	</div>
	<div class="w-full flex items-center justify-center mt-3">
		<h1 class="text-3xl">Settings</h1>
	</div>
	<div class="w-full">
		<h2 class="text-xl">Theme</h2>
		<ThemeSettings bind:darkTheme />
		<p class="text-xs text-center">Theme only changes during workout</p>
	</div>
	<div class="w-full mt-4">
		<h2 class="text-xl mb-3">Voice settings</h2>
		<VoiceSettings bind:pitch bind:rate />
	</div>
	<div class="w-full mt-4">
		<h2 class="text-xl mb-3">Workout</h2>
		<div class="flex items-center justify-between">
			<p class="text-md">Show preparation</p>
			<div
				on:click={togglePreparation}
				class="w-9 h-3 rounded-full flex items-center {preparation
					? 'justify-end bg-yellow-200'
					: 'bg-gray-400'}"
			>
				<div
					class="w-5 h-5 bg-gray-300 rounded-full {preparation
						? 'bg-yellow-500'
						: 'bg-gray-400'}"
				/>
			</div>
		</div>
	</div>
	{#if showAdded}
		<div class="w-3/5 bg-green-600 relative mx-auto top-28 px-3 py-4">
			<p class="text-center">Saved succesfully</p>
		</div>
	{/if}
</div>
<nav class="fixed bottom-0 w-full">
	<SettingsBar settings={true} />
</nav>
