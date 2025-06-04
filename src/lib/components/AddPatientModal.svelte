<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { accentColor } from "$lib/stores";
  import { cities } from "$lib/config/controllers";

  let color;

  let patientName = "";
  let patientSex = "";
  let patientPhone = "";
  let patientCity = "";

  const dispatch = createEventDispatcher();

  let modalElem;

  onMount(() => {
    // Initialize Materialize modal and select
    const modal = M.Modal.init(modalElem);
    const selects = document.querySelectorAll("select");
    M.FormSelect.init(selects);
    color = $accentColor;
  });

  function save() {
    if (
      patientName.trim().length == 0 ||
      patientCity.trim().length == 0 ||
      patientPhone.trim().length == 0 ||
      patientSex.trim().length == 0
    )
      M.toast({ html: "❌ All fields are required" });
    else {
      dispatch("save", {
        name: patientName.trim().toLowerCase(),
        sex: patientSex.trim(),
        phone: patientPhone.trim(),
        city: patientCity.trim(),
      }); // send updated patient to parent
      M.Modal.getInstance(modalElem).close();
    }
  }
</script>

<!-- Modal Structure -->
<div bind:this={modalElem} id="add-patient-modal" class="modal">
  <div class="modal-content">
    <h5 style="margin-bottom: 2rem;">Add Patient</h5>

    <div class="input-field" style="margin-bottom: 3rem">
      <input id="name" type="text" bind:value={patientName} />
      <label for="name" class="active">Name</label>
    </div>

    <div class="input-field" style="margin-bottom: 3rem">
      <select bind:value={patientSex}>
        <option value="" disabled selected>Choose Sex</option>
        <option value="M">Male</option>
        <option value="F">Female</option>
      </select>
      <label class="active">Sex</label>
    </div>

    <div class="input-field" style="margin-bottom: 3rem">
      <input id="phone" type="tel" bind:value={patientPhone} />
      <label for="phone" class="active">Phone</label>
    </div>

    <div class="input-field">
      <select bind:value={patientCity}>
        <option value="" disabled selected>Select City</option>
        {#each cities as c}
          <option value={c}>{c}</option>
        {/each}
      </select>
      <label class="active">City</label>
    </div>
  </div>

  <div class="modal-footer">
    <a class="modal-close btn-flat">Cancel</a>
    <a class="btn {color}" on:click={save}>Add Patient</a>
  </div>
</div>
