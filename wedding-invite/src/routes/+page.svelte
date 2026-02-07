<script>
  import AnimatedElement from '$lib/AnimatedElement.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let titleElement;
  let currentPhotoIndex = 0;
  let groupToken = null;
  let groupInfo = null;
  let maxGuests = null;
  let groupError = '';

  // Photo carousel state
  const photos = [
    '/snow.jpeg',
    '/kiss.jpeg',
    '/beach.jpg',
  ];

  // QR generation state
  let qrDataUrl = '';
  let visitorId = null;
  let qrError = '';

  function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
  }

  function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
  }

  onMount(() => {
    // Auto-rotate photos every 5 seconds
    const interval = setInterval(nextPhoto, 5000);
    return () => clearInterval(interval);
  });

  onMount(async () => {
    if (titleElement) {
      titleElement.classList.add('fade-in-title');
    }

    console.log('page script mounted, visitorId=', visitorId);

    // Check for group token or individual id in URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const group = params.get('group');

    if (group) {
      groupToken = group;
      try {
        const response = await fetch(`/api/admin/groups?token=${encodeURIComponent(group)}`);
        const groupData = await response.json();
        if (groupData.length > 0) {
          groupInfo = groupData[0];
          maxGuests = groupData[0].suggested_guests;
          document.querySelector('input[name="guests"]').value = maxGuests;
        } else {
            groupError = 'Token de grupo inválido.';
        }
    } catch (e) {
    console.warn('Failed to fetch group info', e);
    groupError = 'No se pudo obtener la información del grupo.';
    }
}

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
    } 
  );

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
      id: visitorId || undefined,
      group_token: groupToken || undefined
    };

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('submitRsvp: response status', res.status);

      if (!res.ok) {
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

      // Generate a QR code for their RSVP confirmation
      const qrcodeUrl = `${window.location.origin}/rsvp?id=${encodeURIComponent(payload.id || payload.name)}`;
      const qrcode = await import('qrcode');
      const qrImage = await qrcode.toDataURL(qrcodeUrl, { width: 360 });

      // Navigate to success page with their data
      goto(`/rsvp-success?name=${encodeURIComponent(payload.name)}&guests=${encodeURIComponent(payload.guests)}&qr=${encodeURIComponent(qrImage)}`);
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

<!-- Main decorative frame wrapper -->
<div class="frame-wrapper">
  <div class="frame-border">
    <!-- Decorative corners -->
    <div class="corner corner-top-left"></div>
    <div class="corner corner-top-right"></div>
    <div class="corner corner-bottom-left"></div>
    <div class="corner corner-bottom-right"></div>

    <div class="frame-content">
      <!-- Title section -->
      <div class="title-section">
        <h1 bind:this={titleElement} class="page-title"> 
          Victoria y Luis 
        </h1>
        <div class="decorative-line"></div>
      </div>

      <div class="autoShow container">
          <p class="invitation-text"> Te invitamos a celebrar nuestro matrimonio</p>
      </div>

      <!-- Photo Gallery with Blur Transitions -->
      <div class="autoShow photo-gallery-section">
        <div class="photo-carousel">
          <div class="carousel-container">
            {#each photos as photo, index (index)}
              <div 
                class="carousel-slide"
                class:active={index === currentPhotoIndex}
              >
                <img 
                  src={photo} 
                  alt={`Victoria y Luis - Foto ${index + 1}`}
                  class="carousel-image"
                />
              </div>
            {/each}
          </div>

          <!-- Navigation Controls -->
          <button 
            class="carousel-control carousel-prev"
            on:click={prevPhoto}
            aria-label="Foto anterior"
          >
            ‹
          </button>
          <button 
            class="carousel-control carousel-next"
            on:click={nextPhoto}
            aria-label="Siguiente foto"
          >
            ›
          </button>

          <!-- Indicators -->
          <div class="carousel-indicators">
            {#each photos as _, index}
              <button
                class="indicator"
                class:active={index === currentPhotoIndex}
                on:click={() => (currentPhotoIndex = index)}
                aria-label={`Ir a la foto ${index + 1}`}
              ></button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Details section with cards -->
      <div class="details-grid">
        <div class="autoShow detail-card">
          <h2 class="detail-title">Fecha</h2>
          <p class="detail-value"> 29 de Mayo de 2026 </p>
        </div>
        <div class="autoShow detail-card">
          <h2 class="detail-title">Hora</h2>
          <p class="detail-value"> 7:30 - 8:00 PM </p>
        </div>
      </div>

      <!-- Location section -->
      <div class="autoShow container location-section">
        <h1 class="section-title"> Ubicación</h1>
          <div class="map-container">
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
        <p class="location-name">Centro de convenciones Tlatelolco</p>
      </div>
    </div>
  </div>
</div>


<div class="autoShow container section-block">
    <h1 class="section-title">Código de vestimenta</h1>
    <p class="section-description">Formal</p>
</div>

<div class="autoShow container section-block">
    <h1 class="section-title">Regalos</h1>
    <p class="section-description">Apreciamos tu presencia pero si gustas regalarnos algo aquí tienes los datos</p>
            <table class="wire-table" aria-label="Datos para regalo">
                <tbody>
                    <tr>
                        <td class="wire-label">CLABE</td>
                        <td class="wire-value">722969010490658426</td>
                    </tr>
                    <tr>
                        <td class="wire-label">Beneficiario</td>
                        <td class="wire-value">Luis Guillermo Garcia Cordova</td>
                    </tr>
                    <tr>
                        <td class="wire-label">Institución</td>
                        <td class="wire-value">Mercado Pago W</td>
                    </tr>
                </tbody>
            </table>
</div>

<div class="autoShow container section-block">
    <h1 class="section-title">Niños</h1>
    <p class="section-description">¡Adoramos a tus hijos! Sin embargo, esta celebración será sólo para adultos. </p>
</div>

<div class="autoShow container section-block rsvp-section">
    <h1 class="section-title">Asistencia</h1>
    <p class="section-description">¡Tu presencia es importante! Confirma tu asistencia abajo:</p>
    
  <form class="rsvp-form" on:submit|preventDefault={submitRsvp}>
        {#if groupInfo}
          <div class="group-info-box">
            <p class="group-info-title">Grupo de invitación</p>
            <p class="group-info-name">{groupInfo.group_name}</p>
            {#if groupInfo.contact_person}
              <p class="group-info-contact">Contacto: {groupInfo.contact_person}</p>
            {/if}
          </div>
        {/if}

        <div class="radio-group">
            <label class="radio-option">
                <input type="radio" name="attendance" value="yes" class="radio-input">
                <span>Sí, allí estaré</span>
            </label>
            <label class="radio-option">
                <input type="radio" name="attendance" value="no" class="radio-input">
                <span>No podré asistir</span>
            </label>
        </div>

        <input 
            type="text" 
            name="name"
            placeholder="Nombre y apellido" 
            class="form-input"
            required
        >
        {#if groupError}
            <div class="error-message">{groupError}</div>
        {/if}
        <label for="guests" class="form-label">¿Cuántas personas (incluyéndote)?
            {#if maxGuests}
                <span class="guest-limit">(máximo {maxGuests})</span>
            {/if}
        </label>
        <input
          type="number"
          id="guests"
          min="1"
          max ={maxGuests || 10}
          name="guests"
          placeholder="1"
          value={maxGuests || 1}
          class="form-input"
          required
        />

        <input 
            type="text" 
            name="song_request"
            placeholder="¿Que canción no puede faltar?" 
            class="form-input"
        >

        <textarea 
            name="message"
            placeholder="Mensaje para los novios:" 
            rows="6"
            class="form-input form-textarea"></textarea>
    <button 
      type="submit"
      class="submit-button"
      on:click={() => console.log('submit button clicked')}
    >
      Enviar Respuesta y descargar QRs
    </button>
    </form>
</div>
{#if visitorId}
  <div class="autoShow container qr-section">
    <h2 class="section-title">Tu código QR personal</h2>
    {#if qrError}
      <p class="text-red-600 mt-4">{qrError}</p>
    {:else}
      {#if qrDataUrl}
        <div class="qr-image-wrapper">
          <img src={qrDataUrl} alt="QR de invitación" class="qr-image" width="300" height="300" />
        </div>
        <div class="qr-actions">
          <a class="action-button action-button-primary" href={qrDataUrl} download={`invite-${visitorId}.png`}>Descargar QR</a>
          <button class="action-button action-button-secondary" on:click={() => navigator.clipboard && qrDataUrl && navigator.clipboard.writeText(qrDataUrl)}>Copiar imagen</button>
        </div>
        <p class="qr-note">Muestra este código en la entrada para el registro.</p>
      {:else}
        <p class="mt-4">Generando código QR…</p>
      {/if}
    {/if}
  </div>
{/if}

<div class="footer-spacer"></div>


<style lang="postcss">
    @reference "tailwindcss";

    /* Frame and Layout */
    .frame-wrapper {
        min-height: 100vh;
        padding: 2rem 1rem;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .frame-border {
        position: relative;
        width: 100%;
        max-width: 1000px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 245, 240, 0.98) 100%);
        border-radius: 20px;
        padding: 3rem 2rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.8);
        border: 2px solid rgba(200, 211, 193, 0.4);
        animation: slideInDown 1s ease-out forwards;
    }

    /* Decorative Corners */
    .corner {
        position: absolute;
        width: 30px;
        height: 30px;
        border: 3px solid #c4a876;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(196, 168, 118, 0.3), transparent);
    }

    .corner-top-left {
        top: -5px;
        left: -5px;
        border-bottom: none;
        border-right: none;
        animation: pulse 2s ease-in-out infinite;
    }

    .corner-top-right {
        top: -5px;
        right: -5px;
        border-bottom: none;
        border-left: none;
        animation: pulse 2.2s ease-in-out infinite;
    }

    .corner-bottom-left {
        bottom: -5px;
        left: -5px;
        border-top: none;
        border-right: none;
        animation: pulse 2.4s ease-in-out infinite;
    }

    .corner-bottom-right {
        bottom: -5px;
        right: -5px;
        border-top: none;
        border-left: none;
        animation: pulse 2.6s ease-in-out infinite;
    }

    .frame-content {
        position: relative;
    }

    /* Title Section */
    .title-section {
        text-align: center;
        margin-bottom: 3rem;
    }

    .page-title {
        font-family: var(--font-cursive);
        font-size: clamp(3rem, 10vw, 5rem);
        font-weight: 700;
        color: #2d2d2d;
        margin: 0;
        animation: fadeInScale 1s ease-out forwards;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .decorative-line {
        width: 150px;
        height: 3px;
        background: linear-gradient(90deg, transparent, #c4a876, transparent);
        margin: 1.5rem auto 0;
        animation: expandWidth 1.2s ease-out forwards 0.3s backwards;
    }

    .invitation-text {
        font-size: clamp(1.5rem, 5vw, 2.2rem);
        color: #4a4a4a;
        text-align: center;
        margin-top: 1rem;
        font-style: italic;
    }

    /* Details Grid */
    .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin: 3rem 0;
        padding: 2rem 0;
    }

    .detail-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(212, 230, 207, 0.3));
        border: 2px solid rgba(196, 168, 118, 0.2);
        border-radius: 15px;
        padding: 2rem;
        text-align: center;
        transition: all 0.3s ease;
        animation: slideInUp 0.8s ease-out forwards;
    }

    .detail-card:nth-child(2) {
        animation-delay: 0.2s;
    }

    .detail-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 35px rgba(196, 168, 118, 0.15);
        border-color: rgba(196, 168, 118, 0.4);
    }

    .detail-title {
        font-size: 1.8rem;
        color: #c4a876;
        font-weight: 600;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    .detail-value {
        font-size: 1.6rem;
        color: #2d2d2d;
        font-weight: 500;
    }

    /* Location Section */
    .location-section {
        margin: 3rem 0;
        padding: 2rem 0;
    }

    /* Photo Gallery */
    .photo-gallery-section {
        margin: 2rem 0 3rem;
        padding: 2rem 0;
    }

    .photo-carousel {
        position: relative;
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
    }

    .carousel-container {
        position: relative;
        width: 100%;
        aspect-ratio: 3/2;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        background: #f0f0f0;
    }

    .carousel-slide {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.8s ease-in-out, filter 0.8s ease-in-out;
        filter: blur(8px);
    }

    .carousel-slide.active {
        opacity: 1;
        filter: blur(0px);
        z-index: 10;
    }

    .carousel-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Carousel Navigation */
    .carousel-control {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 20;
        background: rgba(196, 168, 118, 0.8);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 1.8rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
    }

    .carousel-control:hover {
        background: rgba(196, 168, 118, 1);
        transform: translateY(-50%) scale(1.1);
    }

    .carousel-prev {
        left: 20px;
    }

    .carousel-next {
        right: 20px;
    }

    /* Carousel Indicators */
    .carousel-indicators {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 12px;
        z-index: 20;
    }

    .indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.5);
        background: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .indicator.active {
        background: rgba(255, 255, 255, 1);
        border-color: rgba(255, 255, 255, 1);
        width: 30px;
        border-radius: 6px;
    }

    .indicator:hover {
        border-color: rgba(255, 255, 255, 0.8);
    }

    .map-container {
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        margin: 2rem auto;
        animation: fadeIn 1s ease-out;
    }

    .map-container iframe {
        display: block;
        border-radius: 15px;
    }

    .location-name {
        text-align: center;
        font-size: 1.4rem;
        color: #4a4a4a;
        font-weight: 500;
    }

    /* Section Styles */
    .section-block {
        margin: 2rem auto;
        padding: 2.5rem;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(212, 230, 207, 0.2));
        border-radius: 15px;
        border: 3px solid #c4a876;
        max-width: 800px;
        text-align: center;
        box-shadow: 0 0 0 8px rgba(196, 168, 118, 0.1), inset 0 0 0 1px rgba(196, 168, 118, 0.2);
    }

    .section-title {
        font-size: clamp(1.8rem, 5vw, 2.5rem);
        color: #c4a876;
        text-align: center;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 1rem;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
    }

    .section-description {
        font-size: 1.2rem;
        color: #4a4a4a;
        text-align: center;
        line-height: 1.6;
    }

    /* Group Info Box */
    .group-info-box {
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
        border: 2px solid #4caf50;
        border-radius: 10px;
        padding: 1.2rem;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .group-info-title {
        font-size: 0.9rem;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0 0 0.5rem 0;
    }

    .group-info-name {
        font-size: 1.3rem;
        color: #4caf50;
        font-weight: 600;
        margin: 0 0 0.3rem 0;
    }

    .group-info-contact {
        font-size: 0.95rem;
        color: #666;
        margin: 0;
    }

    /* RSVP Form */
    .rsvp-section {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(212, 230, 207, 0.4)) !important;
    }

    .rsvp-form {
        width: 100%;
        max-width: 600px;
        margin: 2rem auto 0;
    }

    .radio-group {
        margin-bottom: 2rem;
        display: flex;
        gap: 2rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .radio-option {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        font-size: 1.2rem;
        color: #2d2d2d;
        transition: color 0.3s ease;
    }

    .radio-option:hover {
        color: #c4a876;
    }

    .radio-input {
        width: 24px;
        height: 24px;
        cursor: pointer;
        accent-color: #c4a876;
    }

    .form-label {
        display: block;
        font-size: 1.1rem;
        color: #2d2d2d;
        margin-bottom: 0.8rem;
        font-weight: 500;
    }

    .form-input,
    .form-textarea {
        width: 100%;
        padding: 0.9rem 1rem;
        margin-bottom: 1.2rem;
        border: 2px solid rgba(196, 168, 118, 0.2);
        border-radius: 10px;
        font-size: 1rem;
        color: #2d2d2d;
        background: rgba(255, 255, 255, 0.8);
        transition: all 0.3s ease;
        font-family: inherit;
    }

    .form-input:focus,
    .form-textarea:focus {
        outline: none;
        border-color: #c4a876;
        box-shadow: 0 0 0 3px rgba(196, 168, 118, 0.1);
        background: white;
    }

    .form-input::placeholder,
    .form-textarea::placeholder {
        color: rgba(74, 74, 74, 0.5);
    }

    .form-textarea {
        resize: vertical;
        min-height: 120px;
    }

    .submit-button {
        width: 100%;
        padding: 1.2rem;
        background: linear-gradient(135deg, #c4a876 0%, #a89060 100%);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1.2rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 8px 15px rgba(196, 168, 118, 0.3);
    }

    .submit-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 25px rgba(196, 168, 118, 0.4);
    }

    .submit-button:active {
        transform: translateY(-1px);
    }

    /* QR Section */
    .qr-section {
        text-align: center;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(212, 230, 207, 0.5)) !important;
        padding: 3rem 2rem;
    }

    .qr-image-wrapper {
        display: flex;
        justify-content: center;
        margin: 2rem 0;
        animation: slideInUp 0.8s ease-out;
    }

    .qr-image {
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        padding: 15px;
        background: white;
        animation: bounce 2s ease-in-out infinite;
    }

    .qr-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin: 1.5rem 0;
    }

    .action-button {
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
        border: none;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .action-button-primary {
        background: linear-gradient(135deg, #c4a876 0%, #a89060 100%);
        color: white;
        box-shadow: 0 8px 15px rgba(196, 168, 118, 0.3);
    }

    .action-button-primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 25px rgba(196, 168, 118, 0.4);
    }

    .action-button-secondary {
        background: rgba(196, 168, 118, 0.1);
        color: #c4a876;
        border: 2px solid #c4a876;
    }

    .action-button-secondary:hover {
        background: #c4a876;
        color: white;
    }

    .qr-note {
        font-size: 0.9rem;
        color: #666;
        margin-top: 1rem;
        font-style: italic;
    }

    .footer-spacer {
        height: 4rem;
    }

  .guest-limit {
    font-size: 0.9em;
    color: #666;
    margin-left: 0.5rem;
  }
  .error-message {
    color: #d32f2f;
    background: #ffebee;
    padding: 0.5rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

    /* Animations */
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-40px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes expandWidth {
        from {
            width: 0;
        }
        to {
            width: 150px;
        }
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 0.6;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.1);
        }
    }

    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-8px);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* View-based animations (already existing) */
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

    /* Responsive Design */
    @media (max-width: 768px) {
        .frame-border {
            padding: 2rem 1.5rem;
            border-radius: 15px;
        }

        .title-section {
            margin-bottom: 2rem;
        }

        .page-title {
            font-size: 2.5rem;
        }

        .details-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin: 2rem 0;
        }

        .carousel-container {
            aspect-ratio: 4/3;
        }

        .carousel-control {
            width: 40px;
            height: 40px;
            font-size: 1.4rem;
        }

        .carousel-prev {
            left: 10px;
        }

        .carousel-next {
            right: 10px;
        }

        .map-container iframe {
            width: 100% !important;
            height: 300px !important;
        }

        .radio-group {
            flex-direction: column;
            gap: 1rem;
        }

        .qr-actions {
            flex-direction: column;
        }

        .action-button {
            width: 100%;
        }
    }

    /* Color scheme */
    h1, h2 {
        color: #2d2d2d;
    }

    p {
        color: #4a4a4a;
    }

    .full-height {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Wire transfer / regalo table */
    .wire-table {
        margin: 1rem auto 0;
        width: 100%;
        max-width: 600px;
        border-collapse: collapse;
        text-align: left;
    }
    .wire-table td {
        padding: 0.5rem 0.25rem;
        vertical-align: top;
    }
    .wire-label {
        width: 35%;
        font-weight: 700;
        color: #2d2d2d;
        padding-right: 1rem;
    }
    .wire-value {
        color: #4a4a4a;
        word-break: break-word;
    }
</style>   
