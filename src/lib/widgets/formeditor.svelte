<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { anketoTheme } from '$lib/editor/theme';
	import { anketoLanguage, anketoHighlighting } from '$lib/editor/language';

	let value = $state('');
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
		<img
			src="https://picsum.photos/800/1200"
			alt="placeholder"
			class="h-full w-full object-cover"
		/>
	</div>
</div>
