<script lang="ts">
  import { supabase } from '$lib/supabase'
  import { goto } from '$app/navigation'

  let email = ''
  let password = ''
  let rememberMe = false 
  let error = ''
  let loading = false
  let resetMsg = ''

  async function login() {
    error = ''
    loading = true

    const { error: err } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    loading = false

    if (err) {
      error = err.message
      return
    }

    // Supabase persists session automatically
    goto('/tasks')
  }

  async function resetPassword() {
    if (!email) {
      resetMsg = 'Enter your email first'
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    resetMsg = error
      ? error.message
      : 'Password reset email sent'
  }
</script>



<div class="wrapper">
  <div class="card">
    <h1>Login</h1>
    <p>Sign in to your account</p>

    <input type="email" placeholder="Email" bind:value={email} required />
    <input type="password" placeholder="Password" bind:value={password} required />

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <button class="primary" on:click={login} disabled={loading}>
      {loading ? 'Signing in...' : 'Login'}
    </button>

    <label style="display:flex; gap:0.5rem; margin-bottom:1rem;">
        <input type="checkbox" bind:checked={rememberMe} />
        Remember me
        </label>

    <p class="link">
        <a href="#" on:click|preventDefault={resetPassword}>
            Forgot password?
        </a>
        </p>

        {#if resetMsg}
        <p class="meta">{resetMsg}</p>
        {/if}

  </div>
</div>


<style>
 /* ========= DESIGN TOKENS ========= */
:root {
  --card-width: 420px;
  --form-width: 320px;

  --radius-lg: 12px;
  --radius-md: 8px;

  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2.5rem;

  --input-height: 44px;
  --button-height: 44px;

  --font-sm: 0.85rem;
  --font-md: 0.95rem;
  --font-lg: 1.75rem;
}

/* ========= WRAPPER ========= */
.wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ========= CARD ========= */
.card {
  width: 100%;
  max-width: var(--card-width);
  background: var(--card);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

/* ========= HEADINGS ========= */
h1 {
  margin: 0;
  font-size: var(--font-lg);
  font-weight: 600;
}

.subtitle {
  margin: 0;
  font-size: var(--font-md);
  color: var(--muted);
}

/* ========= FORM ========= */
.form {
  width: 100%;
  max-width: var(--form-width);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
}

/* ========= INPUTS ========= */
input {
  width: 100%;
  height: var(--input-height);
  padding: 0 0.8rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  font-size: var(--font-md);
  color: var(--text);
}

input:focus {
  outline: none;
  border-color: var(--primary);
}

/* ========= CHECKBOX ========= */
label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-sm);
  color: var(--muted);
  align-self: flex-start;
}

label input[type="checkbox"] {
  width: auto;
  height: auto;
  margin: 0;
}

/* ========= BUTTON ========= */
button {
  width: 100%;
  height: var(--button-height);
  border-radius: var(--radius-md);
  font-size: var(--font-md);
  cursor: pointer;
  border: none;
}

.primary {
  background: var(--primary);
  color: #fff;
}

.primary:hover {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ========= LINKS & META ========= */
.link {
  margin-top: var(--space-sm);
}

.link a {
  font-size: var(--font-sm);
  color: var(--primary);
  text-decoration: none;
}

.link a:hover {
  text-decoration: underline;
}

.error {
  font-size: var(--font-sm);
  color: #b91c1c;
}

.meta {
  font-size: var(--font-sm);
  color: var(--muted);
}

</style>
