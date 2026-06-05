<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { ViewConfig } from '$lib/types';
	import type { Component } from 'svelte';

	// icons
	import CalendarIcon from 'phosphor-svelte/lib/CalendarIcon';
	import TextTIcon from 'phosphor-svelte/lib/TextTIcon';
	import TextAlignLeftIcon from 'phosphor-svelte/lib/TextAlignLeftIcon';
	import HashIcon from 'phosphor-svelte/lib/HashIcon';
	import RadioButtonIcon from 'phosphor-svelte/lib/RadioButtonIcon';
	import CheckSquareIcon from 'phosphor-svelte/lib/CheckSquareIcon';
	import AtIcon from 'phosphor-svelte/lib/AtIcon';
	import CalendarBlankIcon from 'phosphor-svelte/lib/CalendarBlankIcon';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import QuestionIcon from 'phosphor-svelte/lib/QuestionIcon';

	type FieldValue = string | number | boolean | string[] | null | undefined;
	interface FormField {
		type: string;
		label?: string;
		fields?: FormField[];
	}
	interface Submission {
		id: string;
		submittedAt: string | number | Date;
		schema: FormField[] | null;
		data: Record<string, FieldValue>;
	}
	interface SavedView {
		id: string;
		name: string;
		config: ViewConfig;
	}
	interface PageData {
		submissions: Submission[];
		views: SavedView[];
	}
	interface Column {
		label: string;
		type: string;
	}

	let { data }: { data: PageData } = $props();

	// — active view from URL
	const activeViewId = $derived(page.url.searchParams.get('view'));
	const activeView = $derived(data.views.find((v) => v.id === activeViewId) ?? null);

	// — draft config (local state while editing)
	let draftName = $state('New view');
	let draftColumns = $state<Column[]>([]);
	let draftFilters = $state<ViewConfig['filters']>([]);
	let draftSort = $state<ViewConfig['sort']>(null);
	let panelOpen = $state(false);

	// — derive all columns from first submission's schema
	const allColumns = $derived.by(() => {
		if (!data.submissions.length) return [];
		const schema = data.submissions[0]?.schema;
		if (!schema) return [];
		const fields: Column[] = [];
		const collect = (nodes: FormField[]) => {
			for (const node of nodes) {
				if (node.type === 'section' && node.fields) collect(node.fields);
				else if (node.label) fields.push({ label: node.label, type: node.type });
			}
		};
		collect(schema);
		return fields;
	});
	// — open panel seeded with active view or defaults
	function openPanel(view: SavedView | null) {
		draftName = view?.name ?? 'New view';
		draftColumns = view?.config.columns ?? [...allColumns];
		draftFilters = view?.config.filters ?? [];
		draftSort = view?.config.sort ?? null;
		panelOpen = true;
	}

	function toggleColumn(col: Column) {
		draftColumns = draftColumns.some((c) => c.label === col.label)
			? draftColumns.filter((c) => c.label !== col.label)
			: [...draftColumns, col];
	}

	function addFilter() {
		draftFilters = [...draftFilters, { field: allColumns[0].label, op: 'eq', value: '' }];
	}

	function removeFilter(i: number) {
		draftFilters = draftFilters.filter((_, idx) => idx !== i);
	}

	// — visible columns: use active view's or all
	const visibleColumns = $derived(activeView ? activeView.config.columns : allColumns);

	// — apply filters + sort client-side
	const visibleSubmissions = $derived.by(() => {
		const config: ViewConfig = activeView
			? activeView.config
			: { columns: allColumns, filters: [], sort: null };

		let rows = [...data.submissions];

		for (const f of config.filters) {
			rows = rows.filter((row) => {
				const val = String(row.data[f.field] ?? '').toLowerCase();
				const target = f.value.toLowerCase();
				if (f.op === 'eq') return val === target;
				if (f.op === 'contains') return val.includes(target);
				const num = parseFloat(val);
				if (f.op === 'gt') return num > parseFloat(target);
				if (f.op === 'lt') return num < parseFloat(target);
				return true;
			});
		}

		if (config.sort) {
			const { field, dir } = config.sort;
			rows.sort((a, b) => {
				const av = String(a.data[field] ?? '');
				const bv = String(b.data[field] ?? '');
				return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
			});
		}

		return rows;
	});

	const fieldIcons: Record<string, Component> = {
		text: TextTIcon,
		textarea: TextAlignLeftIcon,
		number: HashIcon,
		radio: RadioButtonIcon,
		checkbox: CheckSquareIcon,
		email: AtIcon,
		date: CalendarBlankIcon,
		dropdown: CaretDownIcon
	};
</script>

