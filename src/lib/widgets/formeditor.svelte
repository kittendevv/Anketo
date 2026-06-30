<script lang="ts">
	// external imports
	import { resolve } from '$app/paths';
	import { untrack } from 'svelte';
	import { page } from '$app/state';

	import CodeMirror from 'svelte-codemirror-editor';
	import { anketoTheme } from '$lib/editor/theme';
	import { anketoLanguage, anketoHighlighting } from '$lib/editor/language';

	// internal imports
	import { parse } from '$lib/parser';
	import FormRenderer from '$lib/form/FormRenderer.svelte';

	// icons
	import FloppyDiskIcon from 'phosphor-svelte/lib/FloppyDiskIcon';
	import FileDashedIcon from 'phosphor-svelte/lib/FileDashedIcon';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';
	import ArrowSquareOutIcon from 'phosphor-svelte/lib/ArrowSquareOutIcon';
	import ChatCircleTextIcon from 'phosphor-svelte/lib/ChatCircleTextIcon';

	// variables
	let {
		initial,
		status,
		id,
		slug
	}: {
		initial: string;
		status: 'draft' | 'public';
		id: string;
		slug?: string;
	} = $props();

	let value = $state(untrack(() => initial));

	let parsed = $derived(parse(value));

	let unpublish_confirm_modal = $state<HTMLDialogElement>();
	let publish_confirm_modal = $state<HTMLDialogElement>();
</script>

<div class="flex h-screen flex-col">
	<div class="flex h-15 flex-none items-center bg-base-300 px-4">
		<div class="flex flex-1 items-center text-xl">
			{parsed.frontmatter?.title ?? 'No Title'}
			<div class="ml-2">
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
		</div>
		<div class="flex gap-2">
			{#if page.url.pathname != '/dashboard/forms/new'}
				{#if status === 'draft'}
					<button onclick={() => publish_confirm_modal.showModal()} class="btn" type="submit">
						<PaperPlaneTiltIcon weight="bold" />
						Publish
					</button>
				{:else}
					{#if typeof slug == 'string'}
						<a class="btn btn-ghost" href={resolve(`/f/${slug}`)}>
							<ArrowSquareOutIcon weight="bold" />
						</a>
					{/if}
					<a class="btn" href={resolve(`/dashboard/forms/${id}/responses`)}>
						<ChatCircleTextIcon weight="bold" />
						Responses
					</a>
					<button onclick={() => unpublish_confirm_modal.showModal()} class="btn" type="submit">
						<FileDashedIcon weight="bold" />
						Unpublish
					</button>
				{/if}
			{/if}

			<form method="POST" action="?/save">
				<input type="hidden" name="content" {value} />

				<input type="hidden" name="title" value={parsed.frontmatter?.title ?? 'Untitled Form'} />

				<input type="hidden" name="status" value={status} />

				<button class="btn btn-primary" type="submit">
					<FloppyDiskIcon weight="bold" />
					Save
				</button>
			</form>
		</div>
	</div>

	<!-- Panels — fill remaining height -->
	<div class="flex min-h-0 flex-1">
		<div class="w-1/2 overflow-auto bg-base-100">
			<CodeMirror
				bind:value
				extensions={[anketoTheme, anketoLanguage, anketoHighlighting]}
				styles={{ '&': { height: '100%', overflow: 'auto' } }}
			/>
		</div>
		<div class="w-1/2 overflow-auto">
			<FormRenderer fields={parsed.content} frontmatter={parsed.frontmatter} status="draft" />
		</div>
	</div>
</div>

<dialog bind:this={publish_confirm_modal} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Are you sure you want to publish?</h3>
		<p class="py-4">
			Make sure everything looks perfect! Publishing makes your form visible to the world.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Cancel</button>
			</form>

			<form method="POST" action="?/publish">
				<input type="hidden" name="content" {value} />

				<input type="hidden" name="title" value={parsed.frontmatter?.title ?? 'Untitled Form'} />

				<input type="hidden" name="status" value="published" />

				<button class="btn btn-soft btn-primary" type="submit">
					<PaperPlaneTiltIcon weight="bold" />
					Publish
				</button>
			</form>
		</div>
	</div>
</dialog>

<dialog bind:this={unpublish_confirm_modal} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Are you sure you want to unpublish?</h3>
		<p class="py-4">This will take your form offline. You can always publish it again later!</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Cancel</button>
			</form>
			<form method="POST" action="?/unpublish">
				<button class="btn btn-soft btn-error" type="submit">
					<FileDashedIcon weight="bold" />
					Unpublish
				</button>
			</form>
		</div>
	</div>
</dialog>
