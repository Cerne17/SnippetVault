import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="rounded-lg overflow-hidden text-sm">
      <SyntaxHighlighter
        language={language.toLowerCase()}
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: '0.5rem' }}
        showLineNumbers={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
