<script>
    import { accentColor, storeInfo } from "$lib/stores";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import Modal from "$lib/components/Modal.svelte";
    import Product from "./product.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let showModal = false;
    let showImagePreviewModal = false;
    let imagePreviewSource;
    let isBeingFetchedDynamically = false;
    let searchString = '';

    let color = $accentColor;
    let loading = false;
    let pageSize = 10;
    let scrollFactor = 10; // number of downloaded elements to load
    let storeInfoTemp;
    export let pageNo = 1;
    export let table_data;
    export let table_data_original;
    let total_pages;
    let tempTotalPages;
    const MAX_PAGES = 6;

    export let status;

    function fetch_products() {
        if (browser && status == "all") {
            //scrollFactor = pageSize;
            isBeingFetchedDynamically = true;
            const scrollHeight =
                document.querySelector(".products-container")?.scrollHeight ??
                0;
            loading = true;
            storeInfoTemp = $storeInfo;
            const endpoint = `${PUBLIC_SERVER_URL}/product/all/for/store-or-admin?pageNo=${pageNo}&pageSize=${pageSize}`;
            fetch(endpoint, {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "content-type": "application/json",
                },
                body: `{\"storeId\":\"${storeInfoTemp._id}\"}`,
                method: "POST",
            }).then((res) =>
                res.json().then((dat) => {
                    const totalDocs =
                        dat.next * pageSize + dat.previous * pageSize + 1;

                    if (table_data) {
                        dat.result.forEach((element) => {
                            const sub = table_data.find(
                                (elem) => elem._id == element._id,
                            );
                            // ensure no duplicates found in  array
                            if (sub == undefined) table_data.push(element);

                            table_data = table_data;
                        });
                    } else {
                        table_data = dat.result;
                    }
                    scrollFactor = table_data.length

                    total_pages = Math.ceil(totalDocs / pageSize); // waiting for production chanfes to replace dat.next with dat.totalDocuments
                    tempTotalPages = total_pages;
                    if (total_pages > MAX_PAGES) {
                        total_pages = MAX_PAGES;
                    }

                    loading = false;
                    setTimeout(() => {
                        document.querySelector(
                            ".products-container",
                        ).scrollTop = scrollHeight - 200;
                    }, 100);
                }),
            );
        }
    }

    $: pageNo, fetch_products();

    onMount(() => {
        if (browser) {
            storeInfoTemp = $storeInfo;
        }
    });

    const filterProducts = () => {
        table_data = table_data_original.filter(elem => 
            elem.name.toLowerCase().includes(searchString.toLowerCase().trim()) ||
            elem.description.toLowerCase().includes(searchString.toLowerCase().trim()) ||
            elem.productCode.toLowerCase().includes(searchString.toLowerCase().trim())
        )
    }

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
            if (isBeingFetchedDynamically && pageNo < tempTotalPages && !loading) {
                pageNo = pageNo + 1;
            } else {
                scrollFactor += pageSize;
                table_data = table_data; // refresh data
            }
        }
    }

    function removeProductFromProductsArray(event) {
        if (event.detail.id) {
            table_data = table_data.filter(
                (item) => item._id !== event.detail.id,
            );
            dispatch("updateCount", {
                id: event.detail.id,
            });
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

<Modal bind:showModal={showImagePreviewModal}>
    <span on:click={() => (showImagePreviewModal = false)} id="close-btn"
        ><i class="material-icons text-gray">close</i></span
    >
    <div class="image-preview">
        <img src={imagePreviewSource} alt="preview-image" />
    </div>
</Modal>

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

{#if !isBeingFetchedDynamically}
<div style="margin: 1rem; 0" class="row">
    <form class="col s12">
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">search</i>
          <input id="icon_prefix" on:keydown={filterProducts} placeholder="Product Name or Code" bind:value={searchString} type="text" class="validate">
          <label for="icon_prefix">Search Product</label>
        </div>
    </form>
  </div>
{/if}

<div class="row container">
    <span
        on:click={() => (status = undefined)}
        id="close-btn-product"
        class="waves-effect z-depth-2 transparent"
        ><i class="material-icons text-gray">arrow_back_ios</i></span
    >
    <div class="col s12">
        <!-- {#if !loading && table_data?.length !== 0 && status == "all"}
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

        <div class="table-container">
            {#if table_data}
                <div on:scroll={hasReachedBottom} class="products-container">
                    {#each table_data as entry, i}
                        {#if i < scrollFactor}
                            <Product
                                on:deleteProduct={removeProductFromProductsArray}
                                product={entry}
                            />
                        {/if}
                    {/each}
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
    #close-btn {
        color: #989898;
        cursor: pointer;
    }

    #close-btn-product {
        color: #989898;
        cursor: pointer;
        position: fixed;
        top: 50%;
        border-radius: 50%;
        padding: 0.5rem;
        display: flex;
    }

    #close-btn-product i {
        font-size: 1.6rem;
    }

    .image-preview {
        width: 19rem;
        height: 23rem;
    }

    .image-preview img {
        width: 300px;
    }

    #paginate {
        padding: 1rem;
        text-align: center;
        width: 100%;
    }

    .table-container {
        /* max-height: 60vh;
        overflow-y: auto; */
        /* margin-bottom: 20px; */
    }

    .loader-container {
        position: fixed;
        display: flex;
        justify-content: center;
        padding-top: 50%;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.309);
        z-index: 9;
    }

    .product-image {
        width: 8rem;
        height: 10rem;
        cursor: pointer;
    }

    .product-image img {
        width: 100px;
        border: groove 1px #636363;
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
    .products-container {
        text-align: center;
        max-height: 72vh; /* Set the max height for the container */
        overflow-y: scroll; /* Make the container vertically scrollable */
        margin-bottom: 10rem; /* Optional: to add some space below the table */
    }
</style>
