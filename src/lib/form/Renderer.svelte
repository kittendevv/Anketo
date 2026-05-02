<script lang="ts">
	// Import union type
	import type { FormField } from '$lib/form/types';
	// Import itself
	import Renderer from './Renderer.svelte';

	// Import fields
	import TextField from './fields/TextField.svelte';
	import EmailField from './fields/EmailField.svelte';
	import DateField from './fields/DateField.svelte';
	import NumberField from './fields/NumberField.svelte';
	import TextArea from './fields/TextArea.svelte';
	import DropdownField from './fields/DropdownField.svelte';
	import CheckboxField from './fields/CheckboxField.svelte';
	import RadioField from './fields/RadioField.svelte';
	import ProseBlock from './fields/ProseBlock.svelte';

	let { field }: { field: FormField } = $props();
</script>

{#if field.type === 'text'}
	<TextField data={field} />
{:else if field.type === 'email'}
	<EmailField data={field} />
{:else if field.type === 'date'}
	<DateField data={field} />
{:else if field.type === 'number'}
	<NumberField data={field} />
{:else if field.type === 'textarea'}
	<TextArea data={field} />
{:else if field.type === 'dropdown'}
	<DropdownField data={field} />
{:else if field.type === 'checkbox'}
	<CheckboxField data={field} />
{:else if field.type === 'radio'}
	<RadioField data={field} />
{:else if field.type === 'prose'}
	<ProseBlock data={field} />
{:else if field.type === 'section'}
	<fieldset>
		<legend>{field.label}</legend>
		{#each field.fields as f, i (i)}
			<Renderer field={f} />
		{/each}
	</fieldset>
{/if}
