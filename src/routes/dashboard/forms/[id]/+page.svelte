<script lang="ts">
	import FormEditor from '$lib/widgets/formeditor.svelte';
	let { data } = $props();
</script>

<FormEditor
	initial={data.latestVersion.content}
	status={data.form.status}
	slug={data.form.slug}
	id={data.form.id}
/>
