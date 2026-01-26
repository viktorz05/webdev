<script>
  import { onMount } from 'svelte';

  let groups = [];
  let loading = false;
  let showForm = false;
  let formData = {
    group_name: '',
    group_type: 'family',
    suggested_guests: 1,
    contact_person: '',
    notes: ''
  };
  let searchTerm = '';

  onMount(async () => {
    loadGroups();
  });

  async function loadGroups() {
    loading = true;
    try {
      const res = await fetch('/api/admin/groups');
      if (res.ok) {
        groups = await res.json();
      }
    } catch (e) {
      console.error('Failed to load groups', e);
      alert('Error loading groups');
    } finally {
      loading = false;
    }
  }

  async function addGroup() {
    if (!formData.group_name.trim()) {
      alert('Please enter a group name');
      return;
    }

    try {
      const res = await fetch('/api/admin/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const newGroup = await res.json();
        groups = [...groups, newGroup];
        formData = {
          group_name: '',
          group_type: 'family',
          suggested_guests: 1,
          contact_person: '',
          notes: ''
        };
        showForm = false;
        alert('Group added successfully!');
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (e) {
      console.error('Failed to add group', e);
      alert('Error adding group');
    }
  }

  async function deleteGroup(id) {
    if (!confirm('Are you sure you want to delete this group?')) return;

    try {
      const res = await fetch(`/api/admin/groups/${id}`, { method: 'DELETE' });
      if (res.ok) {
        groups = groups.filter(g => g.id !== id);
        alert('Group deleted');
      } else {
        alert('Error deleting group');
      }
    } catch (e) {
      console.error('Failed to delete group', e);
    }
  }

  function generateInviteLink(token) {
    return `${window.location.origin}/?group=${encodeURIComponent(token)}`;
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }

  $: filteredGroups = groups.filter(
    g =>
      g.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.token.toLowerCase().includes(searchTerm.toLowerCase())
  );
</script>

<svelte:head>
  <title>Admin - Manage Groups</title>
</svelte:head>

<div class="admin-wrapper">
  <div class="admin-container">
    <h1>📋 Invitation Groups Manager</h1>

    <div class="controls">
      <input
        type="text"
        placeholder="Search groups..."
        bind:value={searchTerm}
        class="search-input"
      />
      <button class="btn btn-primary" on:click={() => (showForm = !showForm)}>
        {showForm ? 'Cancel' : '+ Add Group'}
      </button>
    </div>

    {#if showForm}
      <div class="form-card">
        <h2>Create New Group</h2>
        <form on:submit|preventDefault={addGroup}>
          <div class="form-group">
            <label>Group Name *</label>
            <input
              type="text"
              bind:value={formData.group_name}
              placeholder="e.g., Uncle John & Family"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Type</label>
              <select bind:value={formData.group_type}>
                <option value="family">Family</option>
                <option value="couple">Couple</option>
                <option value="individual">Individual</option>
              </select>
            </div>
            <div class="form-group">
              <label>Suggested Guests</label>
              <input type="number" bind:value={formData.suggested_guests} min="1" max="10" />
            </div>
          </div>

          <div class="form-group">
            <label>Contact Person</label>
            <input
              type="text"
              bind:value={formData.contact_person}
              placeholder="e.g., John Smith"
            />
          </div>

          <div class="form-group">
            <label>Notes</label>
            <textarea bind:value={formData.notes} placeholder="Any special notes..."></textarea>
          </div>

          <button type="submit" class="btn btn-success">Create Group</button>
        </form>
      </div>
    {/if}

    <div class="stats">
      <div class="stat-card">
        <div class="stat-number">{groups.length}</div>
        <div class="stat-label">Total Groups</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">
          {groups.reduce((sum, g) => sum + (g.suggested_guests || 1), 0)}
        </div>
        <div class="stat-label">Expected Guests</div>
      </div>
    </div>

    {#if loading}
      <p class="loading">Loading groups...</p>
    {:else if filteredGroups.length === 0}
      <p class="empty">No groups found. {groups.length === 0 ? 'Create your first one!' : 'Try a different search.'}</p>
    {:else}
      <div class="groups-grid">
        {#each filteredGroups as group (group.id)}
          <div class="group-card">
            <div class="group-header">
              <h3>{group.group_name}</h3>
              <span class="group-type" data-type={group.group_type}>{group.group_type}</span>
            </div>

            {#if group.contact_person}
              <p class="group-contact">👤 {group.contact_person}</p>
            {/if}

            <p class="group-guests">👥 {group.suggested_guests} guest{group.suggested_guests !== 1 ? 's' : ''}</p>

            {#if group.notes}
              <p class="group-notes">📝 {group.notes}</p>
            {/if}

            <div class="group-token">
              <code>{group.token}</code>
              <button
                class="btn-copy"
                title="Copy token"
                on:click={() => copyToClipboard(group.token)}
              >
                📋
              </button>
            </div>

            <div class="group-link">
              <label>Invite Link:</label>
              <div class="link-display">
                <input
                  type="text"
                  readonly
                  value={generateInviteLink(group.token)}
                  class="link-input"
                />
                <button
                  class="btn-copy"
                  title="Copy link"
                  on:click={() => copyToClipboard(generateInviteLink(group.token))}
                >
                  🔗
                </button>
              </div>
            </div>

            <button class="btn btn-delete" on:click={() => deleteGroup(group.id)}>Delete</button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .admin-wrapper {
    min-height: 100vh;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, rgba(212, 230, 207, 0.2) 0%, rgba(200, 211, 193, 0.1) 100%);
  }

  .admin-container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }

  h1 {
    color: #c4a876;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
  }

  h2 {
    color: #2d2d2d;
    margin-bottom: 1.5rem;
  }

  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .search-input {
    flex: 1;
    min-width: 250px;
    padding: 0.8rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
  }

  .search-input:focus {
    outline: none;
    border-color: #c4a876;
    box-shadow: 0 0 0 3px rgba(196, 168, 118, 0.1);
  }

  .form-card {
    background: linear-gradient(135deg, rgba(212, 230, 207, 0.1), rgba(196, 168, 118, 0.05));
    border: 2px solid #c4a876;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #2d2d2d;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #c4a876;
    box-shadow: 0 0 0 3px rgba(196, 168, 118, 0.1);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: linear-gradient(135deg, rgba(212, 230, 207, 0.2), rgba(196, 168, 118, 0.1));
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(196, 168, 118, 0.2);
    text-align: center;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #c4a876;
  }

  .stat-label {
    color: #666;
    margin-top: 0.5rem;
    font-size: 0.95rem;
  }

  .groups-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 1.5rem;
  }

  .group-card {
    background: white;
    border: 2px solid rgba(196, 168, 118, 0.2);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }

  .group-card:hover {
    border-color: #c4a876;
    box-shadow: 0 8px 25px rgba(196, 168, 118, 0.15);
  }

  .group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .group-header h3 {
    margin: 0;
    color: #2d2d2d;
    font-size: 1.3rem;
  }

  .group-type {
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .group-type[data-type='family'] {
    background: #e3f2fd;
    color: #1976d2;
  }

  .group-type[data-type='couple'] {
    background: #fce4ec;
    color: #c2185b;
  }

  .group-type[data-type='individual'] {
    background: #f3e5f5;
    color: #7b1fa2;
  }

  .group-contact,
  .group-guests,
  .group-notes {
    margin: 0.5rem 0;
    color: #666;
    font-size: 0.95rem;
  }

  .group-token {
    background: #f5f5f5;
    padding: 0.8rem;
    border-radius: 6px;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .group-token code {
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    color: #2d2d2d;
    word-break: break-all;
    flex: 1;
  }

  .group-link {
    margin: 1rem 0;
  }

  .group-link label {
    display: block;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .link-display {
    display: flex;
    gap: 0.5rem;
  }

  .link-input {
    flex: 1;
    padding: 0.6rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.85rem;
    font-family: 'Courier New', monospace;
  }

  .btn-copy {
    background: none;
    border: 1px solid #ddd;
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.2s ease;
  }

  .btn-copy:hover {
    background: #f5f5f5;
    border-color: #c4a876;
  }

  .btn {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background: #c4a876;
    color: white;
  }

  .btn-primary:hover {
    background: #a89060;
    transform: translateY(-2px);
  }

  .btn-success {
    background: #4caf50;
    color: white;
    width: 100%;
  }

  .btn-success:hover {
    background: #45a049;
  }

  .btn-delete {
    background: #f44336;
    color: white;
    width: 100%;
    margin-top: 1rem;
  }

  .btn-delete:hover {
    background: #da190b;
  }

  .loading,
  .empty {
    text-align: center;
    padding: 2rem;
    color: #666;
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    .admin-container {
      padding: 1.5rem;
    }

    .groups-grid {
      grid-template-columns: 1fr;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .controls {
      flex-direction: column;
    }

    .search-input {
      min-width: unset;
    }
  }
</style>
