<script>
  import '../app.css';
  import { onMount } from 'svelte';
  let name = '';
  let email = '';
  let message = '';
  let status = null; // null | 'sending' | 'success' | 'error'

  // Default endpoint points to Formspree placeholder. Replace with your form endpoint
  // e.g. https://formspree.io/f/abcd1234
  export let endpoint = 'https://formspree.io/f/xrbrawrn';

  // Honeypot field for spam
  let honeypot = '';

  async function handleSubmit(e) {
    e.preventDefault();
    if (honeypot) {
      // likely bot
      return;
    }

    status = 'sending';
    const payload = new FormData();
    payload.append('name', name);
    payload.append('email', email);
    payload.append('message', message);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: payload
      });

      if (res.ok) {
        status = 'success';
        name = '';
        email = '';
        message = '';
      } else {
        status = 'error';
      }
    } catch (err) {
      console.error(err);
      status = 'error';
    }
  }

  onMount(() => {
    // provide helpful console hint for replacing the placeholder endpoint
    if (endpoint.includes('xrbrawrn')) {
      console.info('ContactForm: Replace the default Formspree endpoint with your form ID. Example: https://formspree.io/f/xrbrawrn');
    }
  });
</script>

<form class="contact-form" on:submit|preventDefault={handleSubmit} aria-label="Contact form">
  <div class="form-row">
    <label for="name">Name</label>
    <input id="name" type="text" bind:value={name} required />
  </div>

  <div class="form-row">
    <label for="email">Email</label>
    <input id="email" type="email" bind:value={email} required />
  </div>

  <!-- honeypot (visually hidden) -->
  <div style="display:none;">
    <label for="hp-field">Leave this field empty</label>
    <input id="hp-field" name="hp-field" tabindex="-1" autocomplete="off" bind:value={honeypot} />
  </div>

  <div class="form-row">
    <label for="message">Message</label>
    <textarea id="message" rows="6" bind:value={message} required></textarea>
  </div>

  <div class="form-actions">
    <button type="submit" class="btn" disabled={status === 'sending'}>
      {#if status === 'sending'}Sending...{:else}Send Message{/if}
    </button>
  </div>

  {#if status === 'success'}
    <p class="form-success">Thanks — your message was sent.</p>
  {:else if status === 'error'}
    <p class="form-error">Something went wrong. You can email me directly at <a href="mailto:bekzepeda2005@gmail.com">bekzepeda2005@gmail.com</a>.</p>
  {/if}
</form>

<style>
.contact-form {
  max-width: 640px;
}
.form-row { margin-bottom: 0.75rem; display:flex; flex-direction:column; }
.form-row label { font-size:0.9rem; margin-bottom:0.25rem; }
.form-row input,
.form-row textarea { 
  padding:0.5rem; 
  border-radius:6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.575);
	background-color: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
	backdrop-filter: blur(25px);
	/* box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.3); */
}
.form-actions { margin-top:0.5rem; }
.btn { background-color: rgba(0, 0, 0, 0.3); backdrop-filter: blur(25px); color:#fff; padding:0.6rem 1rem; border-radius:6px; border-color: rgba(255, 255, 255, 0.3); cursor:pointer; }
.form-success { color:green; margin-top:0.75rem; }
.form-error { color:crimson; margin-top:0.75rem; }
</style>
