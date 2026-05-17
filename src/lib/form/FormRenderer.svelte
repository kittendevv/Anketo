<script lang="ts">
	import type { FormField } from '$lib/form/types';
	import { defaultTokens } from './themes/tokens';
	import { themes } from './themes/registry';
	import Renderer from './Renderer.svelte';

	let {
		fields,
		frontmatter = {},
		status
	}: {
		fields: FormField[];
		frontmatter?: Record<string, any>;
		status: 'draft' | 'public';
	} = $props();

	let currentSection = $state(0);

	const formId = `anketo-${Math.random().toString(36).slice(2, 9)}`;

	const paginated = $derived(
		frontmatter?.paginated === true && fields.every((f) => f.type === 'section')
	);
	const total = $derived(fields.length);

	const mergedTokens = $derived({
		...defaultTokens,
		...(themes[frontmatter?.theme] || themes.dark || defaultTokens),
		...(frontmatter?.tokens || {})
	});

	const tokenString = $derived(
		Object.entries(mergedTokens)
			.map(([k, v]) => `${k}: ${v}`)
			.join('; ')
	);

	// XSS-SAFE CUSTOM CSS INJECTOR
	$effect(() => {
		if (!frontmatter?.customCss) return;

		const styleNode = document.createElement('style');
		styleNode.textContent = `
			#${formId} {
				${frontmatter.customCss}
			}
		`;
		document.head.appendChild(styleNode);

		return () => {
			styleNode.remove();
		};
	});
</script>

