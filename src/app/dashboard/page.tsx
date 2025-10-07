"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  PlusCircle,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { isEmailApproved } from "@/components/AuthGate";

/* ---------------- Types ---------------- */
type Source = { label: string; url: string };
type Section = {
  subheading: string;
  description: string;
  imageItems: { file: File; preview: string; addedAt: number }[];
};

/* ---------------- Config ---------------- */
const BASE_URL = "http://127.0.0.1:8000";

/* ---------------- Helpers ---------------- */
function insertAround(
  text: string,
  selStart: number,
  selEnd: number,
  left: string,
  right: string
) {
  const before = text.slice(0, selStart);
  const selected = text.slice(selStart, selEnd);
  const after = text.slice(selEnd);
  return before + left + selected + right + after;
}

/** Insert token at start of the current line (idempotent) */
function insertAtLineStart(text: string, caret: number, token: string) {
  const lineStart = text.lastIndexOf("\n", Math.max(0, caret - 1)) + 1;
  const lineEnd = (() => {
    const n = text.indexOf("\n", caret);
    return n === -1 ? text.length : n;
  })();
  const line = text.slice(lineStart, lineEnd);
  if (line.startsWith(token)) return text; // already present
  return text.slice(0, lineStart) + token + text.slice(lineStart);
}

/** Get the full line-span covering the current selection (or caret line) */
function lineBlockForSelection(text: string, selStart: number, selEnd: number) {
  const start = text.lastIndexOf("\n", Math.max(0, selStart - 1)) + 1;
  const afterEndNL = text.indexOf("\n", selEnd);
  const end = afterEndNL === -1 ? text.length : afterEndNL;
  return { start, end, block: text.slice(start, end) };
}
  
/** UL toggle: if all non-empty lines already have -/* marker, remove; else add "- " */
function toggleUL(block: string) {
  const lines = block.split("\n");
  const isItem = (l: string) => /^\s*(?:-|\*)\s+/.test(l);
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  const allListed = nonEmpty.length > 0 && nonEmpty.every(isItem);

  if (allListed) {
    return lines.map((l) => l.replace(/^(\s*)(?:-|\*)\s+/, "$1")).join("\n");
  }
  return lines
    .map((l) => (l.trim().length ? (isItem(l) ? l : `- ${l}`) : l))
    .join("\n");
}

/** OL toggle: if all non-empty lines numbered, strip; else (re)number sequentially */
function toggleOL(block: string) {
  const lines = block.split("\n");
  const isNum = (l: string) => /^\s*\d+\.\s+/.test(l);
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  const allNumbered = nonEmpty.length > 0 && nonEmpty.every(isNum);

  if (allNumbered) {
    return lines.map((l) => l.replace(/^(\s*)\d+\.\s+/, "$1")).join("\n");
  }
  let n = 1;
  return lines
    .map((l) =>
      l.trim().length ? `${n++}. ${l.replace(/^\s*\d+\.\s+/, "")}` : l
    )
    .join("\n");
}

