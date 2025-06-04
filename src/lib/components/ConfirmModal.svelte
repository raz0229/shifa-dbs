<script>
  import { onMount } from 'svelte';

  let modalElem;

  onMount(() => {
    const modalInstance = M.Modal.init(modalElem, {
      opacity: 0.5,
      inDuration: 250,
      outDuration: 200
    });
  });

  export let onDelete = () => {};
</script>

<!-- Modal Structure -->
<div bind:this={modalElem} id="confirm-modal" class="modal">
  <div class="modal-content center-align">
    <h5 class="red-text text-darken-2">Are you sure?</h5>
    <p class="grey-text text-darken-1">This action cannot be restored.</p>
  </div>
  <div class="modal-footer">
    <a href="#!" class="modal-close waves-effect waves-green btn-flat grey-text text-darken-2">Cancel</a>
    <a href="#!" 
       class="modal-close waves-effect waves-light btn red darken-2 white-text" 
       on:click={onDelete}>
      Delete
    </a>
  </div>
</div>

<style>
  .modal {
    max-width: 400px;
    border-radius: 8px;
  }

  .modal-content {
    padding: 24px;
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
    padding: 16px 24px;
    margin-bottom: 1rem;
  }

  @media (max-width: 500px) {
    .modal-footer {
      gap: 10px;
    }
  }
</style>
