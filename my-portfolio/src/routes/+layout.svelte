<script>
	import '../app.css';

	let { children } = $props();
</script>

<header class="site-header">
	<div class="container">
		<h1 class="site-title"><a href="/">Hi there!</a></h1>
		<nav class="site-nav" aria-label="Primary">
			<!-- Replace the href values below with your actual GitHub profile and resume path -->
			<a class="nav-link" href="https://github.com/viktorz05" target="_blank" rel="noopener">GitHub</a>
			<a class="nav-link" href="/Resume.pdf" target="_blank" rel="noopener">Resume</a>
		</nav>
	</div>
</header>

<main class="site-main">
	{@render children()}
</main>

<footer class="site-footer">
	<div class="container">
		<small>© <span id="year">{new Date().getFullYear()}</span> Viktor Zepeda</small>
	</div>
</footer>
