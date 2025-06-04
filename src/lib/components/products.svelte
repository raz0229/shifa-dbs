<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { accentColor, storeInfo } from "$lib/stores";
    import { compressImage } from "$lib";
    import Select from "svelte-select";
    import {
        PUBLIC_SERVER_URL,
        PUBLIC_IMGKIT_API_KEY,
    } from "$env/static/public";
    import FetchProducts from "$lib/components/fetch-products.svelte";

    let color;
    let status;
    let storeInfoTemp;

    let activeProducts;
    let inactiveProducts;
    let originalProducts;
    let files;
    let base64Images = []; // To store base64 encoded images
    let imageUploading = false;
    let loading = false;
    let fakeLoader = 1;

    let categoryList = [];
    let subcategoryList = [];

    // form data
    let productName = "";
    let productDescription = "";
    let productPrice = "";
    let selectedCategory;
    let selectedSubcategory;
    let imageURLS = [];

    onMount(() => {
        M.Tabs.init(document.querySelectorAll(".tabs"));
        M.Modal.init(document.querySelectorAll(".modal"));
        M.FormSelect.init(document.querySelectorAll("select"));

        if (browser) {
            color = $accentColor;
            storeInfoTemp = $storeInfo;

            // update fake loader from 0 to 100 within 45 seconds MAX
            let maxLoader = 99;
            let totalDuration = 55000; // 45 seconds
            let startTime = Date.now(); // Record the start time

            function increment() {
                if (fakeLoader < maxLoader) {
                    fakeLoader++;
                    // Calculate the elapsed time
                    let elapsedTime = Date.now() - startTime;

                    // Calculate remaining time
                    let remainingTime = totalDuration - elapsedTime;

                    // Random delay factor: start fast, get progressively slower
                    let randomDelay =
                        Math.random() *
                        (remainingTime / (maxLoader - fakeLoader));

                    // Set a random delay for the next increment
                    setTimeout(increment, randomDelay);
                }
            }

            increment();
            try {
                fetch(`${PUBLIC_SERVER_URL}/category/all`, {
                    headers: {
                        accept: "application/json, text/plain, */*",
                        "content-type": "application/json",
                    },
                    method: "GET",
                }).then((res) =>
                    res.json().then((doc) => {
                        categoryList = [];

                        doc.result.forEach((item) => {
                            categoryList.push({
                                value: item._id,
                                label: item.name,
                            });
                        });
                        categoryList = categoryList;
                        //M.FormSelect.init(document.querySelectorAll('select'));
                    }),
                );

                // trying hackable ways since no API support from backend
                fetch(
                    `${PUBLIC_SERVER_URL}/product/all/for/store-or-admin?pageNo=1&pageSize=1000`,
                    {
                        headers: {
                            accept: "application/json, text/plain, */*",
                            "content-type": "application/json",
                        },
                        body: `{\"storeId\":\"${storeInfoTemp._id}\"}`,
                        method: "POST",
                    },
                ).then((res) => {
                    res.json().then((dat) => {
                        originalProducts = dat.result;
                        activeProducts = dat.result.filter(
                            (elem) => elem.isActive == "true",
                        );
                        inactiveProducts = dat.result.filter(
                            (elem) => elem.isActive !== "true",
                        );
                    });
                });
            } catch (e) {
                M.toast({ html: "⚠️ Something went wrong! Please reload" });
            }
        }
    });

    const handleSelectedCategory = () => {
        try {
            fetch(`${PUBLIC_SERVER_URL}/subcategory/all`, {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "content-type": "application/json",
                },
                method: "GET",
            }).then((res) =>
                res.json().then((doc) => {
                    subcategoryList = [];
                    doc.result.forEach((item) => {
                        subcategoryList.push({
                            value: item._id,
                            label: item.name,
                        });
                    });
                    subcategoryList = subcategoryList;
                }),
            );
        } catch (e) {
            M.toast({ html: "⚠️ Something went wrong! Please reload" });
        }
    };

    const handleImages = () => {
        // Reset the base64Images array when new files are selected
        base64Images = [];

        for (const file of files) {
            compressImage(file).then(async (compressedBase64) => {
                imageUploading = true;
                // Push the compressed base64 data to the base64Images array
                base64Images = [...base64Images, compressedBase64];

                const url = "https://upload.imagekit.io/api/v1/files/upload";
                const form = new FormData();
                form.append("file", compressedBase64);
                form.append("fileName", file.name);

                const options = {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Basic ${btoa(PUBLIC_IMGKIT_API_KEY + ":")}`,
                    },
                };

                options.body = form;

                try {
                    const response = await fetch(url, options);
                    const data = await response.json();
                    imageURLS.push(data.url);
                    imageURLS = imageURLS;
                    imageUploading = false;
                } catch (error) {
                    M.toast({ html: "⚠️ Something went wrong! Please reload" });
                    imageUploading = false;
                }
            });
        }
    };

    const handleFormSubmit = async () => {
        if (
            productName.trim().length <= 40 &&
            productDescription.trim().length <= 120 &&
            productPrice >= 0 &&
            selectedCategory &&
            selectedSubcategory &&
            storeInfoTemp._id
        ) {
            try {
                loading = true;
                const url = `${PUBLIC_SERVER_URL}/product/add`;
                const options = {
                    method: "POST",
                    headers: {
                        accept: "application/json, text/plain, */*",
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({
                        name: productName.trim(),
                        description: productDescription.trim(),
                        productCode: `Thefac-${Math.random().toString(36).slice(-8)}`,
                        price: productPrice,
                        category: selectedCategory.value,
                        subcategory: selectedSubcategory.value,
                        store: storeInfoTemp._id,
                        images: imageURLS,
                    }),
                };

                const response = await fetch(url, options);
                const data = await response.json();
                if (data.success) {
                    M.toast({ html: "😍 Product Added to Store" });
                    productName = "";
                    productDescription = "";
                    productPrice = "";
                    selectedCategory = undefined;
                    selectedSubcategory = undefined;
                    imageURLS = [];
                } else {
                    M.toast({ html: "🤷 Something went wrong!" });
                }
                loading = false;
            } catch (e) {
                M.toast({ html: "❌ Something went wrong. Reload!" });
            }
        } else {
            M.toast({ html: "⚠️ Some fields are missing" });
        }
    };

    function removeActiveProduct(event) {
        activeProducts = activeProducts.filter(
            (item) => item._id !== event.detail.id,
        );
    }

    function removeInactiveProduct(event) {
        inactiveProducts = inactiveProducts.filter(
            (item) => item._id !== event.detail.id,
        );
    }
</script>

<!-- Modal Structure -->
<div id="addProductModal" class="modal">
    <div class="modal-content">
        {#if !loading}
            <h4>Add a Product</h4>
            <p class="blue-text">
                <i>Thefac-{Math.random().toString(36).slice(-8)}</i>
            </p>
            <div class="row">
                <form
                    on:submit|preventDefault={handleFormSubmit}
                    class="col s12"
                >
                    <div class="row">
                        <div class="input-field col s12">
                            <i class="material-icons grey-text lighten-2 prefix"
                                >payments</i
                            >
                            <input
                                required
                                id="name"
                                type="text"
                                maxlength="40"
                                bind:value={productName}
                                class="validate"
                            />
                            <label for="name">Product Name</label>
                        </div>
                        <div class="input-field col s12">
                            <i class="material-icons grey-text lighten-2 prefix"
                                >description</i
                            >
                            <textarea
                                required
                                id="description"
                                maxlength="120"
                                bind:value={productDescription}
                                class="materialize-textarea"
                            ></textarea>
                            <label for="description">Description</label>
                        </div>
                        <div class="input-field col s12">
                            <i class="material-icons grey-text lighten-2 prefix"
                                >payments</i
                            >
                            <input
                                required
                                id="price"
                                type="number"
                                bind:value={productPrice}
                                min="0"
                                class="validate"
                            />
                            <label for="price">Price</label>
                        </div>
                        <div style="margin-top: 1rem;" class="col s12">
                            <Select
                                disabled={categoryList.length == 0}
                                id="category"
                                bind:items={categoryList}
                                bind:value={selectedCategory}
                                on:select={handleSelectedCategory}
                                placeholder="Category"
                            ></Select>
                        </div>
                        <div style="margin-top: 1rem;" class="col s12">
                            <Select
                                disabled={subcategoryList.length == 0}
                                id="subcategory"
                                bind:items={subcategoryList}
                                bind:value={selectedSubcategory}
                                placeholder="Subcategory"
                            ></Select>
                        </div>
                    </div>
                    <div class="row s12">
                        <div class="file-field input-field">
                            {#if imageURLS.length == 0 && !imageUploading}
                                <div class="btn transparent z-depth-0">
                                    <span
                                        ><i
                                            class="material-icons grey-text text-lighten-1"
                                            >add_photo_alternate</i
                                        ></span
                                    >
                                </div>
                            {:else if imageURLS.length !== 0 && !imageUploading}
                                <div class="btn transparent z-depth-0">
                                    <span
                                        ><i
                                            class="material-icons grey-text text-lighten-1"
                                            >add_photo_alternate</i
                                        ></span
                                    >
                                </div>
                                <div
                                    style="position: absolute; display: flex; bottom: 2px; right: 2px; gap: 5px;"
                                    class="product-images"
                                >
                                    {#each imageURLS as img}
                                        <div
                                            style="position: relative;"
                                            class="product-image-container"
                                        >
                                            <span
                                                on:click={() =>
                                                    (imageURLS =
                                                        imageURLS.filter(
                                                            (item) =>
                                                                item !== img,
                                                        ))}
                                                style="position: absolute; top: -5px; left: -5px; z-index: 9; "
                                                ><i
                                                    style="border-radius: 50%; font-weight: 600; padding: 4px;"
                                                    class="material-icons z-depth-2 waves-effect red white-text text-lighten-1"
                                                    >close</i
                                                ></span
                                            >
                                            <img
                                                style="width: 70px; height: 70px; border-radius: 4px; opacity: 70%;"
                                                src={img}
                                                alt="product-img"
                                            />
                                        </div>
                                    {/each}
                                </div>
                            {:else}
                                <div class="preloader-wrapper small active">
                                    <div
                                        class="spinner-layer spinner-green-only"
                                    >
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
                            {/if}
                            <div class="file-path-wrapper">
                                <input
                                    class="file-path validate"
                                    accept="image/png, image/jpeg"
                                    bind:files
                                    on:change={handleImages}
                                    id="images"
                                    name="images"
                                    type="file"
                                    placeholder="Upload files"
                                    disabled={imageUploading ||
                                        imageURLS.length >= 3}
                                />
                            </div>
                        </div>
                        <div
                            style="text-align: end; font-size: 12px; padding-right: 0.5rem;"
                            class="images-count red-text"
                        >
                            {imageURLS.length}/3
                        </div>
                    </div>
                    <button
                        style="width: 100%;"
                        class="btn waves-effect waves-light {color}"
                        type="submit"
                        name="action"
                        >Submit
                        <i class="material-icons right">send</i>
                    </button>
                </form>
            </div>
        {:else}
            <div style="text-align: center;">
                <div class="preloader-wrapper big active">
                    <div class="spinner-layer spinner-blue-only">
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
    </div>

    <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-green btn-flat"
            >Cancel</a
        >
    </div>
</div>

{#if !status}
    <div class="row">
        <div id="add-product-btn">
            <a
                href="#addProductModal"
                class="btn-floating btn-large modal-trigger waves-effect waves-light {color} pulse"
                ><i class="material-icons">add</i></a
            >
        </div>
        <div id="test1" class="col s12">
            <ul class="collection">
                <li
                    on:click={() =>
                        activeProducts
                            ? (status = "active")
                            : (status = undefined)}
                    class="collection-item avatar"
                >
                    <i
                        class="material-icons circle grey lighten-2 grey-text text-darken-2"
                        >light_mode</i
                    >
                    <span class="title grey-text text-darken-2"
                        ><b>Active Products</b></span
                    >
                    <p style="margin-top: 0.5rem;" class="green-text">
                        <b
                            >{activeProducts?.length ??
                                `Downloading... ${fakeLoader}%`}</b
                        >
                        <br />
                    </p>
                    {#if !activeProducts}
                        <div
                            style="margin: 0.5rem 0; width: 80%;"
                            class="progress"
                        >
                            <div
                                class="determinate {color}"
                                style="width: {fakeLoader}%"
                            ></div>
                        </div>
                    {/if}
                    <a href="#!" class="secondary-content"
                        ><i
                            class:inactive-btn={!activeProducts}
                            class="{color}-text material-icons">send</i
                        ></a
                    >
                </li>
                <li
                    on:click={() =>
                        inactiveProducts
                            ? (status = "inactive")
                            : (status = undefined)}
                    class="collection-item avatar"
                >
                    <i
                        class="material-icons circle grey lighten-2 grey-text text-darken-2"
                        >bedtime</i
                    >
                    <span class="title grey-text text-darken-2"
                        ><b>Inactive Products</b></span
                    >
                    <p style="margin-top: 0.5rem;" class="green-text">
                        <b
                            >{inactiveProducts?.length ??
                                `Downloading... ${fakeLoader}%`}</b
                        >
                        <br />
                    </p>
                    {#if !inactiveProducts}
                        <div
                            style="margin: 0.5rem 0; width: 80%;"
                            class="progress"
                        >
                            <div
                                class="determinate {color}"
                                style="width: {fakeLoader}%"
                            ></div>
                        </div>
                    {/if}
                    <a href="#!" class="secondary-content"
                        ><i
                            class:inactive-btn={!inactiveProducts}
                            class="{color}-text material-icons">send</i
                        ></a
                    >
                </li>
                <li
                    on:click={() => (status = "all")}
                    class="collection-item avatar"
                >
                    <i
                        class="material-icons circle grey lighten-2 grey-text text-darken-2"
                        >reorder</i
                    >
                    <span class="title grey-text text-darken-2"
                        ><b>All Catalogs</b></span
                    >
                    <p>Loads Faster <br /></p>
                    <a href="#!" class="secondary-content"
                        ><i class="{color}-text material-icons">send</i></a
                    >
                </li>
            </ul>
        </div>
    </div>
{:else if status == "active"}
    <FetchProducts
        on:updateCount={removeActiveProduct}
        bind:status
        table_data={activeProducts}
        table_data_original={originalProducts}
    />
{:else if status == "inactive"}
    <FetchProducts
        on:updateCount={removeInactiveProduct}
        bind:status
        table_data={inactiveProducts}
        table_data_original={originalProducts}
    />
{:else}
    <FetchProducts bind:status table_data={undefined} />
{/if}

<style>
    .file-field.input-field {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        color: #9e9e9e;
        height: 10rem;
        border: dashed 1px #dedede;
    }
    .file-field.input-field .btn i {
        background-color: transparent;
        color: #9e9e9e;
        font-size: 4rem;
    }
    .inactive-btn {
        color: grey !important;
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
    #add-product-btn {
        position: fixed;
        bottom: 8rem;
        right: 1.4rem;
    }

    #category {
        padding: 1rem;
    }
</style>
