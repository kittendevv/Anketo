import { defaultTokens } from './tokens';
import type { AnketoTokens } from './tokens';

export const themes: Record<string, AnketoTokens> = {
	dark: defaultTokens,
	light: {
		...defaultTokens,
		'--anketo-color-bg': '#ffffff',
		'--anketo-color-text': '#1f2937',
		'--anketo-color-text-muted': '#6b7280',
		'--anketo-input-bg': '#f3f4f6',
		'--anketo-input-border': '#d1d5db',
		'--anketo-btn-bg': '#3b82f6',
		'--anketo-section-color': '#111827'
	},
	oled: {
		...defaultTokens,
		'--anketo-color-bg': '#000000',
		'--anketo-color-text': '#ffffff',
		'--anketo-color-text-muted': '#ffffff',
		'--anketo-input-bg': '#000000',
		'--anketo-input-border': '#555555',
		'--anketo-btn-bg': '#ffffff',
		'--anketo-btn-color': '#000000',
		'--anketo-section-color': '#ffffff',
		'--anketo-input-focus-color': '#ffffff'
	}
};
