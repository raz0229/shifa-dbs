<script>
    import { accentColor } from "$lib/stores";
    import Modal from "$lib/components/Modal.svelte";
    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { quintIn } from "svelte/easing";
    import Product from "./product.svelte";
    import { PUBLIC_SERVER_URL } from "$env/static/public";

    let color = $accentColor;
    let showImagePreviewModal = false;
    let imagePreviewSource;
    let showProduct = false;
    let loading = false;
    let currentProduct;

    export let _id;
    export let order_id;
    export let order_date = "2024-07-10T12:48:07.598Z";
    export let courier_company;
    export let store_name;
    export let tracking_id;
    export let total_amount = 0;
    export let status;
    export let orders = [
        {
            productId: "665c9c22e68ed2444b8ca3be",
            product: {
                name: "2 Pcs Women's Unstitched Khaddar Printed Suit",
                images: ["/images/img1-370x727.png"],
            },
            price: 1100,
            size: "Regular",
            quantity: 1,
        },
    ];

    // const showPreviewModal = (src) => {
    //     imagePreviewSource = src;
    //     showImagePreviewModal = true;
    // };

    const revealProduct = (id) => {
        loading = true;
        try {
            fetch(`${PUBLIC_SERVER_URL}/product/find/${id}`, {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "content-type": "application/json",
                },
                method: "GET",
            }).then((res) =>
                res.json().then((doc) => {
                    currentProduct = doc.result;
                    showProduct = true;
                    loading = false;
                }),
            );
        } catch (e) {
            console.log("Something went wrong");
            M.toast({ html: "Something went wrong!" });
        }
    };

    const acceptOrder = async () => {
        try {
            M.toast({ html: "⚙️ Working on it..." });
            await fetch(`${PUBLIC_SERVER_URL}/order/edit/${_id}`, {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "content-type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify({
                    status: "Booked",
                }),
            });
            M.toast({ html: "⚙️ Generating Loadsheet" });

            // generate load sheet
            
            await fetch(
                `${PUBLIC_SERVER_URL}/postex/generate-load-sheet`,
                {
                    headers: {
                        accept: "application/json, text/plain, */*",
                        "content-type": "application/json",
                    },
                    body: `{"trackingNumbers":[${tracking_id}]}`,
                    method: "POST",
                },
            );
            
            M.toast({ html: "✅ Order Booked" });
            location.reload();
        } catch (e) {
            M.toast({ html: "❌ Uh oh! Something isn't right" });
        }
    };

    const rejectOrder = async () => {
        try {
            M.toast({ html: "⚙️ Working on it..." });

            await fetch(`${PUBLIC_SERVER_URL}/order/delete/${_id}`, {
                headers: {
                    accept: "application/json, text/plain, */*",
                },
                method: "DELETE",
            });

            M.toast({ html: "✅ Order Rejected" });
            location.reload();
        } catch (e) {
            M.toast({ html: "🤷 Something went wrong" });
        }
    };
</script>

<Modal bind:showModal={showProduct}>
    <span on:click={() => (showProduct = false)} id="close-btn"
        ><i class="material-icons text-gray">close</i></span
    >
    <div
        transition:slide={{
            delay: 100,
            duration: 350,
            easing: quintOut,
            axis: "x",
        }}
    >
        <Product product={currentProduct} />
    </div>
</Modal>

<!-- <Modal bind:showModal={showImagePreviewModal}>
    <span on:click={() => (showImagePreviewModal = false)} id="close-btn"
        ><i class="material-icons text-gray">close</i></span
    >
    <div class="image-preview">
        <img src={imagePreviewSource} alt="preview-image" />
    </div>
</Modal> -->

<div
    transition:slide={{
        delay: 100,
        duration: 350,
        easing: quintOut,
        axis: "x",
    }}
    class="order-container"
