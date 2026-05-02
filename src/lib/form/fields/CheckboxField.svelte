<script lang="ts">
	import type { CheckboxField } from '$lib/form/types';
	let { data }: { data: CheckboxField } = $props();
</script>

<fieldset>
	<legend>{data.label}</legend>
	{#each data.options as option (option)}
		<label>
			<input type="checkbox" name={data.label} value={option} />
			{option}
		</label>
	{/each}
</fieldset>
