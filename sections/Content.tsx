"use client";
import { useEffect, useRef, useState } from "react";
import { faq } from "@/data/faq";
import { preparation, studio } from "@/data/studio";
import { results } from "@/data/results";
import { testimonials } from "@/data/testimonials";
import BeforeAfter from "@/components/BeforeAfter";
export function Technology() {
  const diagram=useRef<HTMLDivElement>(null);
  const [pulse, setPulse] = useState(false);
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setPulse(true);observer.disconnect()}},{threshold:.5});if(diagram.current)observer.observe(diagram.current);return()=>observer.disconnect()},[]);
  return (
    <section id="laser" className="section technology">
      <div className="section-top">
        <span className="eyebrow">03 / BEAUTY MEETS TECHNOLOGY</span>
        <span className="eyebrow">ПРОСТО О СЛОЖНОМ</span>
      </div>
      <div className="two-columns">
        <div>
          <h2>
            Технология.
            <br />
            <i>В твою пользу.</i>
          </h2>
          <p className="section-copy">
            Лазерный импульс воздействует на пигмент волоса и постепенно снижает
            активность волосяного фолликула.
          </p>
          <button
            className="text-button"
            onClick={() => {
              setPulse(false);
              requestAnimationFrame(() => setPulse(true));
            }}
          >
            ПОКАЗАТЬ ИМПУЛЬС ↓
          </button>
          <p className="small muted">
            Результат индивидуален и зависит от зоны, структуры волос, фототипа
            и других факторов.
          </p>
        </div>
        <div ref={diagram} className={`follicle ${pulse ? "pulsing" : ""}`}>
          <svg
            viewBox="0 0 500 370"
            aria-label="Схема воздействия на волосяной фолликул"
          >
            <path
              d="M0 130 Q100 110 200 130 T500 130 L500 370 L0 370Z"
              fill="#a88c75"
              opacity=".22"
            />
            <path
              d="M250 35 Q245 95 250 145 L267 253 Q281 287 260 300 Q239 300 238 275 L242 145"
              fill="#40332b"
            />
            <path
              d="M238 140 Q223 210 229 270 Q226 322 263 319 Q298 313 286 270 L265 139"
              fill="none"
              stroke="#bca58e"
              strokeWidth="2"
            />
            <ellipse
              className="follicle-glow"
              cx="259"
              cy="284"
              rx="38"
              ry="40"
              fill="#547c35"
              opacity=".15"
            />
            <path
              className="beam"
              d="M251 0 L251 270"
              stroke="#ede9e4"
              strokeWidth="7"
            />
            <path
              d="M36 130 L155 130 M340 285 L462 285"
              stroke="#ede9e4"
              opacity=".4"
            />
            <text x="37" y="111" fill="#ede9e4" fontSize="11">
              КОЖА
            </text>
            <text x="355" y="271" fill="#ede9e4" fontSize="11">
              ФОЛЛИКУЛ
            </text>
            <text x="284" y="61" fill="#ede9e4" fontSize="11">
              ВОЛОС
            </text>
          </svg>
          <span className="eyebrow">LIGHT. PIGMENT. PRECISION.</span>
        </div>
      </div>
    </section>
  );
}
export function Process() {
  return (
    <>
      <section className="section benefits">
        <span className="eyebrow">06 / WHY BARE LISS</span>
        <h2>
          Продумано.
          <br />
          <i>До ощущения.</i>
        </h2>
        <div className="benefit-list">
          {[
            ["Технология", "Индивидуальный подбор параметров."],
            ["Комфорт", "Спокойная атмосфера и бережная процедура."],
            ["Гигиена", "Внимание к чистоте пространства и оборудования."],
            ["Эстетика", "Пространство, в которое хочется возвращаться."],
            ["Забота", "Рекомендации до и после процедуры."],
          ].map(([title, desc], i) => (
            <div key={title}>
              <span className="serif-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p className="muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section process">
        <span className="eyebrow">07 / YOUR SKIN. OUR PROCESS.</span>
        <h2>
          Ты просто
          <br />
          <i>доверяешь.</i>
        </h2>
        <div className="process-line">
          {[
            "Консультация",
            "Подбор параметров",
            "Подготовка",
            "Лазерная процедура",
            "Рекомендации",
          ].map((s, i) => (
            <div key={s}>
              <span>0{i + 1}</span>
              <h3>{s}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export function CoursePreparation({ book }: { book: () => void }) {
  const [session, setSession] = useState(1);
  return (
    <>
      <section className="section course">
        <div className="two-columns">
          <div>
            <span className="eyebrow">09 / A LITTLE PATIENCE</span>
            <h2>
              Гладкость —<br />
              <i>это процесс.</i>
            </h2>
            <p className="section-copy">
              Количество процедур индивидуально и зависит от зоны, структуры
              волос, фототипа, гормонального фона и других факторов.
            </p>
          </div>
          <div>
            <div className="course-skin" aria-hidden="true">
              {Array.from({ length: 48 }, (_, i) => (
                <span
                  key={i}
                  style={{
                    opacity: i % 8 >= session - 1 ? 1 : 0.06,
                    transform: `rotate(${(i % 3) * 12 - 12}deg)`,
                  }}
                />
              ))}
            </div>
            <div className="timeline">
              {Array.from({ length: 8 }, (_, i) => (
                <button
                  key={i}
                  className={i + 1 === session ? "active" : ""}
                  aria-label={`Иллюстрация, этап ${i + 1}`}
                  aria-pressed={i + 1 === session}
                  onClick={() => setSession(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="small muted">
              Это иллюстрация, а не гарантированный результат. Числа не
              обозначают назначенный курс.
            </p>
          </div>
        </div>
      </section>
      <section className="section preparation">
        <span className="eyebrow">10 / BEFORE & AFTER YOUR VISIT</span>
        <h2>
          Немного заботы.
          <br />
          <i>До и после.</i>
        </h2>
        <div className="preparation-grid">
          {preparation.map(([title, desc]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <div className="consult">
          <p>
            Есть вопросы о противопоказаниях?
            <br />
            <span className="muted">
              Обсудим их на консультации. Сайт не ставит диагнозы.
            </span>
          </p>
          <button className="text-button" onClick={book}>
            ПРОКОНСУЛЬТИРОВАТЬСЯ ↗
          </button>
        </div>
      </section>
    </>
  );
}
export function ResultsReviews() {
  return (
    <>
      <section className="section results">
        <span className="eyebrow">11 / REAL SKIN. REAL STORIES.</span>
        <h2>
          Результаты,
          <br />
          <i>которым верят.</i>
        </h2>
        {results.length ? (
          results.map((result, i) => <BeforeAfter key={i} result={result} />)
        ) : (
          <div className="results-placeholder">
            <span>
              REAL RESULTS
              <br />
              <i>COMING SOON.</i>
            </span>
            <p>
              Здесь появятся реальные фотографии
              <br />с согласия клиентов студии.
            </p>
          </div>
        )}
      </section>
      <section className="section reviews">
        <span className="eyebrow">12 / WORD OF SKIN</span>
        <h2>
          Твой опыт.
          <br />
          <i>Твой голос.</i>
        </h2>
        {testimonials.length ? (
          testimonials.map((t) => (
            <blockquote key={t.sourceUrl}>
              <p className="section-copy">«{t.quote}»</p>
              <a href={t.sourceUrl} target="_blank" rel="noreferrer">
                — {t.name} ↗
              </a>
            </blockquote>
          ))
        ) : (
          <p className="section-copy">
            Место для настоящих впечатлений.
            <br />
            Проверенные отзывы появятся после открытия студии.
          </p>
        )}
      </section>
    </>
  );
}
export function FAQ() {
  return (
    <section id="faq" className="section faq">
      <div>
        <span className="eyebrow">13 / GOOD QUESTIONS</span>
        <h2>
          Давай
          <br />
          <i>разберёмся.</i>
        </h2>
        <p className="muted">Спокойно. Без сложных слов.</p>
      </div>
      <div>
        {faq.map(([q, a], i) => (
          <details key={q}>
            <summary>
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              {q}
              <span className="plus">+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
export function Contacts({ book }: { book: () => void }) {
  return (
    <section id="contacts" className="section contacts">
      <span className="eyebrow">15 / FIND YOUR CALM</span>
      <div className="two-columns">
        <div>
          <h2>
            Встретимся
            <br />
            <i>в BARE LISS.</i>
          </h2>
          <p className="muted">
            Контакты студии будут добавлены перед запуском.
          </p>
          <button className="text-button" onClick={book}>
            ОТКРЫТЬ ДЕМО-ЗАПИСЬ ↗
          </button>
        </div>
        <dl>
          <div>
            <dt>АДРЕС</dt>
            <dd>{studio.address}</dd>
          </div>
          <div>
            <dt>РЕЖИМ РАБОТЫ</dt>
            <dd>{studio.hours}</dd>
          </div>
          <div>
            <dt>ТЕЛЕФОН · WHATSAPP · INSTAGRAM · 2GIS</dt>
            <dd>Ссылки ожидают подтверждения владельца</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
