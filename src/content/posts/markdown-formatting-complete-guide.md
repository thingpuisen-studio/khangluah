---
title: "The Comprehensive Markdown Formatting Manual"
slug: "markdown-formatting-complete-guide"
subtitle: "A detailed guide covering bold, italics, codeblocks, tables, headings, and advanced syntax for the CMS Studio"
excerpt: "Learn how to format text with Markdown: from basic bold and italics to syntax-highlighted codeblocks, tables, and nested quotes."
date: "October 2026"
year: 2026
readingTime: "9 min read"
category: "Technical Guides"
postType: "essay"
authors: "H. Kapginlian"
language: "English"
languageFamily: "Tibeto-Burman"
articleLanguage: "English"
themeClass: "from-slate-900 via-slate-800 to-indigo-950 text-slate-100"
accentBarClass: "bg-indigo-500"
coverImage: "/images/posts/literary-manuscript.webp"
featured: true
draft: false
tags:
  - "Markdown"
  - "Formatting"
  - "Guide"
  - "Documentation"
  - "Syntax"
---

Markdown is a lightweight markup language created to format plain text into semantic HTML. Because it is written in human-readable plain text, your writing remains portable, clean, and permanently future-proof.

This guide provides an exhaustive, step-by-step reference for every formatting element supported by this website and the CMS Studio.

---

## 1. Text Styling: Bold, Italics & Strikethrough

Inline formatting allows you to emphasize words, highlight key terms, or denote citations without writing HTML tags.

### How to Make Text Bold
To make words bold, wrap them in two asterisks (`**`) or two underscores (`__`) with no spaces between the symbols and the text:

```markdown
**This sentence is bold.**
__This sentence is also bold.__
```
Rendered output:
**This sentence is bold.**

### How to Make Text Italic
To italicize words, wrap them in a single asterisk (`*`) or single underscore (`_`):

```markdown
*This word is italicized.*
_This word is also italicized._
```
Rendered output:
*This word is italicized.*

### Combining Bold and Italics
To make words both bold and italicized simultaneously, wrap them in three asterisks (`***`):

```markdown
***This text is both bold and italicized.***
```
Rendered output:
***This text is both bold and italicized.***

### Strikethrough
To put a horizontal line through text (useful for revision tracking or humorous corrections), wrap the phrase in double tildes (`~~`):

```markdown
~~This outdated claim was revised.~~
```
Rendered output:
~~This outdated claim was revised.~~

---

## 2. Code: What is a Codeblock and How to Create One?

In technical and academic writing, code styling formats text in a fixed-width (monospace) font. This prevents curly quotes, keeps exact spacing, and distinguishes computer code or linguistic forms from prose.

There are two primary types of code formatting: **Inline Code** and **Fenced Codeblocks**.

### Inline Code
Inline code is used inside a sentence to refer to a filename, a keyboard command, a variable, or a short linguistic morpheme.

**How to type it**: Wrap the word in a single backtick symbol (`` ` ``). The backtick key is located in the top-left corner of standard keyboards, just beneath the `Escape` key:

```markdown
The file is saved in `src/content/posts/` on your computer.
Run the command `npm install` in your terminal.
```
Rendered output:
The file is saved in `src/content/posts/` on your computer.

### Fenced Codeblocks (Multi-line)
A codeblock is an isolated, boxed region formatted with monospace text, syntax highlighting, and preserved line breaks. It is ideal for code snippets, configuration files, terminal commands, or multi-line data tables.

**How to create a codeblock**:
1. Type three consecutive backticks (```` ``` ````) on a new line.
2. Immediately follow the backticks with a language name (e.g., `bash`, `javascript`, `typescript`, `html`, `python`, `json`, or `markdown`). This triggers colorized syntax highlighting.
3. On the subsequent lines, type or paste your code.
4. Close the codeblock with three consecutive backticks (```` ``` ````) on their own line.

````markdown
```javascript
function calculateReadingTime(text) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}
```
````

Rendered output:
```javascript
function calculateReadingTime(text) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}
```

If you do not want syntax highlighting (for example, when displaying raw text or ASCII diagrams), specify `text` or leave the space after the backticks blank:

````markdown
```text
Root Directory:
  ├── public/
  │   └── images/
  └── src/
      └── content/
