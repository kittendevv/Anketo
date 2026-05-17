<script lang="ts">
	import FormRenderer from '$lib/form/FormRenderer.svelte';

	let { data, form } = $props();
</script>

{#if form?.success}
	<div class="flex min-h-screen items-center justify-center p-4">
		<div class="max-w-md text-center">
			<h2 class="mb-4 text-3xl font-bold">Submitted!</h2>
			<p class="text-base-content/70">Your response has been recorded.</p>
		</div>
	</div>
{:else}
	<FormRenderer
		fields={data.parsed.content}
		frontmatter={data.parsed.frontmatter}
		status="public"
	/>
{/if}
