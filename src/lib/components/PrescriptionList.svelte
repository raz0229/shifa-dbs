<script>
    import { onMount } from "svelte";
    import { accentColor, sqlLogs } from "$lib/stores";
    import { browser } from "$app/environment";
    import { capitalizeWords } from "$lib/config/controllers";

    export let prescriptions = [];

    let newPrescription = {
        name: "",
        fee: "",
    };

    $: $sqlLogs;
    let color;

    let showPanel = false; // Controls visibility

    function togglePanel() {
        showPanel = !showPanel;
        // Ensure Materialize text fields update when shown
        if (showPanel) setTimeout(() => M.updateTextFields(), 100);
    }

    async function addPrescription() {
        if (
            newPrescription.name.trim() &&
            !newPrescription.name.trim().includes(",") &&
            newPrescription.fee
        ) {
            const pres_id = `${Math.floor(Math.random() * 1000)}`;
            const query = `INSERT INTO Prescription(pres_id, name, fee) VALUES (${pres_id}, "${capitalizeWords(newPrescription.name.trim().toLowerCase())}", ${newPrescription.fee})`;
            try {
                const response = await fetch("/api/query", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query,
                    }),
                });

                const result = await response.json();
                if (result.success) {
                    const updated = [
                        ...$sqlLogs,
                        {
                            query,
                            date: new Date().toString().substring(0, 21),
                        },
                    ];
                    sqlLogs.set(updated);
                    M.toast({ html: "✅ Prescription Added" });
                    M.toast({ html: "✔️ SQL Query Added to Logs" });

                    prescriptions = [
                        ...prescriptions,
                        {
                            pres_id,
                            name: capitalizeWords(
                                newPrescription.name.trim().toLowerCase(),
                            ),
                            fee: parseFloat(newPrescription.fee),
                        },
                    ];
                    newPrescription.name = "";
                    newPrescription.fee = "";
                } else M.toast({ html: "❌ Oh oh! Could not add Prescription" });
            } catch (error) {
                console.log(error);
                M.toast({ html: "❌ Something went wrong" });
            }
        } else {
            M.toast({ html: "❌ Invalid Value" });
        }
    }

    async function removePrescription(pres_id) {
        const query = `DELETE FROM Prescription WHERE pres_id = ${pres_id}`;
        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query,
                }),
            });

            const result = await response.json();
            if (result.success) {
                const updated = [
                    ...$sqlLogs,
                    {
                        query,
                        date: new Date().toString().substring(0, 21),
                    },
                ];
                sqlLogs.set(updated);
                M.toast({ html: "✅ Prescription Removed" });
                M.toast({ html: "✔️ SQL Query Added to Logs" });

                prescriptions = prescriptions.filter((d) => d.pres_id !== pres_id);
            } else M.toast({ html: "❌ Oh oh! Could not remove Prescription" });
        } catch (error) {
            console.log(error);
            M.toast({ html: "❌ Something went wrong" });
        }
    }

    onMount(() => {
        M.updateTextFields();
        if (browser) {
            color = $accentColor;
        }
    });
</script>

<div class="container">
    <div class="toggle-header" on:click={togglePanel}>
        <span style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="material-icons">medical_services</i>
            <strong>Manage Prescriptions</strong>
        </span>
        <i class="material-icons">
            {showPanel ? "keyboard_arrow_up" : "keyboard_arrow_down"}
        </i>
    </div>

    {#if showPanel}
        <div style="margin-bottom: 8rem;" class="collapse-content">
            <!-- Add Prescription Form -->
            <div class="add-form">
                <div class="row">
                    <div class="input-field col s12 m5">
                        <input
                            id="prescription_name"
                            type="text"
                            bind:value={newPrescription.name}
                            class="validate"
                        />
                        <label for="prescription_name">Prescription Name</label>
                    </div>

                    <div class="input-field col s12 m4">
                        <input
                            id="prescription_fee"
                            type="number"
                            bind:value={newPrescription.fee}
                            class="validate"
                        />
                        <label for="prescription_fee">Price (PKR)</label>
                    </div>

                    <div class="col s12 m3">
                        <button
                            class="btn {color} waves-effect waves-light"
                            on:click={addPrescription}
                            style="width: 100%; margin-top: 20px;"
                        >
                            <i class="material-icons left">add</i>Add
                        </button>
                    </div>
                </div>
            </div>

            <!-- prescriptions List -->
            {#each prescriptions as doctor (doctor.pres_id)}
                <div class="card doctor-card">
                    <div class="card-content">
                        <div
                            class="doctor-info"
                            style="display: flex; justify-content: space-between; align-items: center;"
                        >
                            <div>
                                <span class="card-title">{doctor.name}</span>
                                <p><b>Price:</b> {doctor.fee} PKR</p>
                            </div>
                            <button
                                class="btn-floating red waves-effect waves-light"
                                on:click={() => removePrescription(doctor.pres_id)}
                            >
                                <i class="material-icons">delete</i>
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .doctor-card {
        margin-bottom: 1rem;
    }

    .toggle-header {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #eeeeee;
        padding: 1rem;
        border-radius: 8px;
        transition: background-color 0.2s ease-in-out;
    }

    .toggle-header:hover {
        background-color: #e0e0e0;
    }

    .add-form {
        background-color: #f2f2f2;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
    }

    .collapse-content {
        margin-top: 1rem;
        animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
