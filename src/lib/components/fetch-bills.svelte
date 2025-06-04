<script>
    import { accentColor, storeInfo, printSet, printableItems } from "$lib/stores";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import { fly } from "svelte/transition";
    import Modal from "$lib/components/Modal.svelte";

    let showModal = false;
    let showOrderDetailsModal = false;

    let color = $accentColor;
    let loading = true;
    let pageSize = 10;
    let storeInfoTemp;
    export let pageNo = 1;
    let table_data;
    let total_pages;
    let tempTotalPages;
    const MAX_PAGES = 6;
    let currentProduct;
    let printList = new Set()

    function fetch_products() {
        if (browser) {
            loading = true;
            storeInfoTemp = $storeInfo;
            printList.clear()
            const endpoint = `${PUBLIC_SERVER_URL}/order/get/status-booked-orders?pageNo=${pageNo}&pageSize=${pageSize}&pagination=true`;
            try {
                fetch(endpoint, {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "content-type": "application/json"
                },
                "body": `{\"storeId\":\"${storeInfoTemp._id}\"}`,
                method: "POST",
            }).then((res) =>
                res.json().then((dat) => {
                    table_data = dat.result;
                    total_pages = Math.ceil(dat.totalDocuments / pageSize);
                    tempTotalPages = total_pages;

                    if (total_pages > MAX_PAGES) {
                        total_pages = MAX_PAGES;
                    }

                    loading = false;
                }),
            );
            } catch (e) {
                M.toast({ html: "🤷 Something went wrong!" });
                loading = false;
            }
        }
    }

    $: pageNo, fetch_products();

    onMount(() => {
        if (browser) {
            storeInfoTemp = $storeInfo;
        }
    });

    const navigateRight = () => {
        pageNo = pageNo < total_pages ? pageNo + 1 : pageNo;
        if (pageNo >= MAX_PAGES && tempTotalPages > MAX_PAGES) showModal = true;
    };

    const showOrdersModal = (entry) => {
        showOrderDetailsModal = true;
        currentProduct = entry;
    };

    const closeOrdersDetailModal = () => {
        showOrderDetailsModal = false;
    };

    const addToPrintList = (product) => {
        const box = document.getElementById(product._id)
        if (box.checked)
            printList.add(product._id);
        else
            printList.delete(product._id);
        
        printSet.set(printList)
        printList = printList
    }

    const printSelection = () => {
        printableItems.set(table_data);
        location.href = '/preview';
    }

</script>

{#if printList.size > 0}
    <a 
        in:fly 
        out:fly 
        on:click={printSelection}
        id="float-btn" class="btn-floating btn-large waves-effect waves-light {color}"><i class="material-icons">print</i></a>
{/if}

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

{#if showOrderDetailsModal}
    <Modal bind:showModal={showOrderDetailsModal}>
        <h4>Order Details</h4>
        <span on:click={closeOrdersDetailModal} id="close-btn"
            ><i class="material-icons text-gray">close</i></span
        >
        <div class="products">
            {#each currentProduct?.orderedItems as prod}
            <div class="product">
                <div class="sec-one">
                    <h5>{prod.product.name}</h5>
                    <h6 class="grey-text">{prod.product.details}</h6>
                    <p><b>Price:&nbsp;</b><em>{prod.price}</em></p>
                    <p><b>Quantity:&nbsp;</b>{prod.quantity}</p>
                    <p><b>Size:&nbsp;</b>{prod.size}</p>
                </div>
                <div class="sec-two">
                    <img
                        src="{prod.product.images[0]}"
                        alt="image"
                    />
                </div>
            </div>
            {/each}
            <div class="address">
                <h5>Shipping Address</h5>
                <p><b>Name:&nbsp;</b>{currentProduct?.shippingAddress.customerName}</p>
                <p><b>Number:&nbsp;</b>{currentProduct?.shippingAddress.customerNumber}</p>
                <p><b>Province:&nbsp;</b>{currentProduct?.shippingAddress.province}</p>
                <p><b>City:&nbsp;</b>{currentProduct?.shippingAddress.city}</p>
                <p>
                    <b>Area:&nbsp;</b>
                    {currentProduct?.shippingAddress.areaName}
                </p>
                <p><b>Street No:&nbsp;</b>{currentProduct?.shippingAddress.streetNumber}</p>
                <p><b>House No:&nbsp;</b>{currentProduct?.shippingAddress.houseNumber}</p>
            </div>
        </div>
    </Modal>
{/if}

<div class="row container">
    <div class="col s12">
        {#if !loading && table_data?.length !== 0}
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
        {/if}

        <div class="table-container">
            {#if !loading}
                <table class="striped">
                    <thead>
                        <tr>
                            <th class="grey-text">Select</th>
                            <th>Image</th>
                            <th>Order Date</th>
                            <th>Tracking Number</th>
                            <th>Courier Company</th>
                            <th>Supplier</th>
                            <th>Total Amount</th>
                            <th>Quantity</th>
                            <th>Transaction Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each table_data as entry}
                            <tr>
                                <td on:click={()=>addToPrintList(entry)}>
                                    <p>
                                        <label>
                                          <input id="{entry._id}" type="checkbox" class="filled-in"/>
                                          <span></span>
                                        </label>
                                      </p>
                                </td>
                                <td on:click={() => showOrdersModal(entry)} class="bill-img">
                                    <img src="{entry.orderedItems[0].product.images[0]}" alt="Image">
                                </td>
                                <td on:click={() => showOrdersModal(entry)}>{entry.orderDate.substring(0, 10)}</td>
                                <td on:click={() => showOrdersModal(entry)}>{entry.trackingNumberPostEX}</td>
                                <td on:click={() => showOrdersModal(entry)}>{entry.courierCompany}</td>
                                <td on:click={() => showOrdersModal(entry)}>{entry.supplierName}</td>
                                <td on:click={() => showOrdersModal(entry)}>{entry.totalAmount}</td>
                                <td on:click={() => showOrdersModal(entry)}>{entry.orderedItems?.length}</td>
                                <td on:click={() => showOrdersModal(entry)}>{entry.status}</td>
                                <td
                                    on:click={() => showOrdersModal(entry)}
                                    class="blue-text"><em>Order Details</em></td
                                >
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

    #float-btn {
        position: fixed;
        right: 1rem;
        bottom: 8.5rem;
    }

    .products {
        max-height: 35rem;
        overflow-y: scroll;
        position: relative;
    }

    .bill-img > img {
        width: 100px;
        height: 100px;
    }

@media screen and (max-width: 430px) {
    .products {
        width: 27rem;
    }
}

@media screen and (max-width: 400px) {
    .products {
        width: 24rem;
    }
}

    .products:focus {
        outline: none;
        border: none;
    }

    #close-btn {
        position: absolute;
        padding: 20px;
        right: 0;
        top: 0;
        color: #989898;
        cursor: pointer;
    }

    .products .product {
        border-bottom: solid 1px #dedede;
        padding: 1rem;
        display: flex;
        gap: 8rem;
        justify-content: space-between;
    }

    .products .address {
        padding: 1rem;
        margin: 1.5rem;
        background-color: #e3e3e3;
        border-radius: 10px;
    }

    .products .sec-one > p,
    .products .sec-one > h5 {
        margin: 0;
    }

    .products .sec-two > img {
        width: 10rem;
    }

    #paginate {
        padding: 1rem;
        text-align: center;
        width: 100%;
    }

    .table-container {
        max-height: 60vh;
        overflow-y: auto;
        margin-bottom: 20px;
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
</style>
