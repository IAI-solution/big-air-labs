// app/blog/page.tsx
"use client";

import Hero7 from "@/components/sectionSeven/page";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { SpringOptions } from "motion/react";

/* ---------------- Blog types (API) ---------------- */
interface BlogSection {
  subheading: string;
  image: string | null;
  description: string;
}

interface Blog {
  id: string;
  title: string;
  description: string;
  category: string;
  hero_image: string;
  sections: BlogSection[];
  sources: string | null;
  created_at: string;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_count: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

interface BlogApiResponse {
  status: string;
  data: {
    blogs: Blog[];
    pagination: Pagination;
    filters: {
      category: string | null;
    };
  };
}

/* ---------------- Spring configuration for tilt effect ---------------- */
const springValues: SpringOptions = {
  damping: 22,
  stiffness: 160,
  mass: 2,
};

/* ---------------- Pagination helpers ---------------- */
type PageItem = number | "dots";

function buildPageItems(total: number, current: number): PageItem[] {
  const cur = Math.max(1, Math.min(current, total));

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: PageItem[] = [];
  const add = (n: PageItem) => items.push(n);

  add(1);

  const start = Math.max(2, cur - 2);
  const end = Math.min(total - 1, cur + 2);

  if (start > 2) add("dots");
  for (let i = start; i <= end; i++) add(i);
  if (end < total - 1) add("dots");

  add(total);

  return items;
}

function PaginationComponent({
  totalPages = 12,
  currentPage = 1,
  onPageChange,
}: {
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}) {
  const page = currentPage;
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const items = useMemo(() => buildPageItems(totalPages, page), [totalPages, page]);

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
  };

  const baseBtn =
    "inline-flex items-center justify-center rounded-lg text-sm leading-none px-3.5 py-2.5 transition border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20";
  const pageBtn = "h-9 min-w-9 " + baseBtn + " sm:px-3 sm:py-2";
  const active = "bg-white text-black shadow-sm border-white/60";
  const inactive = "text-black/80 hover:bg-white/70 hover:text-black";
  const arrowBtn =
    baseBtn +
    " text-black/80 hover:text-black hover:bg-white/60 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-black/80";

  return (
    <nav aria-label="Pagination" className="w-full">
      {/* Mobile */}
      <div className="flex sm:hidden items-center justify-between gap-3">
        <button
          type="button"
          className={arrowBtn}
          disabled={!canPrev}
          onClick={() => canPrev && handlePageChange(page - 1)}
        >
          <Image
            src="/icons/rightIcon.svg"
            alt="Previous"
            width={16}
            height={16}
            className="rotate-180 mr-1"
          />
          <span>Previous</span>
        </button>
        <span
          className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-white px-3.5 py-2.5 text-sm font-medium text-black shadow-sm"
          aria-current="page"
        >
          {page}
        </span>
        <button
          type="button"
          className={arrowBtn}
          disabled={!canNext}
          onClick={() => canNext && handlePageChange(page + 1)}
        >
          <span className="mr-1">Next</span>
          <Image src="/icons/rightIcon.svg" alt="Next" width={16} height={16} />
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-center gap-2">
        <button
          type="button"
          className={arrowBtn}
          disabled={!canPrev}
          onClick={() => canPrev && handlePageChange(page - 1)}
        >
          <span aria-hidden>‹</span>
          <span className="ml-1">Previous</span>
        </button>

        <ul className="inline-flex items-center gap-1">
          {items.map((it, idx) =>
            it === "dots" ? (
              <li key={`dots-${idx}`} className="px-2 text-black/70 select-none">
                …
              </li>
            ) : (
              <li key={it}>
                <button
                  type="button"
                  aria-current={page === it ? "page" : undefined}
                  className={`${pageBtn} ${page === it ? active : inactive}`}
                  onClick={() => handlePageChange(it)}
                >
                  {it}
                </button>
              </li>
            )
          )}
        </ul>

        <button
          type="button"
          className={arrowBtn}
          disabled={!canNext}
          onClick={() => canNext && handlePageChange(page + 1)}
        >
          <span className="mr-1">Next</span>
          <span aria-hidden>›</span>
        </button>
      </div>
    </nav>
  );
}

