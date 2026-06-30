<script lang="ts">
	import { createTable, Render, Subscribe } from '@humanspeak/svelte-headless-table';
	import { readable } from 'svelte/store';
	import { parse } from '$lib/parser';
	import type { FormField } from '$lib/form/types';

	let { data } = $props();

	const formSchema = data.formSchema;

	if (typeof formSchema !== 'string') {
		throw new Error('Invalid form schema');
	}

	const submissions = data.submissions as Array<{
		id: string;
		formId: string;
		formVersion: number;
		data: unknown;
		submittedAt: Date;
	}>;

	const form = parse(formSchema);

	const formFields = (form.content as Array<FormField | { type: 'prose'; content: string }>).filter(
		(item): item is FormField & { label: string } =>
			item && typeof item === 'object' && 'label' in item && typeof item.label === 'string'
	);

	function getValueFromSubmission(
		submissionData: unknown,
		field: FormField & { label: string }
	): string {
		if (typeof submissionData !== 'object' || submissionData === null) {
			return '';
		}

		const dataObj = submissionData as Record<string, string>;
		const fieldId = field.id || field.label;

		let value = dataObj[fieldId];

		if (value === undefined) {
			value = dataObj[field.label];
		}

		if (value === undefined && fieldId !== field.label) {
			const matchingKey = Object.keys(dataObj).find(
				(key) =>
					key.toLowerCase() === field.label.toLowerCase() ||
					key.toLowerCase().includes(field.label.toLowerCase()) ||
					field.label.toLowerCase().includes(key.toLowerCase())
			);
			if (matchingKey) {
				value = dataObj[matchingKey];
			}
		}

		return value || '';
	}

	const tableData = readable(
		submissions.map((submission) => {
			const rowData: Record<string, string> = {};
			formFields.forEach((field) => {
				const fieldId = field.id || field.label;
				rowData[fieldId] = getValueFromSubmission(submission.data, field);
			});
			return rowData;
		})
	);

	const table = createTable(tableData);

	const columns = table.createColumns(
		formFields.map((field) => {
			const fieldId = field.id || field.label;
			return table.column({
				header: field.label,
				accessor: fieldId
			});
		})
	);

	const { headerRows, rows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="mx-3 my-5 lg:mx-25">
	<table {...$tableAttrs} class="table">
		<thead>
			{#each $headerRows as headerRow (headerRow.id)}
				<tr>
					{#each headerRow.cells as cell (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs>
							<th {...attrs}>
								<Render of={cell.render()} />
							</th>
						</Subscribe>
					{/each}
				</tr>
			{/each}
		</thead>
		<tbody {...$tableBodyAttrs}>
			{#each $rows as row (row.id)}
				<tr>
					{#each row.cells as cell (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs>
							<td {...attrs}>
								<Render of={cell.render()} />
							</td>
						</Subscribe>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
