<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
	import AnimatedElement from '$lib/AnimatedElement.svelte';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
