<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
	import AnimatedElement from '$lib/AnimatedElement.svelte';
</script>

<header class = "site-header">
	<h1>
		hola
	</h1>
</header>
<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
