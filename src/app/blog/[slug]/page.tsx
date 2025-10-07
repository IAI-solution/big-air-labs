"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useCallback, useEffect, useState, useRef } from "react";
import Hero7 from "@/components/sectionSeven/page"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/* ---------------- API Types ---------------- */
/* ---------------- API Types ---------------- */
interface BlogSection {
  subheading: string;
  image: string | string[] | null;
  description: string;
}

/* Normalize image field (string | string[] | null) -> string | null */
function toImgList(img: BlogSection["image"]): string[] {
  if (!img) return [];
  const arr = Array.isArray(img) ? img : [img];
  return arr
    .map(u => (typeof u === "string" ? u.trim() : ""))
    .filter(Boolean);
}

interface BlogData {
  _id: string;
  title: string;
  description: string;
  category: string;
  hero_image: string;
  sections: BlogSection[];
  sources: any;
  created_at: string;
}

/* ---------------- Config ---------------- */
const BASE_URL = "http://127.0.0.1:8000";

/* ---------------- prettifySlug ---------------- */
function prettifySlug(raw?: string | string[]) {
  if (!raw) return "";
  const s = Array.isArray(raw) ? raw.join("/") : raw;
  let t = decodeURIComponent(s).replace(/-/g, " ");

  const small = new Set([
    "a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the", "to", "with",
  ]);

  t = t
    .split(/\s+/)
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i !== 0 && small.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ")
    .replace(/\bAi\b/g, "AI")
    .replace(/\bKyc\b/g, "KYC")
    .replace(/\bApi\b/g, "API")
    .replace(/\bApis\b/g, "APIs")
    .replace(/\bRegtech\b/g, "RegTech");

  return t;
}

/* ---------------- Utils ---------------- */
function formatDate(dateString?: string) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function calcReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} minutes read`;
}

/* ---------------- Calculate Time Since Published ---------------- */
function calcTimeSince(dateString?: string): string {
  if (!dateString) return "";
  
  const publishedDate = new Date(dateString);
  if (isNaN(publishedDate.getTime())) return "";
  
  const now = new Date();
  const diffInMs = now.getTime() - publishedDate.getTime();
  
  // Convert to minutes, hours, days
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInMonths = Math.floor(diffInDays / 30); // Approximate
  
  // Format based on time difference
  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffInMonths < 6) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  } else {
    return "More than 6 months ago";
  }
}

/* ---------------- Breadcrumbs ---------------- */
function Crumbs({ title }: { title: string }) {
  const linkBase =
    "font-satoshi text-[16px] font-medium leading-normal transition-colors";
  const linkMuted = `${linkBase} text-[#6F6F6F] hover:text-[#333]`;
  const current =
    "font-satoshi text-[16px] font-medium leading-normal text-[#333]";

  return (
    <ol className="flex items-center flex-wrap gap-x-2 gap-y-1">
      <li>
        <Link href="/" className={linkMuted}>Home</Link>
      </li>
      <li aria-hidden className={linkMuted}>/</li>
      <li>
        <Link href="/blog" className={linkMuted}>Winds of change</Link>
      </li>
      <li aria-hidden className={linkMuted}>/</li>
      <li
        aria-current="page"
        className="truncate max-w-[80vw] sm:max-w-[60vw] lg:max-w-[calc(100vw-271px-24px)]"
      >
        <span className={current}>{title}</span>
      </li>
    </ol>
  );
}

