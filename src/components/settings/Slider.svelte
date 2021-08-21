<script lang="ts">
	export let name: string;
	export let value: number = 1;
	export let min: string = '0.5';
	export let max: string = '2';
	export let step: string = '0.1';
</script>

<div class="flex items-center justify-between w-full ">
	<div>
		<label for={name}>{name}</label>
		<input bind:value type="range" {min} {max} {step} />
	</div>
	<p class="text-md">{value}</p>
</div>
