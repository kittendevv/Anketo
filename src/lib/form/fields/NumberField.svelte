<script lang="ts">
	import type { NumberField } from '$lib/form/types';
	let { data }: { data: NumberField } = $props();
</script>

<label for={data.label}>{data.label}</label>
<input type="number" id={data.label} placeholder={data.placeholder} required={data.required} />
