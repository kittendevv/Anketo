<script lang="ts">
	import { resolve } from '$app/paths';

	const { title, status, updatedAt, id, slug } = $props();
	import FileDashedIcon from 'phosphor-svelte/lib/FileDashedIcon';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';
	import TrashIcon from 'phosphor-svelte/lib/TrashIcon';
	import ArrowSquareOutIcon from 'phosphor-svelte/lib/ArrowSquareOutIcon';

	let delete_confirm_modal = $state<HTMLDialogElement>();

	function timeAgo(dateInput: string | number | Date) {
		const timeMs = new Date(dateInput).getTime();
		const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

		const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
		const units: Intl.RelativeTimeFormatUnit[] = [
			'second',
			'minute',
			'hour',
			'day',
			'week',
			'month',
			'year'
		];

		// Find the appropriate unit
		const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
		const divider = unitIndex ? cutoffs[unitIndex - 1] : 1;

		// Format the relative time ('numeric: auto' turns "1 day ago" into "yesterday")
		const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
		return rtf.format(Math.floor(deltaSeconds / divider), units[unitIndex]);
	}
</script>

<div class="group my-1 rounded-box p-2 hover:bg-base-100">
	<div class="flex items-center">
		<a class="flex-1" href={resolve(`/dashboard/forms/${id}`)}>
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
			<!-- Notice we removed the hardcoded "ago" from the template! -->
			<p class="text-base-content/80">
				Edited {timeAgo(updatedAt)}
			</p>
		</a>

		<div class="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
			<button class="btn btn-ghost" onclick={() => delete_confirm_modal.showModal()}>
				<TrashIcon weight="bold" />
			</button>
		</div>
		{#if status === 'public'}
			<a class="btn btn-ghost" href={resolve(`/f/${slug}`)}>
				<ArrowSquareOutIcon weight="bold" />
			</a>
		{/if}
	</div>
</div>

<dialog bind:this={delete_confirm_modal} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Are you sure you want to delete {title}?</h3>
		<p class="py-4">Say your final goodbyes. There is no 'undelete' button.</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Cancel</button>
			</form>
			<form method="POST" action="?/delete">
				<input type="hidden" name="id" value={id} />
				<button class="btn btn-soft btn-error" type="submit">
					<TrashIcon weight="bold" />
					Delete
				</button>
			</form>
		</div>
	</div>
</dialog>
