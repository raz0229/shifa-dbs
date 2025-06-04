<script>
    import Stats from "$lib/components/dashboard.svelte";
    import Appointments from "$lib/components/appointments.svelte";
    import Logs
     from "../../lib/components/Logs.svelte";
    import { getContext } from 'svelte';
    import Patients from "../../lib/components/patients.svelte";
    const message = getContext('selected-tab');

    const clientHasPaid = true;

    // Mapping component names to the actual Svelte components
    const componentMap = {
        'Stats': Stats,
        'Patients': Patients,
        'Appointments': Appointments,
        'Logs': Logs,
    };

    $: selectedComponent = $message;

</script>

{#if clientHasPaid}
    {#if selectedComponent && componentMap[selectedComponent]}
    <svelte:component this={componentMap[selectedComponent]} />
    {:else}
    <!-- Load Stats by default -->
    <svelte:component this={componentMap['Stats']} />
    {/if}
{:else}
<div class="app-blocked">
    <img src="/blocked.png" alt="">
    <h4>App Temporarily Blocked</h4>
    <p>Client needs to complete the payment process to access all functionalities</p>
</div>
{/if}


<style>
    .app-blocked {
        width: 100%;
    height: 80vh;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 3rem;
}

.app-blocked img {
    width: 10rem;
}

.app-blocked h4 {
    color: crimson;
    font-weight: 600;
}
    
</style>