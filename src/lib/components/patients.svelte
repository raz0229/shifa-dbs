<script context="module">
    import { LIST_ALL_PATIENTS_QUERY } from "$lib/config/controllers";

    export async function getAllPatients() {
        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: LIST_ALL_PATIENTS_QUERY,
                }),
            });

            const result = await response.json();

            let data = [];
            if (result && result.results) {
                for (let row of result.results) {
                    data.push({
                        name: row.name,
                        sex: row.sex,
                        phone: row.phone,
                        city: row.city,
                        visits: row.total_appointments,
                    });
                }
            }

            return data;
        } catch (error) {
            console.error(
                "Error fetching or processing appointment data:",
                error,
            );
            return null; // Or handle the error as appropriate
        }
    }
</script>

<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { browser } from "$app/environment";
    import { accentColor, sqlLogs } from "$lib/stores";
    import EditPatientModal from "$lib/components/EditPatientModal.svelte";
    import ViewPatientModal from "$lib/components/ViewPatientModal.svelte";
    import AddPatientModal from "./AddPatientModal.svelte";
    import { capitalizeWords, cities } from "$lib/config/controllers";

    let samplePatient = {
        name: "John Doe",
        sex: "Male",
        phone: "123-456-7890",
        city: "New York",
    };

    let sampleAppointments = [
        {
            date: "2025-06-01T10:30",
            cause: "Flu",
            doctor: "Dr. Adams",
            fee: 500,
            bill: 1000,
            prescription: "Rest, fluids",
        },
        {
            date: "2025-05-21T14:00",
            cause: "Headache",
            doctor: "Dr. Brian",
            fee: 400,
            bill: 850,
            prescription: "Ibuprofen",
        },
    ];

    let selectedPatient = {
        name: "John Doe",
        sex: "Male",
        phone: "123-456-7890",
        city: "New York",
    };

    function handleSave(event) {
        const updated = event.detail;
        console.log("Saved patient:", updated);
    }

    function handleAdd(event) {
        const updated = event.detail;
        console.log("Added patient:", updated);
    }

    let color;
    let name = "";
    let sex = "";
    let phone = "";
    let city = "";

    $: $sqlLogs;

    export let patients = [];
    let allPatients = [];

    function editPatient(patient) {
        console.log("Edit", patient);
        const modalElem = document.getElementById("edit-patient-modal");
        M.Modal.getInstance(modalElem).open();
    }

    function openAddPatientModal() {
        const modalElem = document.getElementById("add-patient-modal");
        M.Modal.getInstance(modalElem).open();
    }

    function viewPatient(patient) {
        console.log("View", patient);
        const modalElem = document.getElementById("view-patient-modal");
        M.Modal.getInstance(modalElem).open();
    }

    function deletePatient(patient) {
        console.log("Delete", patient);
    }

    // Initialize Materialize select after mount
    onMount(() => {
        const elems = document.querySelectorAll("select");
        M.FormSelect.init(elems);

        if (browser) {
            getAllPatients().then((data) => {
                console.log(data);
                allPatients = data;
                patients = data;

                const updated = [...$sqlLogs, {
                     query: LIST_ALL_PATIENTS_QUERY,
                     date: new Date().toString().substring(0, 21),
                }];
                sqlLogs.set(updated);
                M.toast({html: '✔️ SQL Query Added to Logs'})
            });
        }
    });

    function handleSearch() {
        patients = allPatients.filter((patient) => {
            return (
                (!name ||
                    patient.name.trim().toLowerCase().includes(name.toLowerCase())) &&
                (!sex ||
                    patient.sex.toLowerCase().includes(sex.toLowerCase())) &&
                (!phone || patient.phone.trim().includes(phone)) &&
                (!city ||
                    patient.city.toLowerCase().includes(city.toLowerCase()))
            );
        });
    }

    function clearSearch() {
        name = sex = city = phone= '';
        handleSearch()
    }

    onMount(() => {
        M.Tabs.init(document.querySelectorAll(".tabs"));
        M.Modal.init(document.querySelectorAll(".modal"));
        M.FormSelect.init(document.querySelectorAll("select"));

        if (browser) {
            color = $accentColor;
        }
    });