/* ---------------- Tiny Markdown Renderer ---------------- */
function SimpleMarkdown({ content }: { content: string }) {
  const processInline = (raw: string): string => {
    // 1) escape HTML
    let text = raw
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 2) simple inline markdown
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer" class="text-blue-600 hover:underline break-words">$1</a>'
    );
    text = text.replace(
      /(?<!["'(\[])(https?:\/\/[^\s)]+)(?!["')\]])/g,
      '<a href="$1" target="_blank" rel="noreferrer" class="text-blue-600 hover:underline break-words">$1</a>'
    );
    text = text.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="rounded-lg max-w-full h-auto my-4" />'
    );

    // Convert single newlines within a block to <br> tags for HTML
    return text.replace(/\n/g, "<br />");
  };

  const renderMarkdown = (text: string) => {
    // Split by one or more blank lines to get proper paragraphs/blocks
    const blocks = text.split(/\n\s*\n/).filter((block) => block.trim().length > 0);
    const elements: React.ReactNode[] = [];

    blocks.forEach((block, index) => {
      const key = `block-${index}`;

      // Headings
      if (block.startsWith("### ")) {
        elements.push(
          <h3
            key={key}
            className="text-lg font-semibold mb-2 break-words"
            dangerouslySetInnerHTML={{
              __html: processInline(block.substring(4)),
            }}
          />
        );
      } else if (block.startsWith("## ")) {
        elements.push(
          <h2
            key={key}
            className="text-xl font-semibold mb-3 break-words"
            dangerouslySetInnerHTML={{
              __html: processInline(block.substring(3)),
            }}
          />
        );
      } else if (block.startsWith("# ")) {
        elements.push(
          <h1
            key={key}
            className="text-2xl font-bold mb-4 break-words"
            dangerouslySetInnerHTML={{
              __html: processInline(block.substring(2)),
            }}
          />
        );
      }
      // Lists (check if all non-empty lines in block match list format)
      else if (block.includes("\n") || block.startsWith("- ") || block.startsWith("* ") || /^\d+\.\s/.test(block)) {
        const lines = block.split("\n").filter((l) => l.trim().length > 0);
        const isUnordered = lines.length > 0 && lines.every((l) => /^\s*[-*]\s/.test(l));
        const isOrdered = lines.length > 0 && lines.every((l) => /^\s*\d+\.\s/.test(l));

        if (isUnordered) {
          elements.push(
            <ul
              key={key}
              className="mb-4 break-words"
              style={{
                listStyleType: "disc",
                listStylePosition: "outside",
                paddingLeft: "1.25rem",
              }}
            >
              {lines.map((item, i) => (
                <li
                  key={i}
                  dangerouslySetInnerHTML={{
                    __html: processInline(item.replace(/^\s*[-*]\s/, "")),
                  }}
                />
              ))}
            </ul>
          );
// inside SimpleMarkdown.renderMarkdown, replace ONLY the `isOrdered` block
} else if (isOrdered) {
  // Extract numeric markers from each line like "12. Item"
  const nums = lines.map((l) => {
    const m = l.match(/^\s*(\d+)\.\s+/);
    return m ? parseInt(m[1], 10) : NaN;
  });

  // Use the first number as the <ol> start (fallback 1)
  const start = Number.isFinite(nums[0]) ? nums[0] : 1;

  elements.push(
    <ol
      key={key}
      start={start}
      className="mb-4 break-words"
      style={{ listStyleType: "decimal", listStylePosition: "outside", paddingLeft: "1.25rem" }}
    >
      {lines.map((item, i) => {
        const content = item.replace(/^\s*\d+\.\s+/, "");
        // Expected number if strictly sequential from `start`
        const expected = start + i;
        const n = nums[i];

        // If user supplied a non-sequential number, honor it with <li value>
        const needsExplicit = Number.isFinite(n) && n !== expected;

        return needsExplicit ? (
          <li key={i} value={n} dangerouslySetInnerHTML={{ __html: processInline(content) }} />
        ) : (
          <li key={i} dangerouslySetInnerHTML={{ __html: processInline(content) }} />
        );
      })}
    </ol>
  );

        } else {
          // Not a valid list, treat as a paragraph
          elements.push(
            <p
              key={key}
              className="mb-4 break-words"
              dangerouslySetInnerHTML={{ __html: processInline(block) }}
            />
          );
        }
      }
      // Paragraphs
      else {
        elements.push(
          <p
            key={key}
            className="mb-4 break-words"
            dangerouslySetInnerHTML={{ __html: processInline(block) }}
          />
        );
      }
    });

    return elements;
  };

  return <div className="max-w-none break-words">{renderMarkdown(content)}</div>;
}


/* ============================================================
   Main Component
============================================================ */
export default function BlogAdmin() {
  const router = useRouter(); // 3. Initialize the router

  // 4. Add this useEffect hook to protect the route
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("sessionUserEmail");
    // If there's no saved email or the email is not in the approved list, redirect to login
    if (!savedEmail || !isEmailApproved(savedEmail)) {
      router.replace("/login");
    } 
  }, [router]);
  /* -------- Main blog fields -------- */
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  /* -------- UI state -------- */
  const [isCreating, setIsCreating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiResult, setApiResult] = useState<any>(null);

  /* -------- Refs -------- */
  const descRef = useRef<HTMLTextAreaElement>(null);
  const sectionDescRefs = useRef<Array<HTMLTextAreaElement | null>>([]);

  /* -------- Handle hero image preview -------- */
  useEffect(() => {
    if (heroImageFile) {
      const url = URL.createObjectURL(heroImageFile);
      setHeroImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setHeroImagePreview(null);
    }
  }, [heroImageFile]);

  /* ================= Sections ================= */
  function addSection() {
    setSections((prev) => [
      ...prev,
    { subheading: "", description: "", imageItems: [] },
    ]);
  }

  function updateSection(index: number, field: keyof Section, value: any) {
    setSections((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  /** Append selected images to a section (doesn't replace old ones) */
function addSectionImages(index: number, files: FileList | null) {
  if (!files || files.length === 0) return;

  setSections((prev) => {
    const updated = [...prev];
    const sec = { ...updated[index] };

    const base = Date.now();
    const additions = Array.from(files).map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      // ensure stable ascending order even for multi-select
      addedAt: base + i / 1000,
    }));

    const merged = [...(sec.imageItems || []), ...additions];
    // sort asc by addedAt (first uploaded first)
    merged.sort((a, b) => a.addedAt - b.addedAt);

    sec.imageItems = merged;
    updated[index] = sec;
    return updated;
  });
}


  /** Remove a single image from a section (and revoke preview URL) */
