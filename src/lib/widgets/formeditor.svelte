<script lang="ts">
	// external imports
	import { untrack } from 'svelte';

	import CodeMirror from 'svelte-codemirror-editor';
	import { anketoTheme } from '$lib/editor/theme';
	import { anketoLanguage, anketoHighlighting } from '$lib/editor/language';

	// internal imports
	import { parse } from '$lib/parser';
	import FormRenderer from '$lib/form/FormRenderer.svelte';

	// icons
	import FloppyDiskIcon from 'phosphor-svelte/lib/FloppyDiskIcon';

	// variables
	let { initial }: { initial: string } = $props();
	let value = $state(untrack(() => initial));

	let parsed = $derived(parse(value));
</script>

<div class="flex h-screen flex-col">
	<div class="flex h-10 flex-none items-center bg-base-300 p-4">
		<div class="flex-1">
			{parsed.frontmatter?.title ?? 'No Title'}
		</div>
		<div>
			<form method="POST" action="?/save">
				<input type="hidden" name="content" {value} />

				<input type="hidden" name="title" value={parsed.frontmatter?.title ?? 'Untitled Form'} />

				<input type="hidden" name="status" value="draft" />

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
			<FormRenderer fields={parsed.content} frontmatter={parsed.frontmatter} />
		</div>
	</div>
</div>
