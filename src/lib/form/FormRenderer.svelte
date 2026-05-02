<script lang="ts">
	import type { FormField } from '$lib/form/types';
	import type { AnketoTokens } from './themes/tokens';
	import { defaultTokens } from './themes/tokens';
	import { defaultTheme } from './themes/default';
	import Renderer from './Renderer.svelte';

	let {
		fields,
		frontmatter,
		tokens = {}
	}: {
		fields: FormField[];
		frontmatter?: Record<string, unknown>;
		tokens?: AnketoTokens;
	} = $props();

	let currentSection = $state(0);

	const paginated = $derived(
		frontmatter?.paginated === true && fields.every((f) => f.type === 'section')
	);
	const total = $derived(fields.length);
	const mergedTokens = $derived({ ...defaultTokens, ...tokens });
	const tokenString = $derived(
		Object.entries(mergedTokens)
			.map(([k, v]) => `${k}: ${v}`)
			.join('; ')
	);
</script>

{@html `<style>${defaultTheme}</style>`}

<form>
	<div class="anketo-form" style={tokenString}>
		{#if paginated}
			<Renderer field={fields[currentSection]} />
			<div>
				{#if currentSection > 0}
					<button type="button" onclick={() => currentSection--}>Previous</button>
				{/if}
				{#if currentSection < total - 1}
					<button
						type="submit"
						onclick={(e) => {
							e.preventDefault();
							const form = e.currentTarget.closest('form');
							if (form?.checkValidity()) {
								currentSection++;
							} else {
								form?.reportValidity();
							}
						}}>Next</button
					>
				{:else}
					<button type="submit">Submit</button>
				{/if}
			</div>
		{:else}
			{#each fields as field, i (i)}
				<Renderer {field} />
			{/each}
			<button type="submit">Submit</button>
		{/if}
	</div>
</form>
