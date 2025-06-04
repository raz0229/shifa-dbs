<script>
    import Dashboard from '$lib/components/dashboard.svelte';
</script>

<button 
    on:click={()=>location.href='/dashboard'}
    class="go_back">
    <i class="material-icons">arrow_back</i>
</button>
<Dashboard/>

<style>
     button.go_back {
        outline: none;
        background: none;
        border: none;
        margin: 1rem;
    }
</style>