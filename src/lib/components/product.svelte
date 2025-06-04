<script>
    import { accentColor } from "$lib/stores";
    import { onMount } from "svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import { createEventDispatcher } from 'svelte';
    import copy from "copy-to-clipboard";

	const dispatch = createEventDispatcher();

    onMount(() => {
        M.Collapsible.init(document.querySelectorAll(".collapsible"));
    });

    let color = $accentColor;
    let showImagePreviewModal = false;
    let showProductDeleteModal = false;
    let imagePreviewSource;
    let productIdToDelete;
    let deletingProduct = false;

    const showPreviewModal = (src) => {
        imagePreviewSource = src;
        showImagePreviewModal = true;
    };

    const toggleInStock = async (productId, currentVal) => {
        M.toast({ html: "🔄 Updating Status..." });

        const newValue = !(currentVal == "true");
        try {
            await fetch(`${PUBLIC_SERVER_URL}/product/edit/${productId}`, {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "content-type": "application/json",
                },
                body: `{"isActive":${newValue}}`,
                method: "PUT",
            });
            M.toast({ html: "✅ Product Updated" });
            product.isActive = newValue ? "true" : "false";
        } catch (e) {
            M.toast({ html: "🤷 Something went wrong" });
        }
    };

    const setNewPrice = async (productId, newValue) => {
        M.toast({ html: "🔄 Updating Price..." });

        try {
            await fetch(`${PUBLIC_SERVER_URL}/product/edit/${productId}`, {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "content-type": "application/json",
                },
                body: `{"price":${newValue}}`,
                method: "PUT",
            });
            M.toast({ html: "✅ Product Updated" });
        } catch (e) {
            M.toast({ html: "🤷 Something went wrong" });
        }
    };

    export let product = {
        _id: 0,
        name: "GulAhmed Winter Shawl",
        productCode: "Thefac-272290-1",
        category: {
            name: "Women's Shawls",
        },
        subcategory: {
            name: "Ladies Shawl",
        },
        store: {
            name: "Fabollus Collection",
        },
        images: [
            "https://firebasestorage.googleapis.com/v0/b/clothingstorern-70318.appspot.com/o/665c8d83f25c9eab5809614d%2FThefac-58399-FC%2F0.webp?alt=media&token=a23bb422-6685-4b72-9dda-74acbb919364",
        ],
        isActive: "false",
        onSale: false,
        averageRating: 1,
        price: 950,
    };

    const getProductIdToDelete = (id) => {
        productIdToDelete = id;
        showProductDeleteModal = true;
    }

    const deleteProduct = async () => {
        try {
            deletingProduct = true;
            
            await fetch(`${PUBLIC_SERVER_URL}/product/delete/${productIdToDelete}`, {
                headers: {
                    accept: "application/json, text/plain, */*",
                },
                method: "DELETE",
            });

            M.toast({ html: "✅ Product Deleted" });
            showProductDeleteModal = false;
            deletingProduct = false;
            dispatch('deleteProduct', {
			    id: productIdToDelete
		    });
            productIdToDelete = undefined;
        } catch (e) {
           M.toast({ html: "🤷 Something went wrong" });
           deletingProduct = false;
        }
    }

    const copyToClipboard = (code) => {
        copy(code)
        M.toast({ html: "📋 Copied to Clipboard..." });
    }

</script>

<Modal bind:showModal={showImagePreviewModal}>
    <span on:click={() => (showImagePreviewModal = false)} id="close-btn"
        ><i class="material-icons text-gray">close</i></span
    >
    <div class="image-preview">
        <img src={imagePreviewSource} alt="preview-image" />
    </div>
</Modal>

