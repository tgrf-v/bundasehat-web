import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
  RemoveFormatting,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Tulis isi penjelasan artikel, gejala klinis, dan langkah pertolongan pertama di sini...",
  className,
  minHeight = "min-h-[260px]",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-slate max-w-none text-sm text-slate-800 focus:outline-none leading-relaxed",
          "[&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-4 [&_h2]:mb-2",
          "[&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-3 [&_h3]:mb-1.5",
          "[&_p]:my-1.5 [&_p]:leading-relaxed",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2",
          "[&_li]:my-0.5",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-emerald-600 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2 [&_blockquote]:text-slate-600",
          "[&_hr]:my-4 [&_hr]:border-slate-200"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Keep editor content in sync when external content changes (e.g. modal open / reset)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      if (!content && editor.getHTML() === "<p></p>") return;
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className={cn("border border-slate-200 rounded-2xl bg-white p-4 animate-pulse", minHeight)}>
        <div className="h-4 bg-slate-100 rounded w-1/3 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-2/3" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border border-slate-200/90 rounded-2xl bg-white overflow-hidden focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-300 transition-all shadow-xs",
        className
      )}
    >
      {/* Sleek Minimal Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/90 border-b border-slate-200/80">
        
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors",
            editor.isActive("bold") && "bg-white text-emerald-700 shadow-xs font-bold border border-slate-200/80"
          )}
          title="Tebal (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors",
            editor.isActive("italic") && "bg-white text-emerald-700 shadow-xs font-bold border border-slate-200/80"
          )}
          title="Miring (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>

        {/* Strike */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(
            "p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors",
            editor.isActive("strike") && "bg-white text-emerald-700 shadow-xs font-bold border border-slate-200/80"
          )}
          title="Coret Teks"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-300 mx-1" />

        {/* Heading 2 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "px-2 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors",
            editor.isActive("heading", { level: 2 }) && "bg-white text-emerald-700 shadow-xs border border-slate-200/80"
          )}
          title="Subjudul Utama (H2)"
        >
          H2
        </button>

        {/* Heading 3 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "px-2 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors",
            editor.isActive("heading", { level: 3 }) && "bg-white text-emerald-700 shadow-xs border border-slate-200/80"
          )}
          title="Subjudul Kecil (H3)"
        >
          H3
        </button>

        <div className="h-4 w-[1px] bg-slate-300 mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors",
            editor.isActive("bulletList") && "bg-white text-emerald-700 shadow-xs font-bold border border-slate-200/80"
          )}
          title="Daftar Poin (Bullet List)"
        >
          <List className="h-4 w-4" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors",
            editor.isActive("orderedList") && "bg-white text-emerald-700 shadow-xs font-bold border border-slate-200/80"
          )}
          title="Daftar Bernomor (Numbered List)"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors",
            editor.isActive("blockquote") && "bg-white text-emerald-700 shadow-xs font-bold border border-slate-200/80"
          )}
          title="Kutipan / Catatan Khusus"
        >
          <Quote className="h-4 w-4" />
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
          title="Garis Pembatas"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-300 mx-1" />

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
          title="Hapus Format"
        >
          <RemoveFormatting className="h-4 w-4" />
        </button>

        <div className="ml-auto flex items-center gap-1">
          {/* Undo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Urungkan (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </button>

          {/* Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Ulangi (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Editor Content Area (Writing Surface) */}
      <div className={cn("p-4 sm:p-5 overflow-y-auto max-h-[380px] bg-white cursor-text", minHeight)}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
