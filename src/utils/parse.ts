const regex = /@(\w+)\(([^)]+)\)(?:\[([^\]]*)\])?/;
const regex_section = /#\(([^)]+)\)(?:\[([^\]]*)\])?/;
const regex_radio = /^-\s+(.+)$/;

export function parse(str: string) {
  const lines = str.split("\n");
  let i = 0;
  let frontmatter: Record<string, any> | null = null;

  if (lines[0]?.trim() === "---") {
    let endFrontmatterIndex = -1;
    for (let j = 1; j < lines.length; j++) {
      if (lines[j]?.trim() === "---") {
        endFrontmatterIndex = j;
        break;
      }
    }

    if (endFrontmatterIndex !== -1) {
      const frontmatterContent = lines.slice(1, endFrontmatterIndex).join("\n");
      frontmatter = Bun.YAML.parse(frontmatterContent) as Record<string, any>;
      i = endFrontmatterIndex + 1;
    }
  }

  const results = [];
  let sectionCount = 0;
  let currentSection: { id: string; label: string; fields: any[] } | null = null;

  while (i < lines.length) {
    const line = lines[i];
    const sectionMatch = line.match(regex_section);
    const fieldMatch = line.match(regex);

    if (sectionMatch) {
      const [_, label, id] = sectionMatch;
      sectionCount++;
      currentSection = {
        id: id || sectionCount.toString(),
        label,
        fields: [],
      };
      results.push(currentSection);
      i++;
      continue;
    }

    if (fieldMatch) {
      const [_, type, label, bracketContent] = fieldMatch;
      const args = bracketContent
        ? bracketContent.split(",").map((arg) => arg.trim())
        : [];

      const field = buildField(type, label, args, regex, regex_radio, lines, i);
      i = field.nextIndex;

      if (currentSection) {
        currentSection.fields.push(field.data);
      } else {
        results.push(field.data);
      }
      continue;
    }

    // Handle prose text - accumulate consecutive non-empty lines
    if (line.trim() !== "") {
      const proseLines = [];
      while (i < lines.length) {
        const currentLine = lines[i];
        // Stop if we hit a section, field, or empty line
        if (currentLine.trim() === "" || 
            currentLine.match(regex_section) || 
            currentLine.match(regex)) {
          break;
        }
        proseLines.push(currentLine);
        i++;
      }

      if (proseLines.length > 0) {
        const proseNode = {
          type: "prose",
          content: proseLines.join("\n"),
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
    content: results,
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
  if (type === "radio") {
    const options = [];
    let i = startIndex + 1;
    while (i < lines.length) {
      const optionLine = lines[i];
      const optionMatch = optionLine.match(regex_radio);
      if (!optionMatch) {
        break;
      }
      const optionContent = optionMatch[1].trim();
      const nestedFieldMatch = optionContent.match(regex);

      if (nestedFieldMatch) {
        const [_, nestedType, nestedLabel, nestedBracketContent] = nestedFieldMatch;
        const nestedArgs = nestedBracketContent
          ? nestedBracketContent.split(",").map((arg) => arg.trim())
          : [];
        options.push({ type: nestedType, label: nestedLabel, args: nestedArgs });
      } else {
        options.push(optionContent);
      }
      i++;
    }
    return {
      data: { type, label, args, options },
      nextIndex: i,
    };
  } else {
    return {
      data: { type, label, args },
      nextIndex: startIndex + 1,
    };
  }
}