<Modal bind:showModal={showProductDeleteModal}>
    {#if deletingProduct}
    <div class="progress">
        <div class="indeterminate red"></div>
    </div>
    {/if}
    <div 
        style="margin: 1rem;"
        class="modal-content">
        <h5>Are you sure?</h5>
        <p>This action cannot be undone</p>
      </div>
      <div 
      style="padding: 2rem;"
      class="modal-footer">
        <a href="#!" 
            on:click={deleteProduct}
            style="border-radius: 4px; margin-right: 2px;" class="modal-close red darken-2 white-text waves-effect waves-green btn-flat">Delete</a>
        <a href="#!" 
            on:click={()=>showProductDeleteModal=false}
            style="border-radius: 4px; margin-left: 2px; border: solid 1px crimson;" class="modal-close waves-effect waves-green btn-flat">Cancel</a>
      </div>
</Modal>

<div class="order-container">
    <div class="order-header {color} white-text">
        {#if product.category.name}
            <nav class="category transparent z-depth-0">
                <div class="nav-wrapper">
                    <div class="col s12">
                        <a href="#!" class="breadcrumb"
                            >{product.category?.name?.length > 15
                                ? `${product.category?.name.substring(0, 14)}...`
                                : product.category?.name}</a
                        >
                        <a href="#!" class="breadcrumb"
                            >{product.subcategory?.name?.length > 15
                                ? `${product.subcategory?.name.substring(0, 14)}...`
                                : product.subcategory?.name}</a
                        >
                    </div>
                </div>
            </nav>
        {/if}
        <div>
            <div class="order-id">
                <span class="value"><b>{product.name}</b></span>
            </div>
            <div class="order-date">
                <span class="key">Product Code:</span>
                <span class="value"><b><em>{product.productCode}</em></b><i on:click={()=>copyToClipboard(product.productCode)} style="font-size: 17px; margin-left: 5px;" class="material-icons grey-text text-lighten-2">content_copy</i></span>
            </div>
            <div class="order-date">
                <span class="value">
                    {#each {length:product.averageRating} as _}
                        <i style="font-size: 17px;" class="material-icons yellow-text text-darken-3">star</i>
                    {/each}
                    {#each {length : 5 - product.averageRating} as _} 
                        <i style="font-size: 17px;" class="material-icons grey-text text-lighten-3">star</i>
                    {/each}
                </span>
            </div>
        </div>
        <div class="total-price">
            <div><b>{product.price}</b></div>
            <div style="font-size: 1rem; text-align:end;">PKR</div>
        </div>
    </div>
    <div class="product-wrap">
        <!-- <a class="edit-btn btn-floating btn-medium pulse z-depth-5 waves-effect waves-light {color}"><i class="material-icons">edit</i></a>
         -->
        <div class="tracking-container">
            {#if product.store.name}
                <div class="tracking-id">
                    <span class="key"><b>Store</b></span>
                    <span class="value"><b>{product.store.name}</b></span>
                </div>
            {/if}
            <div class="tracking-id">
                <span class="key"><b>On Sale</b></span>
                <span class="value"
                    ><b>{product?.onSale ? "Yes" : "No"}</b></span
                >
            </div>
            <div class="status">
                <span class="key"><b>Status</b></span>
                <span class:active={product.isActive == "true"} class="value"
                    ><b>{product.isActive == "true" ? "Active" : "Inactive"}</b
                    ></span
                >
            </div>
        </div>
        <div class="prod-image">
            <a
                on:click={() => showPreviewModal(product?.images[0])}
                class="carousel-item"
                href="#"><img class="z-depth-4" src={product?.images[0]} /></a
            >
        </div>
    </div>
    <ul class="collapsible z-depth-0">
        <li>
            <a
                class="edit-btn collapsible-header btn-floating btn-medium pulse z-depth-5 waves-effect waves-light {color}"
                ><i class="material-icons">edit</i></a
            >
            <div class="collapsible-body">
                <div class="switch">
                    <label>
                        Activity Status
                        <input
                            type="checkbox"
                            on:change={() =>
                                toggleInStock(product._id, product.isActive)}
                            checked={product.isActive == "true"}
                        />
                        <span class="lever"></span>
                    </label>
                </div>
                <div class="row new-price">
                    <form
                        on:submit={() =>
                            setNewPrice(product._id, product.price)}
                        class="col s12"
                    >
                        <div class="row">
                            <div class="input-field col s6">
                                <i class="material-icons prefix">attach_money</i
                                >
                                <input
                                    id="icon_prefix_{product._id}"
                                    type="text"
                                    bind:value={product.price}
                                    class="validate"
                                />
                                <label for="icon_prefix_{product._id}"
                                    >Press Enter to set New Price</label
                                >
                            </div>
                        </div>
                    </form>
                </div>
                <div 
                    style="width: 100%;"
                    class="delete-product-btn">
                    <button
                        on:click={()=>getProductIdToDelete(product._id)}
                        style="border-radius: 4px;" 
                        class="btn waves-effect waves-light red darken-2" type="submit" name="action">Delete Product
                        <i class="material-icons right">delete</i>
                      </button>
                            
                </div>
            </div>
        </li>
    </ul>
</div>

<style>
    .product-wrap {
        display: flex;
        margin-right: 1rem;
        margin-left: 1rem;
        position: relative;
    }

    .collapsible {
        position: relative;
    }

    .edit-btn {
        position: absolute;
        bottom: 0.5rem;
        right: 0.5rem;
        place-items: center;
        justify-content: center;
    }

    .edit-btn i {
        margin-right: 0;
    }

    .collapsible {
        margin: 0;
        border-right: none;
        border-left: none;
        border-top: none;
    }

    .collapsible-body {
        border-top: solid 1px #c4c4c4;
        border-bottom: 0;
    }

    .value {
        text-align: end;
    }

    .new-price {
        margin-top: 1rem;
        margin-bottom: 0;
    }
    .new-price .input-field {
        width: 100%;
    }

    .prod-image {
        align-self: center;
        margin-left: 1rem;
        border-left: solid 1px #c4c4c4;
    }

    .prod-image img {
        width: 8rem;
        margin: 1rem;
    }

    nav.category {
        position: absolute;
        top: 0;
        left: 0;
    }

    a.breadcrumb {
        font-size: small;
    }

    .image-preview {
        width: 19rem;
        height: 23rem;
    }

    .image-preview img {
        width: 300px;
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
        position: relative;
        padding: 15px;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        display: flex;
        justify-content: space-between;
    }
    .order-header .order-id {
        margin-top: 2rem;
        font-size: larger;
    }
    .order-header .total-price {
        margin-top: 2rem;
        font-size: x-large;
    }

    .tracking-container {
        text-align: start;
        margin-top: 1rem;
    }
    .tracking-container .tracking-id,
    .tracking-container .status {
        padding-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    }

    .tracking-container .status > .value {
        padding: 0.6rem;
        background-color: rgb(226, 76, 16);
        color: #fff;
        border-radius: 15px;
    }

    .tracking-container .status > .value.active {
        background-color: rgb(16, 226, 124) !important;
    }
</style>
