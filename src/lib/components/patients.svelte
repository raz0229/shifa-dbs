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
                        id: row.id,
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
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { accentColor, sqlLogs } from "$lib/stores";
    import EditPatientModal from "$lib/components/EditPatientModal.svelte";
    import ViewPatientModal from "$lib/components/ViewPatientModal.svelte";
    import AddPatientModal from "./AddPatientModal.svelte";
    import ConfirmModal from "./ConfirmModal.svelte";
    import { capitalizeWords, cities } from "$lib/config/controllers";

    let sampleAppointments = [];

    let loadingAppointments = false;

    let selectedPatient = {
        name: "John Doe",
        sex: "Male",
        phone: "123-456-7890",
        city: "New York",
    };

    async function handleSave(event) {
        const patient = event.detail;
        const query = `UPDATE Patient SET name = '${patient.name}', sex = '${patient.sex}', phone = '${patient.phone}', city = '${patient.city}' WHERE id = ${patient.id};`
        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query
                }),
            });

            const result = await response.json();
            if (result.success) {
                const updated = [...$sqlLogs, {
                     query,
                     date: new Date().toString().substring(0, 21),
                }];
                sqlLogs.set(updated);
                M.toast({html: '🥳 Sucessfully updated a Patient'})
                M.toast({html: '✔️ SQL Query Added to Logs'})
                
                patients = patients.map(obj => obj.id === patient.id ? patient : obj);
                allPatients = allPatients.map(obj => obj.id === patient.id ? patient : obj);

                patients = patients
            } else 
            M.toast({html: '❌ Oh oh! Could not update Patient'})
        } catch (error) {
            console.log(error);
            M.toast({html: '❌ Something went wrong'})
        }
    }

    async function handleAdd(event) {
        const patient = event.detail;
        const query = `INSERT INTO Patient (sex, phone, name, city) VALUES ('${patient.sex}', '${patient.phone}', '${patient.name}', '${patient.city}');`;
        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query
                }),
            });

            const result = await response.json();
            if (result.success) {
                const updated = [...$sqlLogs, {
                     query,
                     date: new Date().toString().substring(0, 21),
                }];
                sqlLogs.set(updated);
                M.toast({html: '🥳 Sucessfully added a Patient'})
                M.toast({html: '✔️ SQL Query Added to Logs'})
                allPatients.push(patient);
                patients.push(patient)
                patients = patients
            } else 
            M.toast({html: '❌ Oh oh! Could not add Patient'})
        } catch (error) {
            console.log(error);
            M.toast({html: '❌ Something went wrong'})
        }
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
        const modalElem = document.getElementById("edit-patient-modal");
        M.Modal.getInstance(modalElem).open();
        selectedPatient = patient
    }

    function openAddPatientModal() {
        const modalElem = document.getElementById("add-patient-modal");
        M.Modal.getInstance(modalElem).open();
    }

    async function viewPatient(patient) {
        const modalElem = document.getElementById("view-patient-modal");
        M.Modal.getInstance(modalElem).open();
        selectedPatient = patient;
        loadingAppointments = true;
        const query = `SELECT A.ap_id, FROM_UNIXTIME(A.date) AS appointment_datetime, A.cause_of_visit, D.name AS doctor_name, D.fee AS doctor_fee, GROUP_CONCAT(Pr.name ORDER BY Pr.name SEPARATOR ', ') AS prescription_names, SUM(Pr.fee) AS total_prescription_fee FROM Appointment AS A LEFT JOIN Doctor AS D ON A.examiner = D.doc_id LEFT JOIN AppointmentPrescription AS AP ON A.ap_id = AP.ap_id LEFT JOIN Prescription AS Pr ON AP.pres_id = Pr.pres_id WHERE A.patient = ${selectedPatient.id} GROUP BY A.ap_id, A.date, A.cause_of_visit, D.name, D.fee ORDER BY A.date DESC;`;
        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query
                }),
            });

            const result = await response.json();
            if (result.success) {
                console.log(result.results)
                sampleAppointments = []
                const updated = [...$sqlLogs, {
                     query,
                     date: new Date().toString().substring(0, 21),
                }];
                sqlLogs.set(updated);
                M.toast({html: '✔️ SQL Query Added to Logs'})
                result.results.forEach(res => {
                    sampleAppointments.push({
                        date: res.appointment_datetime,
                        cause: res.cause_of_visit,
                        doctor: capitalizeWords(res.doctor_name),
                        fee: res.doctor_fee,
                        bill: res.prescription_fee,
                        prescription: capitalizeWords(res.prescription_name),
                    })
                });

                sampleAppointments = sampleAppointments


            } else 
            M.toast({html: '❌ Could not fetch appointments'})
        } catch (error) {
            console.log(error);
            M.toast({html: '❌ Something went wrong'})
        }

        loadingAppointments = false;
    }

    function openDeletePatientModal(patient) {
        const modalElem = document.getElementById("confirm-modal");
        M.Modal.getInstance(modalElem).open();
        selectedPatient = patient;
    }

    const deletePatient = async () => {
        if (selectedPatient) {
            const query = `DELETE FROM Patient WHERE id = ${selectedPatient.id};`;
            try {
                const response = await fetch("/api/query", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query
                    }),
                });

                const result = await response.json();
                if (result.success) {
                    const updated = [...$sqlLogs, {
                         query,
                         date: new Date().toString().substring(0, 21),
                    }];
                    sqlLogs.set(updated);
                    M.toast({html: '✅ Patient Deleted'})
                    M.toast({html: '✔️ SQL Query Added to Logs'})
                    
                    let index = patients.findIndex(p => p.id == selectedPatient.id);
                    if (index !== -1)
                        patients.splice(index, 1)
                    allPatients.splice(allPatients.findIndex(p => p.id == selectedPatient.id), 1)

                    patients = patients
                } else 
                M.toast({html: '❌ Oh oh! Could not delete Patient'})
            } catch (error) {
                console.log(error);
                M.toast({html: '❌ Something went wrong'})
            }
        }
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

<!-- Confirm Delete Modal -->
<ConfirmModal onDelete={() => deletePatient()} />

<!-- Edit Patient Modal Component -->
<EditPatientModal patient={selectedPatient} on:save={handleSave} />

<!-- View Patient Modal -->
<ViewPatientModal bind:loadingAppointments patient={selectedPatient} appointments={sampleAppointments} />

<!-- Add Patient Modal -->
<AddPatientModal on:save={handleAdd} />

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

<h6 style="margin-left: 1rem;  margin-top: 4rem;">
    <b>&nbsp;Patients Count: </b>
    {patients.length}
</h6>

<div
    class="list-container z-depth-1 white"
    style="margin-bottom: 12rem; max-width: 80rem;"
>
    {#if patients.length === 0}
        <p class="red-text" style="text-align: center;">
            <em>No Patients! Try clearing the Search Fields</em>
        </p>
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
                    on:click={() => openDeletePatientModal(patient)}
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
