"use client";
import { useState } from "react";
import { zones, categories, money, setDescription } from "@/data/prices";
export function Zones({ book }: { book: (id: string) => void }) {
  const [selected, setSelected] = useState("deep-bikini");
  const zone = zones.find((z) => z.id === selected)!;
  return (
    <section id="zones" className="section zones-section">
      <div className="section-top">
        <span className="eyebrow">04 / YOUR BODY, YOUR CHOICE</span>
        <span className="eyebrow">ТОЧНО В ВАШЕЙ ЗОНЕ КОМФОРТА</span>
      </div>
      <div className="zone-layout">
        <div>
          <h2>
            Твоя зона
            <br />
            <i>гладкости.</i>
          </h2>
          <div className="zone-list">
            {zones.map((z) => (
              <button
                key={z.id}
                className={selected === z.id ? "active" : ""}
                onMouseEnter={() => setSelected(z.id)}
                onFocus={() => setSelected(z.id)}
                onClick={() => setSelected(z.id)}
              >
                {z.name}
                <span>↗</span>
              </button>
            ))}
          </div>
        </div>
        <div className="body-map">
          <svg viewBox="0 0 300 540" aria-label="Силуэт тела">
            <defs>
              <linearGradient id="body">
                <stop stopColor="#52524d" />
                <stop offset=".5" stopColor="#b8b0a0" />
                <stop offset="1" stopColor="#43433e" />
              </linearGradient>
            </defs>
            <path
              d="M150 25 C112 25 115 88 138 96 L137 111 C115 117 96 121 87 144 L65 264 Q62 287 77 288 L98 216 L105 177 L108 275 Q94 311 107 347 L116 487 Q114 510 98 519 L137 519 L148 348 L153 348 L163 519 L200 519 Q185 507 184 487 L194 347 Q206 312 192 275 L195 177 L202 216 L223 288 Q239 287 235 264 L213 144 Q204 121 163 111 L162 96 C186 88 188 25 150 25Z"
              fill="url(#body)"
              opacity=".6"
            />
            <path
              d="M150 123 L150 260 M125 307 Q150 326 176 307"
              fill="none"
              stroke="#ede9e4"
              opacity=".18"
            />
          </svg>
          <span
            className="zone-point"
            style={{ left: zone.point[0] + "%", top: zone.point[1] + "%" }}
          />
          <span className="eyebrow body-caption">SKIN IS ALWAYS IN.</span>
        </div>
        <div className="zone-detail">
          <span className="eyebrow">SELECTED ZONE</span>
          <h3>{zone.name}</h3>
          <p>{setDescription(zone.id)}</p>
          <div className="detail-line">
            <span>ПРОДОЛЖИТЕЛЬНОСТЬ</span>
            <strong>{zone.time} MIN</strong>
          </div>
          <div className="detail-line">
            <span>ДЕМО-ЦЕНА</span>
            <strong>{money(zone.price)}</strong>
          </div>
          <button className="button" onClick={() => book(zone.id)}>
            ЗАПИСАТЬСЯ ↗
          </button>
          <p className="muted small">
            Иллюстративный прайс. Итоговая стоимость подтверждается студией.
          </p>
        </div>
      </div>
    </section>
  );
}
export function Prices({ book }: { book: (id: string) => void }) {
  const [category, setCategory] = useState("ПОПУЛЯРНЫЕ");
  const filtered = zones.filter((z) =>
    category === "ПОПУЛЯРНЫЕ"
      ? ["armpits", "deep-bikini", "legs", "set-1"].includes(z.id)
      : z.category === category,
  );
  return (
    <section id="prices" className="section prices-section">
      <div className="section-top">
        <span className="eyebrow">08 / AN INVESTMENT IN YOURSELF</span>
        <span className="eyebrow">ПОНЯТНЫЙ ВЫБОР</span>
      </div>
      <div className="section-heading">
        <h2>
          Less routine.
          <br />
          <i>More you.</i>
        </h2>
        <p>
          Выберите свою зону.
          <br />
          Остальное оставьте нам.
        </p>
      </div>
      <div className="price-tabs" role="tablist" aria-label="Категории цен">
        {categories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={c === category}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="price-list" role="tabpanel" aria-label={category}>
        {filtered.map((z) => (
          <div className="price-row" key={z.id}>
            <div>
              <h3>{z.name}</h3>
              <span className="small muted">
                {setDescription(z.id) || "ЛАЗЕРНАЯ ЭПИЛЯЦИЯ"}
              </span>
            </div>
            <span className="eyebrow">{z.time} MIN</span>
            <strong>{money(z.price)}</strong>
            <button
              className="arrow-button"
              aria-label={`Записаться: ${z.name}`}
              onClick={() => book(z.id)}
            >
              ↗
            </button>
          </div>
        ))}
      </div>
      <p className="small muted">
        Цены приведены для демонстрации и редактируются в data/prices.ts. Перед
        реальной записью уточните актуальный прайс.
      </p>
    </section>
  );
}
