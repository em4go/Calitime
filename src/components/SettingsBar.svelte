<script>
	export let settings = false;
</script>

<div class="w-full h-11 bg-bgBluedark flex items-center justify-around">
	<a href="/">
		<img
			src=" /home.svg"
			alt="Home button"
			class={settings === true ? 'w-5 opacity-75' : 'w-6'}
		/>
	</a>
	<a href="/settings">
		<img
			src=" /settings.svg"
			alt="Settings button"
			class={settings === false ? 'w-5 opacity-75' : 'w-7'}
		/>
	</a>
</div>
