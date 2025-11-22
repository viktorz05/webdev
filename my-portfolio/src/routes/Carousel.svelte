<script>
    import '../app.css';
</script>
<div class = "carousel">
    <div class ="card glassbox font-bold"> Uma</div>
    <div class ="card glassbox font-bold"> SFU Sprint</div>
    <div class ="card glassbox font-bold"> SFU Fitness App</div>
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
        height: 12em;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: white;
    }
    .card:hover {
        transform: scale(1.05);
        transition: 0.2s ease;
    }
</style>

