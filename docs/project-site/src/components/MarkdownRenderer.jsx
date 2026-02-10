import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkGithubAlerts from 'remark-github-alerts';

export const MarkdownRenderer = ({ content }) => {
  return (
    <div className="w-full px-8 py-2 mx-auto prose prose-sm prose-neutral dark:prose-invert max-w-none 
                   prose-p:my-2 prose-p:leading-relaxed
                   prose-headings:font-bold prose-headings:tracking-tight prose-headings:mb-2 prose-headings:mt-6 first:prose-headings:mt-0
                   prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                   prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                   prose-pre:bg-[#1A1A1A] dark:prose-pre:bg-[#111] prose-pre:border prose-pre:border-border/50
                   prose-img:rounded-2xl prose-img:shadow-sm
                   prose-ul:my-2 prose-li:my-0.5 prose-ol:my-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkGithubAlerts]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
