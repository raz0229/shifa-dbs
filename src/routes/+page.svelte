<script>
  import { isSignedIn } from "$lib/config/controllers"
  import { accentColor, pageTitle } from "$lib/stores";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { auth } from "$lib/config/firebaseapp";
  import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth"

  let email = "";
  let password = "";
  let color;
  let loading = false;

  onMount(async () => {
      if (browser) {
          color = $accentColor;
          pageTitle.set('EHR | Login')
          const signedIn = await isSignedIn()
            if (signedIn) {
              M.toast({ html: "✅ Welcome back! Redirecting..." });
              location.href = '/dashboard';
            }
      }
  });

  async function handleLogin() {
      // Add your login logic here
      if (email.trim().length !== 0 && password.trim().length !== 0) {
          try {
              loading = true;
              const uc = await signInWithEmailAndPassword(auth, email.trim(), password)
              const data = await uc.user.uid;

              loading = false;
              if (data) {
                  M.toast({ html: "✅ Welcome! Redirecting..." });
                  await setPersistence(auth, true ? browserLocalPersistence : browserSessionPersistence)
                  location.href = '/dashboard'
              } else M.toast({ html: "😡 Wrong Email or Password" });
          } catch (e) {
              M.toast({ html: "❌ Uh oh! Something went wrong" });
          }
      } else M.toast({ html: "🤦 Email/Password cannot be blank" });
  }
</script>

<div class="container">
  <div class="card login-container">
      {#if loading}
          <div style="margin-bottom: 2.5rem;" class="progress">
              <div class="indeterminate {color}"></div>
          </div>
      {/if}

      <!-- Logo Image -->
    <img src="/logo.png" alt="Logo" class="logo" />

      <h5 class="login-header">Login to Your Account</h5>

      <div class="input-field">
          <input
              type="email"
              id="email"
              bind:value={email}
              class="validate"
              required
          />
          <label for="email">Email</label>
      </div>

      <div class="input-field">
          <input
              type="password"
              id="password"
              bind:value={password}
              class="validate"
              required
          />
          <label for="password">Password</label>
      </div>

      <button
          class="btn waves-effect {color} waves-light login-btn"
          disabled={loading}
          on:click={handleLogin}
      >
          Login
      </button>
  </div>
</div>

<style>
  /* Background image for the body */
  :global(body) {
    background: url('/bg.jpg') no-repeat center center fixed;
    background-size: cover;
    font-family: 'Roboto', sans-serif;
  }

  .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    
    /* Glassmorphism styles */
    background: rgba(255, 255, 255, 0.1); /* Semi-transparent white */
    backdrop-filter: blur(5px); /* Blur effect */
    -webkit-backdrop-filter: blur(5px); /* Blur effect for Safari */
    border: 1px solid rgba(255, 255, 255, 0.3); /* Border to enhance glass effect */
  }

  .login-header {
    text-align: center;
    margin-bottom: 30px;
    color: #ffffff;
  }

  .logo {
    display: block;
    margin: 0 auto 20px auto; /* Center the image horizontally */
    max-width: 300px; /* Adjust the max width of the logo */
    height: auto;
  }

  .input-field input {
    color: #ffffff;
  }

  .input-field label {
    color: #eee;
  }
  .input-field input:focus + label {
    color: #ffffff !important;
  }

  .input-field .prefix.active {
    color: #ffffff !important;
  }

  .input-field .prefix {
    color: #ffffff;
  }

  .login-btn {
    width: 100%;
    margin-top: 20px;
    background-color: rgba(255, 255, 255, 0.2); /* Semi-transparent button */
    border: none;
    color: #ffffff;
    font-weight: bold;
  }
</style>

