<script lang="ts">
	import { resolve } from '$app/paths';

	const { title, status, updatedAt, id } = $props();
	import FileDashedIcon from 'phosphor-svelte/lib/FileDashedIcon';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';
</script>

<a
	class="my-1 rounded-box p-2 hover:cursor-pointer hover:bg-base-100"
	href={resolve(`/dashboard/forms/${id}`)}
>
	<div class="flex items-center">
		<p class="mr-2 text-xl">{title}</p>
		{#if status === 'draft'}
			<div class="flex flex-row items-center rounded-box bg-neutral/40 px-3 py-1 text-xs">
				<FileDashedIcon weight="bold" class="mr-1" />
				Draft
			</div>
		{:else}
			<div class="flex flex-row items-center rounded-box bg-neutral px-3 py-1 text-xs">
				<PaperPlaneTiltIcon weight="bold" class="mr-1" />
				Public
			</div>
		{/if}
	</div>
	<p class="text-base-content/80">Edited {updatedAt} ago</p>
</a>
