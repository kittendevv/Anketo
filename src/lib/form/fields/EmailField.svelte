<script lang="ts">
	import type { EmailField } from '$lib/form/types';
	let { data }: { data: EmailField } = $props();
</script>

<label for={data.label}>{data.label}</label>
<input type="email" id={data.label} placeholder={data.placeholder} required={data.required} />
