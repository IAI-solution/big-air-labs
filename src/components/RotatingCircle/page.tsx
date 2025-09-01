"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface RotatingSemiCirclesProps {
  className?: string; // 👈 allow passing classNames
  color?: string
}

const RotatingSemiCircles: React.FC<RotatingSemiCirclesProps> = ({ className, color }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      gsap.to(svgRef.current, {
        rotation: 360,
        // transformOrigin: "50% 50%",
        duration: 6, // seconds per full rotation
        repeat: -1,  // infinite
        ease: "linear",
      });
    }
  }, []);

  return (
    <div className={className}> {/* 👈 className spread here */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 250 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mix-blend-screen"
      >
        <path
          d="M207.153 102.987C210.044 113.776 210.782 125.028 209.324 136.101C207.866 147.175 204.241 157.853 198.657 167.526C193.072 177.199 185.637 185.677 176.776 192.476C167.915 199.275 157.801 204.263 147.013 207.154C136.224 210.044 124.972 210.782 113.898 209.324C102.825 207.866 92.1466 204.241 82.4738 198.657C72.8011 193.072 64.323 185.637 57.5236 176.776C50.7243 167.915 45.7369 157.801 42.8461 147.013"
          stroke={color ? color : "#333333"}
          strokeWidth="8.33333"
          strokeLinecap="round"
        />
        <path
          d="M173.111 76.8879C185.871 89.6481 193.04 106.955 193.04 125C193.04 143.046 185.871 160.353 173.111 173.113C160.351 185.873 143.044 193.042 124.998 193.042C106.953 193.042 89.646 185.873 76.8858 173.113"
          stroke={color ? color : "#333333"}
          strokeWidth="8.33333"
          strokeLinecap="round"
        />
        <path
          d="M138.207 75.7081C151.28 79.2111 162.426 87.7638 169.193 99.4848C175.96 111.206 177.794 125.135 174.291 138.208C170.788 151.281 162.236 162.427 150.515 169.195C138.794 175.962 124.864 177.795 111.791 174.293"
          stroke={color ? color : "#333333"}
          strokeWidth="8.33333"
          strokeLinecap="round"
        />
        <path
          d="M116.194 92.1387C124.909 89.8034 134.195 91.026 142.009 95.5374C149.823 100.049 155.525 107.48 157.861 116.195C160.196 124.91 158.973 134.197 154.462 142.011C149.95 149.825 142.52 155.526 133.804 157.862"
          stroke={color ? color : "#333333"}
          strokeWidth="8.33333"
          strokeLinecap="round"
        />
        <path
          d="M110.268 116.495C112.523 112.588 116.239 109.737 120.597 108.57C124.954 107.402 129.597 108.013 133.504 110.269C137.411 112.525 140.262 116.24 141.43 120.598C142.598 124.955 141.986 129.599 139.731 133.506"
          stroke={color ? color : "#333333"}
          strokeWidth="8.33333"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default RotatingSemiCircles;
