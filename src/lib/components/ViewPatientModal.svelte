<script>
  import { onMount } from 'svelte';

  export let patient = {
    name: 'John Doe',
    sex: 'Male',
    phone: '123-456-7890',
    city: 'New York'
  };

  export let appointments = [
    {
      date: '2025-06-01T10:30',
      cause: 'Flu & Cold',
      doctor: 'Dr. Smith',
      fee: 500,
      bill: 1200,
      prescription: 'Rest, fluids, paracetamol'
    },
    {
      date: '2025-05-10T15:00',
      cause: 'Back Pain',
      doctor: 'Dr. Jane Roe',
      fee: 700,
      bill: 1500,
      prescription: 'Ibuprofen, posture correction'
    }
  ];

  let modalElem;

  onMount(() => {
    M.Modal.init(modalElem);
  });

  function formatDate(datetime) {
    const date = new Date(datetime);
    return date.toLocaleString();
  }
</script>

<style>
  .profile-header {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
  }

  .profile-header i {
    font-size: 4rem;
    margin-right: 1rem;
    color: #607d8b;
  }

  .profile-details .info-line {
    display: flex;
    align-items: center;
    margin: 0.2rem 0;
    font-size: 1rem;
  }

  .profile-details .info-line i {
    margin-right: 0.5rem;
    color: #26a69a;
    font-size: xx-large;
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
</style>

<!-- Modal Structure -->
<div bind:this={modalElem} id="view-patient-modal" class="modal modal-fixed-footer">
  <div class="modal-content">
    <!-- Patient Profile -->
    <div class="profile-header">
      <i class="material-icons">account_circle</i>
      <div class="profile-details">
        <h5>{patient.name}</h5>
        <div class="info-line"><i class="material-icons">wc</i> {patient.sex}</div>
        <div class="info-line"><i class="material-icons">phone</i> {patient.phone}</div>
        <div class="info-line"><i class="material-icons">location_city</i> {patient.city}</div>
      </div>
    </div>

    <!-- Appointments List -->
    <h6 class="mt-2">Appointments</h6>
    <div class="appointments-container">
      {#each appointments as appt}
        <div class="appointment-card">
          <div class="appointment-field">
            <i class="material-icons">event</i>
            <b>Date:</b>&nbsp; {formatDate(appt.date)}
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
        </div>
      {/each}
    </div>
  </div>

  <div class="modal-footer">
    <a class="modal-close btn-flat">Close</a>
  </div>
</div>
