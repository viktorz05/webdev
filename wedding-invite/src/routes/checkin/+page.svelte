<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let message = '';
	let isError = false;
	let isLoading = true;

	onMount(async () => {
		const token = $page.url.searchParams.get('token');
		
		if (!token) {
			message = 'No token provided';
			isError = true;
			isLoading = false;
			return;
		}

		try {
			const response = await fetch('/api/checkin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token })
			});

			const result = await response.json();

			if (result.ok) {
				message = `✓ ${result.message}`;
				isError = false;
			} else {
				message = `✗ ${result.error}`;
				isError = true;
			}
		} catch (e) {
			message = `✗ Error: ${e.message}`;
			isError = true;
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="container">
	{#if isLoading}
		<div class="spinner">Checking in...</div>
	{:else}
		<div class="message" class:error={isError}>
			{message}
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.spinner {
		font-size: 2rem;
		color: white;
		animation: spin 1s linear infinite;
	}

	.message {
		font-size: 2rem;
		color: #2ecc71;
		text-align: center;
		padding: 2rem;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
	}

	.message.error {
		color: #e74c3c;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
