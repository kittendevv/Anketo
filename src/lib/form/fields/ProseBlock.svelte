<script lang="ts">
	import type { ProseBlock } from '$lib/form/types';
	let { data }: { data: ProseBlock } = $props();
</script>

<p>{data.content}</p>
