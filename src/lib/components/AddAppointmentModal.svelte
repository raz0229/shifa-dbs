<script>
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { accentColor } from "$lib/stores";

  let doctors = [
    { name: "Dr. Smith", fee: 100 },
    { name: "Dr. Johnson", fee: 120 },
    { name: "Dr. Taylor", fee: 90 },
  ];

  let cause_of_visits = [
    "Seasonal Allergies",
    "Routine Check-up",
    "Fever and Sore Throat",
    "Migraine",
    "Skin Rash",
    "Stomach Pain",
    "Back Pain",
    "Insomnia",
    "Minor Injury",
    "Chronic Fatigue",
    "Joint Pain",
    "Urinary Tract Infection",
    "Anxiety/Depression",
  ];

  let selectedDoctor = doctors[0];
  let selectedCause = cause_of_visits[0];

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
</script>

<!-- Modal Structure -->
<div id="add-appointment-modal" class="modal">
  <div class="modal-content">
    <!-- Top Container -->
    <div class="top-container">
      <div>
        <i class="material-icons appointment-icon">event_note</i>
      </div>

      <div class="form-fields">
        <div class="input-field">
          <input
            type="date"
            bind:value={appointmentDate}
            id="appointment_date"
          />
          <label for="appointment_date" class="active">Date</label>
        </div>

        <div class="input-field">
          <input type="text" bind:value={patientName} id="patient_name" />
          <label for="patient_name" class="active">Patient's Name</label>
        </div>

        <div class="input-field">
          <select
            bind:value={selectedCause}
            on:change={() =>
              (selectedCause = cause_of_visits.find(
                selectedCause
              ))}
          >
            {#each cause_of_visits as cov}
              <option value={cov}>{cov}</option>
            {/each}
          </select>
          <label>Cause of Visit/Ailment</label>
        </div>

        <div class="input-field">
          <select
            bind:value={selectedDoctor}
            on:change={() =>
              (selectedDoctor = doctors.find(
                (d) => d.name === selectedDoctor.name,
              ))}
          >
            {#each doctors as doc}
              <option value={doc}>{doc.name}</option>
            {/each}
          </select>
          <label>Doctor</label>
        </div>

        <div class="input-field">
          <input
            type="number"
            value={selectedDoctor.fee}
            disabled
            id="doctor_fee"
          />
          <label for="doctor_fee" class="active">Doctor's Fee</label>
        </div>
      </div>
    </div>

    <div class="appointment-field">
      <button
        class="inside-card waves-effect waves-light btn {color} shadow-lg text-white"
        style="border-radius: 5px; color: white; text-transform: uppercase; width: 100%; margin: 0.2rem; padding: 0.4rem; display: flex; align-items: center; justify-content: center; gap: 1rem; border: none;"
        ><i class="reverse material-icons">save</i>
        <span>Add Appointment</span></button
      >
    </div>
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
</style>
