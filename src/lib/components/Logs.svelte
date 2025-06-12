<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { sqlLogs } from "$lib/stores";

  $: $sqlLogs;
  let logs = [];

  onMount(() => {
    if (browser) {
        logs = $sqlLogs;
        logs = logs.reverse();
    }
  });


  function clearLogs() {
    logs = [];
    sqlLogs.set([])
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code&display=swap');

  .logs-container {
    /* height: 300px; */
    overflow-y: auto;
    /* border: 1px solid #e0e0e0; */
    padding: 1rem;
    /* background-color: #fafafa; */
    border-radius: 8px;
  }

  .log-entry {
    background-color: #eeeeee;
    padding: 1rem;
    margin-bottom: 1rem;
    font-family: 'Fira Code', monospace;
    overflow-x: auto;
    white-space: pre;
    border-radius: 6px;
    position: relative;
  }

  .log-date {
    font-size: 0.85rem;
    color: #757575;
    text-align: right;
    margin-top: 0.5rem;
  }

  .clear-btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
  }

  .log-scroll-wrapper {
    overflow-x: auto;
  }
</style>

<div class="clear-btn" style="margin: 2rem;">
  <button class="btn red lighten-1" on:click={clearLogs}>
    <i class="material-icons right">delete_sweep</i>
    Clear Logs
  </button>
</div>

<div class="logs-container">
  {#if logs.length === 0}
    <p class="center grey-text"><img style="max-width: 250px;" src="/no_data.png" alt="No Logs"></p>
  {:else}
    {#each logs as log}
      <div class="log-entry">
        <div class="log-scroll-wrapper">
          {log.query}
        </div>
      </div>
    <div style="margin-bottom: 2rem;" class="log-date">{log.date}</div>
    {/each}
  {/if}
</div>
