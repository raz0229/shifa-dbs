<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { accentColor } from "$lib/stores"

    let colors = [
        'red',
        'purple',
        'blue',
        'light-blue',
        'teal',
        'green',
        'orange',
        'indigo',
        'amber',
        'grey'
    ]

    let selectedColor;

    onMount(() => {

        if (browser) {
            selectedColor = $accentColor;
        }

    })

    const updateAccentColor = (color) => {
        accentColor.set(color)
        location.reload()
    }


 

</script>

<button 
    on:click={()=>location.href='/dashboard'}
    class="go_back">
    <i class="material-icons">arrow_back</i>
</button>
<div class="center">
    <h1 class="grey-text">Settings</h1>
</div>

<div class="accent-colors">
    <h5 class="grey-text">Accent Colors</h5>
    <div class="colors">
        {#each colors as color}
            <span
             class:pulse="{$accentColor == color}" 
             on:click={()=>updateAccentColor(color)}
             class="color { color } "></span>
        {/each}
    </div>
</div>



<style>
     button.go_back {
        outline: none;
        background: none;
        border: none;
        margin: 2rem;
    }
    .accent-colors {
        border-top: solid 1px grey;
        margin: 1.5rem;
    }
    .colors {
        padding: 1rem;
        display: flex;
        flex-wrap: wrap;
    }
    .colors .color {
        padding: 1rem;
        border: solid 1px grey;
        border-radius: 50%;
        margin: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .colors .color:hover {
        border: solid 3px rgb(0, 170, 255) !important;
    }
</style>
