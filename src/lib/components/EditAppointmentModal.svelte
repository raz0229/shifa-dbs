<script>
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { accentColor } from "$lib/stores";
  import { toDatetimeLocal } from "$lib/config/controllers";

  let visited = false;
  export let appointment;
  export let doctors = [];
  export let prescriptions = [];

  // export let selectedDoctor = { name: "Doc Oc", fee: 0};
  let selectedPrescription = { pres_id: 0, name: "Amoxicillin", price: 10 };
  export let addedPrescriptions = [];

  let appointmentDate = "";
  let patientName = "";
  let color;

  // Initialize Materialize components
  onMount(async () => {
    await tick();
    M.Modal.init(document.querySelectorAll(".modal"));
    M.FormSelect.init(document.querySelectorAll("select"));
    color = $accentColor;
  });

  function addPrescription() {
    if (
      selectedPrescription &&
      !addedPrescriptions.includes(selectedPrescription)
    ) {
      addedPrescriptions = [...addedPrescriptions, selectedPrescription];
    }
  }

  function getPresById(id) {
    const idx = prescriptions.findIndex(x=>x.pres_id == id)
    if (idx != -1)
      return prescriptions[idx]
    else
      return prescriptions[0]
  }

  $: medicalBill = addedPrescriptions.reduce((sum, p) => sum + getPresById(p).fee, 0);
  $: grandTotal = visited
    ? appointment.fee + medicalBill
    : appointment.fee;
  $: if (visited) {
    tick().then(() => {
      M.FormSelect.init(document.querySelectorAll("select"));
    });
  }

  const changeAppointmentDoctorFee = () => {
    appointment.fee =
      doctors[
        doctors.findIndex((doc) => doc.doc_id == appointment.doc_id)
      ]?.fee;
    appointment.doctor =
      doctors[
        doctors.findIndex((doc) => doc.doc_id == appointment.doc_id)
      ]?.name;
  };

  const changeAppointmentDate = (e) => {
    appointment.date = new Date(e.target.value).getTime() / 1000;
    appointment.dateString = new Date(e.target.value).toLocaleString();
  };
</script>

<!-- Modal Structure -->
<div id="edit-appointment-modal" class="modal modal-fixed-footer">
  <div class="modal-content">
    <!-- Top Container -->
    <div class="top-container">
      <div>
        <i class="material-icons appointment-icon">event_note</i>
      </div>

      <div class="form-fields">
        <div class="input-field">
          <input
            type="datetime-local"
            value={toDatetimeLocal(appointment.dateString)}
            on:change={changeAppointmentDate}
            id="appointment_date"
          />
          <label for="appointment_date" class="active">Date</label>
        </div>

        <div class="input-field">
          <input
            type="text"
            bind:value={appointment.patient}
            id="patient_name"
          />
          <label for="patient_name" class="active">Patient's Name</label>
        </div>

        {#if appointment.doc_id}
          <div class="input-field">
            <select
              bind:value={appointment.doc_id}
              on:change={changeAppointmentDoctorFee}
            >
              {#each doctors as doc}
                <option value={doc.doc_id}>{doc.name}</option>
              {/each}
            </select>
            <label>Doctor</label>
          </div>

          <div class="input-field">
            <input
              type="number"
              value={doctors[
                doctors.findIndex((doc) => doc.doc_id == appointment.doc_id)
              ]?.fee}
              disabled
              id="doctor_fee"
            />
            <label for="doctor_fee" class="active">Doctor's Fee</label>
          </div>
        {/if}
      </div>
    </div>

    <!-- Visited Toggle -->
    <div class="toggle-btn">
      <label>
        <input type="checkbox" bind:checked={visited} />
        <span>Visited</span>
      </label>
    </div>

    <!-- Expanded Fields if Visited -->
    {#if visited}
      <div class="section">
        <h6>Prescriptions</h6>

        <div class="row">
          <div class="col s8">
            <div class="input-field">
              <select bind:value={selectedPrescription}>
                {#each prescriptions as presc}
                  <option value={presc.pres_id}>{presc.name} (Rs. {presc.fee})</option
                  >
                {/each}
              </select>
              <label>Select Prescription</label>
            </div>
          </div>
          <div class="col s4">
            <button
              class="btn-small {color}"
              type="button"
              on:click={addPrescription}
            >
              <i class="material-icons">add</i>
            </button>
          </div>
        </div>

        <!-- List of Prescriptions -->
        <ul class="prescription-list">
          {#each addedPrescriptions as p}
            <li>{getPresById(p).name} - Rs. {getPresById(p).fee}</li>
          {/each}
        </ul>

        <!-- Medical Bill & Grand Total -->
        <div class="row">
          <div class="col s6">
            <h5><b>Medical Bill:</b> PKR {medicalBill}</h5>
          </div>
          <div class="col s6">
            <h5><b>Grand Total:</b> PKR {grandTotal}</h5>
          </div>
        </div>
      </div>
    {/if}

    <div class="appointment-field">
      <button
        class="inside-card waves-effect waves-light btn {color} shadow-lg text-white"
        style="border-radius: 5px; color: white; text-transform: uppercase; width: 100%; margin: 0.2rem; padding: 0.4rem; display: flex; align-items: center; justify-content: center; gap: 1rem; border: none;"
        ><i class="reverse material-icons">save</i>
        <span>Save Appointment</span></button
      >
    </div>
  </div>

  <!-- Modal Footer -->
  <div class="modal-footer modal-footer-actions">
    <a class="waves-effect waves-light btn blue">
      <i class="material-icons left">print</i> Print Receipt
    </a>
    <a class="waves-effect waves-light btn red">
      <i class="material-icons left">delete</i> Delete Appointment
    </a>
  </div>
</div>

<style>
  .top-container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 1rem;
  }

  .appointment-icon {
    font-size: 3rem;
    color: #26a69a;
  }

  .form-fields {
    flex: 1;
    min-width: 250px;
  }

  .toggle-btn {
    position: absolute;
    top: 10px;
    right: 20px;
  }

  .modal-footer-actions {
    display: flex;

    gap: 0.5rem;
  }

  @media (min-width: 600px) {
    .modal-footer-actions {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .prescription-list {
    list-style: none;
    padding-left: 0;
  }

  .prescription-list li {
    padding: 4px 0;
  }
</style>
