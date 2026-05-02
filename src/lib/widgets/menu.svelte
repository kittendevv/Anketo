<script lang="ts">
	import { resolve } from '$app/paths';

	import PlusIcon from 'phosphor-svelte/lib/PlusIcon';
	import HouseIcon from 'phosphor-svelte/lib/HouseIcon';
	import PaletteIcon from 'phosphor-svelte/lib/PaletteIcon';
	import GlobeIcon from 'phosphor-svelte/lib/GlobeIcon';
</script>

<ul class="menu w-54 rounded-box bg-base-300">
	<p class="my-2 ml-1 text-3xl font-medium">Ankēto</p>
	<li class="mb-1 rounded-box bg-primary">
		<a href={resolve('/dashboard')}>
			<PlusIcon weight="bold" />
			New Form
		</a>
	</li>
	<div class="divider"></div>
	<li class="rounded-box menu-active">
		<a href={resolve('/dashboard')}>
			<HouseIcon weight="bold" />
			Home
		</a>
	</li>
	<li>
		<a href={resolve('/dashboard')}>
			<PaletteIcon weight="bold" />
			Themes
		</a>
	</li>
	<li>
		<a href={resolve('/dashboard')}>
			<GlobeIcon weight="bold" />
			Domains
		</a>
	</li>
</ul>
