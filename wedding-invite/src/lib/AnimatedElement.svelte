<script lang="ts">
  import { inview } from 'svelte-inview';
  // start hidden until the inview action notifies us
  let isInView = false;
</script>

<div
  class="wrapper"
  use:inview={{ unobserveOnEnter: true, rootMargin: '0px' }}
  on:change={(e: Event) => {
    isInView = (e as CustomEvent).detail.inView;
  }}
>
  <!-- Always render the slot so layout and accessibility remain intact.
       Toggle a class when in view to reveal with a simple CSS transition. -->
  <div class="box" class:is-visible={isInView}>
    <slot />
  </div>
</div>

<style>
  .wrapper {
    margin-top: 30px;
  }

  .box {
    width: 300px;
    border: 1px solid rgb(221, 221, 221);
    padding: 25px;
    border-radius: 10px;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 300ms ease, transform 300ms ease;
  }

  .box.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>
