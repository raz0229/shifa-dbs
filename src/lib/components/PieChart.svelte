<script>
  import { Pie } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, ArcElement);

  export let data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Indigo'],
    datasets: [
      {
        label: 'Votes',
        data: [12, 19, 3, 23, 1, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#00FFbA', '#E12FFF'],
        hoverOffset: 4
      }
    ]
  };

  export let options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: '4 Most Common Ailments Chart',
      },
    },
  };
</script>


<Pie {data} {options} />



