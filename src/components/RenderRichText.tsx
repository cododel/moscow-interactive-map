export const RenderRichText = ({ content }: { content: any }) => {
  if (!content) return null

  // Payload Lexical renderer placeholder
  // In a real project, you'd use @payloadcms/richtext-lexical helper components
  // For now, let's assume content is structured to be rendered or we just show a placeholder
  return (
    <div className="rich-text">
      {/* 
         Simplified rendering for demonstration. 
         Payload 3 provides structured JSON for Lexical.
       */}
      {content.root?.children?.map((node: any, i: number) => {
        if (node.type === 'paragraph') {
          return (
            <p key={i}>
              {node.children?.map((child: any, j: number) => (
                <span
                  key={j}
                  style={{
                    fontWeight: child.format & 1 ? 'bold' : 'normal',
                    fontStyle: child.format & 2 ? 'italic' : 'normal',
                  }}
                >
                  {child.text}
                </span>
              ))}
            </p>
          )
        }
        return null
      })}
    </div>
  )
}
