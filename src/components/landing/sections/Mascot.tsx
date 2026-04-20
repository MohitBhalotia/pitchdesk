"use client";

import { useEffect, useRef, useState } from "react";

const CUES: [string, string][] = [
  ["Listening for pitch…", "78%"],
  ["Analyzing tone · confidence", "84%"],
  ["Noting TAM claim · follow-up", "62%"],
  ["Traction slide · sourcing check", "71%"],
  ["Warming up panel…", "90%"],
];

export default function Mascot() {
  const mascotRef = useRef<SVGSVGElement>(null);
  const eyeLRef = useRef<SVGGElement>(null);
  const eyeRRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const browLRef = useRef<SVGRectElement>(null);
  const browRRef = useRef<SVGRectElement>(null);

  const [cueIdx, setCueIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const EYE_L = { x: 138, y: 190 };
    const EYE_R = { x: 202, y: 190 };
    const MAX_PUPIL = 7;
    const HEAD_CENTER = { x: 170, y: 180 };

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    const cur = {
      pLx: 0,
      pLy: 0,
      pRx: 0,
      pRy: 0,
      hRot: 0,
      hX: 0,
      hY: 0,
      bRot: 0,
      bX: 0,
      pS: 1,
      bY: 0,
      mS: 0,
    };
    const tgt = { ...cur };
    let surpriseUntil = 0;
    let scrollRatio = 0;
    let blinkScale = 1;
    let nextBlink = performance.now() + 2500 + Math.random() * 2000;
    let blinkPhase = 0;
    let raf = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mx = e.touches[0].clientX;
        my = e.touches[0].clientY;
      }
    };
    const onClick = () => {
      surpriseUntil = performance.now() + 600;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRatio = Math.min(
        1,
        Math.max(0, window.scrollY / Math.max(1, max))
      );
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = (now: number) => {
      const svg = mascotRef.current;
      if (!svg) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.45;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.hypot(dx, dy);
      const soft = Math.min(1, dist / 400);
      const ang = Math.atan2(dy, dx);

      tgt.pLx = tgt.pRx = Math.cos(ang) * MAX_PUPIL * soft;
      tgt.pLy = tgt.pRy = Math.sin(ang) * MAX_PUPIL * soft;
      tgt.hRot = (dx / window.innerWidth) * 6;
      tgt.hX = (dx / window.innerWidth) * 10;
      tgt.hY = (dy / window.innerHeight) * 6;
      tgt.bRot = (dx / window.innerWidth) * 2.4;
      tgt.bX = (dx / window.innerWidth) * 5;
      tgt.mS = scrollRatio * 6;
      tgt.bY = -scrollRatio * 1.5;
      const surprised = now < surpriseUntil;
      tgt.pS = surprised ? 1.35 : 1;

      const k = 0.12;
      (Object.keys(tgt) as (keyof typeof tgt)[]).forEach((key) => {
        cur[key] = lerp(cur[key], tgt[key], k);
      });

      if (now > nextBlink && blinkPhase === 0) blinkPhase = 1;
      if (blinkPhase === 1) {
        blinkScale = Math.max(0.1, blinkScale - 0.25);
        if (blinkScale <= 0.1) blinkPhase = 2;
      } else if (blinkPhase === 2) {
        blinkScale = Math.min(1, blinkScale + 0.18);
        if (blinkScale >= 1) {
          blinkPhase = 0;
          nextBlink = now + 3000 + Math.random() * 3000;
        }
      }

      if (eyeLRef.current) {
        eyeLRef.current.setAttribute(
          "transform",
          `translate(${EYE_L.x + cur.pLx},${EYE_L.y + cur.pLy}) scale(${cur.pS}, ${cur.pS * blinkScale})`
        );
      }
      if (eyeRRef.current) {
        eyeRRef.current.setAttribute(
          "transform",
          `translate(${EYE_R.x + cur.pRx},${EYE_R.y + cur.pRy}) scale(${cur.pS}, ${cur.pS * blinkScale})`
        );
      }
      if (headRef.current) {
        headRef.current.setAttribute(
          "transform",
          `translate(${cur.hX},${cur.hY}) rotate(${cur.hRot} ${HEAD_CENTER.x} ${HEAD_CENTER.y})`
        );
      }
      if (bodyRef.current) {
        bodyRef.current.setAttribute(
          "transform",
          `translate(${cur.bX},0) rotate(${cur.bRot} 170 340)`
        );
      }

      const browOffset = surprised ? -6 : cur.bY;
      browLRef.current?.setAttribute("y", String(158 + browOffset));
      browRRef.current?.setAttribute("y", String(158 + browOffset));

      if (mouthRef.current) {
        if (surprised) {
          mouthRef.current.setAttribute("d", "M 160 250 Q 170 262, 180 250");
          mouthRef.current.setAttribute("stroke-width", "3");
        } else {
          mouthRef.current.setAttribute(
            "d",
            `M 154 250 Q 170 ${252 + cur.mS}, 186 250`
          );
          mouthRef.current.setAttribute("stroke-width", "2.6");
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const cueTimer = window.setInterval(() => {
      setCueIdx((i) => (i + 1) % CUES.length);
    }, 3200);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      window.clearInterval(cueTimer);
    };
  }, []);

  const [cueText, chipValue] = CUES[cueIdx];

  return (
    <div className="mascot-stage">
      <div className="mascot-halo" />
      <div className="mascot-ring-2" />
      <div className="mascot-ring" />

      <div className="mascot-label">
        <span className="mono">AI VC // SESSION</span>
        <span className="ticker" key={cueText}>
          {cueText}
        </span>
      </div>

      <div className="chip c1">
        <span className="kk">confidence</span>
        <span className="vv">{chipValue}</span>
      </div>
      <div className="chip c2">
        <span className="kk">pace</span>
        <span className="vv">142 wpm</span>
      </div>
      <div className="chip c3">
        <span className="kk">moat</span>
        <span className="vv">flagged</span>
      </div>

      <svg
        ref={mascotRef}
        id="landing-mascot"
        width="340"
        height="400"
        viewBox="0 0 340 400"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "relative", zIndex: 2 }}
        aria-label="AI VC mascot"
      >
        <defs>
          <linearGradient id="lpSuit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1A2236" />
            <stop offset="1" stopColor="#0C1018" />
          </linearGradient>
          <linearGradient id="lpHead" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E6F399" />
            <stop offset="0.55" stopColor="#D7FF4F" />
            <stop offset="1" stopColor="#95B82A" />
          </linearGradient>
          <linearGradient id="lpHeadShine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset=".6" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <ellipse cx="170" cy="388" rx="90" ry="6" fill="#000" opacity=".5" />

        <g ref={bodyRef}>
          <path
            d="M 70 390 C 75 320, 110 290, 170 290 C 230 290, 265 320, 270 390 Z"
            fill="url(#lpSuit)"
            stroke="rgba(255,255,255,.06)"
            strokeWidth="1"
          />
          <path
            d="M 140 300 L 170 330 L 170 390 L 125 390 Z"
            fill="#0C1018"
          />
          <path
            d="M 200 300 L 170 330 L 170 390 L 215 390 Z"
            fill="#0C1018"
          />
          <path
            d="M 158 300 L 170 325 L 182 300 Z"
            fill="#E8ECF3"
          />
          <path
            d="M 164 302 L 170 310 L 176 302 L 182 360 L 170 380 L 158 360 Z"
            fill="#D7FF4F"
          />
          <path
            d="M 164 302 L 170 310 L 176 302 L 174 308 L 170 314 L 166 308 Z"
            fill="#95B82A"
          />
          <rect
            x="108"
            y="340"
            width="22"
            height="8"
            rx="2"
            fill="#4FD6FF"
            opacity=".7"
          />
          <circle cx="170" cy="370" r="2" fill="#4FD6FF" />
        </g>

        <g ref={headRef}>
          <g>
            <path
              d="M 95 150 Q 80 110, 100 100 Q 115 115, 115 150 Z"
              fill="url(#lpHead)"
            />
            <path
              d="M 245 150 Q 260 110, 240 100 Q 225 115, 225 150 Z"
              fill="url(#lpHead)"
            />
            <path
              d="M 98 145 Q 92 125, 103 118 Q 110 128, 108 145 Z"
              fill="#95B82A"
            />
            <path
              d="M 242 145 Q 248 125, 237 118 Q 230 128, 232 145 Z"
              fill="#95B82A"
            />
          </g>

          <ellipse cx="170" cy="180" rx="88" ry="92" fill="url(#lpHead)" />
          <ellipse
            cx="142"
            cy="150"
            rx="50"
            ry="40"
            fill="url(#lpHeadShine)"
            opacity=".65"
          />

          <ellipse cx="92" cy="210" rx="22" ry="26" fill="#EEF7B8" />
          <ellipse cx="248" cy="210" rx="22" ry="26" fill="#EEF7B8" />

          <path
            d="M 170 115 L 158 145 L 170 160 L 182 145 Z"
            fill="#95B82A"
            opacity=".85"
          />

          <rect x="95" y="130" width="150" height="1.5" fill="#4FD6FF" opacity=".7">
            <animate
              attributeName="y"
              values="110;230;110"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.7;0"
              dur="4s"
              repeatCount="indefinite"
            />
          </rect>

          <g style={{ transformOrigin: "170px 160px" }}>
            <rect
              ref={browLRef}
              x="112"
              y="158"
              width="34"
              height="5"
              rx="2.5"
              fill="#0C1018"
              transform="rotate(-6 129 161)"
            />
            <rect
              ref={browRRef}
              x="194"
              y="158"
              width="34"
              height="5"
              rx="2.5"
              fill="#0C1018"
              transform="rotate(6 211 161)"
            />
          </g>

          <g>
            <circle
              cx="138"
              cy="190"
              r="20"
              fill="#0C1018"
              stroke="#95B82A"
              strokeWidth="1.2"
            />
            <circle
              cx="202"
              cy="190"
              r="20"
              fill="#0C1018"
              stroke="#95B82A"
              strokeWidth="1.2"
            />
          </g>
          <g ref={eyeLRef} transform="translate(138,190)">
            <circle r="9" fill="#D7FF4F" />
            <circle r="3" cx="-2.5" cy="-3" fill="#fff" />
          </g>
          <g ref={eyeRRef} transform="translate(202,190)">
            <circle r="9" fill="#D7FF4F" />
            <circle r="3" cx="-2.5" cy="-3" fill="#fff" />
          </g>

          <path d="M 162 225 L 178 225 L 170 236 Z" fill="#0C1018" />
          <ellipse
            cx="170"
            cy="240"
            rx="14"
            ry="6"
            fill="#EEF7B8"
            opacity=".8"
          />

          <path
            ref={mouthRef}
            d="M 154 250 Q 170 252, 186 250"
            fill="none"
            stroke="#0C1018"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          <g opacity=".6">
            <circle
              cx="138"
              cy="190"
              r="24"
              fill="none"
              stroke="#0C1018"
              strokeWidth="1.2"
            />
            <circle
              cx="202"
              cy="190"
              r="24"
              fill="none"
              stroke="#0C1018"
              strokeWidth="1.2"
            />
            <line
              x1="162"
              y1="190"
              x2="178"
              y2="190"
              stroke="#0C1018"
              strokeWidth="1.2"
            />
          </g>
        </g>
      </svg>

      <div className="mascot-caption">
        <div className="quote">&ldquo;Walk me through unit economics.&rdquo;</div>
        <div className="mono">— PERSONA: SANJAY KHANNA</div>
      </div>
    </div>
  );
}
