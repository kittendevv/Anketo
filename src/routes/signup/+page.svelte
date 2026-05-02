<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import UserIcon from 'phosphor-svelte/lib/UserIcon';
	import EnvelopeIcon from 'phosphor-svelte/lib/EnvelopeIcon';
	import PasswordIcon from 'phosphor-svelte/lib/PasswordIcon';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state('');

	async function handleSubmit() {
		const { error: err } = await authClient.signUp.email({ email, password, name });
		if (err) {
			error = err.message ?? 'Something went wrong';
			return;
		}
		goto(resolve('/'));
	}
</script>

<div class="relative flex h-screen">
	<div class="w-2/5">
		<img
			src="https://picsum.photos/800/1200"
			alt="placeholder"
			class="h-full w-full object-cover"
		/>
	</div>
	<div class="flex w-3/5 flex-col items-center justify-center">
		<h1 class="text-5xl font-medium">Create an account</h1>
		<p>
			If you already have an account
			<a href={resolve('/login')} class="font-medium underline"> login </a>
			instead.
		</p>
		{#if error}
			<div class="mt-4 alert max-w-sm alert-error">{error}</div>
		{/if}
		<form onsubmit={handleSubmit} class="w-full max-w-sm">
			<fieldset class="fieldset w-full">
				<p class="text-base-content/75">Username</p>
				<label class="input w-full">
					<UserIcon />
					<input type="text" required placeholder="Username" bind:value={name} />
				</label>
				<p class="text-base-content/75">Email</p>
				<label class="input w-full">
					<EnvelopeIcon />
					<input type="email" required placeholder="Email" bind:value={email} />
				</label>
				<p class="text-base-content/75">Password</p>
				<label class="input w-full">
					<PasswordIcon />
					<input type="password" required placeholder="Password" bind:value={password} />
				</label>
				<button type="submit" class="btn mt-4 w-full btn-primary">Sign Up</button>
			</fieldset>
		</form>
	</div>
	<div class="absolute top-2 right-3">
		<span class="text-xl font-semibold">Ankēto</span>
	</div>
</div>
