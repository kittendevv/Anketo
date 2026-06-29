<script lang="ts">
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	const session = authClient.useSession();

	import SignInIcon from 'phosphor-svelte/lib/SignInIcon';
	import TableIcon from 'phosphor-svelte/lib/TableIcon';
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<a class="btn text-xl font-medium btn-ghost" href="/">Ankēto</a>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal items-center gap-1 px-1">
			<li>
				<a href="#pricing">Pricing</a>
			</li>
			{#if $session.data?.user}
				<li>
					<a href={resolve('/dashboard')} class="btn btn-primary">
						<TableIcon weight="bold" />
						Dashboard
					</a>
				</li>
			{:else}
				<li>
					<a href={resolve('/signup')}>Signup</a>
				</li>
				<li>
					<a href={resolve('/login')} class="btn btn-primary">
						<SignInIcon weight="bold" />
						Login
					</a>
				</li>
			{/if}
		</ul>
	</div>
</div>

<h1>{$session.data?.user?.name}</h1>

<h1>A form builder that doesn't fight back</h1>
