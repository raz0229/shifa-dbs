<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { tick } from "svelte";
  import { accentColor, sqlLogs } from "$lib/stores";
  import html2canvas from "html2canvas";
  import { toDatetimeLocal } from "$lib/config/controllers";

  export let visited = false;
  export let appointment;
  export let doctors = [];
  export let prescriptions = [];

  const dispatch = createEventDispatcher();

  // export let selectedDoctor = { name: "Doc Oc", fee: 0};
  let selectedPrescription = { pres_id: 0, name: "Amoxicillin", price: 10 };
  export let addedPrescriptions = [];

  $: $sqlLogs;

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
    const idx = prescriptions.findIndex((x) => x.pres_id == id);
    if (idx != -1) return prescriptions[idx];
    else return prescriptions[0];
  }

  $: medicalBill = addedPrescriptions.reduce(
    (sum, p) => sum + getPresById(p).fee,
    0,
  );
  $: grandTotal = visited ? appointment.fee + medicalBill : appointment.fee;
  $: if (visited) {
    (async () => {
      await tick(); // wait for DOM update
      setTimeout(() => {
        M.FormSelect.init(document.querySelectorAll("select"));
      }, 0); // extra deferral to be safe with Materialize
    })();
  }

  function getPrescriptionNames(idList) {
    // Filter prescriptions by IDs and map to names
    const names = prescriptions
      .filter((prescription) => idList.includes(prescription.pres_id))
      .map((prescription) => prescription.name);

    // Join the names into a single string
    return names.join(", ");
  }

  const removePrescription = (id) => {
    addedPrescriptions.splice(addedPrescriptions.indexOf(id), 1);
    addedPrescriptions = addedPrescriptions;
  };

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

  const saveAppointment = async () => {
    console.log(appointment);
    if (appointment.date && appointment.doc_id && appointment.ap_id) {
      const query = `UPDATE Appointment SET date = ${appointment.date}, examiner = ${appointment.doc_id} WHERE ap_id = ${appointment.ap_id};`;
      const query2 = `DELETE FROM AppointmentPrescription WHERE ap_id = ${appointment.ap_id};`;
      const values = addedPrescriptions.map(
        (presId) => `(${appointment.ap_id}, ${presId})`,
      );
      const valuesClause = values.join(", ");
      const query3 = `INSERT INTO AppointmentPrescription (ap_id, pres_id) VALUES ${valuesClause};`;
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
          M.toast({ html: "✔️ SQL Query Added to Logs" });

          const response = await fetch("/api/query", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: query2,
            }),
          });

          const result = await response.json();
          if (result.success) {
            const updated = [
              ...$sqlLogs,
              {
                query: query2,
                date: new Date().toString().substring(0, 21),
              },
            ];
            sqlLogs.set(updated);
            M.toast({ html: "✅ Prescriptions Removed" });
            M.toast({ html: "✔️ SQL Query Added to Logs" });

            if (addedPrescriptions.length > 0) {
              const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  query: query3,
                }),
              });

              const result = await response.json();
              if (result.success) {
                const updated = [
                  ...$sqlLogs,
                  {
                    query: query3,
                    date: new Date().toString().substring(0, 21),
                  },
                ];
                sqlLogs.set(updated);
                M.toast({ html: "✅ Prescriptions Added" });
                M.toast({ html: "✔️ SQL Query Added to Logs" });
              } else M.toast({ html: "❌ Oh oh! Could not add Prescriptions" });
            }

            dispatch("save", {
              ap_id: appointment.ap_id,
              date: new Date(appointment.date * 1000).toLocaleString(),
              doctor: appointment.doctor,
              prescriptions: addedPrescriptions.join(),
              prescription: getPrescriptionNames(addedPrescriptions),
              bill: medicalBill,
            });
          } else M.toast({ html: "❌ Oh oh! Could not remove Prescriptions" });

          M.toast({ html: "✅ Appointment Updated" });
        } else M.toast({ html: "❌ Oh oh! Could not update Appointment" });
      } catch (error) {
        console.log(error);
        M.toast({ html: "❌ Something went wrong" });
      }
    } else {
      M.toast({ html: "❌ Error in one of the fields" });
    }
  };

  const changeAppointmentDate = (e) => {
    appointment.date = new Date(e.target.value).getTime() / 1000;
    appointment.dateString = new Date(e.target.value).toLocaleString();
  };

  function downloadHiddenReceipt() {
    const receipt = document.getElementById("hidden-receipt");

    html2canvas(receipt, {
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "medical-receipt.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  }
</script>

<!-- Hidden Receipt -->
<!-- Off-screen hidden receipt -->
<div id="hidden-receipt" style="position: absolute; left: -9999px; top: -9999px;">
  <div class="receipt-container z-depth-1">
    <div class="receipt-header">
      <img style="text-align: center; width: 15rem; filter: invert(1)" src="logo.png" alt="shifa-dbs">
      <p><a href="https://www.abcclinic.com" style="color: #000;">www.shifadbs.com</a></p>
    </div>

    <div>
      <div class="section-title">Patient Information</div>
      <table class="info-table">
        <tr>
          <td><strong>Name:</strong></td>
          <td>{ appointment.patient }</td>
        </tr>
        <tr>
          <td><strong>Phone:</strong></td>
          <td>{ appointment.phone }</td>
        </tr>
        <tr>
          <td><strong>Appointment:</strong></td>
          <td>{ appointment.dateString }</td>
        </tr>
        <tr>
          <td><strong>Doctor:</strong></td>
          <td>{ appointment.doctor }</td>
        </tr>
      </table>
    </div>

    <div>
      <div class="section-title">Billing Information</div>
      <table class="info-table">
        <tr>
          <td><strong>Doctor's Fee:</strong></td>
          <td>Rs. {appointment.fee}</td>
        </tr>
        <tr>
          <td><strong>Prescriptions:</strong></td>
          <td>
            <ul style="margin: 0; padding-left: 20px;">
              {#if appointment.prescription}
              {#each appointment.prescription.split(',') as pres}
              <li>{pres.trim()}</li>
              {/each}
              {:else}
              <li><em>Not Yet Advised</em></li>
              {/if}
            </ul>
          </td>
        </tr>
        <tr>
          <td><strong>Medical Bill:</strong></td>
          <td>Rs. { appointment.bill || 0 }</td>
        </tr>
        <tr class="total-row">
          <td><strong>Total:</strong></td>
          <td>Rs. { (appointment.fee + Number(appointment.bill)) || appointment.fee }</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <p>Thank you for visiting Shifa DBs</p>
    </div>
  </div>
</div>

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
            disabled
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
                  <option value={presc.pres_id}
                    >{presc.name} (Rs. {presc.fee})</option
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
            <li>
              <button
                on:click={() => removePrescription(p)}
                style="border: none; cursor: pointer;"
                class="z-depth-2 waves-effect red white-text">-</button
              >
              &nbsp; {getPresById(p).name} - Rs. {getPresById(p).fee}
            </li>
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
        on:click={saveAppointment}
        class="inside-card waves-effect waves-light btn {color} shadow-lg text-white"
        style="border-radius: 5px; color: white; text-transform: uppercase; width: 100%; margin: 0.2rem; padding: 0.4rem; display: flex; align-items: center; justify-content: center; gap: 1rem; border: none;"
        ><i class="reverse material-icons">save</i>
        <span>Save Appointment</span></button
      >
    </div>
  </div>

  <!-- Modal Footer -->
  <div class="modal-footer modal-footer-actions">
    <a
      on:click={downloadHiddenReceipt}
      class="waves-effect waves-light btn blue"
    >
      <i class="material-icons left">download</i> Print Receipt
    </a>
    <a
      on:click={() => dispatch("deleteAppointment", { appointment })}
      class="waves-effect waves-light btn red"
    >
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

    .receipt-container {
    width: 600px;
    padding: 20px;
    font-family: 'Courier New', monospace;
    color: #000;
    background: #fff;
    border: 1px solid #000;
  }

  .receipt-header {
    text-align: center;
    border-bottom: 2px dashed #000;
    margin-bottom: 20px;
    padding-bottom: 10px;
  }

  .section-title {
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 10px;
    text-decoration: underline;
  }

  .info-table td {
    padding: 4px 0;
  }

  .total-row td {
    font-weight: bold;
    border-top: 2px solid #000;
    padding-top: 8px;
  }
</style>