function removeSectionImage(sectionIndex: number, imageIndex: number) {
  setSections((prev) => {
    const updated = [...prev];
    const sec = { ...updated[sectionIndex] };
    const item = sec.imageItems[imageIndex];
    if (item?.preview) URL.revokeObjectURL(item.preview);
    sec.imageItems = sec.imageItems.filter((_, i) => i !== imageIndex);
    updated[sectionIndex] = sec;
    return updated;
  });
}


function removeSection(index: number) {
  const sec = sections[index];
  sec?.imageItems?.forEach((it) => it.preview && URL.revokeObjectURL(it.preview));
  setSections((prev) => prev.filter((_, i) => i !== index));
}


  /* ================= Sources ================= */
  function addSource() {
    setSources((prev) => [...prev, { label: "", url: "" }]);
  }

  function updateSource(index: number, field: keyof Source, value: string) {
    setSources((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function removeSource(index: number) {
    setSources((prev) => prev.filter((_, i) => i !== index));
  }

  /* ================= Create Blog (Single API) ================= */
async function handleCreateBlog() {
  if (!heroImageFile || !title.trim() || !category.trim() || !description.trim()) {
    setApiError("Main Image, Title, Category, and Description are required");
    return;
  }

    setApiError(null);
    setApiResult(null);
    setIsCreating(true);

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category.trim());
      formData.append("hero_image", heroImageFile);

      // Keep section count preserved even if empty text, so image grouping aligns
      const sectionsData = sections.map((s) => ({
        heading: (s.subheading || "").trim(),
        paragraph: (s.description || "").trim(),
      }));
      if (sectionsData.length > 0) {
        formData.append("sections", JSON.stringify(sectionsData));
      }

      // Group images by section index: section_images[0][], section_images[1][]
sections.forEach((section, i) => {
  if (section.imageItems?.length) {
    // they are already kept in ascending order by addedAt
    section.imageItems.forEach((it) => {
      formData.append(`section_images[${i}][]`, it.file);
    });
  } else {
    const empty = new File([""], "", { type: "application/octet-stream" });
    formData.append(`section_images[${i}][]`, empty);
  }
});


      const validSources = sources.filter((s) => s.label.trim() && s.url.trim());
      if (validSources.length > 0) {
        const sourcesData = validSources.map((s) => ({
          title: s.label.trim(),
          url: s.url.trim(),
        }));
        formData.append("sources", JSON.stringify(sourcesData));
      }

      const res = await fetch(`${BASE_URL}/blogs`, {
        method: "POST",
        body: formData,
      });

      let data: any;
      const contentType = res.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text, status: res.status };
        }
      }

      if (res.ok || res.status === 201) {
        setApiResult(data);
        // Revoke all section preview URLs before resetting
sections.forEach((sec) => sec.imageItems.forEach((it) => URL.revokeObjectURL(it.preview)));
        setHeroImageFile(null);
        setTitle("");
        setCategory("");
        setDescription("");
        setSections([]);
        setSources([]);
      } else {
        throw new Error(data?.message || `Request failed with status ${res.status}`);
      }
    } catch (err: any) {
      setApiError(err?.message || "Failed to create blog");
    } finally {
      setIsCreating(false);
    }
  }

  /* ================= Markdown toolbar ================= */

