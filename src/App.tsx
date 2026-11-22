
import { useEffect, useMemo, useState } from 'react';
import {
  marked,
} from 'marked';
import DOMPurify from 'dompurify';
import {
  FileText,
  Upload,
  Download,
  Sun,
  Moon,
  ShieldCheck,
  Eye,
  Code2,
} from 'lucide-react';

import './App.css';

type Theme = 'light' | 'dark';

const initialMarkdown = `# My Document

Welcome to **PrivateDF**.

This is your Markdown to PDF converter.

## Features

- Convert Markdown into PDF
- Edit your Markdown
- Preview your document
- Export using your browser

## Example formatting

You can use **bold**, *italic*, and ~~strikethrough~~.

> This is a blockquote.

### Code example

\`\`\`python
print("Hello, PrivateDF!")
\`\`\`

---

Made with PrivateDF.
`;

function App() {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [fileName, setFileName] = useState('Untitled Document');
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('privatedf-theme');

    if (saved === 'light' || saved === 'dark') return saved;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('privatedf-theme', theme);
  }, [theme]);

  const renderedMarkdown = useMemo(() => {
    const html = marked.parse(markdown) as string;
    return DOMPurify.sanitize(html);
  }, [markdown]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const content = await file.text();
      setMarkdown(content);
      setFileName(file.name.replace(/\.(md|markdown)$/i, ''));
      setActiveTab('edit');
    } catch {
      alert('Unable to read this file.');
    }

    event.target.value = '';
  };

  const exportPDF = () => {
    if (!markdown.trim()) {
      alert('Your document is empty.');
      return;
    }

    document.title = fileName || 'PrivateDF Document';
    window.print();
  };

  return (
    <div className="app-shell">

      {/* Header */}

      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">
            <FileText size={21} />
          </div>
          <span>PrivateDF</span>
          <span className="brand-divider">/</span>
          <span className="brand-section">Markdown to PDF</span>
        </div>

        <div className="header-actions">
          <div className="privacy-indicator">
            <ShieldCheck size={15} />
            <span>Local processing</span>
          </div>

          <button
            className="icon-button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>
        </div>
      </header>

      {/* Main workspace */}

      <main className="workspace">

        <section className="workspace-heading">
          <div>
            <p className="eyebrow">DOCUMENT CONVERTER</p>
            <h1>Markdown to PDF</h1>
            <p className="subtitle">
              Write, preview and convert your Markdown documents.
            </p>
          </div>

          <div className="heading-actions">
            <label className="secondary-button">
              <Upload size={17} />
              Open .md file
              <input
                type="file"
                accept=".md,.markdown,text/markdown,text/plain"
                onChange={handleFileUpload}
                hidden
              />
            </label>

            <button className="primary-button" onClick={exportPDF}>
              <Download size={17} />
              Export PDF
            </button>
          </div>
        </section>

        {/* Document name */}

        <div className="document-bar">
          <FileText size={17} />
          <input
            type="text"
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
            aria-label="Document name"
            placeholder="Document name"
          />
          <span className="file-extension">.pdf</span>
        </div>

        {/* Editor and Preview */}

        <section className="editor-workspace">

          <div className={`editor-panel ${activeTab === 'edit' ? 'mobile-active' : ''}`}>
            <div className="panel-header">
              <div className="panel-title">
                <Code2 size={17} />
                <span>Markdown editor</span>
              </div>
              <span className="panel-meta">.md</span>
            </div>

            <textarea
              className="markdown-editor"
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              placeholder="Start writing Markdown..."
              spellCheck={false}
              aria-label="Markdown editor"
            />

            <div className="panel-footer">
              <span>{markdown.length} characters</span>
              <span>Markdown</span>
            </div>
          </div>

          <div className={`preview-panel ${activeTab === 'preview' ? 'mobile-active' : ''}`}>
            <div className="panel-header">
              <div className="panel-title">
                <Eye size={17} />
                <span>Live preview</span>
              </div>
              <span className="panel-meta">PDF layout</span>
            </div>

            <div className="preview-scroll">
              <article
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
              />
            </div>

            <div className="panel-footer">
              <span>Live preview</span>
              <span>Changes update automatically</span>
            </div>
          </div>

        </section>

        {/* Mobile tabs */}

        <div className="mobile-tabs">
          <button
            className={activeTab === 'edit' ? 'selected' : ''}
            onClick={() => setActiveTab('edit')}
          >
            <Code2 size={16} /> Editor
          </button>

          <button
            className={activeTab === 'preview' ? 'selected' : ''}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={16} /> Preview
          </button>
        </div>

        <footer className="app-footer">
          <span>
            <ShieldCheck size={15} />
            Your document stays on your device.
          </span>
          <span>PrivateDF · Markdown Converter</span>
        </footer>

      </main>
    </div>
  );
}

export default App;
