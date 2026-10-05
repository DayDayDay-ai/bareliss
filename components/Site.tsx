"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {localPath,assetPath,siteUrl} from '@/lib/site';
import { motion, useReducedMotion } from "framer-motion";
import Booking from "./Booking";
import { Zones, Prices } from "@/sections/ZonesPrices";
import {
  Technology,
  Process,
  CoursePreparation,
  ResultsReviews,
  FAQ,
  Contacts,
} from "@/sections/Content";
const Experience = dynamic(() => import("@/games/Experience"), {
  ssr: false,
  loading: () => (
    <div className="game-intro">
      <p>Подготавливаем ваш опыт…</p>
    </div>
  ),
});
const nav = [
  ["О СТУДИИ", "about"],
  ["ЛАЗЕР", "laser"],
  ["ЗОНЫ", "zones"],
  ["ЦЕНЫ", "prices"],
  ["FAQ", "faq"],
  ["КОНТАКТЫ", "contacts"],
];
export default function Site({ focus }: { focus?: string }) {
  const [booking, setBooking] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loadGame, setLoadGame] = useState(false);
  const game = useRef<HTMLElement>(null);
  const hero = useRef<HTMLElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 40);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoadGame(true);
          observer.disconnect();
        }
      },
      { rootMargin: "350px" },
    );
    if (game.current) observer.observe(game.current);
    if (focus) document.getElementById(focus)?.scrollIntoView();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scroll);
    };
  }, [focus]);
  useEffect(() => {
    if (reduced || !matchMedia("(pointer:fine)").matches) return;
    const move = (e: PointerEvent) => {
      if (cursor.current) {
        cursor.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
        cursor.current.classList.toggle(
          "hover",
          !!(e.target as HTMLElement).closest("a,button,summary"),
        );
      }
      if (hero.current) {
        hero.current.style.setProperty('--px',`${(e.clientX/window.innerWidth-.5)*6}px`);
        hero.current.style.setProperty('--py',`${(e.clientY/window.innerHeight-.5)*6}px`);
        hero.current.style.setProperty(
          "--mx",
          `${(e.clientX / window.innerWidth) * 100}%`,
        );
        hero.current.style.setProperty(
          "--my",
          `${(e.clientY / window.innerHeight) * 100}%`,
        );
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced]);
  const book = (id = "deep-bikini") => {
    setMenu(false);
    setBooking(id);
  };
  const start = () => {
    setLoadGame(true);
    game.current?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  };
  return (
    <>
      <a href="#main" className="skip-link">
        К содержимому
      </a>
      <div ref={cursor} className="custom-cursor" aria-hidden="true">
        <span />
      </div>
      <header className={scrolled ? "scrolled" : ""}>
        <a href={localPath('/')} className="wordmark">
          BARE LISS<span>.</span>
          <small>SKIN STUDIO</small>
        </a>
        <nav aria-label="Главная навигация" className={menu ? "open" : ""}>
          {nav.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <button className="header-book" onClick={() => book()}>
          ЗАПИСАТЬСЯ <span>↗</span>
        </button>
        <button
          className="menu-toggle"
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          aria-label="Меню"
        >
          {menu ? "ЗАКРЫТЬ" : "МЕНЮ"} <span>{menu ? "−" : "+"}</span>
        </button>
      </header>
      <main id="main">
        <section className="hero" ref={hero}>
          <div className="hero-photo">
            <Image
              src={assetPath('/hero.webp')}
              alt="Скульптурные складки тёплого шёлка в мягком свете — иллюстрация бренда"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hero-shade" />
          <div className="hero-light" />
          <div className="hero-content">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="eyebrow hero-label">
                <span className="green-dot" /> LASER HAIR REMOVAL / SKIN STUDIO
              </span>
              <h1>
                Гладкость
                <br />
                <i>как состояние.</i>
              </h1>
              <p>
                Лазерная эпиляция нового поколения.
                <br />
                Комфортно. Эстетично. Надолго.
              </p>
              <div className="hero-actions">
                <button className="button" onClick={() => book()}>
                  ЗАПИСАТЬСЯ ↗
                </button>
                <button className="hero-secondary" onClick={start}>
                  ПОЧУВСТВОВАТЬ РАЗНИЦУ <span>→</span>
                </button>
              </div>
            </motion.div>
          </div>
          <div className="hero-bottom">
            <span className="eyebrow">LESS HAIR. MORE SKIN.</span>
            <a href="#about" className="eyebrow">
              SCROLL TO FEEL ↓
            </a>
            <span className="eyebrow">ESTHETICS / TECHNOLOGY / YOU</span>
          </div>
          <span className="hero-side">SMOOTH LOOKS GOOD ON YOU.</span>
        </section>
        <section id="about" className="section brand">
          <div className="section-top">
            <span className="eyebrow">01 / THE BARE PHILOSOPHY</span>
            <span className="eyebrow">НИЧЕГО ЛИШНЕГО. ТОЛЬКО ТЫ.</span>
          </div>
          <div className="brand-layout">
            <h2>
              Твоё тело —<br />
              <i>твои правила.</i>
            </h2>
            <div>
              <span className="green-line" />
              <p>
                BARE LISS — пространство лазерной эпиляции, где технологии,
                комфорт и эстетика работают вместе.
              </p>
              <p className="muted">
                Больше времени на себя.
                <br />
                Меньше бесконечной рутины.
              </p>
              <a href="#laser" className="text-button">
                ПОЗНАКОМИТЬСЯ БЛИЖЕ ↗
              </a>
            </div>
          </div>
          <div className="brand-strip">
            ЧИСТОТА <span>·</span> ЭСТЕТИКА <span>·</span> ТЕХНОЛОГИЯ{" "}
            <span>·</span> КОМФОРТ <span>·</span> ЗАБОТА
          </div>
        </section>
        <section className="section why">
          <span className="eyebrow">02 / MAKE ROOM FOR MORE</span>
          <div className="why-layout">
            <h2>
              Меньше волос.
              <br />
              <i>Больше жизни.</i>
            </h2>
            <div>
              {[
                "Меньше рутины",
                "Меньше раздражения от постоянного бритья",
                "Меньше вросших волос",
                "Больше гладкости",
                "Больше времени на себя",
              ].map((text, i) => (
                <motion.div
                  className="why-row"
                  key={text}
                  initial={reduced ? false : { opacity: 0.75, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="eyebrow">0{i + 1}</span>
                  <h3>{text}</h3>
                  <span>↗</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <Technology />
        <Zones book={book} />
        <section className="section interactive" id="experience" ref={game}>
          <div className="section-top">
            <span className="eyebrow">05 / FEEL THE DIFFERENCE</span>
            <span className="eyebrow">20–45 СЕКУНД. ОДНО ОСОЗНАНИЕ.</span>
          </div>
          <div className="section-heading">
            <h2>
              One by one?
              <br />
              <i>Not anymore.</i>
            </h2>
            <p>
              Иногда разницу лучше
              <br />
              почувствовать самой.
            </p>
          </div>
          {loadGame ? (
            <Experience book={() => book()} />
          ) : (
            <button className="button" onClick={() => setLoadGame(true)}>
              ПОЧУВСТВОВАТЬ РАЗНИЦУ →
            </button>
          )}
        </section>
        <Process />
        <Prices book={book} />
        <CoursePreparation book={() => book()} />
        <ResultsReviews />
        <FAQ />
        <section className="section booking-section" id="booking">
          <span className="eyebrow">14 / YOUR NEXT GOOD DECISION</span>
          <h2>
            Гладкость
            <br />
            <i>начинается здесь.</i>
          </h2>
          <p>Выбери время для себя.</p>
          <button className="button light-button" onClick={() => book()}>
            ЗАПИСАТЬСЯ НА ЛАЗЕР ↗
          </button>
          <span className="small">
            Демо-запись · выбор зоны, даты и времени
          </span>
        </section>
        <Contacts book={() => book()} />
      </main>
      <footer>
        <div className="footer-top">
          <a className="footer-brand" href={localPath('/')}>
            BARE LISS<span>.</span>
            <small>SKIN STUDIO</small>
          </a>
          <div>
            <p>
              ГЛАДКОСТЬ
              <br />
              КАК СОСТОЯНИЕ.
            </p>
            <a
              href="#booking"
              className="text-button"
              onClick={(e) => {
                e.preventDefault();
                book();
              }}
            >
              ТВОЯ НОВАЯ РУТИНА ↗
            </a>
          </div>
        </div>
        <div className="footer-nav">
          {nav
            .filter((x) => x[1] !== "faq")
            .map(([label, id]) => (
              <a href={localPath(`/${id}/`)} key={id}>
                {label}
              </a>
            ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 BARE LISS. SKIN STUDIO</span>
          <span>LESS HAIR. MORE SKIN.</span>
          <span>СОЗДАНО С ЗАБОТОЙ О ТЕБЕ</span>
        </div>
      </footer>
      {booking && <Booking zoneId={booking} onClose={() => setBooking(null)} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BeautySalon",
            name: "BARE LISS. SKIN STUDIO",
            url:siteUrl+'/',
            description: "Студия лазерной эпиляции",
            image:siteUrl+'/hero.webp',
          }),
        }}
      />
    </>
  );
}

