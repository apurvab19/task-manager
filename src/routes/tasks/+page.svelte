<script lang="ts">
  import { supabase } from '$lib/supabase'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'

  let tasks: any[] = []

  let title = ''
  let description = ''
  let priority = ''
  let due_date = ''
  let loading = false

  let editingTaskId: string | null = null
  let editTitle = ''
  let editDescription = ''
  let editPriority = ''

  /* NEW: search / filter / sort state */
  let search = ''
  let statusFilter = 'All'
  let priorityFilter = 'All'
  let sortBy = 'created_at'

  onMount(async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      goto('/login')
      return
    }
    await loadTasks()
  })

  async function loadTasks() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    tasks = data ?? []
  }

  async function addTask() {
    if (!title || !priority || !due_date) return

    loading = true
    const { data: userData } = await supabase.auth.getUser()

    await supabase.from('tasks').insert({
      user_id: userData.user.id,
      title,
      description,
      priority,
      due_date,
      status: 'Pending'
    })

    title = ''
    description = ''
    priority = ''
    due_date = ''
    loading = false

    await loadTasks()
  }

  async function deleteTask(id: string) {
    await supabase.from('tasks').delete().eq('id', id)
    await loadTasks()
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('tasks').update({ status }).eq('id', id)
    await loadTasks()
  }

  function startEdit(task: any) {
    editingTaskId = task.id
    editTitle = task.title
    editDescription = task.description
    editPriority = task.priority
  }

  async function saveEdit(id: string) {
    await supabase.from('tasks')
      .update({
        title: editTitle,
        description: editDescription,
        priority: editPriority
      })
      .eq('id', id)

    editingTaskId = null
    await loadTasks()
  }

  function cancelEdit() {
    editingTaskId = null
  }

  async function logout() {
    await supabase.auth.signOut()
    goto('/login')
  }

  /* NEW: derived filtered + sorted tasks */
  $: filteredTasks = tasks
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(t =>
      statusFilter === 'All' ? true : t.status === statusFilter
    )
    .filter(t =>
      priorityFilter === 'All' ? true : t.priority === priorityFilter
    )
    .sort((a, b) => {
      if (sortBy === 'due_date') {
        return new Date(a.due_date) - new Date(b.due_date)
      }

      if (sortBy === 'priority') {
        const order = { High: 1, Medium: 2, Low: 3 }
        return order[a.priority] - order[b.priority]
      }

      return new Date(b.created_at) - new Date(a.created_at)
    })
</script>

<!-- TOP BAR -->
<div class="top-bar">
  <button class="secondary" on:click={logout}>Logout</button>
</div>

