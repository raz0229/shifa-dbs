<script>
    import { accentColor } from "$lib/stores"
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    let color;

    onMount(() => {
        if (browser)
            color = $accentColor;
    })

</script>
<div class="error">
    <div>
        <h1 class="grey-text darken-2">404</h1>
        <p class="grey-text">We couldn't find the page you're looking for</p>
        <a id="homeButton" href="/" class="{color}  waves-effect waves-light btn-small transparent"><b>Go back</b></a>

    </div>
    <svg class="icon" width="14rem" height="14rem" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M373.333333 576c-23.466667 25.6-57.6 42.666667-96 42.666667h-64c-70.4 0-128-57.6-128-128s57.6-128 128-128h64c38.4 0 72.533333 17.066667 96 42.666666h100.266667c-32-74.666667-108.8-128-196.266667-128h-64C96 277.333333 0 373.333333 0 490.666667s96 213.333333 213.333333 213.333333h64c87.466667 0 162.133333-53.333333 196.266667-128h-100.266667zM810.666667 277.333333h-64c-87.466667 0-162.133333 53.333333-196.266667 128h100.266667c23.466667-25.6 57.6-42.666667 96-42.666666h64c70.4 0 128 57.6 128 128s-57.6 128-128 128h-64c-38.4 0-72.533333-17.066667-96-42.666667h-100.266667c32 74.666667 108.8 128 196.266667 128h64c117.333333 0 213.333333-96 213.333333-213.333333s-96-213.333333-213.333333-213.333334z" fill="#ababab" /><path d="M416 85.333333L341.333333 128l130.133334 172.8 27.733333-17.066667zM608 85.333333L682.666667 128l-130.133334 172.8-27.733333-17.066667zM608 938.666667l74.666667-42.666667-130.133334-172.8-27.733333 17.066667zM416 938.666667L341.333333 896l130.133334-172.8 27.733333 17.066667z" fill="#ababab" /></svg>

</div>

<style>
    .error {
        display: flex;
        justify-content: space-around;
        text-align: left;
        margin: 4rem;
    }
    a#homeButton {
        color: #fff;
    }
</style>