function applyMarkdownTo(
  el: HTMLTextAreaElement | null,
  value: string,
  setValue: (v: string) => void,
  action: "bold" | "italic" | "h2" | "h3" | "ul" | "ol" | "link" | "image"
) {
  if (!el) return;
  const selStart = el.selectionStart ?? value.length;
  const selEnd = el.selectionEnd ?? value.length;
  let next = value;

  // Get line boundaries for all actions when no selection
  const isNoSelection = selStart === selEnd;
  
  // Calculate line boundaries
  const lineStart = value.lastIndexOf("\n", Math.max(0, selStart - 1)) + 1;
  const lineEndIdx = value.indexOf("\n", selEnd);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  
  // For multi-line selection, get full block
  const { start: bStart, end: bEnd, block } = isNoSelection
    ? { start: lineStart, end: lineEnd, block: value.slice(lineStart, lineEnd) }
    : (() => {
        const s = value.lastIndexOf("\n", Math.max(0, selStart - 1)) + 1;
        const eIdx = value.indexOf("\n", selEnd);
        const e = eIdx === -1 ? value.length : eIdx;
        return { start: s, end: e, block: value.slice(s, e) };
      })();

  if (action === "ul" || action === "ol") {
    const replaced = action === "ul" ? toggleUL(block) : toggleOL(block);
    next = value.slice(0, bStart) + replaced + value.slice(bEnd);

    const newStart = bStart;
    const newEnd = bStart + replaced.length;

    setValue(next);
    (setTimeout)(() => {
      try {
        el.focus();
        el.setSelectionRange(newStart, newEnd);
      } catch {}
    }, 0);
    return;
  }

  // For other actions, use line selection when no text is selected
  let effectiveStart = selStart;
  let effectiveEnd = selEnd;
  let newSelStart = selStart;
  let newSelEnd = selEnd;

  if (isNoSelection && (action === "bold" || action === "italic" || action === "link" || action === "image")) {
    // When no selection, select the whole line (excluding newline)
    effectiveStart = lineStart;
    effectiveEnd = lineEnd;
    
    // Trim the line to get actual content bounds
    const lineContent = value.slice(lineStart, lineEnd);
    const trimmedStart = lineContent.search(/\S/); // First non-whitespace
    const trimmedEnd = lineContent.search(/\s*$/); // Last non-whitespace
    
    if (trimmedStart !== -1 && trimmedEnd !== -1) {
      effectiveStart = lineStart + trimmedStart;
      effectiveEnd = lineStart + trimmedEnd;
    } else if (lineContent.trim()) {
      // If line has content but weird trimming, use the whole line minus trailing spaces
      effectiveEnd = lineStart + lineContent.trimEnd().length;
    }
  }

  switch (action) {
    case "bold":
      next = insertAround(value, effectiveStart, effectiveEnd, "**", "**");
      if (isNoSelection) {
        newSelStart = effectiveStart;
        newSelEnd = effectiveEnd + 4; // Account for the added ** **
      }
      break;
    case "italic":
      next = insertAround(value, effectiveStart, effectiveEnd, "*", "*");
      if (isNoSelection) {
        newSelStart = effectiveStart;
        newSelEnd = effectiveEnd + 2; // Account for the added * *
      }
      break;
    case "h2":
      next = insertAtLineStart(value, selStart, "## ");
      if (isNoSelection) {
        newSelStart = lineStart;
        newSelEnd = lineEnd + 3; // Account for added "## "
      }
      break;
    case "h3":
      next = insertAtLineStart(value, selStart, "### ");
      if (isNoSelection) {
        newSelStart = lineStart;
        newSelEnd = lineEnd + 4; // Account for added "### "
      }
      break;
    case "link":
      if (isNoSelection && value.slice(effectiveStart, effectiveEnd).trim()) {
        // If there's text on the line, wrap it as link text
        next = insertAround(value, effectiveStart, effectiveEnd, "[", "](https://example.com)");
        newSelStart = effectiveStart;
        newSelEnd = effectiveEnd + 24; // Account for [] and ](https://example.com)
      } else {
        // Empty line or has selection - use original behavior
        next = insertAround(value, selStart, selEnd, "[", "](https://example.com)");
      }
      break;
    case "image":
      if (isNoSelection && value.slice(effectiveStart, effectiveEnd).trim()) {
        // If there's text on the line, use it as alt text
        next = insertAround(value, effectiveStart, effectiveEnd, "![", "](image-url-here)");
        newSelStart = effectiveStart;
        newSelEnd = effectiveEnd + 20; // Account for ![] and ](image-url-here)
      } else {
        // Empty line or has selection - use original behavior
        next = insertAround(value, selStart, selEnd, "![alt text](", ")");
      }
      break;
  }

  setValue(next);
  
  // Set selection for better UX
  (setTimeout)(() => {
    try {
      el.focus();
      if (isNoSelection && (action === "bold" || action === "italic" || action === "h2" || action === "h3" || action === "link" || action === "image")) {
        el.setSelectionRange(newSelStart, newSelEnd);
      }
    } catch {}
  }, 0);
}
  function applyMarkdown(
    action: "bold" | "italic" | "h2" | "h3" | "ul" | "ol" | "link" | "image"
  ) {
    applyMarkdownTo(descRef.current, description, setDescription, action);
  }

  function applyMarkdownForSection(
    index: number,
    action: "bold" | "italic" | "h2" | "h3" | "ul" | "ol" | "link" | "image"
  ) {
    const el = sectionDescRefs.current[index];
    const current = sections[index]?.description ?? "";
    applyMarkdownTo(el, current, (v) => updateSection(index, "description", v), action);
  }

  /* ================= Render ================= */