```
````

---

## 3. Headings & Document Structure

Headings create a hierarchical outline for your article. In Markdown, headings are created using the hash symbol (`#`). Always insert a space between the `#` and your heading text.

```markdown
# Heading 1 (Article Title - Reserved)
## Heading 2 (Major Section)
### Heading 3 (Subsection / Subtopic)
#### Heading 4 (Minor Subhead)
```

> **Studio Convention**: In the CMS Studio, avoid using `# Heading 1` in the article body. The website template automatically renders your title from the frontmatter metadata. Start your article sections with `## Heading 2`.

---

## 4. Blockquotes and Pullquotes

Blockquotes are formatted with an elegant vertical accent bar on the left margin, indenting the quoted passage to distinguish it from the author's narrative.

**How to type a blockquote**: Start the line with a greater-than symbol (`>`) followed by a space:

```markdown
> "A dictionary without grammatical context is like an anatomical chart without circulation."
> -- Traditional Research Maxim
```

Rendered output:
> "A dictionary without grammatical context is like an anatomical chart without circulation."
> -- Traditional Research Maxim

### Multi-paragraph Quotes
To format quotes spanning multiple paragraphs, place a `>` on the blank line between paragraphs:

```markdown
> First paragraph of the quoted statement.
>
> Second paragraph continuing the thought.
```

---

## 5. Lists: Unordered, Ordered & Nested

### Bullet Lists (Unordered)
Use a hyphen (`-`) or an asterisk (`*`) followed by a space:

```markdown
- Tibeto-Burman language family
- Morphological typology
- Interlinear glossing
```

### Numbered Lists (Ordered)
Use numbers followed by a period and a space:

```markdown
1. Write draft locally in browser storage.
2. Verify visual appearance in Preview.
3. Publish live to repository.
```

### Nested Sub-lists
To create an indented sub-list, press `Enter`, then indent the sub-item with two or four spaces:

```markdown
- Linguistic Modules
  - Morphosyntax
  - Phonology & Tone
- Historical Documentation
  - Oral narratives
  - Archival records
```

---

## 6. Tables

Markdown tables are formatted using vertical pipes (`|`) to separate columns and hyphens (`-`) to separate the header row from the content.

### Alignment Syntax
Colons (`:`) in the delimiter row determine text alignment:
- Left-aligned: `:---`
- Center-aligned: `:---:`
- Right-aligned: `---:`

```markdown
| Morpheme | Grammatical Gloss | Category | Alignment |
| :--- | :---: | ---: | :--- |
| **ka-** | 1SG.SUBJ | Prefix | Left |
| **-pi** | FEM | Suffix | Center |
| **-in** | ERG | Case | Right |
```

Rendered output:

| Morpheme | Grammatical Gloss | Category | Alignment |
| :--- | :---: | ---: | :--- |
| **ka-** | 1SG.SUBJ | Prefix | Left |
| **-pi** | FEM | Suffix | Center |
| **-in** | ERG | Case | Right |

---

## 7. Hyperlinks & Image Embeds

### Text Hyperlinks
Wrap the clickable text in square brackets `[text]`, followed immediately by the destination URL in parentheses `(url)`:

```markdown
Read the [Research Archive](/research) or review [About](/about).
```

### Image Embeds
Image syntax is identical to link syntax, but starts with an exclamation point (`!`):

```markdown
![Descriptive alternative text for accessibility](/images/posts/literary-manuscript.webp)
```

Rendered output:

![Archival literary manuscript on aged paper](/images/posts/literary-manuscript.webp)

- The brackets `[...]` contain the **alt text** (read by screen readers and search engines).
- The parentheses `(...)` contain the **image file path** (typically `/images/posts/your-file.webp`).

---

## 8. Horizontal Dividers & Breaks

To separate thematic sections, type three hyphens on their own line with blank lines above and below:

```markdown
First section text.

---

Second section text.
```

Rendered output:
A subtle, clean horizontal rule spanning the content column.
