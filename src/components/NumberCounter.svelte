<script>
	export let counter = 3;

	function handleMinus() {
		counter--;
		if (counter < 1) counter = 99;
	}
	function handleAdd() {
		counter++;
		if (counter > 99) counter = 1;
	}
</script>

<div class="w-full flex flex-col items-center ">
	<div class="flex items-center">
		<img src="../static/minus.svg" alt="Minus sign" class="w-5" on:click={handleMinus} />
		<p class="text-3xl font-semibold mx-5">
			x<input
				type="text"
				bind:value={counter}
				class="w-10 ml-1 border-b border-gray-400 outline-none bg-transparent text-center font-semibold text-3xl"
			/>
		</p>
		<img src="../static/add.svg" alt="Add sign" class="w-5" on:click={handleAdd} />
	</div>
</div>
