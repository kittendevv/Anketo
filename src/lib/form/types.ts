export type FormField =
	| TextField
	| EmailField
	| NumberField
	| TextareaField
	| DateField
	| CheckboxField
	| DropdownField
	| RadioField
	| ProseBlock
	| SectionBlock;

export type BaseField = {
	type: string;
	label: string;
	required?: boolean;
	validation?: {
		pattern?: string;
		message?: string;
	};
};

// basic fields
export type TextField = BaseField & {
	type: 'text';
	placeholder?: string;
};

export type EmailField = BaseField & {
	type: 'email';
	placeholder?: string;
};

export type NumberField = BaseField & {
	type: 'number';
	placeholder?: string;
};

export type TextareaField = BaseField & {
	type: 'textarea';
	placeholder?: string;
};

export type DateField = BaseField & {
	type: 'date';
	placeholder?: string;
};

// fields with arrays
export type CheckboxField = BaseField & {
	type: 'checkbox';
	options: string[];
};

export type DropdownField = BaseField & {
	type: 'dropdown';
	options: string[];
};

export type RadioField = BaseField & {
	type: 'radio';
	options: (string | BaseField)[];
};

// text block
export type ProseBlock = {
	type: 'prose';
	content: string;
};

// section
export type SectionBlock = {
	type: 'section';
	label: string;
	id?: string;
	fields: FormField[];
};