/* ---------------- Pills ---------------- */
function Pill({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const pillBase =
    "inline-flex items-center justify-center rounded-[60px] border font-satoshi font-medium leading-none text-[14px] px-6 py-[14px] whitespace-nowrap transition cursor-pointer";
  const pillActive = "border-[#333] bg-[#333] text-white hover:opacity-90";
  const pillInactive =
    "border-[#333] text-[#333] bg-transparent hover:bg-[#333] hover:text-white";

  return (
    <button
      type="button"
      className={`${pillBase} ${active ? pillActive : pillInactive}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function PillStrip({
  categories,
  selectedCategory,
  onCategoryChange,
}: {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateScrollState());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.max(160, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: dir === "left" ? -delta : delta, behavior: "smooth" });
  };

  return (
    <div className="mt-4 relative">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollByAmount("left")}
        className={`sm:hidden absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full p-2 bg-white/80 shadow z-10 ${
          canLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Image
          src="/icons/rightIcon.svg"
          alt="left"
          width={18}
          height={18}
          className="rotate-180"
        />
      </button>

      <div
        ref={scrollerRef}
        className="overflow-x-auto sm:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex sm:flex-wrap items-center gap-3 whitespace-nowrap sm:whitespace-normal">
          <Pill
            label="Viewing All"
            active={selectedCategory === null}
            onClick={() => onCategoryChange(null)}
          />
          {categories.map((category) => (
            <Pill
              key={category}
              label={category}
              active={selectedCategory === category}
              onClick={() => onCategoryChange(category)}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollByAmount("right")}
        className={`sm:hidden absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full p-2 bg-white/80 shadow z-10 ${
          canRight ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Image src="/icons/rightIcon.svg" alt="right" width={18} height={18} />
      </button>
    </div>
  );
}

/* ---------------- Blog Card with Tilt Effect ---------------- */
function BlogCard({
  href,
  category,
  title,
  date,
  timeSince = "Just now",
  heroImage,
  className = "",
}: {
  href: string;
  category: string;
  title: string;
  date: string;
  timeSince?: string;
  heroImage?: string;
  className?: string;
}) {
  // Fallback image if heroImage is missing
  const imgSrc = heroImage && heroImage.trim().length > 0 
    ? heroImage 
    : "/placeholder.png";

  // Tilt effect state
  const ref = useRef<HTMLElement>(null);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  const rotateAmplitude = 12; // Reduced for subtler effect on larger component
  const scaleOnHover = 1.05; // Slightly less scale for the full card

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <Link
      href={href}
      aria-label={`Read: ${title}`}
      className={"group block focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-[8px] [perspective:800px] " + className}
    >
      <motion.article
        ref={ref}
        className={
          "flex flex-col items-start p-6 gap-6 rounded-[8px] " +
          "bg-[rgba(255,255,255,0.20)] border border-white/40 backdrop-blur-md " +
          "transition-colors hover:bg-[rgba(255,255,255,0.40)] " +
          "[transform-style:preserve-3d] will-change-transform"
        }
        style={{
          rotateX,
          rotateY,
          scale,
        }}
        onMouseMove={handleMouse}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full max-w-[358px] pointer-events-none">
          {/* Static image (no longer using TiltedCard) */}
          <div className="w-full rounded-[9.339px] overflow-hidden">

<Image
  src={imgSrc}
  alt={title}
  width={358}   
  height={280}
  className="w-full h-[280px] object-cover"
  draggable={false}
  priority     
  unoptimized={false} 
/>
          </div>

          {/* Text meta below the image */}
          <div className="w-full">
            <p className="mt-6 text-[#333] font-satoshi italic text-[16px] leading-[20px] font-normal">
              {category}
            </p>
            <h3 className="mt-3 text-[#333] font-satoshi font-medium text-[20px] leading-[30px] line-clamp-2">
              {title}
            </h3>
            <p className="mt-[18px] text-[#575757] font-satoshi text-[14px] leading-[1.75] font-normal">
              {date}
            </p>
            <div className="mt-[27px] flex items-center justify-between">
              <span className="text-[#6F6F6F] font-satoshi text-[16px] font-medium leading-none">
                {timeSince}
              </span>
              <span className="text-[#333] font-satoshi text-[14px] font-medium leading-none inline-flex items-center gap-1 group-hover:underline">
                Read this <span aria-hidden>›</span>
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

/* ---------------- Utils ---------------- */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function calcTimeSince(dateString?: string): string {
  if (!dateString) return "";

  const publishedDate = new Date(dateString);
  if (isNaN(publishedDate.getTime())) return "";

  const now = new Date();
  const diffInMs = now.getTime() - publishedDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  if (diffInDays < 30) return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  if (diffInMonths < 6) return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;

  return "More than 6 months ago";
}

/* ---------------- Page Component ---------------- */
export default function Blog() {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch ALL blogs (across API pages) once, then paginate client-side
  const fetchAllBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const limit = 6;
      let page = 1;
      let aggregated: Blog[] = [];
      let lastPagination: Pagination | null = null;

      while (true) {
        const response = await fetch(
          `http://127.0.0.1:8000/blogs?page=${page}&limit=${limit}`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data: BlogApiResponse = await response.json();
        if (data.status !== "success") throw new Error("Failed to fetch blogs");

        aggregated = aggregated.concat(data.data.blogs);
        lastPagination = data.data.pagination;

        if (!lastPagination.has_next) break;
        page += 1;
      }

      setAllBlogs(aggregated);
      setFilteredBlogs(aggregated);
      setPagination(
        lastPagination
          ? {
              ...lastPagination,
              total_count: aggregated.length,
              total_pages: Math.ceil(aggregated.length / lastPagination.limit),
              current_page: 1,
              has_prev: false,
              has_next: Math.ceil(aggregated.length / lastPagination.limit) > 1,
            }
          : null
      );

      const uniqueCategories = Array.from(new Set(aggregated.map((b) => b.category))).sort();
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  // Filter blogs when category changes
  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredBlogs(allBlogs);
    } else {
      setFilteredBlogs(allBlogs.filter((blog) => blog.category === selectedCategory));
    }
    // reset to first page on any category change
    setCurrentPage(1);
  }, [selectedCategory, allBlogs]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Client-side pagination on filtered list
  const paginatedBlogs = useMemo(() => {
    const limit = 6;
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    return filteredBlogs.slice(start, end);
  }, [filteredBlogs, currentPage]);

  const filteredPagination = useMemo(() => {
    if (!pagination) return null;
    const limit = 6;
    const totalPages = Math.ceil(filteredBlogs.length / limit);
    return {
      ...pagination,
      total_pages: totalPages,
      current_page: currentPage,
      total_count: filteredBlogs.length,
      has_next: currentPage < totalPages,
      has_prev: currentPage > 1,
      limit,
    };
  }, [filteredBlogs, currentPage, pagination]);

  return (
    <main className="min-h-screen w-full gradient6">
      {/* TOP: heading + pills */}
      <section className="px-4 sm:px-8 md:px-[70px] pt-24 sm:pt-36 md:pt-[198px] pb-4">
        <h1 className="text-[#000] font-satoshi font-medium leading-[1.5] text-[24px] sm:text-[30px] md:text-[36px]">
          Winds of change <span className="normal-case">: </span>
          News & Updates
        </h1>
        <PillStrip
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </section>

      {/* CARD LIST */}
      <section className="px-4 sm:px-8 md:px-[70px] pb-6 mt-3 sm:mt-4 md:mt-6">
        <div className="w-full">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-[#333] font-satoshi text-lg">Loading blogs...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-red-600 font-satoshi text-lg">Error: {error}</div>
            </div>
          ) : (
            <>
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                {paginatedBlogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    href={`/blog/${blog.id}`}
                    category={blog.category}
                    title={blog.title}
                    date={formatDate(blog.created_at)}
                    timeSince={calcTimeSince(blog.created_at)}
                    heroImage={blog.hero_image}
                  />
                ))}
              </div>

              {paginatedBlogs.length === 0 && !loading && (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="text-[#333] font-satoshi text-lg">
                    {selectedCategory
                      ? `No blogs found for "${selectedCategory}"`
                      : "No blogs found"}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {filteredPagination && filteredPagination.total_pages > 1 && (
          <div className="mt-8 sm:mt-10 md:mt-12 flex justify-center">
            <div className="inline-flex sm:inline-flex justify-center items-center gap-1 sm:gap-2 px-2 py-2 rounded-lg">
              <PaginationComponent
                totalPages={filteredPagination.total_pages}
                currentPage={filteredPagination.current_page}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </section>

      <Hero7 />
    </main>
  );
}
