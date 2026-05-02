<script lang="ts">
	// external imports
	import { untrack } from 'svelte';

	import CodeMirror from 'svelte-codemirror-editor';
	import { anketoTheme } from '$lib/editor/theme';
	import { anketoLanguage, anketoHighlighting } from '$lib/editor/language';

	// internal imports
	import { parse } from '$lib/parser';
	import FormRenderer from '$lib/form/FormRenderer.svelte';

	// variables
	let { initial }: { initial: string } = $props();
	let value = $state(untrack(() => initial));

	let parsed = $derived(parse(value));

	$effect(() => {
		console.log(parsed.content);
	});
</script>

<div class="flex h-screen">
	<div class="h-screen w-1/2 overflow-auto">
		<CodeMirror
			bind:value
			extensions={[anketoTheme, anketoLanguage, anketoHighlighting]}
			styles={{ '&': { height: '100vh', overflow: 'auto' } }}
		/>
	</div>
	<div class="h-screen w-1/2 overflow-auto">
		<FormRenderer fields={parsed.content} frontmatter={parsed.frontmatter} />
	</div>
</div>