</script>

<a
    on:click={() => openAddPatientModal()}
    style="position: fixed; bottom: 7rem; right: 20px; z-index: 100;"
    class="btn-floating btn-large waves-effect waves-light {color}"
    ><i class="material-icons">add</i></a
>

<!-- Edit Patient Modal Component -->
<EditPatientModal bind:patient={selectedPatient} on:save={handleSave} />

<!-- View Patient Modal -->
<ViewPatientModal patient={samplePatient} appointments={sampleAppointments} />

<!-- Add Patient Modal -->
<AddPatientModal bind:patient={selectedPatient} on:save={handleAdd} />

<div class="form-container z-depth-2 white" style="max-width: 80rem;">
    <h5 class="form-title">Patient Search</h5>

    <div class="row">
        <div class="input-field col s12">
            <input id="name" type="text" bind:value={name} />
            <label for="name">Patient's Name</label>
        </div>

        <div class="input-field col s12">
            <select bind:value={sex}>
                <option value="" selected>Choose Sex</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
            </select>
            <label>Sex</label>
        </div>

        <div class="input-field col s12">
            <input id="phone" type="tel" bind:value={phone} />
            <label for="phone">Phone Number</label>
        </div>

        <div class="input-field col s12">
            <select bind:value={city}>
                <option value="" selected>Select City</option>
                {#each cities as c}
                    <option value={c}>{c}</option>
                {/each}
            </select>
            <label>City</label>
        </div>

        <div class="input-field col s12">
            <button
                class="btn {color} waves-effect waves-light btn-block"
                on:click={handleSearch}
            >
                Search
            </button>
        </div>
                <div class="input-field col s12">
            <button
                class="btn red waves-effect waves-light btn-block"
                on:click={clearSearch}
            >
                Clear Filters
            </button>
        </div>
    </div>
</div>


<h6 style="margin-left: 1rem;  margin-top: 4rem;"><b>&nbsp;Patients Count: </b> {patients.length} </h6>

<div
    class="list-container z-depth-1 white"
    style="margin-bottom: 12rem; max-width: 80rem;"
>

{#if patients.length === 0}
<p class="red-text" style="text-align: center;"><em>No Patients! Try clearing the Search Fields</em></p>
{/if}

    {#each patients as patient}
        <div class="patient-card">
            <i class="material-icons avatar">account_circle</i>

            <div class="patient-details">
                <div><b>Name:</b> {capitalizeWords(patient.name)}</div>
                <div><b>Sex:</b> {patient.sex}</div>
                <div><b>Phone:</b> {patient.phone}</div>
                <div><b>City:</b> {patient.city}</div>
                <div><b>Total Visits:</b> {patient.visits}</div>
            </div>

            <div class="action-buttons">
                <a
                    class="btn-floating yellow darken-2"
                    on:click={() => editPatient(patient)}
                >
                    <i class="material-icons">edit</i>
                </a>
                <a
                    class="btn-floating blue"
                    on:click={() => viewPatient(patient)}
                >
                    <i class="material-icons">visibility</i>
                </a>
                <a
                    class="btn-floating red"
                    on:click={() => deletePatient(patient)}
                >
                    <i class="material-icons">delete</i>
                </a>
            </div>
        </div>
    {/each}
</div>

<style>
    .form-container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: #f5f5f5;
        border-radius: 8px;
    }

    .form-title {
        text-align: center;
        margin-bottom: 2rem;
    }

    .btn-block {
        width: 100%;
    }
    .list-container {
        max-width: 700px;
        margin: 2rem auto;
        height: 400px;
        overflow-y: auto;
        padding: 1rem;
        background-color: #fafafa;
        border-radius: 8px;
    }

    .patient-card {
        display: flex;
        align-items: center;
        padding: 1rem;
        margin-bottom: 1rem;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .avatar {
        font-size: 3rem;
        margin-right: 1rem;
        color: #78909c;
    }

    .patient-details {
        flex: 1;
    }

    .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .action-buttons .btn-floating {
        width: 36px;
        height: 36px;
        line-height: 36px;
    }
</style>
