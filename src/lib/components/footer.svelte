<script>
    import { accentColor } from "$lib/stores"
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    let color;
    export let selected = 'Stats';
    

    /* Strict component binding with text property
      Handle with care
    */
    const navs = [
        {
            text: 'Stats',
            href: '/dashboard/overview',
            icon: 'analytics',
            hide: false
        },
        {
            text: 'Appointments',
            href: '/dashboard/bills',
            icon: 'payments',
            hide: false
        },
        {
            text: 'Patients',
            href: '/reviews', // dynamic redirect
            icon: 'personal_injury',
            hide: false
        },
        {
            text: 'Logs',
            href: '/reviews', // dynamic redirect
            icon: 'folder_open',
            hide: false
        }
    ]

    onMount(() => {
     // M.Tabs.init(document.querySelectorAll('.tabs'));
      if (browser)
        color = $accentColor;
    })

    const redirectTo = (nav) => {
      selected = nav.text;
      dispatch('selected', {
        tab: selected
      })
    }

</script>

<footer class="{color}" id="footer">
  {#each navs as nav, i}
  <li ><a on:click={()=>redirectTo(nav)}><i class:white={selected==nav.text} class="{ selected==nav.text ? color : 'white' }-text material-icons">{nav.icon}</i><span class="white-text" class:hide="{ nav.hide }">{nav.text}</span></a></li>
{/each}
</footer>

  <style>
    
#footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  list-style: none;
  position: fixed;
  bottom: 0rem;
  padding: 0.6rem;
  z-index: 9;
}

li {
  flex: 1;
}

li a{
  display: grid;
  place-items: center;
  grid-row-gap: 10px;
  font-size: large;
  cursor: pointer;
}

li a > span {
  font-size: 14px;
  font-weight: 600;
  color: rgb(54, 54, 54);
}

li a > i {
    width: 100%;
    padding: 10px;
    text-align-last: center;
    border-radius: 25px;
}


  </style>