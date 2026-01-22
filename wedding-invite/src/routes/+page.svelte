<script>
  import AnimatedElement from '$lib/AnimatedElement.svelte';
  import { onMount } from 'svelte';

  let titleElement;

  // QR generation state
  let qrDataUrl = '';
  let visitorId = null;
  let qrError = '';

  onMount(() => {
    if (titleElement) {
      titleElement.classList.add('fade-in-title');
    }

    console.log('page script mounted, visitorId=', visitorId);

    // If the invite was opened using a personalized link like
    // https://your-domain/?id=PERSON_TOKEN then generate a QR code
    // that encodes the RSVP/check-in URL for that person.
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        visitorId = id;
        generateQrFor(id).catch((e) => {
          console.error('QR error', e);
          qrError = 'No se pudo generar el código QR.';
        });
        // ping tracking endpoint (optional) to record that this id opened the invite
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, event: 'open', ts: Date.now(), url: window.location.href })
        }).catch((e) => console.warn('track failed', e));
      }
    } catch (e) {
      console.warn('unable to parse params', e);
    }
  });

  async function generateQrFor(id) {
    // Build the URL you want encoded in the QR code. This could be a check-in URL
    // or a deep link that your staff will scan at the door, e.g. /rsvp?id=...
    const urlToEncode = `${window.location.origin}/rsvp?id=${encodeURIComponent(id)}`;

    // Dynamically import 'qrcode' to avoid SSR issues
    const qrcode = await import('qrcode');
    qrDataUrl = await qrcode.toDataURL(urlToEncode, { width: 360 });
    return qrDataUrl;
  }

  async function submitRsvp(event) {
    const f = event.target;
    const form = new FormData(f);
    const payload = {
      name: form.get('name'),
      attendance: form.get('attendance'),
      song_request: form.get('song_request'),
      message: form.get('message'),
      guests: form.get('guests') || '1',
      id: visitorId || undefined
    };

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('submitRsvp: response status', res.status);
      console.log('submitRsvp: content-type', res.headers.get('content-type'));

      if (!res.ok) {
        // Try to parse JSON error body for better message
        let errMsg = 'no se pudo procesar';
        try {
          const err = await res.json();
          errMsg = err.error || err.message || JSON.stringify(err);
        } catch (e) {
          console.warn('failed to parse error body', e);
        }
        alert('Error: ' + errMsg);
        return;
      }

      const ctype = res.headers.get('content-type') || '';
      if (ctype.includes('application/json')) {
        // server returned JSON (likely an error)
        const data = await res.json();
        alert('Respuesta JSON: ' + (data.error || JSON.stringify(data)));
        return;
      }

      // Expecting ZIP blob. Try to download it; if automatic download is blocked, open in new tab.
      const blob = await res.blob();
      console.log('submitRsvp: received blob, size=', blob.size);
      const url = URL.createObjectURL(blob);
      const filename = `${(payload.name || 'rsvp').replace(/\s+/g, '_')}_qrcodes.zip`;
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        // Also try opening the blob in a new tab as an explicit fallback
        try {
          window.open(url, '_blank');
        } catch (e) {
          console.warn('open tab fallback failed', e);
        }
      } catch (e) {
        console.warn('programmatic download failed, opening blob URL', e);
        window.open(url, '_blank');
      } finally {
        // revoke after a short delay so the browser can use it
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch (e) {
      console.error('submit rsvp failed', e);
      alert('Error al enviar, intenta de nuevo');
    }
  }
</script>
<svelte:head>
    <title>Invitación de Boda - Victoria y Luis</title>
    <meta name="description" content="Únete a nosotros para celebrar nuestro matrimonio el 15 de Agosto de 2024.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="/favicon.ico">
</svelte:head>
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
    
  <form class="w-full max-w-lg mx-auto mt-10" on:submit|preventDefault={submitRsvp}>
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

        <label for="guests" class="block text-2xl mb-2">¿Cuántas personas (incluyéndote)?</label>
        <input
          type="number"
          id="guests"
          min="1"
          name="guests"
          placeholder="1"
          value="1"
          class="w-full px-4 py-3 mb-4 border border-gray-300 rounded"
          required
        />

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
            class="w-full px-4 py-3 mb-6 border border-gray-300 rounded"></textarea>
    <button 
      type="submit"
      class="w-full bg-green-700 hover:bg-green-800 text-white text-2xl font-bold py-3 rounded"
      on:click={() => console.log('submit button clicked')}
    >
      Enviar Respuesta y descargar QRs
    </button>
    </form>
</div>
{#if visitorId}
  <div class="autoShow container mt-8 flex flex-col items-center">
    <h2 class="text-3xl">Tu código QR personal</h2>
    {#if qrError}
      <p class="text-red-600 mt-4">{qrError}</p>
    {:else}
      {#if qrDataUrl}
        <img src={qrDataUrl} alt="QR de invitación" class="mt-4" width="300" height="300" />
        <div class="mt-4">
          <a class="bg-blue-600 text-white px-4 py-2 rounded mr-2" href={qrDataUrl} download={`invite-${visitorId}.png`}>Descargar QR</a>
          <button class="bg-gray-200 px-4 py-2 rounded" on:click={() => navigator.clipboard && qrDataUrl && navigator.clipboard.writeText(qrDataUrl)}>Copiar imagen (data URL)</button>
        </div>
        <p class="mt-2 text-sm text-gray-600">Muestra este código en la entrada para el registro.</p>
      {:else}
        <p class="mt-4">Generando código QR…</p>
      {/if}
    {/if}
  </div>
{/if}


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
