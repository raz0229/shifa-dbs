<script>
  import { accentColor, storeInfo } from "$lib/stores";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { PUBLIC_SERVER_URL } from "$env/static/public";
  import Modal from "$lib/components/Modal.svelte";

  let showModal = false;

  let color = $accentColor;
  let loading = true;
  let storeInfoTemp;
  let table_data;
  
  function fetch_stats() {
      if (browser) {
          loading = true;
          storeInfoTemp = $storeInfo;
          const endpoint = `${PUBLIC_SERVER_URL}/order/stats-by-supplier?storeId=${storeInfoTemp._id}`;
          fetch(endpoint, {
              headers: {
                  accept: "application/json, text/plain, */*",
              },
              method: "GET",
          }).then((res) =>
              res.json().then((dat) => {
                  table_data = dat.result;
                  loading = false;
              }),
          );
      }
  }

  onMount(() => {
      if (browser) {
          fetch_stats()
      }
  });

</script>


<div class="row container">
  <div class="col s12">
     

      <div class="table-container">
          {#if !loading}
              <table class="striped">
                  <thead>
                      <tr>
                          <th>Order Date</th>
                          <th>Order Number</th>
                          <th>Status</th>
                          <th>Amount to Pay</th>
                          <th>Total Amount</th>
                          <th>Factory Profit</th>
                          <th>Payment</th>
                      </tr>
                  </thead>

                  <tbody>
                      {#each table_data as entry}
                          <tr>
                              <td>{entry.orderDate.substring(0,10)}</td>
                              <td>{entry.orderNumber}</td>
                              <td>{entry.status}</td>
                              <td>{entry.supplierAmountToPay}</td>
                              <td>{entry.totalAmount}</td>
                              <td>{entry.companyProfitTotal}</td>
                              <td>{entry.paymentStatus}</td>
                          </tr>
                      {/each}
                  </tbody>
              </table>
          {:else}
              <div class="loader-container">
                  <div class="preloader-wrapper big active">
                      <div class="spinner-layer spinner-{color}-only">
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
          {#if table_data?.length == 0}
              <div style="text-align: center;" class="no-data">
                  <img src="/no_data.png" alt="x_x No Data" />
              </div>
          {/if}
      </div>
  </div>
</div>

<style>

  .table-container {
      /* max-height: 60vh; */
      overflow-y: auto;
      /* margin-bottom: 20px; */
  }

  .loader-container {
      width: 100%;
      text-align: center;
      padding: 3rem;
  }

  td {
      padding: 1rem;
  }

  .no-data img {
      width: 20rem;
      filter: hue-rotate(45deg);
  }
</style>
