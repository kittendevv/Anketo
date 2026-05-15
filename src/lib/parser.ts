import { parse as parseYAML } from 'yaml';

const regex = /@(\w+)\(([^)]+)\)(?:\[([^\]]*)\])?/;
const regex_section = /#\(([^)]+)\)(?:\[([^\]]*)\])?/;
const regex_radio = /^-\s+(.+)$/;

function parseArgs(args: string[]): { required: boolean } {
	return {
		required: args.includes('r') || args.includes('required')
	};
}

function buildField(
	type: string,
	label: string,
	args: string[],
	regex: RegExp,
	regex_radio: RegExp,
	lines: string[],
	startIndex: number
): { data: any; nextIndex: number } {
	if (type === 'radio' || type === 'dropdown' || type === 'checkbox') {
		const options = [];
		let i = startIndex + 1;
		while (i < lines.length) {
			const optionLine = lines[i];
			const optionMatch = optionLine.match(regex_radio);
			if (!optionMatch) {
				break;
			}
			const optionContent = optionMatch[1].trim();

			options.push(optionContent);

			i++;
		}
		return {
			data: { type, label, args, options, ...parseArgs(args) },
			nextIndex: i
		};
	} else {
		return {
			data: { type, label, args, ...parseArgs(args) },
			nextIndex: startIndex + 1
		};
	}
}

export function parse(str: string) {
	const lines = str.split(/\r?\n/);
	let i = 0;
	let frontmatter: Record<string, any> | null = null;
	if (lines[0]?.trim() === '---') {
		let endFrontmatterIndex = -1;
		for (let j = 1; j < lines.length; j++) {
			if (lines[j]?.trim() === '---') {
				endFrontmatterIndex = j;
				break;
			}
		}
		if (endFrontmatterIndex !== -1) {
			const frontmatterContent = lines.slice(1, endFrontmatterIndex).join('\n');
			frontmatter = parseYAML(frontmatterContent) as Record<string, any>;
			i = endFrontmatterIndex + 1;
		}
	}
	const results = [];
	let sectionCount = 0;
	let currentSection: { type: 'section'; id: string; label: string; fields: any[] } | null = null;
	while (i < lines.length) {
		const line = lines[i];
		const sectionMatch = line.match(regex_section);
		const fieldMatch = line.match(regex);
		if (sectionMatch) {
			const [_, label, id] = sectionMatch;
			sectionCount++;
			currentSection = {
				type: 'section',
				id: id || sectionCount.toString(),
				label,
				fields: []
			};
			results.push(currentSection);
			i++;
			continue;
		}
		if (fieldMatch) {
			const [_, type, label, bracketContent] = fieldMatch;
			const args = bracketContent ? bracketContent.split(',').map((arg) => arg.trim()) : [];
			const field = buildField(type, label, args, regex, regex_radio, lines, i);
			i = field.nextIndex;
			if (currentSection) {
				currentSection.fields.push(field.data);
			} else {
				results.push(field.data);
			}
			continue;
		}
		if (line.trim() !== '') {
			const proseLines = [];
			while (i < lines.length) {
				const currentLine = lines[i];
				if (
					currentLine.trim() === '' ||
					currentLine.match(regex_section) ||
					currentLine.match(regex)
				) {
					break;
				}
				proseLines.push(currentLine);
				i++;
			}
			if (proseLines.length > 0) {
				const proseNode = {
					type: 'prose',
					content: proseLines.join('\n')
				};
				if (currentSection) {
					currentSection.fields.push(proseNode);
				} else {
					results.push(proseNode);
				}
				continue;
			}
		}
		i++;
	}
	return {
		...(frontmatter && { frontmatter }),
		content: results
	};
}
