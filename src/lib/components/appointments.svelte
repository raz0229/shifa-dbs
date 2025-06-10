<script context="module">
    import {
        LIST_ALL_APPOINTMENTS_QUERY,
        LIST_ALL_DOCTORS_QUERY,
        LIST_ALL_PATIENTS_QUERY,
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
                data = result.results;
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

    export async function getAllAppointments() {
        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: LIST_ALL_APPOINTMENTS_QUERY,
                }),
            });

            const result = await response.json();

            let data = [];
            if (result && result.results) {
                data = result.results;
            }

            for (let ap of data) {
                ap.dateString = new Date(ap.date * 1000).toLocaleString();
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
    import { onMount, afterUpdate } from "svelte";
    import { browser } from "$app/environment";
    import { accentColor, sqlLogs } from "$lib/stores";
    import EditAppointmentModal from "$lib/components/EditAppointmentModal.svelte";
    import AddAppointmentModal from "./AddAppointmentModal.svelte";
    import ConfirmModal from "./ConfirmModal.svelte";
    import { capitalizeWords, cities } from "$lib/config/controllers";

    let loading = false;
    let isLoadingPatients = false;

    let appointments = [];
    let allAppointments = [];

    $: $sqlLogs;

    let selectedAppointment = {
        name: "John Doe",
        sex: "Male",
        phone: "123-456-7890",
        city: "New York",
    };

    async function handleAdd(event) {
        const u = event.detail;
        console.log("Added appointment:", u);
        const query = `INSERT INTO Appointment (date, cause_of_visit, examiner, patient) VALUES (${u.date}, '${u.selectedCause}', ${u.selectedDoctor}, ${u.selectedPatientId});`;
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
                M.toast({ html: "🥳 Appointment added! Reload" });
                M.toast({ html: "✔️ SQL Query Added to Logs" });

                const modalElem = document.getElementById(
                    "add-appointment-modal",
                );
                M.Modal.getInstance(modalElem).close();
            } else M.toast({ html: "❌ Oh oh! Could not add Patient" });
        } catch (error) {
            console.log(error);
            M.toast({ html: "❌ Something went wrong" });
        }
    }

    const handleUpdate = (event) => {
        const u = event.detail;
        const index = allAppointments.findIndex((a) => a.ap_id == u.ap_id);
        if (index != -1) {
            allAppointments[index].dateString = u.date;
            allAppointments[index].doctor = u.doctor;
            allAppointments[index].prescriptions = u.prescriptions;
            allAppointments[index].prescription = u.prescription;
            allAppointments[index].bill = u.bill;
        }

        const modalElem = document.getElementById("edit-appointment-modal");
        M.Modal.getInstance(modalElem).close();
        clearSearch();
        allAppointments = allAppointments;
    };

    let color;
    let name = "";
    let phone = "";
    let city = "";
    let date = "";
    let doctor = "";
    let visited = false;

    let doctors = [];
    let prescriptions = [];
    let patients = [];
    let addedPrescriptions;

    function openEditAppointmentModal(appointment) {
        selectedAppointment = appointment;
        selectedAppointment.patient = capitalizeWords(
            selectedAppointment.patient,
        );
        addedPrescriptions = selectedAppointment.prescriptions
            ? selectedAppointment.prescriptions.split(",").map(Number)
            : [];
        visited = addedPrescriptions.length > 0;

        const modalElem = document.getElementById("edit-appointment-modal");
        M.Modal.getInstance(modalElem).open();
        console.log("here: ", appointment);
    }

    function openAddAppointmentModal() {
        isLoadingPatients = true;
        const modalElem = document.getElementById("add-appointment-modal");
        M.Modal.getInstance(modalElem).open();
        getAllPatients().then((data) => {
            patients = data;
            const updated = [
                ...$sqlLogs,
                {
                    query: LIST_ALL_PATIENTS_QUERY,
                    date: new Date().toString().substring(0, 21),
                },
            ];
            sqlLogs.set(updated);
            M.toast({ html: "✔️ SQL Query Added to Logs" });
            isLoadingPatients = false;
        });
    }

    const deleteAppointment = async () => {
        if (selectedAppointment) {
            const query = `DELETE FROM Appointment WHERE ap_id = ${selectedAppointment.ap_id};`;
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
                    M.toast({ html: "✅ Appointment Deleted" });
                    M.toast({ html: "✔️ SQL Query Added to Logs" });

                    let index = allAppointments.findIndex(
                        (p) => p.ap_id == selectedAppointment.ap_id,
                    );
                    if (index !== -1) allAppointments.splice(index, 1);
                    clearSearch();
                    // allAppointments.splice(
                    //     allAppointments.findIndex(
                    //         (p) => p.ap_id == selectedAppointment.ap_id,
                    //     ),
                    //     1,
                    // );

                    appointments = appointments;
                } else
                    M.toast({ html: "❌ Oh oh! Could not delete Appointment" });
            } catch (error) {
                console.log(error);
                M.toast({ html: "❌ Something went wrong" });
            }

            const modalElem = document.getElementById("edit-appointment-modal");
            M.Modal.getInstance(modalElem).close();
        }
    };

    // Initialize Materialize select after mount
    onMount(() => {
        const elems = document.querySelectorAll("select");
        M.FormSelect.init(elems);
    });

    function handleSearch() {
        appointments = allAppointments.filter((appt) => {
            return (
                (!name ||
                    appt.patient
                        .trim()
                        .toLowerCase()
                        .includes(name.toLowerCase())) &&
                (!date ||
                    appt.dateString.includes(
                        new Date(date).toLocaleDateString(),
                    )) &&
                (!phone || appt.phone.trim().includes(phone)) &&
                (!city ||
                    appt.city.toLowerCase().includes(city.toLowerCase())) &&
                (!doctor || appt.doc_id == doctor)
            );
        });
    }

    function openDeleteAppointmentModal(appt) {
        const modalElem = document.getElementById("confirm-modal");
        M.Modal.getInstance(modalElem).open();
        selectedAppointment = appt;
    }

    const deleteWrapper = (event) => {
        const appt = event.detail.appointment;
        if (appt) openDeleteAppointmentModal(appt);
    };

    function clearSearch() {
        name = date = city = phone = doctor = "";
        handleSearch();
    }

    onMount(() => {
        M.Tabs.init(document.querySelectorAll(".tabs"));
        M.Modal.init(document.querySelectorAll(".modal"));
        M.FormSelect.init(document.querySelectorAll("select"));

        if (browser) {
            loading = true;
            color = $accentColor;
            getAllAppointments().then((data) => {
                console.log(data);
                allAppointments = data;
                appointments = data;

                const updated = [
                    ...$sqlLogs,
                    {
                        query: LIST_ALL_APPOINTMENTS_QUERY,
                        date: new Date().toString().substring(0, 21),
                    },
                ];
                sqlLogs.set(updated);
                M.toast({ html: "✔️ SQL Query Added to Logs" });

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
                    });
                });
            });
        }
    });

    afterUpdate(() => {
        const selects = document.querySelectorAll("select");
        M.FormSelect.init(selects);
    });
