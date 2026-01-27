import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CodeBlockProps {
  code: string;
  language: string;
  isMarkdown?: boolean;
}

export default function CodeBlock({ code, language, isMarkdown }: CodeBlockProps) {
  if (isMarkdown) {
    return (
      <div className="prose prose-slate max-w-none text-sm markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="rounded-lg overflow-hidden my-4">
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0 }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={`${className} bg-slate-200 px-1 rounded text-slate-900`} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {code}
        </ReactMarkdown>
      </div>
    );
  }

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