/* ---------------- Blog Meta ---------------- */
function BlogMeta({ 
  timeSince, 
  readTime, 
  dateStr,
  fullText,
  title 
}: { 
  timeSince: string; 
  readTime: string; 
  dateStr: string;
  fullText: string;
  title: string;
}) {
  const [speechState, setSpeechState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isLoadingRef = useRef(false);
  const chunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef(0);
  const isPausedRef = useRef(false);
  const wasPlayingRef = useRef(false);

  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/`{1,3}([^`]+)`{1,3}/g, '$1') // Remove code blocks
      .replace(/[-•]/g, '') // Remove bullet points
      .replace(/\n{2,}/g, '. ') // Replace multiple newlines with periods
      .replace(/\n/g, ' ') // Replace single newlines with spaces
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  };

  // Split text into smaller chunks (sentence-level for better pause/resume)
  const splitTextIntoChunks = (text: string): string[] => {
    const chunks: string[] = [];
    // Split by sentence-ending punctuation
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    let currentChunk = '';
    const maxChunkLength = 50; // Reduced to ~50 words per chunk for better pause/resume granularity
    
    for (const sentence of sentences) {
      const words = sentence.trim().split(/\s+/);
      const currentWords = currentChunk.split(/\s+/).filter(Boolean);
      
      // If adding this sentence would exceed the limit, save current chunk and start new one
      if (currentWords.length > 0 && currentWords.length + words.length > maxChunkLength) {
        chunks.push(currentChunk);
        currentChunk = sentence.trim();
      } else {
        // Add sentence to current chunk
        currentChunk += (currentChunk ? ' ' : '') + sentence.trim();
        
        // If current chunk is getting close to limit, save it
        if (currentChunk.split(/\s+/).length >= maxChunkLength) {
          chunks.push(currentChunk);
          currentChunk = '';
        }
      }
    }
    
    // Don't forget the last chunk
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    // If no chunks were created (empty text), return empty array
    return chunks.filter(chunk => chunk.trim().length > 0);
  };

  const speakChunk = useCallback((chunkIndex: number) => {
    if (!window.speechSynthesis || chunkIndex >= chunksRef.current.length) {
      // All chunks done
      setSpeechState('idle');
      currentChunkIndexRef.current = 0;
      isPausedRef.current = false;
      wasPlayingRef.current = false;
      return;
    }

    // Update the current chunk index
    currentChunkIndexRef.current = chunkIndex;

    const chunk = chunksRef.current[chunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunk);
    
    // Configure speech settings
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';
    
    // Try to select a voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en-US')
      ) || voices.find(voice => 
        voice.lang.startsWith('en')
      ) || voices[0];
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    utterance.onstart = () => {
      console.log(`Speaking chunk ${chunkIndex + 1}/${chunksRef.current.length}`);
      if (chunkIndex === 0) {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
      setSpeechState('playing');
      isPausedRef.current = false;
      wasPlayingRef.current = true;
    };

    utterance.onend = () => {
      console.log(`Finished chunk ${chunkIndex + 1}/${chunksRef.current.length}`);
      
      // Check if we should continue to the next chunk
      if (!isPausedRef.current && wasPlayingRef.current) {
        const nextIndex = chunkIndex + 1;
        if (nextIndex < chunksRef.current.length) {
          // Continue with next chunk
          currentChunkIndexRef.current = nextIndex;
          setTimeout(() => {
            if (!isPausedRef.current && wasPlayingRef.current) {
              speakChunk(nextIndex);
            }
          }, 100);
        } else {
          // All chunks done
          setSpeechState('idle');
          currentChunkIndexRef.current = 0;
          isPausedRef.current = false;
          wasPlayingRef.current = false;
        }
      } else if (isPausedRef.current) {
        // If paused, move to next chunk but don't play
        currentChunkIndexRef.current = chunkIndex + 1;
      }
    };

    utterance.onerror = (event) => {
      // Ignore interrupted errors as they happen when we cancel
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('Speech synthesis error:', event.error, event);
        alert(`Speech error: ${event.error}`);
      }
      setIsLoading(false);
      isLoadingRef.current = false;
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        setSpeechState('idle');
        currentChunkIndexRef.current = 0;
        isPausedRef.current = false;
        wasPlayingRef.current = false;
      }
    };

    utterance.onpause = () => {
      console.log('Speech paused at chunk', chunkIndex);
      setSpeechState('paused');
      isPausedRef.current = true;
    };

    utterance.onresume = () => {
      console.log('Speech resumed at chunk', chunkIndex);
      setSpeechState('playing');
      isPausedRef.current = false;
      wasPlayingRef.current = true;
    };

    utteranceRef.current = utterance;
    
    // Cancel any ongoing speech and speak the new chunk
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleSpeech = useCallback(() => {
    console.log('Speech button clicked, current state:', speechState);
    
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (speechState === 'playing') {
      // Pause speech
      console.log('Pausing speech...');
      isPausedRef.current = true;
      wasPlayingRef.current = false;
      
      // Try to pause the current utterance
      window.speechSynthesis.pause();
      setSpeechState('paused');
      
    } else if (speechState === 'paused') {
      // Resume speech
      console.log('Resuming speech...');
      isPausedRef.current = false;
      wasPlayingRef.current = true;
      
      // Check if synthesis is actually paused
      if (window.speechSynthesis.paused) {
        console.log('Resuming paused synthesis');
        window.speechSynthesis.resume();
        setSpeechState('playing');
      } else {
        console.log('Synthesis not paused, speaking from chunk:', currentChunkIndexRef.current);
        // Synthesis is not paused (utterance ended), start from current chunk
        setSpeechState('playing');
        if (currentChunkIndexRef.current < chunksRef.current.length) {
          speakChunk(currentChunkIndexRef.current);
        } else {
          // Reset if we're at the end
          currentChunkIndexRef.current = 0;
          speakChunk(0);
        }
      }
      
    } else {
      // Start new speech from beginning
      console.log('Starting new speech...');
      setIsLoading(true);
      isLoadingRef.current = true;
      isPausedRef.current = false;
      wasPlayingRef.current = true;
      
      // Combine and clean text
      const textToSpeak = cleanTextForSpeech(`${title}. ${fullText}`);
      console.log('Text length:', textToSpeak.length, 'characters');
      
      // Split into chunks
      chunksRef.current = splitTextIntoChunks(textToSpeak);
      console.log('Split into', chunksRef.current.length, 'chunks');
      currentChunkIndexRef.current = 0;
      
      // Cancel any pending speech
      window.speechSynthesis.cancel();
      
      // Start speaking first chunk
      speakChunk(0);
      
      // Fallback: if speech doesn't start after 2 seconds, reset
      setTimeout(() => {
        if (isLoadingRef.current) {
          console.log('Speech failed to start, resetting...');
          setIsLoading(false);
          isLoadingRef.current = false;
          setSpeechState('idle');
          alert('Text-to-speech failed to start. Please check your browser settings and try again.');
        }
      }, 2000);
    }
  }, [speechState, fullText, title, speakChunk]);

  // Load voices on mount and ensure they're available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      let voicesLoaded = false;
      
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          voicesLoaded = true;
          console.log(`Loaded ${voices.length} voices`);
        }
      };
      
      // Try to load voices immediately
      loadVoices();
      
      // Also listen for voices changed event (needed for Chrome)
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      
      // Fallback: try to load voices after a delay
      const timeout = setTimeout(() => {
        if (!voicesLoaded) {
          loadVoices();
        }
      }, 500);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        window.speechSynthesis.cancel();
        clearTimeout(timeout);
      };
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Image src="/images/listen.svg" width={25} height={25} alt="Listen icon" />
          <span>Loading...</span>
        </>
      );
    }
    
    if (speechState === 'playing') {
      return (
        <>
          <Image src="/icons/pause.svg" width={25} height={25} alt="Pause icon" />
          <span>Pause</span>
        </>
      );
    } else if (speechState === 'paused') {
      return (
        <>
          <Image src="/images/listen.svg" width={25} height={25} alt="Listen icon" />
          <span>Resume</span>
        </>
      );
    } else {
      return (
        <>
          <Image src="/images/listen.svg" width={25} height={25} alt="Listen icon" />
          <span>Listen</span>
        </>
      );
    }
  };


  return (
    <div className="mt-3 lg:mt-0">
<div className="max-w-fit rounded-lg border border-white/20 bg-white/30 backdrop-blur-md px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-base text-gray-500">
          <span>{timeSince || readTime}</span>
          <span className="text-gray-300">|</span>
          <span>{dateStr || "—"}</span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span>By Big Air Labs</span>
          <span className="text-gray-300">|</span>
          <button 
            onClick={handleSpeech}
            disabled={isLoading || !fullText}
            className="flex items-center gap-x-2 font-medium text-gray-800 transition-colors hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getButtonContent()}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Table of Contents ---------------- */
function TableOfContents({ items }: { items: string[] }) {
  const tocItems = items.length ? items : ["Introduction"];

  const handleJump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const root = document.documentElement;
    const navH = parseInt(
      getComputedStyle(root).getPropertyValue("--nav-h").trim() || "64",
      10
    );
    const offset = navH + 56 + 16;
    const y = target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top: y, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="On this page"
      className="
        w-full
        max-w-[220px]         /* base / mobile */
        lg:max-w-[240px]      /* laptop */
        xl:max-w-[260px]      /* desktop */
        2xl:max-w-[300px]     /* big screens */
      "
    >
      <h3
        className="
          block
          max-w-full
          font-satoshi text-[#333] font-medium
          text-[16px] lg:text-[20px]
          leading-snug
          break-words whitespace-normal
          underline
        "
        style={{
          textDecorationStyle: "solid",
          textDecorationSkipInk: "auto",
          textDecorationThickness: "auto",
          textUnderlineOffset: "auto",
          textUnderlinePosition: "from-font",
          // optional: better long-word handling in supporting browsers
          hyphens: "auto",
        }}
      >
        Introduction
      </h3>

      <ol className="mt-3 space-y-2">
        {tocItems.map((label) => {
          const id = label
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          return (
            <li key={label}>
              <a
                href={`#${id}`}
                onClick={(e) => handleJump(e, id)}
                className="
                  block
                  max-w-full
                  font-satoshi text-[#333] font-normal
                  text-[16px] lg:text-[20px]
                  leading-snug
                  break-words whitespace-normal
                "
                style={{
                  fontStyle: "normal",
                  hyphens: "auto", // optional, helps break very long tokens
                }}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}




