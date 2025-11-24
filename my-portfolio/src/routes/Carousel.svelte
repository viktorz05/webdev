<script>
    import '../app.css';
	import IconBar from './IconBar.svelte';
    const githubIcon = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg";
    const icons276 = [
        {
            src: githubIcon,
            alt: "GitHub",
            link: "https://github.com/viktorz05/SFU-Sprint",
            color: "#000000"
        },
        {
			src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
			alt: "Java",
			color:  "rgba(176,114 , 25, 0.85)"
		},
        {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/junit/junit-plain-wordmark.svg" ,
            alt: "JUnit",
            color: "#dc514a"
        }
    ];
    const iconsStormhacks = [
        {
            src: githubIcon,
            alt: "GitHub",
            link: "https://github.com/viktorz05/stormhacks-2025",
            color: "#000000"

        },
        {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
            alt: "Spring",
            color: "rgba(0, 255, 128, 0.85)"
        },
        {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-plain.svg",
            alt: "SQLite",
            color: "rgba(3, 102, 214, 0.85)"
        }
    ];
    const iconsUma = [
        {
            src: githubIcon,
            alt: "GitHub",
            link: "https://github.com/viktorz05/uma",
            color: "#000000"
        },
        {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg",
            alt: "Unity",
            color: "rgba(0, 204, 204, 0.85)"
        },
        {
            src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
            alt: "C#",
            color: "rgba(145, 121, 228, 0.85)"
        }
    ];
</script>
<div class = "carousel">
<!-- Example Card 1 -->
  <div class="card">
    <div class="card-inner">
      <div class="card-front glassbox font-bold">
        Uma
      </div>
        <div class="card-back glassbox">
            <p > Uma is a 4 player <a href="https://glizzy.au/rise-of-friendslop-co-op-games/" target="_blank"> friendslop</a> game inspired by office work I'm developing with my friends from Mexico</p>
            <img src="/Official_unity_logo.png" alt="Unity Logo" class="card-image"/>
            <IconBar icons= {iconsUma}>   </IconBar>
        </div>
    </div>
</div>

  <!-- Example Card 2 -->
  <div class="card">
    <div class="card-inner">
      <div class="card-front glassbox font-bold">
        SFU Sprint
      </div>
      <div class="card-back glassbox">
        <p > SFU Sprint is a 2D game made in Java for my Intro to Software Engineering course. It features non-blocking UI, enemy pathfinding and custom made assets</p>
            <img src="/sfusprint.jpeg" alt="SFU Sprint" class="card-image"/>
            <IconBar icons={icons276}></IconBar>
      </div>
    </div>
  </div>

  <!-- Example Card 3 -->
  <div class="card">
    <div class="card-inner">
      <div class="card-front glassbox font-bold">
        SFU Fitness App
    </div>
        <div class="card-back glassbox">
            <p > The SFU Fitness app was made during the <a href="https://stormhacks2025.devpost.com/?_gl=1*6c17lu*_gcl_au*NjMxNTkwMzgzLjE3NjM5NzQxNjM.*_ga*MTEwMTkwNTAxNy4xNzYzOTc0MTYz*_ga_0YHJK3Y10M*czE3NjM5NzQxNjMkbzEkZzEkdDE3NjM5NzQyNzIkajEzJGwwJGgw" target="_blank"> Stormhacks</a> hackathon alongside 3 of my friends.</p>
            <img src="/Fitness-app.jpg" alt="Fitness App" class="card-image"/>
            <IconBar icons= {iconsStormhacks}>   </IconBar>
        </div>
    </div>
  </div>
</div>
<style>
    .carousel {
        width: 100%;
        overflow-x: auto;
        margin: 3em auto;
        display: flex;
        gap: 1em;
        scroll-behavior: smooth;
        anchor-name: --carousel;
    }

    .carousel::-webkit-scrollbar {
        display: none;
    }

    .carousel::scroll-button(right), .carousel::scroll-button(left){

        background-color: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(25px);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.575);

        content: "→";
        border: none;
        padding: 1em;
        margin-bottom: 2rem;
        color: white;
        font-size: 3em;
        height: 60px;
        width: 60px;
        border-radius: 10%;
        padding-bottom: .1em;
        align-items: center;
        display: flex;
        line-height: 1;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        position: fixed;
        position-anchor: --carousel;
        position-area: right center;
    }

    .carousel::scroll-button(left) {
        content: "←";
        position-area: left center;
    }

    .carousel::scroll-button:hover {
        background-color: rgba(255,255,255,0.2);
        transform: scale(1.05);
        transition: 0.2s ease;
    }
    /* layout-only styles for cards — visual glass handled by .glassbox in app.css */
    .card {
        flex: 0 0 20em;
        height: 24em;
        margin-bottom: 2rem;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: white;
        perspective: 1000px;
    }

    .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.8s;
        transform-style: preserve-3d;
    }
    .card:hover .card-inner {
        transform: rotateY(180deg);
    }

    .card-front, .card-back {
        display: flex;
        flex-direction: column;
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    .card-back {
        transform: rotateY(180deg);
    }
    
    .card-image {
        width: 60%;
        height: 60%;
        object-fit: contain;
        border-radius: 12px;
    }
    a {
        background: linear-gradient(90deg, #ff8a00, #e52e71);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    /* .card:hover {
        transform: scale(1.025);
        transition: 0.2s ease;
    } */
</style>

