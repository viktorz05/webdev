<script>
	import ContactForm from '$lib/ContactForm.svelte';
</script>

<section class="hero container">
	<h1>Viktor Zepeda Sanchez</h1>
	<p>Hi — I'm a developer. This is a minimal portfolio. See my projects below and feel free to reach out.</p>
</section>

<section class="projects container">
	<h2>Projects</h2>
	<p>List your project cards or links here. You can keep project data as Markdown or JSON in <code>src/lib/</code>.</p>
</section>

<section class="contact container">
	<h2>Contact</h2>
	<p>If you'd like to get in touch, send a message using the form below.</p>
	<!-- ContactForm will post to Formspree by default; replace the endpoint in the component or pass an endpoint prop. -->

	<ContactForm />
</section>
