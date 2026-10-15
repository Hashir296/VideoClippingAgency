import React, { useState } from 'react';

/**
 * High-performance, luxury-styled Markdown renderer
 * Supports:
 * - Headings (h1, h2, h3) with anchor IDs for Table of Contents
 * - Markdown tables (| col | col |) with responsive gold-bordered dark container
 * - Fenced code blocks with one-click copy button
 * - Executive Callout blocks (> [!NOTE], > [!METRIC], > [!WARNING])
 * - Blockquotes
 * - Ordered & unordered lists
 * - Inline formatting (bold, italic, inline code)
 */
export default function MarkdownView({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];
  let inCode = false;
  let codeBlockLines = [];
  let codeLang = '';
  let inTable = false;
  let tableRows = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-6 list-disc space-y-2.5 pl-6 text-[#D0CECB] leading-relaxed">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushCode = () => {
    if (inCode) {
      const codeStr = codeBlockLines.join('\n');
      elements.push(
        <CodeBlock key={`code-${elements.length}`} code={codeStr} lang={codeLang} />
      );
      codeBlockLines = [];
      codeLang = '';
      inCode = false;
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="my-8 overflow-x-auto rounded-2xl border border-white/10 bg-[#0C0C10] p-1 shadow-2xl">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                {tableRows[0].map((header, idx) => (
                  <th key={idx} className="px-5 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                    {header.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tableRows.slice(1).map((row, rIdx) => (
                <tr key={rIdx} className="transition-colors hover:bg-white/[0.02]">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-5 py-3.5 text-[#D0CECB] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatInline(cell.trim()) }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const formatInline = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#F5F3EF]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-[#D4AF37]">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-[#D4AF37]">$1</code>');
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Code blocks toggling
    if (line.startsWith('```')) {
      if (inCode) {
        flushCode();
      } else {
        flushList();
        flushTable();
        inCode = true;
        codeLang = line.replace('```', '').trim();
      }
      continue;
    }

    if (inCode) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // Markdown Table row
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      // Skip delimiter row like |---|---|
      if (/^\|[\s\-:|]+\|$/.test(line)) {
        continue;
      }
      const cells = line.slice(1, -1).split('|');
      inTable = true;
      tableRows.push(cells);
      continue;
    } else {
      flushTable();
    }

    // Empty lines
    if (!line) {
      flushList();
      continue;
    }

    // Horizontal Rule
    if (line === '---' || line === '***') {
      flushList();
      elements.push(<hr key={`hr-${i}`} className="my-10 border-white/10" />);
      continue;
    }

    // Headings with id anchors
    if (line.startsWith('### ')) {
      flushList();
      const text = line.replace('### ', '');
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      elements.push(
        <h3 id={slug} key={`h3-${i}`} className="mb-3 mt-8 font-serif text-2xl font-medium tracking-tight text-[#F5F3EF]">
          {text}
        </h3>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flushList();
      const text = line.replace('## ', '');
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      elements.push(
        <h2 id={slug} key={`h2-${i}`} className="mb-4 mt-12 font-serif text-3xl font-medium tracking-tight text-[#F5F3EF] md:text-4xl scroll-mt-24">
          {text}
        </h2>
      );
      continue;
    }

    if (line.startsWith('# ')) {
      flushList();
      const text = line.replace('# ', '');
      elements.push(
        <h1 key={`h1-${i}`} className="mb-6 mt-12 font-serif text-4xl font-semibold tracking-tight text-[#F5F3EF] md:text-5xl">
          {text}
        </h1>
      );
      continue;
    }

    // Executive Callouts
    if (line.startsWith('> [!NOTE]') || line.startsWith('> [!METRIC]') || line.startsWith('> [!TIP]') || line.startsWith('> [!KEY FINDING]')) {
      flushList();
      const type = line.match(/> \[!(.*?)\]/)?.[1] || 'INSIGHT';
      const body = line.replace(/> \[!.*?\]\s*/, '');
      elements.push(
        <div key={`callout-${i}`} className="my-7 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.04] p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Strategic Finding: {type}
            </span>
          </div>
          <p className="text-[#F5F3EF] leading-relaxed text-sm md:text-base" dangerouslySetInnerHTML={{ __html: formatInline(body) }} />
        </div>
      );
      continue;
    }

    // Standard Blockquote
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-7 border-l-2 border-[#D4AF37] bg-white/[0.02] py-4 pl-6 pr-4 italic text-neutral-300 rounded-r-2xl"
          dangerouslySetInnerHTML={{ __html: formatInline(line.replace('> ', '')) }}
        />
      );
      continue;
    }

    // Unordered List item
    if (line.startsWith('* ') || line.startsWith('- ')) {
      inList = true;
      listItems.push(line.substring(2));
      continue;
    }

    // Numbered List
    if (/^\d+\.\s/.test(line)) {
      flushList();
      const numText = line.replace(/^\d+\.\s/, '');
      elements.push(
        <div key={`num-${i}`} className="my-3.5 flex items-start gap-3 pl-2">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/5 font-mono text-xs font-bold text-[#D4AF37]">
            {line.match(/^\d+/)[0]}
          </span>
          <p className="pt-0.5 text-[#D0CECB] leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(numText) }} />
        </div>
      );
      continue;
    }

    // Regular Paragraph
    flushList();
    elements.push(
      <p
        key={`p-${i}`}
        className="my-5 text-base leading-relaxed text-[#A3A3B0] md:text-lg selection:bg-[#D4AF37]/20"
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
  }

  flushList();
  flushCode();
  flushTable();

  return <div className="article-body prose-dark space-y-1">{elements}</div>;
}

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-7 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0E]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs text-neutral-400">
        <span>{lang || 'snippet'}</span>
        <button
          onClick={handleCopy}
          className="rounded px-2 py-0.5 text-xs text-[#D4AF37] hover:bg-white/5 transition-colors"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-xs text-neutral-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
