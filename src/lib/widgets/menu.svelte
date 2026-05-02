<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	const session = authClient.useSession();

	import HouseIcon from 'phosphor-svelte/lib/HouseIcon';
	import PaletteIcon from 'phosphor-svelte/lib/PaletteIcon';
	import GlobeIcon from 'phosphor-svelte/lib/GlobeIcon';
	import GearIcon from 'phosphor-svelte/lib/GearIcon';
	import SignOutIcon from 'phosphor-svelte/lib/SignOutIcon';
</script>

<ul class="menu w-54 rounded-box bg-base-300">
	<div class="flex-1">
		<p class="my-2 ml-1 text-3xl font-medium">Ankēto</p>

		<div class="divider"></div>
		<li class="rounded-box" class:menu-active={$page.url.pathname === '/dashboard'}>
			<a href={resolve('/dashboard')}>
				<HouseIcon weight="bold" />
				Home
			</a>
		</li>
		<li class="rounded-box" class:menu-active={$page.url.pathname === '/dashboard/themes'}>
			<a href={resolve('/dashboard/themes')}>
				<PaletteIcon weight="bold" />
				Themes
			</a>
		</li>
		<li class="rounded-box" class:menu-active={$page.url.pathname === '/dashboard/domains'}>
			<a href={resolve('/dashboard/domains')}>
				<GlobeIcon weight="bold" />
				Domains
			</a>
		</li>
		<li class="rounded-box" class:menu-active={$page.url.pathname === '/dashboard/settings'}>
			<a href={resolve('/dashboard/settings')}>
				<GearIcon weight="bold" />
				Settings
			</a>
		</li>
	</div>
	<div class="flex-0">
		<p class="text-md ml-3 font-medium">{$session.data?.user?.name}</p>
		<li>
			<a href={resolve('/dashboard')}>
				<SignOutIcon weight="bold" />
				Logout
			</a>
		</li>
	</div>
</ul>
