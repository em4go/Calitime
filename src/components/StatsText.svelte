<script>
	export let props;
</script>

<div class="flex flex-col items-{props.position}">
	<p class="text-sm text-gray-400 uppercase">{props.statName}</p>
	<p class="text-3xl font-teko text-gray-200 uppecase">{props.statContent}</p>
</div>
