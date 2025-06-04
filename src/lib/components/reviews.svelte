<script>
    import { accentColor } from "$lib/stores";

    let color = $accentColor;

    const selectIteminUI = (e) => {

        document.querySelectorAll('.item').forEach(elem => {
            elem.classList.remove(`${color}`)
            elem.classList.remove('white-text')
        })

        e.target.classList.add(`${color}`)
        e.target.classList.add('white-text')
    }

</script>

<div class="time-container">
    <span on:click={selectIteminUI} class="item white-text {color}">7D</span>
    <span on:click={selectIteminUI} class="item">1M</span>
    <span on:click={selectIteminUI} class="item">6M</span>
    <span on:click={selectIteminUI} class="item">1Y</span>
    <span on:click={selectIteminUI} class="item">All</span>
</div>

<div class="reviews-count">
    <div class="bad">
        <div class="content">
            <div class="count" style="display: flex; justify-content: center">
                <i style="font-size: 3rem; margin-right: 5px;" class="material-icons red-text text-darken-1">thumb_down</i>
                <span style="font-size: 2rem;">0</span>
            </div>
            <div style="font-size: 1rem; text-align: center; padding: 0.5rem;">Bad (1-3) Stars</div>
        </div>
    </div>
    <div class="good">
        <div class="content">
            <div class="count" style="display: flex; justify-content: center">
                <i style="font-size: 3rem; margin-right: 5px;" class="material-icons green-text text-darken-1">thumb_up</i>
                <span style="font-size: 2rem;">0</span>
            </div>
            <div style="font-size: 1rem; text-align: center; padding: 0.5rem;">Good (4-5) Stars</div>
        </div>
    </div>
</div>

<div style="text-align: center;" class="no-data">
    <img src="/no_data.png" alt="x_x No Data" />
</div>

<style>
    .reviews-count {
        margin: 1rem;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }
    .reviews-count .bad {
        border-radius: 8px;
        border: solid 2px crimson;
        flex: 1;
    }
    .reviews-count .good {
        border-radius: 8px;
        border: solid 2px green;
        flex: 1;
    }
    .reviews-count .content {
        padding: 1rem;
    }
    .time-container {
        margin: 1rem;
        display: flex;
        justify-content: space-between;
        overflow-x: scroll;
        border-radius: 8px;
        background-color: #e7e6e6;
    }
    .time-container .item {
        padding: 1rem;
        font-size: larger;
        font-weight: 600;
        border-radius: 8px;
    }
    .no-data img {
        width: 20rem;
        filter: hue-rotate(45deg);
    }
</style>