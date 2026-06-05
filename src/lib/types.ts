export interface ViewConfig {
	columns: Column[];
	filters: { field: string; op: 'eq' | 'contains' | 'gt' | 'lt'; value: string }[];
	sort: { field: string; dir: 'asc' | 'desc' } | null;
}
export interface Column {
	label: string;
	type: string;
}
