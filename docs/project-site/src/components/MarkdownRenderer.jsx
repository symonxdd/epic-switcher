import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkGithubAlerts from 'remark-github-alerts';
import { NoteCallout } from './NoteCallout';

export const MarkdownRenderer = ({ content }) => {
  return (
    <div className="w-full px-8 py-2 mx-auto prose prose-sm prose-neutral dark:prose-invert max-w-none 
                   prose-p:my-2 prose-p:leading-relaxed
                   prose-headings:font-bold prose-headings:tracking-tight prose-headings:mb-2 prose-headings:mt-4 prose-h2:mt-2 first:prose-headings:mt-0
                   prose-a:text-primary
                   prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                   prose-pre:bg-[#f5f5f5] prose-pre:text-[#374151] dark:prose-pre:bg-[#111] dark:prose-pre:text-[#e5e5e5] prose-pre:border prose-pre:border-border/50 [&_pre_code]:bg-transparent
                   prose-img:rounded-2xl prose-img:shadow-sm
                   prose-ul:my-2 prose-li:my-0.5 prose-ol:my-2
                   [&_summary]:mb-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkGithubAlerts]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ children, ...props }) => (
            <a
              className="underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors"
              {...props}
            >
              {children}
            </a>
          ),
          div: ({ className, children, ...props }) => {
            if (className === 'markdown-alert markdown-alert-note') {
              return <NoteCallout>{children}</NoteCallout>;
            }
            return <div className={className} {...props}>{children}</div>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
