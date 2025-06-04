<script>
    import Barcode from "svelte-barcode";

    export let courierCompany = 'PostEX';

    export let c_tracking_id = "2014792000402";
    export let c_weight = "grams";
    export let c_payment_method = "COD";
    export let c_destination = "Islamabad";

    export let total_amount = "2588";

    export let o_id = "20240730371";
    export let o_items = [
        {
            product: {
                name: "Aisling",
                size: "Regular",
                quantity: 1,
            },
        },
    ];

    //export let b_id = '2014792000402';

    export let r_name = "Raja Nadir Khan";
    export let r_phone = "03127260108";
    export let r_phone_alt = "";
    export let r_house_no = "1";
    export let r_street_no = "1";
    export let r_address = "Basti Muhammad Pura, Gaggoo Mandi";
    export let r_city;

    export let s_name = "SherazTech";

    export let ret_address =
        "G2 Markaz, Kadir Colony, North Nazimabad, Punjab, PK";
</script>

<div class="slip">
    <div class="postex-name">
        <div class="name">{courierCompany}</div>
        <img src="/qr_code.png" alt="postex.pk" />
    </div>
    <div class="content">
        <div class="content-top">
            <div class="box">
                <div class="title-bar">Courier Information</div>
                <div class="row">
                    <span class="cell"><b>Tracking ID: &nbsp;</b></span>
                    <span class="cell">{c_tracking_id}</span>
                </div>
                <div class="row">
                    <span class="cell"><b>Weight: &nbsp;</b></span>
                    <span class="cell">{c_weight}</span>
                </div>
                <div class="row">
                    <span class="cell"><b>Payment Method: &nbsp;</b></span>
                    <span class="cell">{c_payment_method}</span>
                </div>
                <div class="row">
                    <span class="cell"><b>Destination: &nbsp;</b></span>
                    <span class="cell">{c_destination}</span>
                </div>
                <Barcode
                    value={o_id}
                    elementTag={"canvas"}
                    options={{
                        format: "CODE128",
                        width: 2,
                        height: 27,
                        text: "",
                        textAlign: "center",
                        textPosition: "bottom",
                        textMargin: 2,
                        fontSize: 20,
                        background: "#ffffff",
                        lineColor: "#000000",
                    }}
                />
                <div class="title-bar">Amount</div>
                <div class="row">
                    <span class="cell"><b>Total Amount: &nbsp;</b></span>
                    <span class="cell">{total_amount}/-&nbsp; PKR</span>
                </div>
            </div>
            <div class="box">
                <div class="title-bar">Consignee Information</div>
                <div class="row">
                    <span class="cell"><b>Receiver: &nbsp;</b></span>
                    <span class="cell">{r_name}</span>
                </div>
                <div class="row">
                    <span class="cell"><b>Phone# 1: &nbsp;</b></span>
                    <span class="cell">{r_phone}</span>
                </div>
                <div class="row">
                    <span class="cell"><b>Phone# 2: &nbsp;</b></span>
                    <span class="cell">{r_phone_alt}</span>
                </div>
                <div class="row">
                    <span class="cell"><b>Address: &nbsp;</b></span>
                    <span class="cell"
                        >{r_house_no}, {r_street_no}, {r_address}, {r_city}</span
                    >
                </div>
            </div>
            <div class="box">
                <div class="title-bar">Sender Information</div>
                <div class="row">
                    <span class="cell"><b>Sender Name: &nbsp;</b></span>
                    <span class="cell">{s_name}</span>
                </div>
                <div class="title-bar">Return Address</div>
                <div class="row">
                    <span class="cell"><b>Address: &nbsp;</b></span>
                    <span class="cell">{ret_address}</span>
                </div>
            </div>
        </div>
        <div class="content-bottom">
            <div class="box one">
                <div class="title-bar">Order Information:</div>
            </div>
            <div class="box two">
                <div class="row">
                    <span class="cell"><b>Item ID: &nbsp;</b></span>
                    <span class="cell">{o_id}</span>
                </div>
            </div>
            <div class="box three">
                <div class="row">
                    {#each o_items as item}
                        <span class="cell">{item?.quantity} &nbsp; X &nbsp; {item?.product.name} ({item?.size})</span>
                    {/each}
                </div>
            </div>
        </div>
        <div class="bottom-id">
            <Barcode
                    value={c_tracking_id}
                    elementTag={"canvas"}
                    options={{
                        format: "CODE128",
                        width: 2,
                        height: 27,
                        text: "",
                        textAlign: "center",
                        textPosition: "bottom",
                        textMargin: 2,
                        fontSize: 20,
                        background: "#ffffff",
                        lineColor: "#000000",
                    }}
                />
        </div>
    </div>
</div>

<style>
    @media print {
  div {
    break-inside: avoid;
  }
}

    .slip {
        padding: 1rem;
        min-width: 1100px;
        max-width: 1100px;
        height: 610px;
    }

    .postex-name {
        padding: 2rem;
        display: flex;
        justify-content: space-between;
        height: 130px;
    }
    .postex-name .name {
        font-weight: 600;
        font-size: 40px;
    }
    .content {
        height: 50rem;
        /* border: solid 1.5px #000; */
    }

    .content .content-top {
        width: 100%;
        display: flex;
        padding: 0;
        margin: 0;
    }

    .content .content-bottom {
        width: 100%;
        border-left: solid 1px #000;
        border-right: solid 1px #000;
        display: flex;
    }

    .content .content-bottom > .box.one {
        flex: 1;
    }
    .content .content-bottom > .box.two {
        flex: 2;
        border-left: solid 1px #000;
    }
    .content .content-bottom > .box.three {
        flex: 3;
        border-left: solid 1px #000;
    }

    .content .content-top > .box {
        flex: 1;
        border: solid 1px #000;
    }

    .content .content-top .box > .title-bar, .content .content-bottom .box > .title-bar  {
        font-weight: 600;
        font-size: 15px;
        width: 100%;
        text-align: start;
        padding: 10px;
        background: #dcdcdc;
    }

    .content .bottom-id {
        border: solid 1px #000;
        padding: 0;
        margin: 0;
        text-align: center;
    }

    .row {
        margin: 10px;
    }
</style>