<div class="mx-auto max-w-6xl p-8">
	<!-- header -->
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Submissions</h1>
		<button class="btn btn-outline btn-sm" onclick={() => openPanel(null)}> + New view </button>
	</div>

	<!-- view tabs -->
	{#if data.views.length}
		<div role="tablist" class="tabs-border mb-4 tabs">
			<a role="tab" class="tab {!activeViewId ? 'tab-active' : ''}" href="?"> All responses </a>
			{#each data.views as view (view.id)}
				<a
					role="tab"
					class="tab {activeViewId === view.id ? 'tab-active' : ''}"
					href="?view={view.id}"
				>
					{view.name}
				</a>
			{/each}
		</div>
	{/if}

	{#if data.submissions.length === 0}
		<div class="rounded-xl bg-base-200 p-12 text-center text-base-content/60">
			No submissions yet. Share your form link to start collecting responses!
		</div>
	{:else}
		<!-- active view actions -->
		{#if activeView}
			<div class="mb-3 flex items-center gap-2">
				<button class="btn btn-ghost btn-xs" onclick={() => openPanel(activeView)}>
					Edit view
				</button>
				<form
					method="POST"
					action="?/deleteView"
					use:enhance={() =>
						async ({ update }) => {
							await update();
							goto('?');
						}}
				>
					<span class="ml-auto text-xs text-base-content/40">
						{visibleSubmissions.length} of {data.submissions.length} responses
					</span>
				</form>
			</div>
		{/if}

		<div class="overflow-x-auto">
			<table class="table table-sm">
				<thead>
					<tr>
						<th class="flex items-center gap-1 text-base-content/50">
							<CalendarIcon weight="bold" />
							Submitted
						</th>
						{#each visibleColumns as col (col.label)}
							{@const Icon = fieldIcons[col.type] ?? QuestionIcon}
							<th class="max-w-48 truncate">
								<span class="flex items-center gap-1">
									<Icon weight="bold" size={14} class="text-base-content/40" />
									{col.label}
								</span>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each visibleSubmissions as submission (submission.id)}
						<tr class="hover">
							<td class="text-xs whitespace-nowrap text-base-content/50">
								{new Date(submission.submittedAt).toLocaleString()}
							</td>
							{#each visibleColumns as col (col)}
								{@const val = submission.data[col.label]}
								<td class="max-w-56 truncate">
									{#if Array.isArray(val)}
										{(val as string[]).join(', ')}
									{:else}
										{val ?? '—'}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- config panel -->
{#if panelOpen}
	<div
		class="fixed inset-0 z-40 bg-black/30"
		role="button"
		tabindex="-1"
		onclick={() => (panelOpen = false)}
		onkeydown={(e) => e.key === 'Escape' && (panelOpen = false)}
	></div>
	<div class="fixed top-0 right-0 z-50 flex h-full w-80 flex-col bg-base-100 shadow-xl">
		<div class="flex items-center justify-between border-b border-base-300 p-4">
			<input
				class="input input-sm w-full font-medium"
				bind:value={draftName}
				placeholder="View name"
			/>
			<button class="btn ml-2 btn-ghost btn-sm" onclick={() => (panelOpen = false)}>✕</button>
		</div>

		<div class="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
			<!-- columns -->
			<div>
				<p class="mb-2 text-xs font-semibold text-base-content/50 uppercase">Columns</p>
				<div class="flex flex-col gap-1">
					{#each allColumns as col (col)}
						<label
							class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-base-200"
						>
							<input
								type="checkbox"
								class="checkbox checkbox-xs"
								checked={draftColumns.some((c) => c.label === col.label)}
								onchange={() => toggleColumn(col)}
							/>
							<span class="truncate text-sm">{col.label}</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- filters -->
			<div>
				<p class="mb-2 text-xs font-semibold text-base-content/50 uppercase">Filters</p>
				<div class="flex flex-col gap-2">
					{#each draftFilters as filter, i (i)}
						<div class="flex flex-col gap-1 rounded bg-base-200 p-2">
							<div class="flex items-center gap-1">
								<select class="select flex-1 select-xs" bind:value={filter.field}>
									{#each allColumns as col (col)}
										<option value={col.label}>{col.label}</option>
									{/each}
								</select>
								<button class="btn text-error btn-ghost btn-xs" onclick={() => removeFilter(i)}
									>✕</button
								>
							</div>
							<select class="select select-xs" bind:value={filter.op}>
								<option value="eq">equals</option>
								<option value="contains">contains</option>
								<option value="gt">greater than</option>
								<option value="lt">less than</option>
							</select>
							<input class="input input-xs" placeholder="Value" bind:value={filter.value} />
						</div>
					{/each}
					<button class="btn self-start btn-ghost btn-xs" onclick={addFilter}>+ Add filter</button>
				</div>
			</div>

			<!-- sort -->
			<div>
				<p class="mb-2 text-xs font-semibold text-base-content/50 uppercase">Sort</p>
				{#if draftSort}
					<div class="flex gap-1">
						<select class="select flex-1 select-xs" bind:value={draftSort.field}>
							{#each allColumns as col (col)}
								<option value={col.label}>{col.label}</option>
							{/each}
						</select>
						<select class="select select-xs" bind:value={draftSort.dir}>
							<option value="asc">asc</option>
							<option value="desc">desc</option>
						</select>
						<button class="btn text-error btn-ghost btn-xs" onclick={() => (draftSort = null)}
							>✕</button
						>
					</div>
				{:else}
					<button
						class="btn btn-ghost btn-xs"
						onclick={() => (draftSort = { field: allColumns[0].label, dir: 'asc' })}
					>
						+ Add sort
					</button>
				{/if}
			</div>
		</div>

		<!-- save -->
		<form
			method="POST"
			action="?/saveView"
			use:enhance={() =>
				async ({ update }) => {
					await update();
					panelOpen = false;
				}}
		></form>
	</div>
{/if}
