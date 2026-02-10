import React from 'react';
import { Info } from 'lucide-react';

export const NoteCallout = ({ children }) => {
  // Extract title and content from children
  const childArray = React.Children.toArray(children);
  const titleElement = childArray.find(
    child => child?.props?.className === 'markdown-alert-title'
  );
  const contentElements = childArray.filter(
    child => child?.props?.className !== 'markdown-alert-title'
  );

  const titleText = titleElement?.props?.children?.[1] || 'Note';

  return (
    <div className="my-4 border-l-4 border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2 font-semibold text-foreground mb-2">
        <Info className="w-4 h-4 text-muted-foreground" />
        <span>{titleText}</span>
      </div>
      {contentElements}
    </div>
  );
};