<!-- MAIN FLEX LAYOUT -->
<div class="main-layout">

  <!-- ADD TASK -->
  <div class="wrapper">
    <div class="card">
      <h1>Add Task</h1>
      <p>Create a new task</p>

      <div class="form">
        <input placeholder="Title" bind:value={title} />
        <textarea placeholder="Description" bind:value={description}></textarea>

        <select bind:value={priority}>
          <option value="">Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input type="date" bind:value={due_date} />

        <button class="primary" on:click={addTask} disabled={loading}>
          Add Task
        </button>
      </div>
    </div>
  </div>

  <!-- TASK LIST -->
  <div class="tasks-wrapper">
    <div class="tasks-card">
      <h1>Your Tasks</h1>

      <!-- FILTERS / SEARCH / SORT -->
      <div class="form">

        <select bind:value={statusFilter}>
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select bind:value={priorityFilter}>
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select bind:value={sortBy}>
          <option value="created_at">Sort by Created Date</option>
          <option value="due_date">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </select>

        <input class="titlesearch"
          placeholder="Search by title"
          bind:value={search}
        />
      </div>

      {#if filteredTasks.length === 0}
        <p class="empty">No tasks found</p>
      {/if}

      {#each filteredTasks as task}
        <div class="task-item">

          {#if editingTaskId === task.id}
            <input bind:value={editTitle} />
            <textarea bind:value={editDescription}></textarea>

            <select bind:value={editPriority}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <div class="task-actions">
              <button class="primary" on:click={() => saveEdit(task.id)}>Save</button>
              <button class="secondary" on:click={cancelEdit}>Cancel</button>
            </div>

          {:else}
            <div class="task-header">
              <h3>{task.title}</h3>
              <span class="priority {task.priority.toLowerCase()}">
                {task.priority}
              </span>
            </div>

            <p class="desc">{task.description}</p>
            <p class="meta">
              Due: {task.due_date} · Status: {task.status}
            </p>

            <div class="task-actions">
              <button class="primary" on:click={() => updateStatus(task.id, 'Pending')}>Pending</button>
              <button class="primary" on:click={() => updateStatus(task.id, 'In Progress')}>In Progress</button>
              <button class="primary" on:click={() => updateStatus(task.id, 'Completed')}>Completed</button>
              <button class="primary" on:click={() => startEdit(task)}>Edit</button>
              <button class="primary" on:click={() => deleteTask(task.id)}>Delete</button>
            </div>
          {/if}

        </div>
      {/each}
    </div>
  </div>

</div>


<style>
* {
  box-sizing: border-box;
}

h1, h3, p {
  margin: 0;
}

p {
  color: var(--muted);
  font-size: 0.95rem;
  margin-top:20px;
  margin-bottom:20px;
}

/* TOP BAR */
.top-bar {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 2rem;
}

/* MAIN FLEX */
.main-layout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  padding: 2rem;
}

/* WRAPPERS */
.wrapper,
.tasks-wrapper {
  display: flex;
  justify-content: center;
}

/* CARDS */
.card,
.tasks-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.card {
  max-width: 420px;
  padding: 2.5rem;
  text-align: center;
}

.tasks-card {
  max-width: max-content;
  padding: 2rem;
}

/* HEADINGS */
.card h1,
.tasks-card h1 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card p {
  margin-bottom: 1.5rem;
}

/* FORM */
.form {
  max-width: max-content;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.65rem 0.75rem;
  font-size: 0.9rem;
  border-radius: 6px;
  border: 1px solid var(--border);
}

textarea {
  min-height: 70px;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--primary);
}

/* BUTTONS */
button {
  width: 110px;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}

.primary {
  background: var(--primary);
  color: #fff;
}

.secondary {
  background: #fff;
  border: 1px solid var(--border);
}

/* TASK LIST */
.task-item {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.desc {
  margin: 0.5rem 0;
}

.meta {
  font-size: 0.8rem;
  color: var(--muted);
}

.task-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* PRIORITY */
.priority {
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  border-radius: 6px;
}

.priority.low {
  background: #dcfce7;
  color: #166534;
}

.priority.medium {
  background: #fef9c3;
  color: #854d0e;
}

.priority.high {
  background: #fee2e2;
  color: #991b1b;
}

/* EMPTY */
.empty {
  text-align: center;
  color: var(--muted);
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .main-layout {
    flex-direction: column;
    align-items: center;
  }

  button {
    width: max-content;
  }
  .form input{
    width:max-content;
    height:max-content;
  }
  .titlesearch{
    width:max-content;
    height:max-content;
  }
}

/* Filters / Search / Sort layout */
.tasks-card .form {
  display: flex;
  flex-direction: row;     
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  width:max-content;
}

/* Fixed width for all filter inputs */
.tasks-card .form input,
.tasks-card .form select {
  flex: 0 0 160px;          /* FIXED WIDTH */
  max-width: max-content;
}

/* Search slightly wider (optional but nice) */
.tasks-card .form input:first-child {
  flex: 0 0 220px;
  max-width: max-content;
}

/* Mobile: stack filters */
@media (max-width: 900px) {
  .tasks-card .form {
    flex-direction: column;
    align-items: stretch;
  }

  .tasks-card .form input,
  .tasks-card .form select {
    max-width: max-content;
    height:max-content;
    flex: none;
  }
  .titlesearch{
    width:100px;
    height:100px;
  }
  @media (max-width: 900px) {
  .tasks-card .form {
    flex-direction: column;
    align-items: stretch;
  }

  .tasks-card .form input,
  .tasks-card .form select {
    width: 100%;
  }
}
}

</style>
