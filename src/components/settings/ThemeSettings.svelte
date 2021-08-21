<script>
	import ThemeButton from './ThemeButton.svelte';

	export let darkTheme = true;
	function setDarkTheme() {
		darkTheme = true;
	}
	function setLightTheme() {
		darkTheme = false;
	}
</script>

<div class="w-3/4 flex items-center justify-around mx-auto my-3">
	<ThemeButton isDark={true} isDisabled={!darkTheme} on:click={setDarkTheme} />
	<ThemeButton isDark={false} isDisabled={darkTheme} on:click={setLightTheme} />
</div>
