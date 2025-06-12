<script context="module">
    import {
        LIST_ALL_DOCTORS_QUERY,
        LIST_ALL_PRESCRIPTIONS_QUERY,
    } from "$lib/config/controllers";

    export async function getAllPrescriptions() {
        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: LIST_ALL_PRESCRIPTIONS_QUERY,
                }),
            });

            const result = await response.json();

            let data = [];
            if (result && result.results) {
                data = result.results;
            }

            return data;
        } catch (error) {
            console.error("Error fetching or processing doctors data:", error);
            return null; // Or handle the error as appropriate
        }
    }

    export async function getAllDoctors() {
        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: LIST_ALL_DOCTORS_QUERY,
                }),
            });

            const result = await response.json();

            let data = [];
            if (result && result.results) {
                data = result.results;
            }

            return data;
        } catch (error) {
            console.error("Error fetching or processing doctors data:", error);
            return null; // Or handle the error as appropriate
        }
    }
</script>

<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { accentColor, sqlLogs } from "$lib/stores";
    import DoctorList from "$lib/components/DoctorList.svelte";
    import PrescriptionList from "$lib/components/PrescriptionList.svelte";

    let colors = [
        "red accent-4",
        "purple accent-4",
        "blue accent-4",
        "light-blue accent-4",
        "teal accent-4",
        "green accent-4",
        "orange accent-4",
        "indigo accent-4",
        "amber accent-4",
        "grey accent-4",
    ];

    let selectedColor;
    let doctors = [];
    let prescriptions = [];
    let loading = true;

    $: $sqlLogs;

    onMount(() => {
        if (browser) {
            selectedColor = $accentColor;

            getAllDoctors().then((data) => {
                console.log("Doctors = ", data);
                doctors = data;

                const updated = [
                    ...$sqlLogs,
                    {
                        query: LIST_ALL_DOCTORS_QUERY,
                        date: new Date().toString().substring(0, 21),
                    },
                ];
                sqlLogs.set(updated);
                M.toast({ html: "✔️ SQL Query Added to Logs" });

                getAllPrescriptions().then((data) => {
                    console.log("Prescriptions = ", data);
                    prescriptions = data;
                    loading = false;

                    const updated = [
                        ...$sqlLogs,
                        {
                            query: LIST_ALL_PRESCRIPTIONS_QUERY,
                            date: new Date().toString().substring(0, 21),
                        },
                    ];
                    sqlLogs.set(updated);
                    M.toast({ html: "✔️ SQL Query Added to Logs" });

                    loading = false;
                });
            });
        }
    });

    const updateAccentColor = (color) => {
        accentColor.set(color);
        location.reload();
    };
</script>

<button on:click={() => (location.href = "/dashboard")} class="go_back">
    <i class="material-icons">arrow_back</i>
</button>
<div class="center">
    {#if loading}
        <div
            style="width: 70%; display: flex; justify-self: center;"
            class="progress"
        >
            <div class="indeterminate"></div>
        </div>
    {/if}
    <h1 class="grey-text">Settings</h1>
</div>

<div class="accent-colors">
    <h5 class="grey-text">Accent Colors</h5>
    <div class="colors">
        {#each colors as color}
            <span
                class:pulse={$accentColor == color}
                on:click={() => updateAccentColor(color)}
                class="color {color} "
            ></span>
        {/each}
    </div>
</div>

{#if !loading}
    <DoctorList bind:doctors />
    <div style="margin-top: 1rem;">
        <PrescriptionList bind:prescriptions />
    </div>
{/if}

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
