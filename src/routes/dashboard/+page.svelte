<script lang="ts">
	let { data }: { data: PageData } = $props();
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';

	import PlusIcon from 'phosphor-svelte/lib/PlusIcon';
	import FormCard from '$lib/widgets/formcard.svelte';
</script>

<div class="mx-25 my-5">
	<div class="flex">
		<h1 class="flex-1 text-4xl font-bold">Your forms</h1>
		<a
			href={resolve('/dashboard/forms/new')}
			class="flex items-center rounded-box bg-primary px-3 py-1"
		>
			<PlusIcon weight="bold" class="mr-1" />
			New Form
		</a>
	</div>
	<div class="divider"></div>
	<div class="flex flex-col">
		{#each data.forms as form (form.id)}
			<FormCard title={form.title} status={form.status} updatedAt={form.updatedAt} id={form.id} />
		{:else}
			<p>No forms yet</p>
		{/each}
	</div>
</div>
