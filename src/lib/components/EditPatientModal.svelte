<script>
  import { onMount, createEventDispatcher, afterUpdate } from "svelte";
  import { accentColor } from "$lib/stores";
  import { cities } from "$lib/config/controllers";

  export let patient = {
    name: "",
    sex: "",
    phone: "",
    city: "",
  };

  let color;

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
      patient.name.trim().length == 0 ||
      patient.city.trim().length == 0 ||
      patient.phone.trim().length == 0 ||
      patient.sex.trim().length == 0
    )
      M.toast({ html: "❌ All fields are required" });
    else {
      dispatch("save", {
        id: patient.id,
        name: patient.name.trim().toLowerCase(),
        sex: patient.sex.trim(),
        phone: patient.phone.trim(),
        city: patient.city.trim(),
      }); // send updated patient to parent
      M.Modal.getInstance(modalElem).close();
    }
  }

  afterUpdate(() => {
        const selects = document.querySelectorAll("select");
        M.FormSelect.init(selects);
  });
</script>

<!-- Modal Structure -->
<div bind:this={modalElem} id="edit-patient-modal" class="modal">
  <div class="modal-content">
    <h5 style="margin-bottom: 2rem;">Edit Patient</h5>

    <div class="input-field" style="margin-bottom: 3rem">
      <input id="name" type="text" bind:value={patient.name} />
      <label for="name" class="active">Name</label>
    </div>

    <div class="input-field" style="margin-bottom: 3rem">
      <select bind:value={ patient.sex }>
        <option value="" disabled>Choose Sex</option>
        <option value="M">Male</option>
        <option value="F">Female</option>
      </select>
      <label class="active">Sex</label>
    </div>

    <div class="input-field" style="margin-bottom: 3rem">
      <input id="phone" type="tel" bind:value={patient.phone} />
      <label for="phone" class="active">Phone</label>
    </div>

    <div class="input-field">
      <select bind:value={patient.city}>
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
    <a class="btn {color}" on:click={save}>Save</a>
  </div>
</div>
