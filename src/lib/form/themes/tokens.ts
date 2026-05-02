export const defaultTokens = {
	'--anketo-font-family': 'DM Sans Variable, sans-serif',
	'--anketo-font-size': '1rem',
	'--anketo-color-text': '#e9d5ff',
	'--anketo-color-text-muted': '#a78bca',
	'--anketo-color-bg': '#2a1f33',
	'--anketo-input-bg': '#1e1529',
	'--anketo-input-border': '#3d2b4a',
	'--anketo-input-border-radius': '0.25rem',
	'--anketo-input-padding': '0.5rem 0.75rem',
	'--anketo-input-focus-color': '#9333ea',
	'--anketo-btn-bg': '#9333ea',
	'--anketo-btn-color': '#ffffff',
	'--anketo-btn-border-radius': '0.25rem',
	'--anketo-btn-padding': '0.5rem 1rem',
	'--anketo-gap': '1rem',
	'--anketo-max-width': '640px',
	'--anketo-section-font-size': '1.25rem',
	'--anketo-section-color': '#c084fc'
} as const;

export type AnketoTokens = Partial<typeof defaultTokens>;
