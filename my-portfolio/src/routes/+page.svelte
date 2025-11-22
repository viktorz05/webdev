<script>
	import ContactForm from '$lib/ContactForm.svelte';
	import Carousel from './Carousel.svelte';
</script>

<video
  class="fixed top-0 left-0 w-screen h-screen object-cover -z-10 pointer-events-none"
  autoplay muted loop playsinline
>
  <source src="/background.webm" type="video/webm" />
</video>


<section class="container glassbox hero-flex">
	<div class="hero-title-block">
		<h1 class="hero-title text-5xl font-roboto font-bold">Viktor Zepeda Sánchez</h1>
		<img src="/linkedin.jpg" alt="Viktor Zepeda Sánchez" class="hero-photo"/>
	</div>
	<div class="hero-text-block">
		<p class="hero-text">Hi, I'm a third year Computer Science student interested in computer graphics 
			and game engines.<br></p>
	</div>
</section>

<section class="container">
  <h2 class="text-center text-5xl font-roboto font-bold">
    Projects
  </h2>
  <Carousel />
</section>

<section class="container">
	<h2 class="text-center text-5xl font-roboto font-bold">Contact</h2>
	<div class="glassbox contact-flex">
		<div class="contact-info">
			<p>If you'd like to get in touch, send a message using the form below.</p>
		</div>
		<div class="contact-form-block">
			<ContactForm />
		</div>
	</div>
</section>
