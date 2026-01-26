<script>
	import { onMount } from 'svelte';

	let rsvps = [];
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/admin/rsvps');
			if (!response.ok) throw new Error('Failed to load RSVPs');
			rsvps = await response.json();
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	});

	function downloadCSV() {
		const headers = ['Name', 'Guests', 'Attendance', 'Checked In', 'Song Request', 'Message'];
		const rows = rsvps.map(r => [
			r.name || 'Guest',
			r.guests || 1,
			r.attendance || 'Not specified',
			r.checked_in_count || 0,
			r.song_request || '',
			r.message || ''
		]);

		const csv = [headers, ...rows].map(row => 
			row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')
		).join('\n');

		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `wedding_rsvps_${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="container">
	<h1>Wedding Check-In Dashboard</h1>
	
	{#if loading}
		<p>Loading...</p>
	{:else if error}
		<p class="error">Error: {error}</p>
	{:else}
		<button class="download-btn" on:click={downloadCSV}>
			📥 Download CSV
		</button>

		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Total Guests</th>
						<th>Checked In</th>
						<th>Attendance</th>
						<th>Song Request</th>
						<th>Message</th>
					</tr>
				</thead>
				<tbody>
					{#each rsvps as rsvp (rsvp.id)}
						<tr class:checked-in={rsvp.checked_in_count > 0}>
							<td>{rsvp.name || 'Guest'}</td>
							<td>{rsvp.guests || 1}</td>
							<td class="checked-in-count">{rsvp.checked_in_count || 0}</td>
							<td>{rsvp.attendance || '—'}</td>
							<td>{rsvp.song_request || '—'}</td>
							<td>{rsvp.message || '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="stats">
			<div class="stat">
				<span class="label">Total RSVPs:</span>
				<span class="value">{rsvps.length}</span>
			</div>
			<div class="stat">
				<span class="label">Checked In:</span>
				<span class="value">{rsvps.filter(r => r.checked_in_count > 0).length}</span>
			</div>
			<div class="stat">
				<span class="label">Total Guests:</span>
				<span class="value">{rsvps.reduce((sum, r) => sum + (r.guests || 1), 0)}</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	h1 {
		color: #333;
		margin-bottom: 2rem;
		text-align: center;
	}

	.download-btn {
		background: #667eea;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
		margin-bottom: 2rem;
		transition: background 0.3s;
	}

	.download-btn:hover {
		background: #5568d3;
	}

	.table-wrapper {
		overflow-x: auto;
		margin-bottom: 2rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	thead {
		background: #f5f5f5;
	}

	th, td {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid #eee;
	}

	th {
		font-weight: 600;
		color: #333;
	}

	tr:hover {
		background: #f9f9f9;
	}

	tr.checked-in {
		background: #f0f9f0;
	}

	.checked-in-count {
		font-weight: 600;
		color: #2ecc71;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.stat {
		background: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label {
		color: #666;
		font-weight: 500;
	}

	.value {
		font-size: 1.5rem;
		font-weight: 600;
		color: #667eea;
	}

	.error {
		color: #e74c3c;
		padding: 1rem;
		background: #fef5f5;
		border-radius: 0.5rem;
	}
</style>
