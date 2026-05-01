<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { resolve } from '$app/paths';

	import UserIcon from 'phosphor-svelte/lib/UserIcon';
	import EnvelopeIcon from 'phosphor-svelte/lib/EnvelopeIcon';
	import PasswordIcon from 'phosphor-svelte/lib/PasswordIcon';

	const session = authClient.useSession();
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
		<fieldset class="fieldset w-1/3">
			<p class="text-base-content/75">Username</p>
			<label class="input w-full">
				<UserIcon />
				<input type="text" required placeholder="Username" />
			</label>

			<p class="text-base-content/75">Email</p>
			<label class="input w-full">
				<EnvelopeIcon />
				<input type="text" required placeholder="Email" />
			</label>

			<p class="text-base-content/75">Password</p>
			<label class="input w-full">
				<PasswordIcon />
				<input type="text" required placeholder="Password" />
			</label>

			<button class="btn mt-4 btn-primary">Sign Up</button>
		</fieldset>
	</div>
	<div class="absolute top-2 right-3">
		<span class="text-xl font-semibold">Ankēto</span>
	</div>
</div>
