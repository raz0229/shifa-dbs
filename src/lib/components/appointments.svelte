<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { browser } from "$app/environment";
    import { accentColor, storeInfo } from "$lib/stores";
    import EditAppointmentModal from "$lib/components/EditAppointmentModal.svelte";
    import AddAppointmentModal from "./AddAppointmentModal.svelte";

    let samplePatient = {
        name: "John Doe",
        sex: "Male",
        phone: "123-456-7890",
        city: "New York",
    };

    let appointments = [
        {
            patient: "Talha Abid",
            date: "2025-06-01T10:30",
            cause: "Flu & Cold",
            doctor: "Dr. Smith",
            fee: 500,
            bill: 1200,
            prescription: "Rest, fluids, paracetamol",
        },
        {
            patient: "Ali Adam",
            date: "2025-05-10T15:00",
            cause: "Back Pain",
            doctor: "Dr. Jane Roe",
            fee: 700,
            bill: 1500,
            prescription: "Ibuprofen, posture correction",
        },
    ];

    let selectedPatient = {
        name: "John Doe",
        sex: "Male",
        phone: "123-456-7890",
        city: "New York",
    };

    function formatDate(datetime) {
        const date = new Date(datetime);
        return date.toLocaleString();
    }

    function handleSave(event) {
        const updated = event.detail;
        console.log("Saved patient:", updated);
    }

    function handleAdd(event) {
        const updated = event.detail;
        console.log("Added patient:", updated);
    }

    let color;
    let storeInfoTemp;
    let name = "";
    let sex = "";
    let phone = "";
    let city = "";
    let date = "";
    let doctor = "";

    const cities = ["New York", "London", "Tokyo", "Sydney", "Paris"];
    const doctors = [
        "Dr. Ali Nawaz",
        "Dr. Abdurrehman",
        "Dr. Mirium Zain",
        "Dr. Mujahid Saleem",
        "Dr. Kamran",
    ];

    export let patients = [
        {
            name: "John Doe",
            sex: "Male",
            phone: "123-456-7890",
            city: "New York",
            visits: 5,
        },
        {
            name: "Jane Smith",
            sex: "Female",
            phone: "555-123-4567",
            city: "London",
            visits: 8,
        },
        {
            name: "Kenji Tanaka",
            sex: "Male",
            phone: "080-1234-5678",
            city: "Tokyo",
            visits: 3,
        },
    ];

    function openEditAppointmentModal(appointment) {
        console.log("Edit", appointment);
        const modalElem = document.getElementById("edit-appointment-modal");
        M.Modal.getInstance(modalElem).open();
    }

    function openAddAppointmentModal() {
        console.log('add appointment')
        const modalElem = document.getElementById("add-appointment-modal");
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
    });

    function handleSearch() {
        console.log({ name, sex, phone, city });
        // Implement your actual search logic here
    }

    onMount(() => {
        M.Tabs.init(document.querySelectorAll(".tabs"));
        M.Modal.init(document.querySelectorAll(".modal"));
        M.FormSelect.init(document.querySelectorAll("select"));

        if (browser) {
            color = $accentColor;
            storeInfoTemp = $storeInfo;
        }
    });
</script>

<a
    on:click={() => openAddAppointmentModal()}
    style="position: fixed; bottom: 7rem; right: 20px; z-index: 100;"
    class="btn-floating btn-large waves-effect waves-light {color}"
    ><i class="material-icons">add</i></a
>

<!-- Edit Patient Modal Component -->
<EditAppointmentModal bind:patient={selectedPatient} on:save={handleSave} />

<!-- Add Patient Modal -->
<AddAppointmentModal bind:patient={selectedPatient} on:save={handleAdd} />

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
                {#each doctors as c}
                    <option value={c}>{c}</option>
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
    </div>
</div>

    <!-- Appointments List -->
<div>
    <h4 style="margin-left: 2rem;" class="mt-2">Appointments</h4>
    <div class="appointments-container" style="margin-bottom: 8rem;">
      {#each appointments as appt}
        <div class="appointment-card">
        <div class="appointment-field">
            <i class="material-icons">event</i>
            <b>Patient:</b>&nbsp; {appt.patient}
          </div>
          <div class="appointment-field">
            <i class="material-icons">event</i>
            <b>Time:</b>&nbsp; {formatDate(appt.date)}
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
            <b>Medical Bill:</b>&nbsp; Rs. {appt.bill}
          </div>
          <div class="appointment-field">
            <i class="material-icons">description</i>
            <b>Prescription:</b> &nbsp;{appt.prescription}
          </div>
          <div class="appointment-field">
            <button on:click={openEditAppointmentModal} class="btn waves-effect waves-light inside-card {color} shadow-lg text-white" style="border-radius: 5px; color: white; text-transform: uppercase; width: 100%; margin: 0.2rem; border: none;"><i class="reverse material-icons">edit</i> <span>Edit</span></button>
          </div>
          <div class="appointment-field">
            <button class="btn waves-effect waves-light inside-card red shadow-lg text-white" style="border-radius: 5px; color: white; text-transform: uppercase; width: 100%; margin: 0.2rem; border: none;"><i class="reverse material-icons">delete</i> <span>Delete</span></button>
          </div>
        </div>
      {/each}
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

.appointment-field  i.reverse {
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
