<script lang="ts">
	$: minutesText = calculateTime(minutes);
	$: secondsText = calculateTime(seconds);
	export let time: number;
	$: time = minutes * 60 + seconds;
	let seconds = time % 60;
	let minutes = Math.floor(time / 60);
	const timeRegEx = '^[-+]?\\d+(\\.\\d+)?$';

	function isNumeric(str: string): boolean {
		if (str.match(timeRegEx)) return true;
	}

	function handleMinusMinutes() {
		/* 		if (minutes > 0) minutes--; */
		if (isNumeric(minutesText)) minutes = Number(minutesText);
		minutes--;
		if (minutes < 0) minutes = 59;
	}
	function handleAddMinutes() {
		/* 		if (minutes < 59) minutes++; */
		if (isNumeric(minutesText)) minutes = Number(minutesText);
		minutes++;
		if (minutes > 59) minutes = 0;
	}
	function handleMinusSeconds() {
		/* 		if (seconds > 0) seconds--; */
		if (isNumeric(secondsText)) seconds = Number(secondsText);
		seconds--;
		if (seconds < 0) seconds = 59;
		if (minutes === 0 && seconds === 0) seconds = 59;
	}
	function handleAddSeconds() {
		/* 		if (seconds < 59) seconds++; */
		if (isNumeric(secondsText)) seconds = Number(secondsText);
		seconds++;
		if (seconds > 59) seconds = 0;
		if (minutes === 0 && seconds === 0) seconds = 1;
	}
	function calculateTime(time: number): string {
		if (time < 10) {
			return `0${time}`;
		}
		console.log(time);
		return `${time}`;
	}
</script>

<div class="w-full flex flex-col items-center ">
	<div class="flex items-center">
		<div class="flex flex-col items-center">
			<img src=" /up-arrow.svg" alt="Up arrow" class="w-5" on:click={handleAddMinutes} />
			<input
				type="text"
				bind:value={minutesText}
				class="w-10 outline-none bg-transparent text-center font-semibold text-3xl"
			/>
			<img
				src=" /down-arrow.svg"
				alt="Down arrow"
				class="w-5"
				on:click={handleMinusMinutes}
			/>
		</div>
		<p class="text-3xl w-auto">:</p>
		<div class="flex flex-col items-center">
			<img
				src=" /up-arrow.svg"
				alt="Up arrow"
				class="w-5 select-none"
				on:click={handleAddSeconds}
			/>
			<input
				type="text"
				bind:value={secondsText}
				class="w-10 outline-none bg-transparent text-center font-semibold text-3xl"
			/>
			<img
				src=" /down-arrow.svg"
				alt="Down arrow"
				class="w-5 select-none"
				on:click={handleMinusSeconds}
			/>
		</div>
	</div>
</div>
