<script>
    import '../app.css';
    export let icons = [];
    // $: console.log('IconBar icons:', icons);
</script>

<div class="icon-bar">
  {#each icons as icon}
    {#if icon.link}
      <a
        href={icon.link}
        target="_blank"
        rel="noopener noreferrer"
        class="icon"
        style={`--hover-color: ${icon.color}`}
      >
        <img src={icon.src} alt={icon.alt} />
      </a>
    {:else}
      <div
        class="icon"
        style={`--hover-color: ${icon.color}`}
      >
        <img src={icon.src} alt={icon.alt} />
      </div>
    {/if}
  {/each}
</div>

<style>
    .icon-bar {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>