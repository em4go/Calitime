<script>
	export let isDark = false;
	let props;
	isDark
		? (props = {
				color: 'bg-black',
				image: 'moon',
				width: 'w-6',
				text: 'Dark'
		  })
		: (props = {
				color: 'bg-orange',
				image: 'sun',
				width: 'w-7',
				text: 'Light'
		  });
	export let isDisabled = false;
</script>

<div
	class="w-16 h-16 p-2 rounded-lg flex flex-col items-center justify-around {props.color} {isDisabled
		? 'filter grayscale bg-orange'
		: ''}"
	on:click
>
	<img class={props.width} src=" /{props.image}.svg" alt="moon icon" />
	<p class="text-xs">{props.text}</p>
</div>
