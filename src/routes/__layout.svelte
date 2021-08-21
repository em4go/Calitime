<div class="w-full min-h-screen bg-bgBlue text-gray-200 flex justify-center ">
	<slot />
</div>
<svelte:head>
	<title>Calitimer</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
	<script
		src="https://cdn.jsdelivr.net/combine/npm/pouchdb@7.2.2/dist/pouchdb.min.js,npm/pouchdb@7.2.2/dist/pouchdb.find.min.js"></script>
</svelte:head>

<style lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
