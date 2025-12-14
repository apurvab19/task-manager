<script lang="ts">
  import { supabase } from '$lib/supabase'

  let email = ''
  let password = ''
  let msg = ''
  let loading = false

  async function signup() {
    msg = ''
    loading = true

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    loading = false

    if (error) {
      msg = error.message
    } else {
      msg = 'Check your email to confirm your account'
    }
  }
</script>

<div class="wrapper">
  <div class="card">
    <h1>Create Account</h1>
    <p>Sign up to start managing your tasks</p>

    <input type="email" placeholder="Email" bind:value={email} required />
    <input type="password" placeholder="Password" bind:value={password} required />

    {#if msg}
      <p class="message">{msg}</p>
    {/if}

    <button class="primary" on:click={signup} disabled={loading}>
      {loading ? 'Creating account...' : 'Sign Up'}
    </button>

    <p class="link">
      Already have an account?
      <a href="/login">Login</a>
    </p>
  </div>
</div>


<style>
  /* same wrapper as landing & login */
  .wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* same card styling */
  .card {
    width: 100%;
    max-width: 420px;
    background: var(--card);
    padding: 2.5rem;
    border-radius: 12px;
    border: 1px solid var(--border);
    text-align: center;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h1 {
    margin-bottom: 0.75rem;
    font-size: 1.75rem;
    font-weight: 600;
  }

  p {
    margin-bottom: 1.5rem;
    color: var(--muted);
    font-size: 0.95rem;
  }

  input {
    width: 100%;
    max-width: 300px;
    padding: 0.65rem 0.75rem;
    margin-bottom: 0.75rem;
    border-radius: 6px;
    border: 1px solid var(--border);
    font-size: 0.9rem;
    color: var(--text);
  }

  input:focus {
    outline: none;
    border-color: var(--primary);
  }

  button {
    padding: 0.7rem 1rem;
    border-radius: 8px;
    font-size: 0.95rem;
    cursor: pointer;
    border: none;

    width: 160px;
    text-align: center;
  }

  .primary {
    background-color: var(--primary);
    color: white;
  }

  .primary:hover {
    opacity: 0.9;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .message {
    color: var(--text);
    margin-bottom: 1rem;
    font-size: 0.85rem;
  }
</style>
