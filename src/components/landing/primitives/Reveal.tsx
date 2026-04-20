"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "reveal" | "reveal-stagger" | "word-reveal";

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "header" | "footer" | "h1" | "h2" | "span";
  variant?: RevealVariant;
  immediate?: boolean;
  children: ReactNode;
};

export default function Reveal({
  as = "div",
  variant = "reveal",
  immediate = false,
  className,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (immediate) {
      requestAnimationFrame(() => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(variant, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
