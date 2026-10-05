"use client";
import Image from "next/image";
import { assetPath } from "@/lib/site";
import { useState } from "react";
import type { ResultPair } from "@/data/results";
export default function BeforeAfter({ result }: { result: ResultPair }) {
  const [split, setSplit] = useState(50);
  return (
    <div className="before-after">
      <div className="comparison-images">
        <Image
          src={assetPath(result.after)}
          alt={`После: ${result.description}`}
          fill
          sizes="(max-width:800px) 90vw, 80vw"
        />
        <div
          className="before-image"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        >
          <Image
            src={assetPath(result.before)}
            alt={`До: ${result.description}`}
            fill
            sizes="(max-width:800px) 90vw, 80vw"
          />
        </div>
        <div className="comparison-divider" style={{ left: split + "%" }} />
        <span className="before-label">ДО</span>
        <span className="after-label">ПОСЛЕ</span>
      </div>
      <label>
        Сравнить до и после
        <input
          type="range"
          min="0"
          max="100"
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
        />
      </label>
      <p className="small muted">
        {result.description} · Результат индивидуален.
      </p>
    </div>
  );
}
