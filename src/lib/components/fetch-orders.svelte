<script>
    import { accentColor, storeInfo } from "$lib/stores";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import Order from "./order.svelte";
    import Product from "./product.svelte";
    import Modal from "$lib/components/Modal.svelte";

    let showModal = false;

    let color = $accentColor;
    let loading = true;
    let pageSize = 10;
    let storeInfoTemp;
    export let status;
    export let pageNo = 1;
    let table_data;
    let total_pages;
    let tempTotalPages;
    const MAX_PAGES = 7;

    function fetch_orders() {
        if (browser) {
            const scrollHeight =
                document.querySelector(".orders-container")?.scrollHeight ?? 0;
            loading = true;
            storeInfoTemp = $storeInfo;
            const endpoint =
                status !== "All"
                    ? `${PUBLIC_SERVER_URL}/order/by/query?pageNo=${pageNo}&pageSize=${pageSize}&supplier_id=${storeInfoTemp?._id}&status=${status}`
                    : `${PUBLIC_SERVER_URL}/order/by/query?pageNo=${pageNo}&pageSize=${pageSize}&supplier_id=${storeInfoTemp?._id}`;
            fetch(endpoint, {
                headers: {
                    accept: "application/json, text/plain, */*",
                },
                method: "POST",
            }).then((res) =>
                res.json().then((dat) => {
                    if (table_data) {
                        dat.data.forEach((element) => {
                            const sub = table_data.find(
                                (elem) => elem._id == element._id,
                            );
                            // ensure no duplicates found in  array
                            if (sub == undefined) table_data.push(element);

                            table_data = table_data;
                        });
                    } else {
                        table_data = dat.data;
                    }

                    total_pages = Math.ceil(dat.totalDocuments / pageSize);
                    tempTotalPages = total_pages;

                    if (total_pages > MAX_PAGES) {
                        total_pages = MAX_PAGES;
                    }

                    loading = false;
                    setTimeout(() => {
                        document.querySelector(".orders-container").scrollTop =
                            scrollHeight - 200;
                    }, 100);
                }),
            );
        }
    }

    $: status, fetch_orders();
    $: pageNo, fetch_orders();

    onMount(() => {
        if (browser) {
            storeInfoTemp = $storeInfo;
        }
    });

    const navigateRight = () => {
        pageNo = pageNo < total_pages ? pageNo + 1 : pageNo;
        if (pageNo >= MAX_PAGES && tempTotalPages > MAX_PAGES) showModal = true;
    };

    function hasReachedBottom(event) {
        const element = event.target;
        const bias = 100; // adding a bias to prevent absolute bottom

        // Check if the user has scrolled to the bottom of the div
        if (
            element.scrollHeight - element.scrollTop <=
            element.clientHeight + bias
        ) {
            if (pageNo < total_pages && !loading) {
                pageNo = pageNo + 1;
            }
        }
    }
</script>

<Modal bind:showModal>
    <ul id="paginate">
        <span class="scrollable-pagination">
            {#each { length: tempTotalPages } as _, i}
                <li
                    class="waves-effect {color}-text"
                    on:click={() => (pageNo = i + 1)}
                >
                    <a href="#!">{i + 1}</a>
                </li>
            {/each}
        </span>
    </ul>
</Modal>

{#if status != "Returned"}
    <button on:click={() => (status = undefined)} class="go_back">
        <i class="material-icons">arrow_back</i>
    </button>
{/if}

<!-- <Product /> -->

<!-- {#if !loading && table_data?.length !== 0}
    <ul id="paginate" class="pagination">
        <li
            class:disabled={pageNo == 1}
            class:waves-effect={pageNo > 1}
            on:click={() => (pageNo = pageNo > 1 ? pageNo - 1 : pageNo)}
        >
            <a href="#!"><i class="material-icons">chevron_left</i></a>
        </li>
        <span>
            {#each { length: total_pages } as _, i}
                <li
                    class:active={i + 1 == pageNo}
                    class:text-white={i + 1 == pageNo}
                    class="waves-effect"
                    on:click={() => (pageNo = i + 1)}
                >
                    <a href="#!">{i + 1}</a>
                </li>
            {/each}
        </span>
        <li
            class:disabled={pageNo == total_pages &&
                tempTotalPages <= MAX_PAGES}
            class:waves-effect={pageNo < total_pages}
            on:click={navigateRight}
        >
            <a href="#!"><i class="material-icons">chevron_right</i></a>
        </li>
    </ul>
{/if} -->
{#if loading}
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
<div class="table-container">
    {#if table_data}
        <div on:scroll={hasReachedBottom} class="orders-container">
            {#each table_data as entry}
                <Order
                    _id={entry._id}
                    order_id={entry.orderNumber}
                    order_date={entry.orderDate}
                    courier_company={entry.courierCompany}
                    store_name={entry.supplierName}
                    tracking_id={entry.trackingNumberPostEX}
                    status={entry.status}
                    orders={entry.orderedItems}
                    total_amount={entry.totalAmount}
                />
            {/each}
        </div>
    {/if}

    {#if table_data?.length == 0}
        <div style="text-align: center;" class="no-data">
            <img src="/no_data.png" alt="x_x No Data" />
        </div>
    {/if}
</div>

<style>
    #paginate {
        padding: 1rem;
        text-align: center;
        width: 100%;
    }

    .table-container {
        /* max-height: 60vh; Set the max height for the container */
        overflow-y: auto; /* Make the container vertically scrollable */
        /* margin-bottom: 10rem; Optional: to add some space below the table */
    }

    .loader-container {
        position: fixed;
        display: flex;
        justify-content: center;
        padding-top: 50%;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.309);
    }

    td {
        padding: 1rem;
    }

    button.go_back {
        outline: none;
        background: none;
        border: none;
    }

    .no-data img {
        width: 20rem;
        filter: hue-rotate(45deg);
    }

    span.scrollable-pagination {
        display: block;
        width: 20rem;
        max-height: 30rem;
        overflow-y: scroll;
    }

    span.scrollable-pagination > li {
        padding: 0.5rem;
        width: 100%;
        font-size: 1.3rem;
    }

    .orders-container {
        text-align: center;
        max-height: 60vh; /* Set the max height for the container */
        overflow-y: scroll; /* Make the container vertically scrollable */
        margin-bottom: 10rem; /* Optional: to add some space below the table */
    }
</style>
