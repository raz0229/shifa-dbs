<script>
  import { onMount } from 'svelte';
  import { accentColor } from '$lib/stores';
  import { browser } from '$app/environment';

  let color;

  const devs = [
    {
      name: "Abdullah Zafar",
      profileImage: "/profile.jpg",
      username: "@raz0229",
      registration: "L1F23BSAI0054"
    },
    {
      name: "Abdurrehman",
      profileImage: "/profile2.jpg",
      username: "@r3hman_007",
      registration: "L1F23BSAI0050"
    }
  ];

  let currentIndex = 0;
  let currentDev = devs[currentIndex];

  function switchDev(index) {
    currentIndex = index;
    currentDev = devs[index];
  }

  onMount(() => {
    if (browser)
      color = $accentColor;

    M.Tabs.init(document.querySelectorAll('.tabs'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.ScrollSpy.init(document.querySelectorAll('.scrollspy'), { scrollOffset: 50 });
  });
</script>

<style>
  .about-container {
    margin-top: 3rem;
    margin-bottom: 8rem;
  }

  .profile-img, .logo-img {
    max-width: 260px;
    margin: 1rem auto;
    display: block;
  }

  .profile-img {
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  .profile-img:hover {
    transform: scale(1.05);
  }

  .logo-img {
    filter: invert(1);
  }

  .section-title {
    margin-bottom: 1rem;
  }

  .card-content {
    min-height: 200px;
  }

  .github-btn {
    margin-top: 1rem;
  }

  .switch-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .switch-buttons .btn {
    border-radius: 20px;
  }

  @media (max-width: 600px) {
    .switch-buttons {
      /* flex-direction: column; */
      align-items: center;
    }
  }
</style>

<div class="container about-container">
  <button 
    class="btn-small white black-text go_back"
    on:click={() => location.href = '/dashboard'}
  >
    <i class="material-icons">arrow_back</i>
  </button>

  <div class="row center-align">
    <h4 class="section-title">About</h4>
    <img src="/logo.png" alt="App Logo" class="logo-img z-depth-2 tooltipped" data-tooltip="Shifa DBs Logo">
  </div>

  <div class="row">
    <div class="col s12 m8 offset-m2">
      <ul class="tabs">
        <li class="tab col s6"><a class="active" href="#project">Project</a></li>
        <li class="tab col s6"><a href="#developer">Developers</a></li>
      </ul>
    </div>
  </div>

  <!-- Project Info -->
  <div id="project" class="col s12">
    <div class="card hoverable z-depth-3">
      <div class="card-content">
        <span class="card-title">Project Description</span>
        <p>
          <b>Shifa DBs</b> is a semester-final project for the Database Systems course and a fully functional
          PWA (Progressive Web App) for managing Electronic Health Records (EHR). Built with <b>SvelteKit</b> and styled
          using <b>MaterializeCSS</b>, it interfaces with a MySQL database hosted on <em>freesqldatabase.com</em>.
        </p>
        <p>
          The app allows secure login via Firebase Authentication, lets users add/remove patients, manage doctors, write prescriptions,
          and book appointments. A standout feature is the <b>real-time SQL logs</b> that offer full transparency of backend queries,
          making it an ideal demonstration of using SQL in real-world health data systems.
        </p>
        <div class="center-align github-btn">
          <a class="btn waves-effect waves-light {color}" href="https://github.com/raz0229/shifa-dbs" target="_blank">
            <i class="material-icons left">code</i> View on GitHub
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Developer Info -->
  <div id="developer" class="col s12">
    <div class="switch-buttons">
      <button class="btn waves-effect {color} tooltipped" data-tooltip="View Abdullah's Info" on:click={() => switchDev(0)}>
        Abdullah Zafar
      </button>
      <button class="btn waves-effect {color} tooltipped" data-tooltip="View Abdurrehman's Info" on:click={() => switchDev(1)}>
        Abdurrehman
      </button>
    </div>

    <div class="card hoverable z-depth-3">
      <div class="card-content center-align">
        <img src={currentDev.profileImage} alt={currentDev.name} class="profile-img z-depth-1 tooltipped" data-tooltip={currentDev.name}>
        <span class="card-title">{currentDev.name}</span>
        <p><em class="indigo-text">{currentDev.username}</em></p>
        <p>Registration: <b>{currentDev.registration}</b></p>
        <p>Course Instructor: <b>Mam Maida Sajid</b></p>
      </div>
    </div>
  </div>
</div>
