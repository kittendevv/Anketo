<script lang="ts">
	let { children } = $props();
	import Menu from '$lib/widgets/menu.svelte';
</script>

<div class="flex h-full min-h-screen">
	<Menu />
	<div class="h-full flex-1">
		{@render children()}
	</div>
</div>