const canCreate = Boolean(heroImageFile && title.trim() && category.trim() && description.trim());
  return (
    <main className="min-h-screen bg-gray-50 pt-20 md:pt-24 lg:pt-28">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create Blog</h1>
        </header>

        {/* Error/Success Messages */}
        {apiError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {apiError}
          </div>
        )}
        {apiResult && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Blog created successfully!
          </div>
        )}

        {/* Main card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            {/* Hero Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Main Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
                className="block w-full rounded-lg border border-gray-300 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:px-4 file:py-2 file:font-medium hover:file:bg-blue-100"
              />
              {heroImageFile && (
                <p className="text-xs text-gray-500">Selected: {heroImageFile.name}</p>
              )}
            </div>

            {/* Title + Category */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text_sm font-medium mb-1">Title *</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="My awesome blog post"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="Big AI Research">Big AI Research</option>
                  <option value="Big AI Case study">Big AI Case study</option>
                  <option value="Big AIR Lab notes">Big AIR Lab notes</option>
                  <option value="AI News & Industry">AI News & Industry</option>
                  <option value="Financial Intelligence">Financial Intelligence</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Description *</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { action: "bold", label: "", Icon: Bold },
                  { action: "italic", label: "", Icon: Italic },
                  { action: "h2", label: "", Icon: Heading2 },
                  { action: "h3", label: "", Icon: Heading3 },
                  { action: "ul", label: "", Icon: List },
                  { action: "ol", label: "", Icon: ListOrdered },
                  { action: "link", label: "", Icon: LinkIcon },
                  { action: "image", label: "", Icon: ImageIcon },
                ].map(({ action, label, Icon }) => (
                  <button
                    key={action}
                    onClick={() => applyMarkdown(action as any)}
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs hover:bg-gray-50"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
              <textarea
                ref={descRef}
                rows={8}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Write your blog description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Blog Sections */}
            <div className="space-y-4">
              <div className="flex justify-between items-center not-prose">
                <h2 className="text-lg font-semibold">Blog Sections</h2>
                <button
                  onClick={addSection}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                  style={{
                    background: "none",
                    backgroundColor: "#2563eb",
                    mixBlendMode: "normal",
                  }}
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Section
                </button>
              </div>

              {sections.length === 0 ? (
                <p className="text-sm text-gray-500">No sections yet. Add one to start.</p>
              ) : (
                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm">Section {index + 1}</h3>
                        <button
                          onClick={() => removeSection(index)}
                          type="button"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Image upload (MULTIPLE) */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Section Images (Optional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => addSectionImages(index, e.target.files)}
                          className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 file:px-3 file:py-1"
                        />

{section.imageItems.length > 0 && (
  <div className="mt-2 flex flex-col gap-2"> {/* column layout */}
    {section.imageItems.map((it, imgIdx) => (
      <div key={it.addedAt} className="relative">
        <img
          src={it.preview}
          alt={`Section ${index + 1} - ${imgIdx + 1}`}
          className="w-full max-h-64 object-cover rounded-md border"
        />
        <button
          type="button"
          onClick={() => removeSectionImage(index, imgIdx)}
          className="absolute top-1 right-1 rounded bg-white/80 border px-1 py-0.5 text-xs hover:bg-white"
          title="Remove"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
)}

                      </div>

                      {/* Subheading */}
                      <input
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Section heading"
                        value={section.subheading}
                        onChange={(e) => updateSection(index, "subheading", e.target.value)}
                      />

                      {/* Section toolbar */}
                      <div className="flex flex-wrap gap-2">
                        {[
                          { action: "bold", label: "", Icon: Bold },
                          { action: "italic", label: "", Icon: Italic },
                          { action: "h2", label: "", Icon: Heading2 },
                          { action: "h3", label: "", Icon: Heading3 },
                          { action: "ul", label: "", Icon: List },
                          { action: "ol", label: "", Icon: ListOrdered },
                          { action: "link", label: "", Icon: LinkIcon },
                          { action: "image", label: "", Icon: ImageIcon },
                        ].map(({ action, label, Icon }) => (
                          <button
                            key={action}
                            onClick={() => applyMarkdownForSection(index, action as any)}
                            type="button"
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs hover:bg-gray-50"
                          >
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Section content */}
                      <textarea
                        ref={(el) => {sectionDescRefs.current[index] = el;}}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        rows={4}
                        placeholder="Section content"
                        value={section.description}
                        onChange={(e) => updateSection(index, "description", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sources */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Sources (Optional)</h2>
                <button
                  onClick={addSource}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  <PlusCircle className="h-4 w-4" /> Add Source
                </button>
              </div>

              {sources.length === 0 ? (
                <p className="text-sm text-gray-500">No sources added.</p>
              ) : (
                <div className="space-y-3">
                  {sources.map((source, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-2">
                      <input
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Source label"
                        value={source.label}
                        onChange={(e) => updateSource(index, "label", e.target.value)}
                      />
                      <input
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="https://example.com"
                        value={source.url}
                        onChange={(e) => updateSource(index, "url", e.target.value)}
                      />
                      <button
                        onClick={() => removeSource(index)}
                        type="button"
                        className="self-center sm:self-auto text-red-600 hover:text-red-700 px-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
              <button
                onClick={() => setPreviewOpen(!previewOpen)}
                type="button"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                {previewOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewOpen ? "Hide Preview" : "Preview Blog"}
              </button>

              <button
                disabled={!canCreate || isCreating}
                onClick={handleCreateBlog}
                type="button"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-medium text-white"
                style={{
                  background: canCreate && !isCreating ? "none" : undefined,
                  backgroundColor: canCreate && !isCreating ? "#16a34a" : "#d1d5db",
                  mixBlendMode: "normal",
                  border:
                    canCreate && !isCreating ? "1px solid #15803d" : "1px solid #d1d5db",
                }}
              >
                {isCreating ? "Creating..." : "Create Blog"}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {previewOpen && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow_sm p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl font-bold mb-6">📖 Preview</h2>

            {heroImagePreview && (
              <div className="mb-6">
                <img
                  src={heroImagePreview}
                  alt="Hero"
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {title && <h1 className="text-3xl font-bold mb-4">{title}</h1>}

            {category && (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
                {category}
              </span>
            )}

            {description ? (
              <div className="mb-6">
                <SimpleMarkdown content={description} />
              </div>
            ) : (
              <p className="text-gray-500 italic mb-6">No description provided</p>
            )}

            {sections.length > 0 && (
              <div className="space-y-6 mb-6">
                {sections.map((section, index) => (
                  <div key={index} className="border-t pt-6">
{section.imageItems?.length > 0 && (
  <div className="mb-4 flex flex-col gap-3"> {/* column layout */}
    {section.imageItems.map((it, i2) => (
      <img
        key={it.addedAt}
        src={it.preview}
        alt={`Section ${index + 1} - ${i2 + 1}`}
        className="w-full max-h-80 object-cover rounded-lg"
      />
    ))}
  </div>
)}

                    {section.subheading && (
                      <h2 className="text-xl font-semibold mb-3">{section.subheading}</h2>
                    )}
                    {section.description && <SimpleMarkdown content={section.description} />}
                  </div>
                ))}
              </div>
            )}

            {sources.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">Sources</h3>
                <ul className="space-y-2">
                  {sources.map((source, index) => (
                    <li key={index} className="break-words">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {source.label || source.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
