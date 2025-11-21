<script>
	import ContactForm from '$lib/ContactForm.svelte';
	import Carousel from './Carousel.svelte';
</script>

<video
  class="fixed top-0 left-0 w-screen h-screen object-cover -z-10 pointer-events-none"
  autoplay muted loop playsinline
>
  <source src="/background.mov" type="video/mp4" />
</video>

<section class="hero container glassbox">
		<h1 class="hero-title text-5xl font-bold">Viktor Zepeda Sánchez</h1>
			<p class = "hero-text">Hi — I'm a developer. This is a minimal portfolio. See my projects below and feel free to reach out.</p>
			<img src="/linkedin.jpg" alt="Profile picture of Viktor Zepeda Sánchez" class="hero-photo"/>
</section>

<section class="projects container">
	<h2>Projects</h2>
	<Carousel />
</section>

<section class="contact container">
	<div class = "glassbox">
	<h2>Contact</h2>
	<p>If you'd like to get in touch, send a message using the form below.</p>
	<!-- ContactForm will post to Formspree by default; replace the endpoint in the component or pass an endpoint prop. -->
	<ContactForm />
	</div>
</section>
