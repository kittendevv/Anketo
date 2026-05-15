<script lang="ts">
	import type { RadioField } from '$lib/form/types';
	let { data }: { data: RadioField } = $props();
</script>

<fieldset>
	<legend>{data.label}</legend>
	{#each data.options as option, index (index)}
		<label>
			<input type="radio" name={data.label} value={option} required={data.required} />
			{option}
		</label>
	{/each}
</fieldset>
