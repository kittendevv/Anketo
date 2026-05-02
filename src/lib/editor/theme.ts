import { EditorView } from '@codemirror/view';

export const anketoTheme = EditorView.theme(
	{
		'&': {
			backgroundColor: '#2a1f33',
			color: '#e9d5ff',
			fontFamily: 'DM Sans Variable, sans-serif',
			fontSize: '14px'
		},
		'.cm-content': {
			caretColor: '#9333ea'
		},
		'.cm-cursor': {
			borderLeftColor: '#9333ea'
		},
		'.cm-selectionBackground': {
			backgroundColor: '#9333ea33'
		},
		'.cm-activeLine': {
			backgroundColor: '#9333ea11'
		},
		'.cm-gutters': {
			backgroundColor: '#1e1529',
			color: '#6b7280',
			border: 'none'
		},
		'.cm-activeLineGutter': {
			backgroundColor: '#9333ea22'
		}
	},
	{ dark: true }
);