/* ---------------- Share Panel ---------------- */
function SharePanel({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || document?.title || "");

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }, [url]);

  const itemBase =
    "flex items-center gap-x-3 font-satoshi text-[16px] md:text-[16px] lg:text-[20px] font-normal leading-[normal] text-[#333] hover:opacity-80 transition-opacity";

  return (
    <aside aria-label="Share this article" className="w-full font-satoshi text-[#333] pb-6 sm:pb-8 md:pb-10 lg:pb-12">
      <h4 className="text-[16px] md:text-[16px] lg:text-[24px] font-medium leading-[normal]">
        Share this Article
      </h4>

      <ul className="mt-3 space-y-3">
        <li>
          <button onClick={onCopy} className={itemBase}>
            <Image src="/icons/shareCopy.svg" width={18} height={18} alt="Copy link" />
            <span>Copy link</span>
          </button>
        </li>
        <li>
          <a
            className={itemBase}
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank" rel="noopener noreferrer"
          >
            <Image src="/icons/shareLinkedIn.svg" width={18} height={18} alt="LinkedIn" />
            <span>Share on LinkedIN</span>
          </a>
        </li>
        <li>
          <a
            className={itemBase}
            href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
            target="_blank" rel="noopener noreferrer"
          >
            <Image src="/icons/shareReddit.svg" width={18} height={18} alt="Reddit" />
            <span>Share on Reddit</span>
          </a>
        </li>
        <li>
          <a
            className={itemBase}
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank" rel="noopener noreferrer"
          >
            <Image src="/icons/shareX.svg" width={18} height={18} alt="X" />
            <span>Share on X</span>
          </a>
        </li>
        <li>
          <a
            className={itemBase}
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`}
            target="_blank" rel="noopener noreferrer"
          >
            <Image src="/icons/shareFacebook.svg" width={18} height={18} alt="Facebook" />
            <span>Share on Facebook</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}


/* ---------------- Markdown Article ---------------- */
/* ---------------- Markdown Article ---------------- */
function MarkdownArticle({ markdown }: { markdown: string }) {
  return (
    <article className="md-reset self-stretch">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}




/* ---------------- Page ---------------- */
export default function BlogInternal() {
  const params = useParams() as any;

  // Accept either /blog/[id] or /blog/[...slug]
  const rawParam = params?.id ?? params?.slug;
  const blogId: string | undefined = Array.isArray(rawParam)
    ? rawParam[rawParam.length - 1]
    : rawParam;

  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog by ID
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        if (!blogId) return;
        setLoading(true);
        setError(null);
        const res = await fetch(`${BASE_URL}/blogs/${blogId}`, {
          headers: { accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Failed to fetch blog (${res.status})`);
        const data: BlogData = await res.json();
        if (mounted) setBlog(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Something went wrong");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [blogId]);

  // Title shown in breadcrumbs & hero
  const title = useMemo(
    () => blog?.title || prettifySlug(rawParam) || "Article",
    [blog?.title, rawParam]
  );

  // Category and hero image from API
  const category = blog?.category || "Big AI Research";
  // ⬇️ no fallback image; empty string if missing
  const heroImageSrc = useMemo(() => {
    const s = (blog?.hero_image || "").trim();
    return s.length ? s : null;
  }, [blog?.hero_image]);

  // Read time and published date (from API)
  const combinedText = useMemo(() => {
    const base = blog?.description || "";
const secs = (blog?.sections || []).map(s => s.description || "").join("\n");
    return `${base}\n${secs}`;
  }, [blog]);
  const readTime = calcReadTime(combinedText);
  const timeSince = calcTimeSince(blog?.created_at);
  const dateStr = formatDate(blog?.created_at);

  // TOC from sections
  const tocItems = useMemo(
    () => (blog?.sections || []).map((s) => s.subheading).filter(Boolean),
    [blog?.sections]
  );

  // Full text for TTS - properly formatted
  const fullTextForTTS = useMemo(() => {
    if (!blog) return "";
    
    let fullText = "";
    
    // Add description
    if (blog.description) {
      fullText += blog.description + " ";
    }
    
    // Add all sections with their subheadings and descriptions
    (blog.sections || []).forEach((section) => {
      if (section.subheading) {
        fullText += section.subheading + ". ";
      }
      if (section.description) {
        fullText += section.description + " ";
      }
    });
    
    return fullText.trim();
  }, [blog]);

  /* -------- Full-screen loading (no layout/images) -------- */
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center gradient4">
        <p className="text-[#333] font-satoshi text-lg">Loading...</p>
      </main>
    );
  }

  return (
<main className="relative min-h-screen pt-16 sm:pt-20 lg:pt-[calc(var(--nav-h,64px)+56px+16px)] pb-12 sm:pb-14 lg:pb-16 gradient4">
      {/* Breadcrumbs — mobile/tablet 20px, desktop 70px */}
      <div className="px-5 lg:px-[70px] pt-4 sm:pt-6">
        <Crumbs title={title} />
      </div>

      {/* Hero/title card — keep styling; swap in API fields */}
      <div className="relative w-full px-5 lg:px-[70px] mt-8 lg:mt-12">
        {/* not-prose shields children from any ancestor .prose */}
        <div className="relative w-full bg-transparent border border-[#F8F8F8] rounded-[12px] overflow-hidden flex flex-col lg:flex-row lg:h-[480px] not-prose">
          <div className="relative z-10 p-6 lg:px-12 lg:py-10 flex flex-col justify-start lg:justify-between flex-grow order-1 lg:order-1 gap-y-4">
            <span className="inline-block self-start px-5 py-3 bg-[#F4F6FF] text-[#333] font-satoshi font-medium text-[14px] italic rounded-[4px] order-2 lg:order-1">
              {category}
            </span>

            {/* Title – base 20px on mobile, 50px from 640px+ */}
            <h1
              data-hero-title
              className="text-[20px] sm:text-[50px] font-satoshi font-bold text-black sm:text-[#333] leading-[normal] max-w-[95%] lg:max-w-[678px] order-1 lg:order-2"
            >
              {title}
            </h1>
          </div>

          <div className="w-full lg:relative lg:w-[560px] lg:h-full order-2 lg:order-2 flex-shrink-0">
            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:absolute lg:inset-0 rounded-[12px] overflow-hidden p-6 lg:p-10">
              <div className="w-full h-full relative rounded-[12px] overflow-hidden">
                {heroImageSrc ? (
                  <Image
                    src={heroImageSrc}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 560px"
                    priority
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content — keep grid, just constrain side widths so center stays roomy on tablet */}
      <section className="mt-[60px] px-5 lg:px-[70px]">
       <div className="flex flex-col lg:flex-row items-start gap-6">

  {/* Left: fixed 200px */}
  <div  style={{maxWidth: '280px'}}>
    <TableOfContents items={tocItems} />
  </div>

  {/* Middle: flexible */}
  <div className="flex-1 min-w-0 space-y-8">
    <BlogMeta 
      timeSince={timeSince} 
      readTime={readTime} 
      dateStr={dateStr}
      fullText={fullTextForTTS}
      title={title}
    />

    {error ? (
      <div className="prose prose-neutral max-w-none text-red-600">{error}</div>
    ) : (
      <>
        <MarkdownArticle markdown={(blog?.description || "").replace(/\r\n/g, "\n")} />

        {(blog?.sections || []).map((sec, idx) => {
          const anchorId = (sec.subheading || `section-${idx + 1}`)
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          return (
            <section
              key={idx}
              id={anchorId}
              className="space-y-8"
              style={{ scrollMarginTop: "calc(var(--nav-h, 64px) + 56px + 16px)" }}
            >
              {sec.subheading && (
                <h2 className="font-satoshi text-[16px] sm:text-[20px] lg:text-[20px] font-semibold text-[#333] pb-3">
                  {sec.subheading}
                </h2>
              )}

              {(() => {
                const imgs = toImgList(sec.image);
                if (!imgs.length) return null;

                if (imgs.length === 1) {
                  return (
                    <div className="w-full rounded-[12px] overflow-hidden">
                      <Image
                        src={imgs[0]}
                        alt={sec.subheading || `Section ${idx + 1}`}
                        width={1280}
                        height={720}
                        className="w-full h-auto object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
                      />
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col gap-4">
                    {imgs.map((src, i) => (
                      <div key={`${idx}-${i}`} className="rounded-[12px] overflow-hidden">
                        <Image
                          src={src}
                          alt={(sec.subheading ? `${sec.subheading} ` : `Section ${idx + 1} `) + `image ${i + 1}`}
                          width={1280}
                          height={720}
                          className="w-full h-auto object-cover"
                          sizes="100vw"
                        />
                      </div>
                    ))}
                  </div>
                );
              })()}

              {sec.description && (
                <div className="md-reset self-stretch">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
                  >
                    {(sec.description || "").replace(/\r\n/g, "\n")}
                  </ReactMarkdown>
                </div>
              )}
            </section>
          );
        })}
      </>
    )}
  </div>

  {/* Right: fixed 400px */}
  <div style={{maxWidth: '300px'}}>
    <SharePanel title={title} />
  </div>
</div>

      </section>
      <Hero7 />

      {/* Scoped hard override to beat any global rules */}
<style jsx>{`
  /* Enable smooth scroll globally; JS fallback covers older browsers */
  :global(html) {
    scroll-behavior: smooth;
  }

  h1[data-hero-title] {
    font-family: 'Satoshi', sans-serif;
    font-weight: 700;
    font-size: 50px !important;
    line-height: normal !important;
    color: #333 !important;
  }
  @media (max-width: 640px) {
    h1[data-hero-title] {
      font-size: 20px !important;
      color: #000 !important;
    }
  }

  /* --- Markdown typography (global so it styles child component output) --- */
  :global(.md-reset),
  :global(.md-reset :is(p, li, a, strong, em, code, pre, blockquote, h1, h2, h3, h4, h5, h6)) {
    color: #333;
    font-family: 'Satoshi', sans-serif;
    font-style: normal;
    line-height: normal;
  }
  :global(.md-reset) { font-size: 16px; font-weight: 400; }

  :global(.md-reset :is(h1, h2, h3, h4, h5, h6)) {
    font-size: 16px;
    font-weight: 400;
    margin: 0 0 0.75rem 0;
  }

  :global(.md-reset :is(p, li)) {
    font-size: 16px;
    font-weight: 400;
    margin: 0 0 0.75rem 0;
  }

  :global(.md-reset ul) {
    list-style: disc outside;
    padding-left: 1.25rem;
    margin: 0 0 0.75rem 0;
  }
  :global(.md-reset ol) {
    list-style: decimal outside;
    padding-left: 1.25rem;
    margin: 0 0 0.75rem 0;
  }

  :global(.md-reset img) {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: .75rem 0;
  }

  :global(.md-reset a) {
    text-decoration: underline;
  }

  /* Offset for headings generated from Markdown (rehype-slug/auto-link) */
  :global(.md-reset :is(h1[id], h2[id], h3[id], h4[id], h5[id], h6[id])) {
    scroll-margin-top: calc(var(--nav-h, 64px) + 56px + 16px);
  }
`}</style>


    </main>
  );
}