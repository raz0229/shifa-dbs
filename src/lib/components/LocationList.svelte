<script>
  // Expects an object like: { "New York": 75, "London": 50, ... }
  export let data = {
    "New York": 75,
    "London": 50,
    "Tokyo": 90
  };
</script>

<style>
  .city-row {
    margin-bottom: 2rem;
  }

  .city-label {
    font-weight: 500;
    margin-bottom: 0.3rem;
  }

  .progress {
    background-color: #e0e0e0;
  }

  .determinate {
    background-color: #26a69a; /* Materialize teal lighten-1 */
  }
</style>

<div class="container">
  {#each Object.entries(data) as [city, value]}
    <div class="city-row">
      <div class="city-label">{city}</div>
      <div class="progress">
        <div
          class="determinate"
          style="width: {Math.min(Math.max(value, 0), 100)}%;"
        ></div>
      </div>
    </div>
  {/each}
</div>
