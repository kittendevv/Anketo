<script lang="ts">
	import { resolve } from '$app/paths';

	const { title, status, updatedAt, id } = $props();
	import FileDashedIcon from 'phosphor-svelte/lib/FileDashedIcon';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';
	import TrashIcon from 'phosphor-svelte/lib/TrashIcon';

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

<a class="group my-1 rounded-box p-2 hover:bg-base-100" href={resolve(`/dashboard/forms/${id}`)}>
	<div class="flex items-center">
		<div class="flex-1">
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
		</div>

		<div class="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
			<button class="btn btn-ghost">
				<TrashIcon weight="bold" />
			</button>
		</div>
	</div>
</a>
