<script>
	import ContactForm from '$lib/ContactForm.svelte';
	import Carousel from './Carousel.svelte';
	import IconBar from './IconBar.svelte';
	const icons = [
		{
			src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
			alt: "C++",
			color: "rgba(0,122,204,0.8)"
		},
		{
			src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
			alt: "Rust",
			color: "rgba(247, 118, 24, 0.85)"
		},
		{
			src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matlab/matlab-original.svg",
			alt: "MATLAB",
			color: "rgba(178,345, 255, 0.85)"
		},
		{
			src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
			alt: "Java",
			color:  "rgba(176,114 , 25, 0.85)"
		},
		{
			src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-plain.svg",
			alt: "JavaScript",
			color: "rgba(240, 219, 79, 0.85)"
		},
		{
			src: "favicon.svg",
			alt: "Svelte",
			color: "rgba(255, 72, 0, 0.85)"
		},
		{
			src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opengl/opengl-plain.svg",
			alt: "OpenGL",
			color: "rgba(0, 128, 255, 0.85)"
		}
	];
	
	const githubIcon = [
		{
			src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
			alt: "GitHub",
			link: "https://github.com/viktorz05",
			color: "#ffffff"
		}
	];
</script>

<!-- <video class="fixed inset-0 w-screen h-screen object-cover -z-10 pointer-events-none" 
autoplay muted loop playsinline>
  <source src="/background_opt.webm" type="video/webm" />
  <source src="/background.mp4" type="video/mp4" />

            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opengl/opengl-plain.svg" />
          
</video> -->


<section class="container glassbox hero-flex">
  <h1 class="hero-title text-5xl font-roboto font-bold">
    Viktor Zepeda Sánchez
  </h1>

  <div class="hero-content-row">
	  <img src="/linkedin.jpg" alt="Viktor Zepeda Sánchez" class="hero-photo"/>
	  
	  <p class="hero-text text-2xl">
		  Hi, I'm a third year Computer Science student interested in computer graphics 
		  and game engines. 
		  <br /><br />
		  I enjoy working on projects that challenge me to learn new skills and technologies.
		  <br /><br />
		  Check out some of the languages and frameworks I work with below!
		</p>
	</div>
	<IconBar icons={icons}/>
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
