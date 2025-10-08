import { type BundledLanguage } from "shiki";
import { createHighlighter } from 'shiki'
import { createCssVariablesTheme } from 'shiki/core'

interface CodeBlockProps {
  children: string;
  lang?: BundledLanguage;
}

const cssVarsTheme = createCssVariablesTheme({
  name: 'fedor-css-theme',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true
})

const highlighter = await createHighlighter({
  langs: ['tsx', 'css', 'html', 'angular-html', 'jsx'],
  themes: [cssVarsTheme]
})

async function CodeBlock({children, lang ='tsx'}: CodeBlockProps) {
    const out = await highlighter.codeToHtml(children, {
    lang: lang,
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

  return (
    <div className="relative">
      <div className="absolute left-2 top-2.5 md:top-4 z-10 rounded-full text-[0.66rem] md:text-xs font-mono text-foreground/50">
        {lang}
      </div>
      <div dangerouslySetInnerHTML={{ __html: out }} />
    </div>
  )
}

export { CodeBlock }