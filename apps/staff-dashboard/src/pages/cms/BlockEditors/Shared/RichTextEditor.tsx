import React from "react";
import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';

/**
 * Shared Rich Text Editor Wrapper
 * Path: apps/staff-dashboard/src/pages/cms/BlockEditors/Shared/RichTextEditor.tsx
 * Purpose: Provides a consistent WYSIWYG editor for CMS blocks.
 * Fix: Removed auto-cleaning on every keystroke to prevent infinite re-render loops.
 */

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Global Utility: cleanRichText
 * 1. Decodes common HTML entities into clean UTF-8.
 * 2. Strips only the outermost wrapping tag (usually <p>...</p>).
 * IMPORTANT: Call this BEFORE saving to DB, not inside onChange.
 */
export const cleanRichText = (html: string): string => {
  if (!html) return "";

  // Step 1: Decode HTML entities to clean UTF-8 characters
  let cleaned = html
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘");

  // Step 2: Strip the outermost wrapping <p> tag if it wraps the entire content
  // We use the 's' flag to allow the dot to match newlines
  cleaned = cleaned.replace(/^<p>(.*)<\/p>$/s, "$1");

  return cleaned.trim();
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 focus-within:border-emerald-500 transition-all">
      {/* @ts-ignore */}
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange} // Logic: Let the editor manage its internal state (including <p> tags)
        modules={modules}
        placeholder={placeholder}
        className="min-h-[150px]"
      />
      <style>{`
        .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid #f1f5f9; padding: 12px; }
        .ql-container.ql-snow { border: none; font-family: inherit; font-size: 1rem; }
        .ql-editor { min-height: 150px; color: #0f172a; }
        .ql-editor.ql-blank::before { color: #cbd5e1; font-style: normal; }
      `}</style>
    </div>
  );
}