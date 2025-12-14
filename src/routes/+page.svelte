<script>
  import { goto } from '$app/navigation'
</script>

<div class="wrapper">
  <div class="card">
    <h1>Task Management App</h1>
    <p>
      A simple and secure way to manage your tasks.
    </p>

    <div class="actions">
      <button class="primary" on:click={() => goto('/signup')}>
        Create Account
      </button>

      <button class="secondary" on:click={() => goto('/login')}>
        Login
      </button>
    </div>
  </div>
</div>

<style>
  .wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

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
    margin-bottom: 2rem;
    color: var(--muted);
    font-size: 0.95rem;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
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

  .secondary {
    background-color: white;
    border: 1px solid var(--border);
    color: var(--text);
  }

  .secondary:hover {
    background-color: #f1f5f9;
  }
</style>
