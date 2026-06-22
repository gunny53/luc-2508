'use client'

import React from 'react'
import DOMPurify from 'dompurify'

interface HTMLPreviewProps {
  content?: string
  className?: string
}

export default function HTMLPreview({ content, className = '' }: HTMLPreviewProps) {
  if (!content) return null
  const formattedContent = content.replace(/\n/g, '<br />')
  const sanitizedContent = DOMPurify.sanitize(formattedContent, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'blockquote',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'hr',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'span',
      'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'title', 'width', 'height', 'style', 'class', 'id', 'name']
  })

  return (
    <div
      className={`product-description prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}