</script>

<a
    on:click={() => openAddAppointmentModal()}
    style="position: fixed; bottom: 7rem; right: 20px; z-index: 100;"
    class="btn-floating btn-large waves-effect waves-light {color}"
    ><i class="material-icons">add</i></a
>

<!-- Confirm Delete Modal -->
<ConfirmModal onDelete={() => deleteAppointment()} />

<!-- Edit Appointment Modal Component -->
<EditAppointmentModal
    bind:appointment={selectedAppointment}
    {doctors}
    {prescriptions}
    {addedPrescriptions}
    bind:visited
    on:save={handleUpdate}
    on:deleteAppointment={deleteWrapper}
/>

<!-- Add Appointment Modal -->
<AddAppointmentModal
    bind:isLoadingPatients
    bind:doctors
    bind:patients
    on:save={handleAdd}
/>

<div class="form-container z-depth-2 white" style="max-width: 80rem;">
    <h5 class="form-title">Appointment Search</h5>

    <div class="row">
        <div class="input-field col s12">
            <input id="name" type="text" bind:value={name} />
            <label for="name">Patient's Name</label>
        </div>

        <div class="input-field col s12">
            <input id="phone" type="tel" bind:value={phone} />
            <label for="phone">Phone Number</label>
        </div>

        <div class="input-field col s12">
            <select bind:value={city}>
                <option value="" disabled selected>Select City</option>
                {#each cities as c}
                    <option value={c}>{c}</option>
                {/each}
            </select>
            <label>City</label>
        </div>

        <div class="input-field col s12">
            <input id="date" type="date" bind:value={date} />
            <label for="date">Date</label>
        </div>

        <div class="input-field col s12">
            <select bind:value={doctor}>
                <option value="" disabled selected>Select Doctor</option>
                {#each doctors as d}
                    <option value={d.doc_id}>{d.name}</option>
                {/each}
            </select>
            <label>Doctor</label>
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

<!-- Appointments List -->
<div>
    <h4 style="margin-left: 2rem;" class="mt-2">Appointments</h4>
    <div class="appointments-container" style="margin-bottom: 8rem;">
        {#if loading}
            <div style="text-align: center;">
                <div class="preloader-wrapper big active">
                    <div class="spinner-layer spinner-blue-only">
                        <div class="circle-clipper left">
                            <div class="circle"></div>
                        </div>
                        <div class="gap-patch">
                            <div class="circle"></div>
                        </div>
                        <div class="circle-clipper right">
                            <div class="circle"></div>
                        </div>
                    </div>
                </div>
            </div>
        {:else if appointments.length == 0}
            <h5 class="grey-text" style="text-align: center;">
                No Appointments to Display
            </h5>
        {:else}
            {#each appointments as appt}
                <div class="appointment-card">
                    <div class="appointment-field">
                        <i class="material-icons">event</i>
                        <b>Patient:</b>&nbsp; {capitalizeWords(appt.patient)}
                    </div>
                    <div class="appointment-field">
                        <i class="material-icons">event</i>
                        <b>Time:</b>&nbsp; {appt.dateString}
                    </div>
                    <div class="appointment-field">
                        <i class="material-icons">healing</i>
                        <b>Cause of Visit:</b>&nbsp; {appt.cause}
                    </div>
                    <div class="appointment-field">
                        <i class="material-icons">person</i>
                        <b>Examined By:</b> &nbsp;{appt.doctor}
                    </div>
                    <div class="appointment-field">
                        <i class="material-icons">attach_money</i>
                        <b>Doctor's Fee:</b> &nbsp;Rs. {appt.fee}
                    </div>
                    <div class="appointment-field">
                        <i class="material-icons">local_hospital</i>
                        <b>Medical Bill:</b>&nbsp; Rs. {appt.bill
                            ? appt.bill
                            : 0}
                    </div>
                    <div class="appointment-field">
                        <i class="material-icons">description</i>
                        <b>Prescription:</b> &nbsp;{appt.prescription
                            ? appt.prescription
                            : 0}
                    </div>
                    <div class="appointment-field">
                        <button
                            on:click={() => openEditAppointmentModal(appt)}
                            class="btn waves-effect waves-light inside-card {color} shadow-lg text-white"
                            style="border-radius: 5px; color: white; text-transform: uppercase; width: 100%; margin: 0.2rem; border: none;"
                            ><i class="reverse material-icons">edit</i>
                            <span>Edit</span></button
                        >
                    </div>
                    <div class="appointment-field">
                        <button
                            on:click={() => openDeleteAppointmentModal(appt)}
                            class="btn waves-effect waves-light inside-card red shadow-lg text-white"
                            style="border-radius: 5px; color: white; text-transform: uppercase; width: 100%; margin: 0.2rem; border: none;"
                            ><i class="reverse material-icons">delete</i>
                            <span>Delete</span></button
                        >
                    </div>
                </div>
            {/each}
        {/if}
    </div>
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

    .appointments-container {
        max-height: 300px;
        overflow-y: auto;

        padding: 1rem;
    }

    .appointment-card {
        display: inline-block; /* key for horizontal scroll */
        vertical-align: top;
        width: 300px; /* or any fixed width */
        margin-right: 1rem;
        margin-bottom: 1rem;
        background: #f9f9f9;
        padding: 1rem;
        border-left: 4px solid #26a69a;
        border-radius: 6px;
        white-space: normal; /* allow internal wrapping */
    }

    .appointment-field {
        display: flex;
        align-items: center;
        margin: 0.3rem 0;
    }

    .appointment-field i {
        margin-right: 0.5rem;
        color: #42a5f5;
    }

    .appointment-field i.reverse {
        color: #fff;
        margin: 0;
    }

    button.inside-card {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.4rem;
        gap: 0.5rem;
    }
</style>
