<script lang="ts">
	import type { TextField } from '$lib/form/types';
	let { data }: { data: TextField } = $props();
</script>

<label for={data.label}>{data.label}</label>
<input type="text" id={data.label} placeholder={data.placeholder} required={data.required} />
