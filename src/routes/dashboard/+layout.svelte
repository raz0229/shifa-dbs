<script>
    import { onMount } from "svelte";
    import Footer from "$lib/components/footer.svelte";
    import { accentColor, pageTitle } from "$lib/stores";
    import { browser } from "$app/environment";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import { auth } from "$lib/config/firebaseapp";
    import { signOut } from 'firebase/auth';
    import { isSignedIn } from '$lib/config/controllers';

    let color;
    let selected;
    let email;
    let store;

    const message = writable("");
    setContext("selected-tab", message);

    onMount(async () => {
        var elems = document.querySelectorAll(".sidenav");
        M.Sidenav.init(document.querySelectorAll(".sidenav"));

        var instances = M.Sidenav.init(elems);

        if (browser) {
            color = $accentColor;
            pageTitle.set('Shifa | Admin')
            const signedIn = await isSignedIn()
            if (!signedIn) {
              location.href = '/';
            }

            
        }
    });

    const updateContext = (e) => {
        message.set(e.detail.tab);
        selected = e.detail.tab;
        console.log(selected)
    };

    const logout = () => {
        signOut(auth).then(() => {
  			location.href = '/';
		})
    };
</script>

<nav>
    <div class="nav-wrapper {color}">
        <a href="#" data-target="mobile-demo" class="sidenav-trigger"
            ><i class="material-icons">menu</i></a
        >
        <a href="#!" class="brand-logo"
            ><img id="logo-image" src="/logo_scaled.png" alt="Factory" /></a
        >
    <ul class="right hide-on-med-and-down">
      <li>
        <a href="/dashboard/settings"
            >Settings<i class="material-icons left">settings</i></a
        >
    </li>
    <li>
        <a href="/dashboard/profile"
            >About Shifa<i class="material-icons left">store</i></a
        >
    </li>
    <li on:click={logout} class="red">
        <a>Logout<i class="material-icons white-text left">logout</i></a>
    </li>
      </ul>
    </div>
</nav>

<ul class="sidenav" id="mobile-demo">
    <!-- If logged in -->

    <div style="padding-left: 1rem;" class="login-info">
        <div class="stockImage">
            <img src={store?.stockPicture} alt="Stock" />
        </div>
        <h5><b>{store?.businessName ?? "Business Name"}</b></h5>
        <p style="margin: 0;" class="blue-text"><em>{email}</em></p>
        <h6 class="small-icons grey-text darken-4">
            <i class="material-icons left">pin_drop</i>{store?.city ??
                "Loading..."}
        </h6>
        <h6 class="small-icons grey-text darken-4">
            <i class="material-icons left">call</i><em
                >{store?.whatsAppPhoneNumber ?? "Loading..."}</em
            >
        </h6>
        <h6 class="small-icons grey-text darken-4">
            <i class="material-icons left">verified</i><em
                >{store?._id ?? "Loading..."}</em
            >
        </h6>
    </div>

    <div class="divider"></div>
    <li>
        <a href="/dashboard/settings"
            >Settings<i class="material-icons left">settings</i></a
        >
    </li>
    <li>
        <a href="/dashboard/profile"
            >About Shifa<i class="material-icons left">store</i></a
        >
    </li>
    <div class="divider"></div>
    <li on:click={logout}>
        <a>Logout<i class="material-icons red-text left">logout</i></a>
    </li>
</ul>

<slot></slot>

<Footer bind:selected on:selected={updateContext} />

<style>
    .login-info {
        margin-bottom: 2rem;
    }

    #logo-image {
        width: 10rem;
        padding: 10px;
    }

    div.stockImage {
        width: 100%;
        padding: 0.5rem;
        text-align: center;
        margin-top: 0.7rem;
    }

    div.stockImage > img {
        border-radius: 50%;
        width: 7rem;
    }

    .small-icons i {
        font-size: 20px;
    }
</style>
