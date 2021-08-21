<script lang="ts">
	import Slider from './Slider.svelte';
	export let rate = 1;
	export let pitch = 1;
</script>

<div class="w-full flex flex-col items-center">
	<Slider name={'Speed'} min={'0.5'} bind:value={rate} />
	<Slider name={'Pitch'} min={'0'} bind:value={pitch} />
</div>
