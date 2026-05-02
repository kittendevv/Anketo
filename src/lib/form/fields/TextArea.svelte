<script lang="ts">
	import type { TextareaField } from '$lib/form/types';
	let { data }: { data: TextareaField } = $props();
</script>

<label for={data.label}>{data.label}</label>
<textarea id={data.label} placeholder={data.placeholder} required={data.required}></textarea>
