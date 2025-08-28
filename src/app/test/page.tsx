"use client";

import { useRef } from "react";

export default function InfiniteScrollRight() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="overflow-hidden w-full bg-gray-100 py-4">
            testing route
        </div>
    );
}
