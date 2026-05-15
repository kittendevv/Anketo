<script lang="ts">
	import type { DropdownField } from '$lib/form/types';
	let { data }: { data: DropdownField } = $props();
</script>

<label for={data.label}>{data.label}</label>
<select id={data.label} required={data.required}>
	{#each data.options as option, index (index)}
		<option value={option}>{option}</option>
	{/each}
</select>
