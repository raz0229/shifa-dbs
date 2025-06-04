<script>
    import BillPreview from "$lib/components/bill-preview.svelte";
    import { printSet, printableItems } from '$lib/stores';
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    let entries = [];

    onMount(() => {

        if (browser) {
            const items = $printableItems;
            const set = $printSet;
            entries = items.filter(obj => set.includes(obj._id));

            setTimeout(()=>window.print(), 1500)
        }
    })

</script>


{#each entries as entry}
    <BillPreview
        courierCompany={entry.courierCompany == 'POST EX' ? 'Post EX' : entry.courierCompany}
        c_tracking_id={entry.trackingNumberPostEX}
        c_weight="_____________ grams"
        c_payment_method={entry.paymentMethod == 'cash' ? 'COD' : entry.paymentMethod}
        c_destination={entry.shippingAddress.city}
        o_id={entry.orderNumber}
        total_amount={entry.totalAmount}
        o_items={entry.orderedItems}
        r_name={entry.shippingAddress.customerName}
        r_phone={entry.shippingAddress.customerNumber}
        r_phone_alt={entry.shippingAddress.customerNumber}
        r_street_no={entry.shippingAddress.streetNumber}
        r_house_no={entry.shippingAddress.houseNumber}
        r_address={entry.shippingAddress.areaName}
        r_city={entry.shippingAddress.city}
        ret_address={entry.returnAddressForAirwaysBill}
        s_name={entry.supplierName}
    
    />
{/each}

<style>

@media print {
  div {
    break-inside: avoid;
  }
}
</style>