<script>
	export let duration = '';
</script>

<div class="w-full h-screen bg-bgBlue fixed top-0 flex flex-col items-center ">
	<h1 class="text-3xl text-center mt-10">Workout finished</h1>
	<div class="w-4/6 mt-20 flex flex-col items-center justify-center">
		<p class="text-xl">Duration</p>
		<p class="text-3xl font-teko ">{duration}</p>
	</div>
	<footer class="fixed bottom-0 py-5 ">
		<a href="/" class="w-11 bg-red-500 rounded-full px-3 py-2">Go home</a>
	</footer>
</div>
