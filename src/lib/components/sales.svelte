<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { accentColor, storeInfo } from "$lib/stores"
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import FetchOrders from "$lib/components/fetch-orders.svelte";
    
    const statuses = [
        {
            text: 'Delivered&paymentStatus=Paid',
            totalDocuments: 'Loading...'
        },
        {
            text: 'Returned',
            totalDocuments: 'Loading...'
        },
        {
            text: 'Cancelled',
            totalDocuments: 'Loading...'
        }
    ]
    let year = new Date().getFullYear();
    let globalDate = new Date();

    let color;
    let status;
    let storeInfoTemp;

    let total_delivered_amount=0;

    let datePrior = getSevenDaysPrior();
    let dateAfter = getSevenDaysAfter();

    onMount(() => {
        var elems = document.querySelectorAll('.tabs');
        M.Tabs.init(elems);

        if (browser) {
            storeInfoTemp = $storeInfo;
            color = $accentColor;
            statuses.forEach((stat, index) => {
                fetch(`${PUBLIC_SERVER_URL}/order/by/query?supplier_id=${storeInfoTemp?._id}&status=${stat.text}`, {
                headers: {
                    accept: "application/json, text/plain, */*",
                },
                method: "POST",
            }).then((res) =>
                res.json().then((dat) => {

                    // find total sales
                    if (index == 0) {
                        dat.data.forEach(elem => {
                            total_delivered_amount += elem.totalAmount;
                        })
                    }

                    statuses[index].totalDocuments = dat.totalDocuments;
                }),
            );
            })
        }
    })


    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let currentMonth = new Date().getMonth();


    function getSevenDaysPrior() {
        globalDate.setDate(globalDate.getDate() - 7);
        return globalDate.toDateString().substring(4,10)
    }

    function getSevenDaysAfter() {
        globalDate.setDate(globalDate.getDate() + 7);
        return globalDate.toDateString().substring(4,10);
    }

    function subMonth() {
        //currentMonth = currentMonth < 1 ? 10 : currentMonth - 1;
        dateAfter = datePrior;
        datePrior = getSevenDaysPrior();

    }

    function addMonth() {
        //currentMonth = currentMonth > 10 ? 0 : currentMonth + 1;
        datePrior = dateAfter;
        dateAfter = getSevenDaysAfter();
    }

</script>



<div 
style="display: grid; place-content: center;"
    
class="row">
    <div 
    style="width: 8rem;"
    class="input-field col s12">
    <select style="display: block;">
        <option value="{year-3}">{year-3}</option>
        <option value="{year-2}">{year-2}</option>
        <option value="{year-1}">{year-1}</option>
        <option selected value="{year}">{year}</option>
    </select>
    <label></label>
  </div>
</div>

<div class="s12 grey-text text-darken-1" style="display: flex; justify-content: space-evenly; width: 100%">
    <div on:click={subMonth} class="arrow-left"><i class="material-icons grey-text text-darken-1">arrow_back</i></div>
    <!-- <div class="months">Earned {months[currentMonth]} - {months[currentMonth == 11 ? 0 : currentMonth + 1]}</div> -->
    <div class="months">Earned {datePrior} - {dateAfter}</div>
    <div on:click={addMonth} class="arrow-right"><i class="material-icons grey-text text-darken-1">arrow_forward</i></div>
</div>

<div class="row">
    <!-- In Progress -->
    
    {#if !status}
    <div id="test1" class="col s12">
            <ul class="collection">
                <li 
                    on:click={()=>status=statuses[0].text}
                    class="collection-item avatar">
                  <i class="material-icons circle grey lighten-2 grey-text text-darken-2">local_shipping</i>
                  <span class="title grey-text text-darken-2"><b>Delivered</b></span>
                  <p>Items: <b>{statuses[0].totalDocuments} </b><br>
                  </p>
                  <p class="green-text"><b>Rs. {total_delivered_amount} </b><br>
                  </p>
                  <a href="#!" class="secondary-content"><i class="{color}-text material-icons">send</i></a>
                </li>
                <li 
                    on:click={()=>status=statuses[1].text}
                    class="collection-item avatar">
                  <i class="material-icons circle grey lighten-2 grey-text text-darken-2">warning</i>
                  <span class="title grey-text text-darken-2"><b>Failed Delivery Returned</b></span>
                  <p>Items: <b>{statuses[1].totalDocuments}</b> <br>
                  </p>
                  <a href="#!" class="secondary-content"><i class="{color}-text material-icons">send</i></a>
                </li>
                <li 
                    on:click={()=>status=statuses[2].text}
                    class="collection-item avatar">
                  <i class="material-icons circle grey lighten-2 grey-text text-darken-2">error</i>
                  <span class="title grey-text text-darken-2"><b>Cancelled</b></span>
                  <p>Items: <b>{statuses[2].totalDocuments}</b> <br>
                  </p>
                  <a href="#!" class="secondary-content"><i class="{color}-text material-icons">send</i></a>
                </li>
              </ul>
        </div>
    
    {:else}
    <FetchOrders bind:status/>
    {/if}
    

    



    
  </div>


<style>
    .row {
        margin-top: 10px;
    }
    li > a {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
</style>