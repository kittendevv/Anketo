<script lang="ts">
	import FormEditor from '$lib/widgets/formeditor.svelte';
	let { data } = $props();
</script>

<FormEditor initial={data.form.content} />
