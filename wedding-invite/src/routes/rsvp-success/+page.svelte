<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let name = '';
  let guests = '';
  let qrImage = '';
  let isLoading = true;

  onMount(() => {
    // Extract data from URL parameters
    name = $page.url.searchParams.get('name') || '';
    guests = $page.url.searchParams.get('guests') || '1';
    qrImage = $page.url.searchParams.get('qr') || '';
    isLoading = false;
  });

  function downloadQR() {
    if (!qrImage) return;
    const a = document.createElement('a');
    a.href = qrImage;
    a.download = `${name.replace(/\s+/g, '_')}_qr.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function goBack() {
    window.history.back();
  }
</script>

<svelte:head>
  <title>Confirmación de RSVP - Victoria y Luis</title>
</svelte:head>

<div class="success-wrapper">
  <div class="success-frame">
    <!-- Decorative corners -->
    <div class="corner corner-top-left"></div>
    <div class="corner corner-top-right"></div>
    <div class="corner corner-bottom-left"></div>
    <div class="corner corner-bottom-right"></div>

    {#if isLoading}
      <div class="loading-container">
        <p>Cargando...</p>
      </div>
    {:else}
      <div class="success-content">
        <!-- Checkmark animation -->
        <div class="checkmark-animation">
          <svg class="checkmark" viewBox="0 0 52 52">
            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>

        <!-- Success Message -->
        <h1 class="success-title">¡Confirmación Recibida!</h1>
        <p class="success-message">Gracias por confirmar tu asistencia</p>

        <!-- Name Display -->
        <div class="name-card">
          <p class="card-label">Nombre</p>
          <p class="card-value">{name}</p>
          <p class="card-subtitle">{guests} {guests === '1' ? 'asistente' : 'asistentes'}</p>
        </div>

        <!-- QR Code Section -->
        <div class="qr-section">
          <p class="qr-label">Tu código QR de entrada</p>
          <div class="qr-container">
            {#if qrImage}
              <img src={qrImage} alt="QR de confirmación" class="qr-code" />
            {/if}
          </div>
          <p class="qr-instruction">Presenta este código en la entrada del evento</p>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn btn-primary" on:click={downloadQR}>
            📥 Descargar QR
          </button>
          <button class="btn btn-secondary" on:click={goBack}>
            ← Volver
          </button>
        </div>

        <!-- Additional Info -->
        <!-- <div class="info-box">
          <p>Te hemos enviado un email de confirmación. Si tienes preguntas, contáctanos.</p>
        </div> -->
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .success-wrapper {
    min-height: 100vh;
    padding: 2rem 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, rgba(212, 230, 207, 0.3) 0%, rgba(200, 211, 193, 0.2) 100%);
  }

  .success-frame {
    position: relative;
    width: 100%;
    max-width: 600px;
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

  .success-content {
    text-align: center;
    animation: fadeIn 0.8s ease-out;
  }

  .loading-container {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    color: #c4a876;
  }

  /* Checkmark Animation */
  .checkmark-animation {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .checkmark {
    width: 80px;
    height: 80px;
    animation: checkmarkScale 0.5s ease-in-out;
  }

  .checkmark-circle {
    stroke: #4caf50;
    stroke-width: 2;
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    animation: checkmarkCircle 0.6s ease-in-out 0.2s forwards;
  }

  .checkmark-check {
    stroke: #4caf50;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: checkmarkCheck 0.6s ease-in-out 0.4s forwards;
  }

  @keyframes checkmarkScale {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes checkmarkCircle {
    0% {
      stroke-dashoffset: 166;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes checkmarkCheck {
    0% {
      stroke-dashoffset: 48;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  /* Title and Messages */
  .success-title {
    font-size: 2rem;
    color: #2d2d2d;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .success-message {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 2rem;
    font-style: italic;
  }

  /* Name Card */
  .name-card {
    background: linear-gradient(135deg, rgba(212, 230, 207, 0.3), rgba(196, 168, 118, 0.1));
    border: 2px solid rgba(196, 168, 118, 0.2);
    border-radius: 15px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    animation: slideInUp 0.8s ease-out;
  }

  .card-label {
    font-size: 0.9rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 0.5rem 0;
  }

  .card-value {
    font-size: 1.6rem;
    color: #c4a876;
    font-weight: 600;
    margin: 0;
  }

  .card-subtitle {
    font-size: 0.95rem;
    color: #666;
    margin: 0.5rem 0 0 0;
  }

  /* QR Section */
  .qr-section {
    margin: 2rem 0;
    animation: slideInUp 0.8s ease-out 0.2s both;
  }

  .qr-label {
    font-size: 0.95rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1rem;
  }

  .qr-container {
    background: white;
    padding: 20px;
    border-radius: 15px;
    display: inline-block;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }

  .qr-code {
    max-width: 300px;
    width: 100%;
    height: auto;
    display: block;
    animation: bounce 2s ease-in-out infinite;
  }

  .qr-instruction {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
    font-style: italic;
  }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin: 2rem 0;
    animation: slideInUp 0.8s ease-out 0.4s both;
  }

  .btn {
    padding: 0.9rem 1.8rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .btn-primary {
    background: linear-gradient(135deg, #c4a876 0%, #a89060 100%);
    color: white;
    box-shadow: 0 8px 15px rgba(196, 168, 118, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(196, 168, 118, 0.4);
  }

  .btn-secondary {
    background: rgba(196, 168, 118, 0.1);
    color: #c4a876;
    border: 2px solid #c4a876;
  }

  .btn-secondary:hover {
    background: #c4a876;
    color: white;
    transform: translateY(-3px);
  }

  /* Info Box */
  .info-box {
    background: rgba(76, 175, 80, 0.05);
    border-left: 4px solid #4caf50;
    padding: 1rem;
    border-radius: 5px;
    margin-top: 2rem;
    font-size: 0.95rem;
    color: #666;
    animation: slideInUp 0.8s ease-out 0.6s both;
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

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
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

  /* Responsive */
  @media (max-width: 768px) {
    .success-frame {
      padding: 2rem 1.5rem;
    }

    .success-title {
      font-size: 1.6rem;
    }

    .card-value {
      font-size: 1.3rem;
    }

    .action-buttons {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }

    .qr-container {
      padding: 15px;
    }
  }
</style>
