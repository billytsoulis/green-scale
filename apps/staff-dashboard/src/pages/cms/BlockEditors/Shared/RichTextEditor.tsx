import React from "react";
import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';

/**
 * Shared Rich Text Editor Wrapper
 * Path: apps/staff-dashboard/src/pages/cms/BlockEditors/Shared/RichTextEditor.tsx
 * Purpose: Provides a consistent WYSIWYG editor for CMS blocks.
 */

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

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
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 focus-within:border-brand-emerald-500 transition-all">
      {/* @ts-ignore */}
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        className="min-h-[150px]"
      />
      <style>{`
        .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid #f1f5f9; padding: 12px; }
        .ql-container.ql-snow { border: none; font-family: inherit; font-size: 1rem; }
        .ql-editor { min-height: 150px; color: #0f172a; }
      `}</style>
    </div>
  );
}