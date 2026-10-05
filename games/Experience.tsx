"use client";
import { useEffect, useRef, useState } from "react";
type State =
  | "pluck-intro"
  | "pluck-playing"
  | "pluck-complete"
  | "laser-intro"
  | "laser-playing"
  | "laser-complete"
  | "booking-cta";
type Hair = { id: number; x: number; y: number; angle: number; length: number };
const makeHairs = (count: number): Hair[] =>
  Array.from({ length: count }, (_, id) => ({
    id,
    x:
      13 +
      (id % (count === 25 ? 5 : 8)) * (count === 25 ? 18 : 10.5) +
      Math.sin(id * 7) * 2,
    y:
      21 +
      Math.floor(id / (count === 25 ? 5 : 8)) * (count === 25 ? 15 : 9) +
      Math.cos(id * 5) * 2,
    angle: Math.sin(id * 3) * 18,
    length: 17 + ((id * 7) % 13),
  }));
const pluck = makeHairs(25),
  laser = makeHairs(64);
function TouchButton({
  onClick,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  onClick: () => void;
}) {
  const lastTouch = useRef(0);
  return (
    <button
      {...props}
      onPointerUp={(e) => {
        if (e.pointerType === "touch") {
          lastTouch.current = Date.now();
          onClick();
        }
      }}
      onClick={(e) => {
        if (e.detail === 0 || Date.now() - lastTouch.current > 600) onClick();
      }}
    />
  );
}
export default function Experience({ book }: { book: () => void }) {
  const [state, setState] = useState<State>("pluck-intro");
  const [removed, setRemoved] = useState<number[]>([]);
  const [treated, setTreated] = useState<number[]>([]);
  const [sound, setSound] = useState(false);
  const [flash, setFlash] = useState(false);
  const [grab, setGrab] = useState<number | null>(null);
  const [tension, setTension] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [lastPulse, setLastPulse] = useState(0);
  const [iosHaptics, setIosHaptics] = useState(false);
  const surface = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; y: number; pointer: number } | null>(null);
  const lastHairTouch = useRef(0);
  const context = useRef<AudioContext | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    // Recent Safari requires a direct tap on its native switch for haptics.
    // Keep the touch target local to the laser; plucking needs free dragging.
    setIosHaptics(
      /iPhone/.test(navigator.userAgent) &&
      !("vibrate" in navigator) &&
      "switch" in document.createElement("input"),
    );
  }, []);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      context.current?.close();
    },
    [],
  );
  useEffect(() => {
    if (removed.length === 25 && state === "pluck-playing") {
      const completion = setTimeout(() => setState("pluck-complete"), 850);
      return () => clearTimeout(completion);
    }
  }, [removed, state]);
  useEffect(() => {
    if (treated.length === 64 && state === "laser-playing") {
      const completion = setTimeout(() => setState("laser-complete"), 700);
      return () => clearTimeout(completion);
    }
  }, [treated, state]);
  function tick() {
    if (sound) {
      context.current ??= new AudioContext();
      const c = context.current;
      void c.resume();
      const o = c.createOscillator(),
        g = c.createGain();
      o.frequency.value = state === "laser-playing" ? 380 : 700;
      g.gain.setValueAtTime(0.025, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
      o.connect(g).connect(c.destination);
      o.start();
      o.stop(c.currentTime + 0.08);
    }
    if ("vibrate" in navigator) navigator.vibrate(8);
  }
  function remove(id: number) {
    setRemoved((r) => (r.includes(id) ? r : [...r, id]));
    if (
      drag.current &&
      surface.current?.hasPointerCapture(drag.current.pointer)
    )
      surface.current.releasePointerCapture(drag.current.pointer);
    drag.current = null;
    setGrab(null);
    setTension(0);
    tick();
  }
  function move(e: React.PointerEvent) {
    const rect = surface.current!.getBoundingClientRect();
    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    if (drag.current) {
      const dy = drag.current.y - e.clientY;
      setTension(Math.max(0, dy));
      if (dy >= Math.min(35, rect.height * 0.08)) remove(drag.current.id);
    }
  }
  function pulse(x = position.x, y = position.y) {
    setPosition({ x, y });
    if (state !== "laser-playing" || flash) return;
    const fresh = laser
      .filter(
        (h) =>
          !treated.includes(h.id) && Math.hypot(h.x - x, (h.y - y) * 0.8) < 19,
      )
      .map((h) => h.id);
    setLastPulse(fresh.length);
    setTreated((t) => [...new Set([...t, ...fresh])]);
    setFlash(true);
    tick();
    timer.current = setTimeout(() => setFlash(false), 180);
  }
  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setState("pluck-intro");
    setRemoved([]);
    setTreated([]);
    setFlash(false);
    setGrab(null);
    drag.current = null;
  }
  const playing = state === "pluck-playing" || state === "laser-playing";
  const count = removed.length;
  const message =
    count === 25
      ? "SMOOTH."
      : count >= 20
        ? "ПОЧТИ."
        : count >= 15
          ? "ОДИН МАЛЕНЬКИЙ УЧАСТОК."
          : count >= 10
            ? "УЖЕ НАДОЕЛО?"
            : count >= 5
              ? "ЕЩЁ " + (25 - count) + "."
              : "ONE BY ONE.";
  return (
    <div className="experience">
      <div className="game-toolbar">
        <span className="eyebrow">THE BARE EXPERIENCE</span>
        <div>
          <TouchButton onClick={() => setSound((s) => !s)} aria-pressed={sound}>
            SOUND {sound ? "ON" : "OFF"}
          </TouchButton>
          <TouchButton onClick={reset}>RESTART</TouchButton>
          <TouchButton
            onClick={() => {
              if (timer.current) clearTimeout(timer.current);
              setState("booking-cta");
            }}
          >
            SKIP ↗
          </TouchButton>
        </div>
      </div>
      {state === "pluck-intro" && (
        <div className="game-intro">
          <span className="eyebrow">01 / ONE AT A TIME</span>
          <h3>PLUCK.</h3>
          <p>Каждый волосок. Отдельное действие.</p>
          <p className="muted">
            Зажмите волос пинцетом и потяните вверх.
            <br />
            На клавиатуре: выберите волос клавишей Tab и нажмите Enter.
          </p>
          <TouchButton
            className="button"
            onClick={() => setState("pluck-playing")}
          >
            ВЗЯТЬ ПИНЦЕТ →
          </TouchButton>
          <TouchButton
            className="text-button"
            onClick={() => setState("laser-intro")}
          >
            СРАЗУ ПОПРОБОВАТЬ ЛАЗЕР ↗
          </TouchButton>
        </div>
      )}
      {playing && (
        <>
          <div className="game-heading">
            <h3>{state === "pluck-playing" ? "PLUCK." : "LASER."}</h3>
            <div aria-live="polite">
              <span className="eyebrow">
                {state === "pluck-playing" ? "HAIRS REMOVED" : "TREATED AREA"}
              </span>
              <strong>
                {state === "pluck-playing"
                  ? String(count).padStart(2, "0") + " / 25"
                  : Math.round((treated.length / 64) * 100) + "%"}
              </strong>
            </div>
          </div>
          <div
            ref={surface}
            className={`skin-surface ${state === "laser-playing" ? "laser-surface" : ""} ${flash ? "flash" : ""}`}
            onPointerMove={move}
            onPointerUp={() => {
              drag.current = null;
              setGrab(null);
              setTension(0);
            }}
            onPointerCancel={() => {
              drag.current = null;
              setGrab(null);
              setTension(0);
            }}
            onPointerDown={(e) => {
              if (state === "laser-playing") {
                if (!(e.target instanceof HTMLInputElement)) {
                  e.currentTarget.setPointerCapture(e.pointerId);
                }
                const r = e.currentTarget.getBoundingClientRect();
                pulse(
                  ((e.clientX - r.left) / r.width) * 100,
                  ((e.clientY - r.top) / r.height) * 100,
                );
              }
            }}
          >
            {state === "laser-playing" && iosHaptics && (
              <input
                type="checkbox"
                {...{ switch: "" }}
                className="ios-laser-haptic"
                tabIndex={-1}
                aria-hidden="true"
              />
            )}
            {(state === "pluck-playing" ? pluck : laser).map((h) => (
              <button
                key={h.id}
                className={`hair ${(state === "pluck-playing" ? removed : treated).includes(h.id) ? "removed" : ""} ${grab === h.id ? "grabbed" : ""}`}
                aria-label={`${state === "pluck-playing" ? "Удалить" : "Обработать"} волос ${h.id + 1}`}
                disabled={(state === "pluck-playing"
                  ? removed
                  : treated
                ).includes(h.id)}
                style={
                  {
                    left: h.x + "%",
                    top: h.y + "%",
                    "--angle": h.angle + "deg",
                    "--length": h.length + "px",
                    "--pull": (grab === h.id ? tension * 0.7 : 0) + "px",
                  } as React.CSSProperties
                }
                onPointerDown={(e) => {
                  if (e.pointerType === "touch") lastHairTouch.current = Date.now();
                  if (state === "pluck-playing") {
                    surface.current?.setPointerCapture(e.pointerId);
                    drag.current = {
                      id: h.id,
                      y: e.clientY,
                      pointer: e.pointerId,
                    };
                    setGrab(h.id);
                    setPosition({ x: h.x, y: h.y });
                  }
                }}
                onClick={(e) => {
                  if (e.detail === 0 && Date.now() - lastHairTouch.current > 600) {
                    if (state === "pluck-playing") remove(h.id);
                    else pulse(h.x, h.y);
                  }
                }}
              >
                <span />
              </button>
            ))}
            <div
              className={`tool ${grab !== null ? "closed" : ""}`}
              style={{ left: position.x + "%", top: position.y + "%" }}
              aria-hidden="true"
            >
              {state === "pluck-playing" ? (
                <svg viewBox="0 0 70 160">
                  <defs>
                    <linearGradient id="metal">
                      <stop stopColor="#777" />
                      <stop offset=".4" stopColor="#eee" />
                      <stop offset="1" stopColor="#8c8c8c" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M26 4 L12 150 L27 139 L35 15 L43 139 L58 150 L44 4 Z"
                    fill="url(#metal)"
                  />
                  <path
                    d="M33 20 L26 128 M37 20 L44 128"
                    stroke="#333"
                    strokeWidth="1"
                  />
                </svg>
              ) : (
                <>
                  <div className="pulse-radius" />
                  <svg viewBox="0 0 100 145">
                    <rect
                      x="22"
                      y="0"
                      width="58"
                      height="105"
                      rx="20"
                      fill="#ede9e4"
                    />
                    <rect
                      x="33"
                      y="20"
                      width="35"
                      height="45"
                      rx="8"
                      fill="#c0c7b6"
                    />
                    <rect
                      x="15"
                      y="86"
                      width="72"
                      height="47"
                      rx="13"
                      fill="#c8c8c3"
                    />
                    <rect
                      x="26"
                      y="117"
                      width="50"
                      height="16"
                      rx="4"
                      fill="#547c35"
                    />
                  </svg>
                </>
              )}
            </div>
          </div>
          <div className="game-status" aria-live="polite">
            {state === "pluck-playing"
              ? message
              : lastPulse
                ? `${treated.length <= lastPulse ? "ONE PULSE." : "ONE BY ONE? NOT ANYMORE."} ${lastPulse} HAIRS TREATED.`
                : "ДВИГАЙТЕ МАНИПУЛУ. НАЖМИТЕ ДЛЯ ИМПУЛЬСА."}
          </div>
          <div className="game-bottom">
            <p className="small muted">
              {state === "pluck-playing"
                ? "Зажмите волос. Потяните вверх."
                : "Нажмите на участок кожи или используйте Tab + Enter."}
            </p>
            {state === "pluck-playing" && (
              <TouchButton
                className="text-button"
                onClick={() => setState("laser-intro")}
              >
                УЖЕ НАДОЕЛО? TRY LASER →
              </TouchButton>
            )}
          </div>
        </>
      )}
      {state === "pluck-complete" && (
        <div className="game-intro">
          <span className="eyebrow">25 / 25 · SMOOTH.</span>
          <h3 className="statement">
            А это был всего
            <br />
            один маленький
            <br />
            участок.
          </h3>
          <p>Не хочешь делать это с каждым волоском отдельно?</p>
          <TouchButton
            className="button"
            onClick={() => setState("laser-intro")}
          >
            TRY LASER →
          </TouchButton>
          <TouchButton className="text-button" onClick={book}>
            ХВАТИТ С МЕНЯ → ЗАПИСАТЬСЯ
          </TouchButton>
        </div>
      )}
      {state === "laser-intro" && (
        <div className="game-intro">
          <span className="eyebrow">02 / A DIFFERENT FEELING</span>
          <h3>TRY LASER.</h3>
          <p>Один импульс. Сразу несколько волосков.</p>
          <p className="muted">Двигайте манипулу и нажимайте на кожу.</p>
          <TouchButton
            className="button"
            onClick={() => {
              setTreated([]);
              setState("laser-playing");
            }}
          >
            ПОПРОБОВАТЬ →
          </TouchButton>
        </div>
      )}
      {(state === "laser-complete" || state === "booking-cta") && (
        <div className="game-intro">
          <span className="eyebrow">
            {state === "laser-complete"
              ? "SESSION COMPLETE."
              : "YOUR SKIN. YOUR CHOICE."}
          </span>
          <h3 className="statement">
            {state === "laser-complete" ? (
              <>
                ONE BY ONE?
                <br />
                <i>NOT ANYMORE.</i>
              </>
            ) : (
              <>
                Хочешь гладкость
                <br />
                <i>без игр?</i>
              </>
            )}
          </h3>
          <p>Хватит бороться с каждым волоском отдельно.</p>
          <p className="muted">Ты просто лежишь. Остальное делает BARE LISS.</p>
          <TouchButton className="button" onClick={book}>
            ЗАПИСАТЬСЯ НА ЛАЗЕР ↗
          </TouchButton>
          <a className="text-button" href="#prices">
            ПОСМОТРЕТЬ ЦЕНЫ →
          </a>
        </div>
      )}
      <p className="game-disclaimer">
        Интерактивная метафора. Волосы не исчезают мгновенно после реальной
        процедуры. Результат индивидуален.
      </p>
    </div>
  );
}
