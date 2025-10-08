import { type BundledLanguage } from "shiki";
import { createHighlighter } from 'shiki'
import { createCssVariablesTheme } from 'shiki/core'

interface CodeBlockProps {
  children: string;
  lang: BundledLanguage;
}

const cssVarsTheme = createCssVariablesTheme({
  name: 'fedor-css-theme',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true
})

const highlighter = await createHighlighter({
  langs: ['typescript', 'css'],
  themes: [cssVarsTheme]
})

async function CodeBlock(props: CodeBlockProps) {
    const out = await highlighter.codeToHtml(props.children, {
    lang: props.lang,
    theme: 'fedor-css-theme',
    transformers: [
      {
        name: "line-numbers",
        line(node, line) {
          node.properties["data-line"] = line;
        },
      },
    ],
  });

  return <div dangerouslySetInnerHTML={{ __html: out }} />;
}

export { CodeBlock }