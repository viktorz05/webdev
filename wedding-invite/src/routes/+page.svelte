<script>
  import AnimatedElement from '$lib/AnimatedElement.svelte';
</script>
<head>
    <title>Invitación de Boda - Victoria y Luis</title>
    <meta name="description" content="Únete a nosotros para celebrar nuestro matrimonio el 15 de Agosto de 2024.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="/favicon.ico">
</head>
<div>
    <h1 class="font-cursive text-8xl font-bold text-center mt-10"> 
    Victoria y Luis 
    </h1>
</div>

<div class="full-height">
    <AnimatedElement>
    <p class="text-5xl text-center mt-5"> Te invitamos a celebrar nuestro matrimonio</p>
    <h2 class="text-6xl text-center mt-10">
        Centro de convenciones Tlatelolco
        <p class="text-5xl text-center mt-2"> 29 de Mayo de 2026 </p>
    </h2>
</AnimatedElement>
</div>

<div class="full-height">
  <AnimatedElement>
    <h2 class="text-5xl text-center">Ceremonia Religiosa</h2>
    <p class="text-3xl mt-4 text-center">4:00 PM</p>
  </AnimatedElement>
</div>


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


<style lang="postcss">
    @reference "tailwindcss";

    :global(html) {
        background-color: theme(--color-gray-100);
    }
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
</style>   