>
    {#if loading}
        <div style="margin-left: 1rem; width: 90%;" class="progress">
            <div class="indeterminate"></div>
        </div>
    {/if}
    <div class="order-header {color} white-text">
        <div>
            <div class="order-id">
                <span class="key"><b>Order ID:</b></span>
                <span class="value"><b>{order_id}</b></span>
            </div>
            <div class="order-date">
                <span class="key">Order Date:</span>
                <span class="value">{new Date(order_date).toDateString()}</span>
            </div>
            <div class="order-date order-company">
                <span class="key">Courier Company:</span>
                <span class="value">{courier_company}</span>
            </div>
        </div>
        <div class="total-price">
            <div><b>{total_amount}</b></div>
            <div style="font-size: 1rem; text-align:end;">PKR</div>
        </div>
    </div>
    <div class="tracking-container">
        <div class="tracking-id">
            <span class="key"><b>Tracking ID</b></span>
            <span class="value"><b>{tracking_id}</b></span>
        </div>
        <div class="status">
            <span class="key"><b>Status</b></span>

            {#if status?.toLowerCase() == "returned"}
                <span class="value red"><b>{status}</b></span>
            {:else if status?.toLowerCase() == "delivered"}
                <span class="value green"><b>{status}</b></span>
            {:else if status?.toLowerCase() == "cancelled"}
                <span class="value amber"><b>{status}</b></span>
            {:else}
                <span class="value blue"><b>{status}</b></span>
            {/if}
        </div>
    </div>
    <div class="orders-container">
        {#each orders as order}
            <div on:click={() => revealProduct(order?.productId)} class="order">
                <div class="order-image">
                    <img src={order?.product.images[0]} alt="image" />
                    <!-- <img src="https://firebasestorage.googleapis.com/v0/b/clothingstorern-70318.appspot.com/o/665c8d83f25c9eab5809614d%2FThefac-10274-FC%2F0.webp?alt=media&token=a25472b7-087c-4a9d-8f16-709b9dcf5578" alt="image"> -->
                </div>
                <div class="order-details">
                    <div class="item-id grey-text">
                        <span><b>Item ID:&nbsp;</b></span>
                        <span
                            >{`${order.productId?.substring(0, 5)}...${order.productId.substring(order.productId.length - 5)}`}</span
                        >
                    </div>
                    <div class="store-name grey-text">
                        <span><b>Store:&nbsp;</b></span>
                        <span>{store_name}</span>
                    </div>
                    <div class="item-name">
                        <b>{order?.product.name}</b>
                    </div>
                    <div class="item-size">
                        <span><b>Size:&nbsp;</b></span>
                        <span><em>{order.size}</em></span>
                    </div>
                    <div class="item-price">
                        <b>Rs. {order.price} /-</b>
                    </div>
                </div>
                <div class="order-qnt"><b>x{order?.quantity}</b></div>
            </div>
        {/each}
    </div>
    {#if status?.toLowerCase() == "unbooked"}
        <div
            style="padding: 1.5rem; display: flex; justify-content: center; gap: 1rem;"
            class="btn-group"
        >
            <a
                on:click={acceptOrder}
                style="font-weight: 600;"
                class="waves-effect waves-light btn green accent-3"
                ><i class="material-icons left">done_all</i>Accept</a
            >
            <a
                on:click={rejectOrder}
                style="font-weight: 600;"
                class="waves-effect waves-light btn red accent-3"
                ><i class="material-icons right">close</i>Reject</a
            >
        </div>
    {/if}
</div>

<style>
    .image-preview {
        width: 19rem;
        height: 23rem;
    }

    .image-preview img {
        width: 300px;
    }
    .orders-container .order {
        display: flex;
        gap: 10px;
        justify-content: space-around;
    }
    .orders-container .order > .order-image {
        flex: 1;
        padding: 1rem;
    }
    .orders-container .order > .order-image > img {
        width: 100px;
        height: 100px;
        border-radius: 10px;
    }
    .orders-container .order > .order-details {
        flex: 4;
        text-align: start;
        padding-top: 1rem;
        padding-bottom: 1rem;
        font-size: small;
    }
    .orders-container .order > .order-details .item-price {
        font-size: larger;
        color: rgb(7, 202, 78);
    }

    .orders-container .order > .order-qnt {
        flex: 1;
        font-size: 2rem;
        padding-top: 1rem;
        padding-right: 1.3rem;
    }
    .order-container {
        border-radius: 12px;
        border: solid 1px #c4c4c4;
        margin-top: 1rem;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        font-size: 12px;
    }
    .order-header {
        text-align: start;
        padding: 15px;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        display: flex;
        justify-content: space-between;
    }
    .order-header .order-id {
        font-size: larger;
    }
    .order-header .total-price {
        font-size: x-large;
    }

    .tracking-container {
        text-align: start;
        margin-top: 1rem;
        margin-right: 1rem;
        margin-left: 1rem;
        border-bottom: solid 1px #c4c4c4;
    }
    .tracking-container .tracking-id,
    .tracking-container .status {
        padding-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .tracking-container .status > .value {
        padding: 0.6rem;
        /* background-color: rgb(16, 135, 226); */
        color: #fff;
        border-radius: 15px;
    }
</style>
