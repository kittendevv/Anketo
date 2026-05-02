export const defaultTheme = `
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

  .anketo-form label {
    display: block;
    margin-bottom: 0.25rem;
    color: var(--anketo-color-text-muted);
    font-size: 0.875rem;
  }

  .anketo-form input[type="text"],
  .anketo-form input[type="email"],
  .anketo-form input[type="number"],
  .anketo-form input[type="date"],
  .anketo-form textarea,
  .anketo-form select {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--anketo-input-border);
    padding: 0.5rem 0;
    color: var(--anketo-color-text);
    font-family: var(--anketo-font-family);
    font-size: var(--anketo-font-size);
    outline: none;
    transition: border-color 150ms;
  }

  .anketo-form input:focus,
  .anketo-form textarea:focus,
  .anketo-form select:focus {
    border-bottom-color: var(--anketo-input-focus-color);
  }

  .anketo-form textarea {
    min-height: 120px;
    resize: vertical;
  }

  .anketo-form fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }

  .anketo-form legend {
    color: var(--anketo-section-color);
    font-size: var(--anketo-section-font-size);
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .anketo-form input[type="radio"],
  .anketo-form input[type="checkbox"] {
    accent-color: var(--anketo-input-focus-color);
    margin-right: 0.5rem;
  }

  .anketo-form button[type="submit"],
  .anketo-form button {
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

  .anketo-form button:hover {
    opacity: 0.85;
  }

  .anketo-form p {
    color: var(--anketo-color-text-muted);
    line-height: 1.6;
  }
`;
