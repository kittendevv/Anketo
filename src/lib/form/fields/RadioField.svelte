<script lang="ts">
	import type { RadioField } from '$lib/form/types';
	let { data }: { data: RadioField } = $props();
</script>

<fieldset>
	<legend>{data.label}</legend>
	{#each data.options as option (option)}
		{#if typeof option === 'string'}
			<label>
				<input type="radio" name={data.label} value={option} required={data.required} />
				{option}
			</label>
		{:else}
			<!-- nested field, Renderer goes here later -->
		{/if}
	{/each}
</fieldset>
