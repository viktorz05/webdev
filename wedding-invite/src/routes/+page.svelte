<script>
  import AnimatedElement from '$lib/AnimatedElement.svelte';
  import { onMount } from 'svelte';

  let titleElement;

  onMount(() => {
    if (titleElement) {
      titleElement.classList.add('fade-in-title');
    }
  });
</script>
<head>
    <title>Invitación de Boda - Victoria y Luis</title>
    <meta name="description" content="Únete a nosotros para celebrar nuestro matrimonio el 15 de Agosto de 2024.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="/favicon.ico">
</head>
<div>
    <h1 bind:this={titleElement} class="autoShow font-cursive text-8xl font-bold text-center mt-10"> 
    Victoria y Luis 
    </h1>
</div>

<div class="autoShow container">
    <p class=" text-5xl text-center mt-5"> Te invitamos a celebrar nuestro matrimonio</p>
</div>
  <div class="autoShow flex flex-col items-center">
    <h1 class ="text-5xl text-center mt-10">Fecha</h1>
    <p class="text-5xl text-center mt-2"> 29 de Mayo de 2026 </p>
    <h1 class ="text-5xl text-center mt-10">Hora</h1>
    <p class="text-5xl text-center mt-2"> 7:30 - 8:00 PM </p>
  </div>

<div class="autoShow container">
  <h1 class="text-5xl text-center mt-10"> Ubicación</h1>
    <div class ="flex flex-col items-center mt-10">
      <iframe
      title="Ubicación del salón de eventos"
      width="600" 
      height="400" 
      style="border:0" 
      loading="lazy" 
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps/embed/v1/place?q=place_id:El1NYW51ZWwgR29uemFsZXogMTcxLCBTYW4gU2ltw7NuIFRvbG5haHVhYywgQ3VhdWh0w6ltb2MsIDA2OTAwIENpdWRhZCBkZSBNw6l4aWNvLCBDRE1YLCBNZXhpY28iMRIvChQKEgkHfcTDIfnRhRH1tJhRxLO67xCrASoUChIJw0WHHyL50YURYy727kZCPtc&key=AIzaSyDNgtmWED0jXIcVcRNNEj9yFsEJvKD5TIk">
      </iframe>
  </div>
  <p class=text-5xl text-center mt-10>Centro de convenciones Tlatelolco</p>
</div>

<div class="autoShow container">
    <h1 class= "text-5xl text-center">Codigo de vestimenta</h1>

</div>

<div class="autoShow container">
    <h1 class= "text-5xl text-center">Regalos</h1>
      <p class="text-3xl text-center">Apreciamos tu presencia pero si gustas regalarnos algo aqui tienes los datos</p>
</div>

<div class="autoShow container">
    <h1 class= "text-5xl text-center">Asistencia</h1>
    <p class = "text-5xl text-center">Tu presencia es importante! Confirma tu asistencia abajo:</p>
    
    <form class="w-full max-w-lg mx-auto mt-10"  action="https://formspree.io/f/mvgdpjzz" method="POST">

        <div class="mb-6">
            <label class="flex items-center gap-4 text-2xl">
                <input type="radio" name="attendance" value="yes" class="w-6 h-6">
                <span>Sí, allí estaré</span>
            </label>
            <label class="flex items-center gap-4 text-2xl mt-4">
                <input type="radio" name="attendance" value="no" class="w-6 h-6">
                <span>No podré asistir</span>
            </label>
        </div>

        <input 
            type="text" 
            name="name"
            placeholder="Nombre y apellido" 
            class="w-full px-4 py-3 mb-4 border border-gray-300 rounded"
            required
        >

        <input 
            type="text" 
            name="song_request"
            placeholder="¿Que canción no puede faltar?" 
            class="w-full px-4 py-3 mb-4 border border-gray-300 rounded"
        >

        <textarea 
            name="message"
            placeholder="Mensaje para los novios:" 
            rows="6"
            class="w-full px-4 py-3 mb-6 border border-gray-300 rounded"
        ></textarea>

        <button 
            type="submit"
            class="w-full bg-green-700 hover:bg-green-800 text-white text-2xl font-bold py-3 rounded"
        >
            Enviar Respuesta
        </button>
    </form>
</div>


<style lang="postcss">
    @reference "tailwindcss";
    h1, h2 {
        color: black
    }
    p {
        color: black

    }
    .full-height {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
  }

  .autoShow {
    animation: text-appear both;
    animation-timeline: view();
    animation-range: entry 20% cover 100vh;
  }
  @keyframes text-appear {
    from {
        opacity: 0;
        transform: translateY(100px)
    }
    to {
        opacity: 1;
        transform: translateY(0)
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .fade-in-title {
    animation: fade-in 1s ease-in forwards;
  }
</style>   
