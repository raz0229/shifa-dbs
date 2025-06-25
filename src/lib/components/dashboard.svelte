<script context="module">
    import {
        PAST_WEEK_APPOINTMENTS_QUERY,
        TOP_CAUSE_OF_VISITS_QUERY,
        TOP_CITIES_QUERY,
    } from "$lib/config/controllers";

    function buildProgressData(results) {
        const progressData = {};

        results.forEach((item) => {
            progressData[item.city] = parseFloat(item.percentage);
        });

        return progressData;
    }

    function buildVisitCauseData(results) {
        const labels = [];
        const dataValues = [];

        results.forEach((item) => {
            labels.push(item.cause_of_visit);
            dataValues.push(parseInt(item.visit_count, 10)); // Ensure it's a number
        });

        const backgroundColors = ["#FF6384", "#36A2EB", "#FFCE56", "#00FFbA"];

        const data = {
            labels: labels,
            datasets: [
                {
                    label: "Votes",
                    data: dataValues,
                    backgroundColor: backgroundColors, // match colors to data length
                    hoverOffset: 4,
                },
            ],
        };

        return data;
    }

    // Function to get the start of the day in Unix timestamp (seconds)
    function buildChartData(results, today = new Date("2025-06-04")) {
        const labels = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const dayMap = {}; // Map to hold appointment counts by date

        results.forEach((item) => {
            dayMap[item.appointment_day] = item.appointment_count;
        });

        const dataArray = [];
        const labelArray = [];

        // Go back 7 days from today (including today)
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const isoDate = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
            const weekday = labels[date.getDay()];
            labelArray.push(weekday);
            dataArray.push(dayMap[isoDate] || 0);
        }

        const data = {
            labels: labelArray,
            datasets: [
                {
                    label: "Visitors",
                    data: dataArray,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                },
            ],
        };

        return data;
    }

    export async function getTopCities() {
        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: TOP_CITIES_QUERY,
                }),
            });

            const result = await response.json();

            let data = {
                "New York": 75,
                London: 50,
                Tokyo: 90,
            };
            if (result && result.results)
                data = buildProgressData(result.results);

            return data;
        } catch (error) {
            console.error(
                "Error fetching or processing appointment data:",
                error,
            );
            return null; // Or handle the error as appropriate
        }
    }

    export async function getTopCauseOfVisits() {
        try {
            const pieResponse = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: TOP_CAUSE_OF_VISITS_QUERY,
                }),
            });

            const resultPie = await pieResponse.json();
            let data = {
                labels: ["Red", "Blue", "Yellow", "Green", "Indigo"],
                datasets: [
                    {
                        label: "Votes",
                        data: [12, 19, 3, 23, 1, 0],
                        backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#00FFbA",
                            "#E12FFF",
                        ],
                        hoverOffset: 4,
                    },
                ],
            };

            if (resultPie && resultPie.results)
                data = buildVisitCauseData(resultPie.results);

            return data;
        } catch (error) {
            console.error(
                "Error fetching or processing appointment data:",
                error,
            );
            return null; // Or handle the error as appropriate
        }
    }

    export async function getPastWeekAppointmentsData() {
        // Calculate the Unix timestamp for one week ago from the current time
        const oneWeekAgoInSeconds =
            Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;

        try {
            const response = await fetch("/api/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: PAST_WEEK_APPOINTMENTS_QUERY,
                }),
            });

            const result = await response.json();

            // default data
            let data = {
                labels: [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                ],
                datasets: [
                    {
                        label: "Appointments",
                        data: [0, 0, 0, 0, 0, 0, 0],
                        borderColor: "rgb(75, 192, 192)",
                        tension: 0.1,
                    },
                ],
            };

            if (result && result.results) {
                data = buildChartData(result.results, new Date().toISOString().substring(0,10));
            }

            return data;
        } catch (error) {
            console.error(
                "Error fetching or processing appointment data:",
                error,
            );
            return null; // Or handle the error as appropriate
        }
    }
</script>

<script>
    import LineChart from "$lib/components/LineChart.svelte";
    import PieChart from "$lib/components/PieChart.svelte";
    import LocationList from "./LocationList.svelte";
    import { onMount } from "svelte";
    import { accentColor } from "$lib/stores";
    import { browser } from "$app/environment";
    import { sqlLogs } from "$lib/stores";

    let color;
    let pieChartData;
    let lineChartData;
    let progressData;

    $: $sqlLogs;

    onMount(() => {
        if (browser) {
            color = $accentColor;
            getPastWeekAppointmentsData().then((data) => {
                console.log(data);
                if (data) {
                    lineChartData = data;
                    const updated = [...$sqlLogs, {
                        query: PAST_WEEK_APPOINTMENTS_QUERY,
                        date: new Date().toString().substring(0, 21),
                    }];
                    sqlLogs.set(updated);
                    M.toast({html: '✔️ SQL Query Added to Logs'})
                }
            });

            getTopCauseOfVisits().then((data) => {
                console.log(data);
                if (data) {
                    pieChartData = data;
                    const updated = [...$sqlLogs, {
                        query: TOP_CAUSE_OF_VISITS_QUERY,
                        date: new Date().toString().substring(0, 21),
                    }];
                    sqlLogs.set(updated);
                    M.toast({html: '✔️ SQL Query Added to Logs'})
                }
            });

            getTopCities().then((data) => {
                console.log(data);
                if (data) {
                    progressData = data;
                    const updated = [...$sqlLogs, {
                        query: TOP_CITIES_QUERY,
                        date: new Date().toString().substring(0, 21),
                    }];
                    sqlLogs.set(updated);
                    M.toast({html: '✔️ SQL Query Added to Logs'})
                }
            });
        }
    });
</script>

<div class="container">
    <h5 class="grey-text">◉ Past Week Visits</h5>
    <div class="chart-container">
        <LineChart bind:data={lineChartData} />
    </div>
</div>
<div class="container two">
    <h5 class="grey-text">◉ Common Diseases</h5>

    <div class="chart-container">
        <PieChart bind:data={pieChartData} />
    </div>
</div>
<div class="container three">
    <h5 class="grey-text">◉ Patients by Location</h5>
    <div class="chart-container">
        <LocationList bind:data={progressData} />
    </div>
</div>

<style>
    .container {
        width: 100%;
        padding: 1rem;
    }
    .three {
        margin-bottom: 6rem;
    }
    .chart-bg {
        border-radius: 15px;
    }
    .loader-container {
        width: 100%;
        padding: 3rem;
        text-align: center;
    }
    .chart-container {
        max-width: 600px;
        margin: 2rem auto; /* top-bottom spacing, horizontally centered */
        padding: 1rem;
    }
</style>
