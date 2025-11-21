<script>
	import ContactForm from '$lib/ContactForm.svelte';
	import Carousel from './Carousel.svelte';
	import Card from './Card.svelte';
</script>

<section class="hero container">
	<h1 class="text-5xl">Viktor Zepeda Sanchez</h1>
	<p>Hi — I'm a developer. This is a minimal portfolio. See my projects below and feel free to reach out.</p>
</section>

<section class="projects container">
	<h2>Projects</h2>
	<Carousel />
</section>

<section class="contact container">
	<h2>Contact</h2>
	<p>If you'd like to get in touch, send a message using the form below.</p>
	<!-- ContactForm will post to Formspree by default; replace the endpoint in the component or pass an endpoint prop. -->
	<ContactForm />
</section>
