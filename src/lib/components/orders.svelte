<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { accentColor, storeInfo } from "$lib/stores";
    import FetchOrders from "$lib/components/fetch-orders.svelte";
    import { PUBLIC_SERVER_URL } from "$env/static/public";

    let color;
    let status;
    let storeInfoTemp;

    let collection = [
        {
            text: "New Orders",
            icon: "no_backpack",
            status: "Unbooked",
            count: "Loading...",
        },
        {
            text: "Booked",
            icon: "book_online",
            status: "Booked",
            count: 'Loading...'
        },
        {
            text: "Delivered",
            icon: "local_shipping",
            status: "Delivered",
            count: 'Loading...'
        },
        {
            text: "Expired",
            icon: "warning",
            status: "Expired",
            count: 'Loading...'
        },
        {
            text: "All Orders",
            icon: "apps",
            status: "All",
        },
    ];

    onMount(() => {
        var elems = document.querySelectorAll(".tabs");
        M.Tabs.init(elems);

        if (browser) {
            color = $accentColor;
            storeInfoTemp = $storeInfo;
            collection.forEach((col) => {
                if (col.status !== "All") {
                    fetch(
                        `${PUBLIC_SERVER_URL}/order/by/query?supplier_id=${storeInfoTemp?._id}&status=${col.status}`,
                        {
                            headers: {
                                accept: "application/json, text/plain, */*",
                            },
                            method: "POST",
                        },
                    ).then((res) => {
                        res.json().then((dat) => {
                            col.count = dat.data.length;
                            collection = collection;
                        });
                    });
                }
            });
        }
    });
</script>

<div class="row">
    <div
        style="margin-top: -0.8rem; margin-bottom: 1rem;"
        class="col s12 {color}"
    >
        <ul class="tabs {color}">
            <li on:click={() => (status = undefined)} class="tab col s3">
                <a class="active white-text" href="#"
                    ><i class="white-text material-icons">swap_vert</i>
                    <span>In Progress</span></a
                >
            </li>
            <li on:click={() => (status = "Returned")} class="tab col s3">
                <a class="white-text" href="#"
                    ><i class="white-text material-icons">keyboard_return</i>
                    <span>Returned</span></a
                >
            </li>
        </ul>
    </div>
    <!-- In Progress -->

    {#if !status}
        <div id="test1" class="col s12">
            <ul class="collection">
                {#each collection as item}
                    <li
                        on:click={() => (status = item.status)}
                        class="collection-item avatar"
                    >
                        <i
                            class:text-amber={item.status == "Unbooked"}
                            class="material-icons circle grey lighten-2 grey-text text-darken-2"
                            >{item.icon}</i
                        >
                        <span
                            class="title text-darken-2"
                            class:text-amber={item.status == "Unbooked"}
                            ><b>{item.text}</b></span
                        >
                        <p> {item.count == undefined ? 'Expected Sale' : item.count} <br /></p>
                        <a href="#!" class="secondary-content"
                            ><i class="{color}-text material-icons">send</i></a
                        >
                    </li>
                {/each}
            </ul>
        </div>
    {:else if status == "Returned"}
        <div id="test2" class="col s12">
            <FetchOrders status="Returned" />
        </div>
    {:else}
        <FetchOrders bind:status />
    {/if}
</div>

<style>
    .text-amber {
        color: crimson !important;
    }
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