<!-- Fixed the Tailwind background interpolation syntax here -->
<div style={tokenString} class="min-h-screen w-full bg-(--anketo-color-bg)">
	<form method="POST">
		<div id={formId} class="anketo-form">
			{#if paginated}
				<div class="anketo-field-wrapper">
					<Renderer field={fields[currentSection]} />
				</div>
				<div class="anketo-button-group">
					{#if currentSection > 0}
						<button type="button" onclick={() => currentSection--}>Previous</button>
					{/if}
					{#if currentSection < total - 1}
						<button
							type="submit"
							onclick={(e) => {
								e.preventDefault();
								const form = e.currentTarget.closest('form');
								if (form?.checkValidity()) {
									currentSection++;
								} else {
									form?.reportValidity();
								}
							}}>Next</button
						>
					{:else}
						<button type="submit">Submit</button>
					{/if}
				</div>
			{:else}
				{#each fields as field, i (i)}
					<div class="anketo-field-wrapper">
						<Renderer {field} />
					</div>
				{/each}
				<div class="anketo-button-group">
					{#if status === 'draft'}
						<button disabled>Submit</button>
					{:else}
						<button type="submit">Submit</button>
					{/if}
				</div>
			{/if}
		</div>
	</form>
</div>

<style>
	/* Base form container - uses anketo-gap for space BETWEEN questions */
	.anketo-form {
		font-family: var(--anketo-font-family);
		font-size: var(--anketo-font-size);
		color: var(--anketo-color-text);
		max-width: var(--anketo-max-width);
		margin: 0 auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: var(--anketo-gap);
	}

	/* Controls the small space between a single question's label and its input */
	.anketo-field-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.anketo-button-group {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}

	:global(.anketo-form label),
	:global(.anketo-form legend) {
		display: block;
		color: var(--anketo-color-text-muted);
		font-size: 0.875rem;
	}

	:global(.anketo-form h1) {
		color: var(--anketo-section-color);
		font-size: var(--anketo-section-font-size);
		font-weight: 600;
		margin-bottom: 1rem;
	}

	:global(.anketo-form input[type='text']),
	:global(.anketo-form input[type='email']),
	:global(.anketo-form input[type='number']),
	:global(.anketo-form input[type='date']),
	:global(.anketo-form textarea),
	:global(.anketo-form select) {
		width: 100%;
		background: transparent;
		border: none;
		border-bottom: 2px solid var(--anketo-input-border);
		padding: 0.5rem 0;
		color: var(--anketo-color-text);
		font-family: var(--anketo-font-family);
		font-size: var(--anketo-font-size);
		outline: none;
		transition: border-color 150ms;
	}

	:global(.anketo-form input:focus),
	:global(.anketo-form textarea:focus),
	:global(.anketo-form select:focus) {
		border-bottom-color: var(--anketo-input-focus-color);
	}

	:global(.anketo-form textarea) {
		min-height: 120px;
		resize: vertical;
	}

	/* Fieldsets wrap radio/checkbox groups, so we give them a small inner gap */
	:global(.anketo-form fieldset) {
		border: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	:global(.anketo-form input[type='radio']) {
		-webkit-appearance: none;
		appearance: none;
		background-color: transparent;
		margin: 0;
		margin-right: 0.5rem;
		font: inherit;
		width: 1.15em;
		height: 1.15em;
		border: 2px solid var(--anketo-input-border);
		border-radius: 50%;
		position: relative;
		transform: translateY(0.1em);
		cursor: pointer;
		transition: border-color 150ms ease-in-out;
		flex-shrink: 0;
	}

	:global(.anketo-form input[type='radio']:checked) {
		border-color: var(--anketo-input-focus-color);
	}

	:global(.anketo-form input[type='radio']::before) {
		content: '';
		width: 0.65em;
		height: 0.65em;
		border-radius: 50%;
		background-color: var(--anketo-input-focus-color);

		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0);
		transition: 120ms transform ease-in-out;
	}

	:global(.anketo-form input[type='radio']:checked::before) {
		transform: translate(-50%, -50%) scale(1);
	}

	/** custom checkbox **/
	:global(.anketo-form input[type='checkbox']) {
		-webkit-appearance: none;
		appearance: none;
		background-color: transparent;
		margin: 0;
		margin-right: 0.5rem;
		font: inherit;
		width: 1.15em;
		height: 1.15em;
		border: 2px solid var(--anketo-input-border);
		border-radius: 0.25em;
		position: relative;
		transform: translateY(0.1em);
		cursor: pointer;
		transition: all 150ms ease-in-out;
		flex-shrink: 0;
	}

	:global(.anketo-form input[type='checkbox']:checked) {
		background-color: var(--anketo-input-focus-color);
		border-color: var(--anketo-input-focus-color);
	}

	:global(.anketo-form input[type='checkbox']::before) {
		content: '';
		position: absolute;
		top: 42%;
		left: 50%;
		width: 0.35em;
		height: 0.65em;
		border: solid var(--anketo-btn-color);
		border-width: 0 0.15em 0.15em 0;
		transform: translate(-50%, -50%) rotate(45deg) scale(0);
		transition: 120ms transform ease-in-out;
	}

	:global(.anketo-form input[type='checkbox']:checked::before) {
		transform: translate(-50%, -50%) rotate(45deg) scale(1);
	}

	:global(.anketo-form label:has(input[type='radio'])),
	:global(.anketo-form label:has(input[type='checkbox'])) {
		margin-bottom: 0; /* Handled by fieldset gap now */
		display: flex;
		align-items: center;
	}

	:global(.anketo-form button[type='submit']),
	:global(.anketo-form button[type='button']) {
		background-color: var(--anketo-btn-bg);
		color: var(--anketo-btn-color);
		border-radius: var(--anketo-btn-border-radius);
		padding: var(--anketo-btn-padding);
		border: none;
		cursor: pointer;
		font-family: var(--anketo-font-family);
		font-size: var(--anketo-font-size);
		font-weight: 500;
		transition: opacity 150ms;
	}

	:global(.anketo-form button:hover) {
		opacity: 0.85;
	}

	:global(.anketo-form button:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global(.anketo-form p) {
		color: var(--anketo-color-text-muted);
		line-height: 1.6;
	}
</style>
