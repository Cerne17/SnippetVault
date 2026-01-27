import type { Snippet } from '../types/snippet';

/**
 * Maps common programming language identifiers to their file extensions.
 */
const languageMap: Record<string, string> = {
    typescript: 'ts',
    javascript: 'js',
    python: 'py',
    java: 'java',
    csharp: 'cs',
    cpp: 'cpp',
    c: 'c',
    html: 'html',
    css: 'css',
    markdown: 'md',
    rust: 'rs',
    go: 'go',
    ruby: 'rb',
    php: 'php',
    swift: 'swift',
    kotlin: 'kt',
    sql: 'sql',
    shell: 'sh',
    yaml: 'yaml',
    json: 'json',
};

/**
 * Triggers a browser download of a blob.
 */
export const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Exports a single snippet as a JSON file.
 */
export const exportSnippetAsJson = (snippet: Snippet) => {
    const data = JSON.stringify(snippet, null, 2);
    const fileName = `${snippet.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    downloadFile(data, fileName, 'application/json');
};

/**
 * Exports a single snippet as a source code file.
 */
export const exportSnippetAsSource = (snippet: Snippet) => {
    const extension = languageMap[snippet.language.toLowerCase()] || 'txt';
    const fileName = `${snippet.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${extension}`;
    downloadFile(snippet.code, fileName, 'text/plain');
};

/**
 * Exports an array of snippets as a single consolidated JSON file.
 */
export const exportVaultAsJson = (snippets: Snippet[]) => {
    const data = JSON.stringify(snippets, null, 2);
    const fileName = `snippet-vault-export-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(data, fileName, 'application/json');
};
