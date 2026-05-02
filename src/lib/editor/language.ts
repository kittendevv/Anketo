import { StreamLanguage } from '@codemirror/language';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

export const anketoLanguage = StreamLanguage.define({
	token(stream) {
		// Section: #(label)[id]
		if (stream.match(/^#\([^)]+\)(\[[^\]]*\])?/)) {
			return 'heading';
		}
		// Field: @type(label)[args]
		if (stream.match(/^@\w+/)) {
			return 'keyword';
		}
		if (stream.match(/^\([^)]+\)/)) {
			return 'string';
		}
		if (stream.match(/^\[[^\]]*\]/)) {
			return 'heading';
		}
		// Radio option
		if (stream.match(/^-\s+/)) {
			return 'operator';
		}
		// Frontmatter
		if (stream.match(/^---/)) {
			return 'comment';
		}
		stream.next();
		return null;
	}
});

export const anketoHighlighting = syntaxHighlighting(
	HighlightStyle.define([
		{ tag: t.heading, color: '#c084fc', fontWeight: 'bold' }, // sections
		{ tag: t.keyword, color: '#9333ea', fontWeight: 'bold' }, // @fieldtype
		{ tag: t.string, color: '#e9d5ff' }, // (label)
		{ tag: t.meta, color: '#6d28d9' }, // [args]
		{ tag: t.operator, color: '#c084fc' }, // - radio
		{ tag: t.comment, color: '#4b5563', fontStyle: 'italic' } // ---
	])
);
