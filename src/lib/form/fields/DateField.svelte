<script lang="ts">
	import type { DateField } from '$lib/form/types';
	let { data }: { data: DateField } = $props();
</script>

<label for={data.label}>{data.label}</label>
<input type="date" id={data.label} placeholder={data.placeholder} required={data.required} />
