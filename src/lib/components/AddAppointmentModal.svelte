<script>
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { accentColor, sqlLogs } from "$lib/stores";
  import { capitalizeWords } from "$lib/config/controllers";

  export let isLoadingPatients = false;
  let addApButtonDisabled = true;

  export let doctors = [];
  export let patients = [];

  $: $sqlLogs;

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

  let selectedDoctor;
  let selectedCause = cause_of_visits[0];
  let doctor_fee = 0;
  let appointmentDate = "";
  let color;

  let inputValue = "";
  let suggestions = [];
  let selectedPatientId = null;
  let showSuggestions = false;

  $: suggestions = inputValue
    ? patients
        .filter((p) => p.name.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 5)
    : [];

  $: addApButtonDisabled =
    selectedPatientId == null ||
    doctor_fee == 0 ||
    appointmentDate.length == 0 ||
    selectedCause.length == 0 ||
    selectedDoctor == undefined;

  function selectSuggestion(patient) {
    inputValue = patient.name;
    selectedPatientId = patient.id;
    showSuggestions = false;
  }

  function handleInput(e) {
    inputValue = e.target.value;
    selectedPatientId = null;
    showSuggestions = true;
  }

  function handleBlur() {
    // Ensure a valid patient is selected
    const match = patients.find(
      (p) => p.name.toLowerCase() === inputValue.toLowerCase(),
    );
    if (!match) {
      inputValue = "";
      selectedPatientId = null;
    } else {
      selectedPatientId = match.id;
    }
    showSuggestions = false;
  }

  async function addAppointment() {
    if (
      doctor_fee != 0 &&
      appointmentDate.length != 0 &&
      selectedCause.length != 0 &&
      selectedPatientId != null &&
      selectedDoctor != undefined
    ) {
      const query = `INSERT INTO Appointment (date, cause_of_visit, examiner, patient) VALUES (${new Date(appointmentDate).getTime() / 1000}, '${selectedCause}', ${selectedDoctor}, ${selectedPatientId});`;
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
          M.toast({ html: "🥳 Sucessfully added Appointment" });
          M.toast({ html: "✔️ SQL Query Added to Logs" });

          location.reload();
        } else M.toast({ html: "❌ Oh oh! Could not add Patient" });
      } catch (error) {
        console.log(error);
        M.toast({ html: "❌ Something went wrong" });
      }
    }
    console.log(
      doctor_fee,
      appointmentDate,
      selectedCause,
      selectedDoctor,
      selectedPatientId,
    );
  }

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
    {#if !isLoadingPatients}
      <!-- Top Container -->
      <div class="top-container">
        <div>
          <i class="material-icons appointment-icon">event_note</i>
        </div>

        <div class="form-fields">
          <div class="input-field">
            <input
              type="datetime-local"
              bind:value={appointmentDate}
              id="appointment_date"
            />
            <label for="appointment_date" class="active">Date</label>
          </div>

          <div class="input-field input-wrapper">
            <input
              type="text"
              id="patient_name"
              bind:value={inputValue}
              on:input={handleInput}
              on:blur={handleBlur}
              autocomplete="off"
            />
            <label for="patient_name" class="active">Patient's Name</label>

            {#if showSuggestions && suggestions.length > 0}
              <ul class="autocomplete-list">
                {#each suggestions as patient}
                  <li
                    class="autocomplete-item"
                    on:mousedown={() => selectSuggestion(patient)}
                  >
                    {capitalizeWords(patient.name)}
                  </li>
                {/each}
              </ul>
            {/if}
          </div>

          <div class="input-field">
            <select bind:value={selectedCause}>
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
                (doctor_fee = doctors.find(
                  (d) => d.doc_id == selectedDoctor,
                )?.fee)}
            >
              <option value="" selected disabled>Select Doctor</option>
              {#each doctors as doc}
                <option value={doc.doc_id}>{doc.name}</option>
              {/each}
            </select>
            <label>Doctor</label>
          </div>

          <div class="input-field">
            <input type="number" value={doctor_fee} disabled id="doctor_fee" />
            <label for="doctor_fee" class="active">Doctor's Fee</label>
          </div>
        </div>
      </div>
    {:else}
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
    {/if}
    <div class="appointment-field">
      <button
        disabled={addApButtonDisabled}
        on:click={addAppointment}
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

  .autocomplete-list {
    position: absolute;
    top: 2rem;
    z-index: 1000;
    background: white;
    border: 1px solid #ddd;
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
  }

  .autocomplete-item {
    padding: 10px;
    cursor: pointer;
  }

  .autocomplete-item:hover {
    background-color: #f0f0f0;
  }

  .input-wrapper {
    position: relative;
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
