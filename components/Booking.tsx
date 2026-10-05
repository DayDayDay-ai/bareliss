"use client";
import { useEffect, useRef, useState } from "react";
import { zones, money, setDescription } from "@/data/prices";
import { bookingAdapter, mockSlots, type BookingRequest } from "@/lib/booking";
export default function Booking({
  zoneId,
  onClose,
}: {
  zoneId: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState(zoneId.startsWith("set") ? "set" : "single");
  const [data, setData] = useState<BookingRequest>({
    zoneId,
    specialist: "Любой мастер",
    date: "",
    time: "",
    name: "",
    phone: "",
  });
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [today, setToday] = useState("");
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setToday(d.toISOString().slice(0, 10));
    return () => {
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, []);
  const zone = zones.find((z) => z.id === data.zoneId)!;
  const titles = [
    "ВЫБЕРИТЕ ЗОНУ",
    "ЗОНА ИЛИ КОМПЛЕКС",
    "ВЫБЕРИТЕ СПЕЦИАЛИСТА",
    "ВЫБЕРИТЕ ДАТУ",
    "ВЫБЕРИТЕ ВРЕМЯ",
    "КАК ВАС ЗОВУТ?",
    "ВАШ ТЕЛЕФОН",
    "ПРОВЕРЬТЕ ДЕТАЛИ",
  ];
  const update = (key: keyof BookingRequest, value: string) =>
    setData((d) => ({ ...d, [key]: value }));
  const valid =
    step === 3
      ? !!data.date && data.date >= today
      : step === 4
        ? !!data.time
        : step === 5
          ? data.name.trim().length >= 2
          : step === 6
            ? /^\+?[\d ()-]{10,20}$/.test(data.phone) &&
              data.phone.replace(/\D/g, "").length >= 10
            : true;
  async function submit() {
    setBusy(true);
    setError("");
    try {
      const r = await bookingAdapter.submit(data);
      setResult(r.id);
    } catch {
      setError("Не удалось отправить. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="booking"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-labelledby="booking-title"
    >
      <button className="close" onClick={onClose} aria-label="Закрыть запись">
        ×
      </button>
      <div className="eyebrow">BARE LISS. / DEMO BOOKING</div>
      {result ? (
        <>
          <h2 id="booking-title">
            YOU’RE
            <br />
            BOOKED.
          </h2>
          <p>Демонстрационная запись создана.</p>
          <p className="muted">
            Это тестовый сценарий. Визит в студию не забронирован: CRM ещё не
            подключена.
          </p>
          <div className="booking-summary">
            {zone.name}
            <br />
            {data.date} · {data.time}
            <br />
            {result}
          </div>
          <button className="button" onClick={onClose}>
            ГОТОВО ↗
          </button>
        </>
      ) : (
        <>
          <div className="steps" aria-label={`Шаг ${step + 1} из 8`}>
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className={i <= step ? "active" : ""} />
            ))}
          </div>
          <span className="eyebrow">
            STEP {String(step + 1).padStart(2, "0")} / 08
          </span>
          <h2 id="booking-title" className="booking-title">
            {titles[step]}
          </h2>
          <p className="muted small">
            Демонстрационные цены и доступность. Реальный визит не бронируется.
          </p>
          <div className="booking-body">
            {step === 0 && (
              <label>
                Зона
                <select
                  aria-label="Зона"
                  value={data.zoneId}
                  onChange={(e) => {
                    update("zoneId", e.target.value);
                    setKind(
                      e.target.value.startsWith("set") ? "set" : "single",
                    );
                  }}
                >
                  {zones.map((z) => (
                    <option value={z.id} key={z.id}>
                      {z.name} — {money(z.price)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {step === 1 && (
              <>
                <div className="choice">
                  <button
                    className={kind === "single" ? "selected" : ""}
                    onClick={() => {
                      setKind("single");
                      if (data.zoneId.startsWith("set"))
                        update("zoneId", "armpits");
                    }}
                  >
                    ОТДЕЛЬНАЯ ЗОНА
                  </button>
                  <button
                    className={kind === "set" ? "selected" : ""}
                    onClick={() => {
                      setKind("set");
                      update("zoneId", "set-1");
                    }}
                  >
                    КОМПЛЕКС
                  </button>
                </div>
                {kind === "set" && (
                  <label>
                    Комплекс
                    <select
                      aria-label="Комплекс"
                      value={data.zoneId}
                      onChange={(e) => update("zoneId", e.target.value)}
                    >
                      {zones
                        .filter((z) => z.category === "КОМПЛЕКСЫ")
                        .map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.name} · {setDescription(z.id)}
                          </option>
                        ))}
                    </select>
                  </label>
                )}
                <p>
                  {zone.name} · {money(zone.price)}
                </p>
              </>
            )}
            {step === 2 && (
              <label>
                Специалист
                <select
                  aria-label="Специалист"
                  value={data.specialist}
                  onChange={(e) => update("specialist", e.target.value)}
                >
                  <option>Любой мастер</option>
                </select>
              </label>
            )}
            {step === 3 && (
              <label>
                Предпочтительная дата
                <input
                  type="date"
                  min={today}
                  value={data.date}
                  onChange={(e) => {
                    update("date", e.target.value);
                    update("time", "");
                  }}
                />
              </label>
            )}
            {step === 4 && (
              <div className="slots">
                {mockSlots.map((time) => (
                  <button
                    key={time}
                    className={data.time === time ? "selected" : ""}
                    onClick={() => update("time", time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
            {step === 5 && (
              <label>
                Имя
                <input
                  autoComplete="given-name"
                  value={data.name}
                  maxLength={80}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ваше имя"
                />
              </label>
            )}
            {step === 6 && (
              <label>
                Телефон
                <input
                  aria-label="Телефон"
                  type="tel"
                  autoComplete="tel"
                  value={data.phone}
                  maxLength={20}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+7 (___) ___ __ __"
                />
                <small>Введите не менее 10 цифр.</small>
              </label>
            )}
            {step === 7 && (
              <div className="booking-summary">
                <p>
                  {zone.name} <span>{money(zone.price)}</span>
                </p>
                <p>{setDescription(zone.id)}</p>
                <p>{data.specialist}</p>
                <p>
                  {data.date} · {data.time}
                </p>
                <p>
                  {data.name} · {data.phone}
                </p>
                <small>
                  Контактные данные используются только в этом тесте и не
                  отправляются в студию.
                </small>
              </div>
            )}
          </div>
          <p role="alert">{error}</p>
          <div className="booking-actions">
            {step > 0 && (
              <button
                className="text-button"
                onClick={() => setStep((s) => s - 1)}
              >
                ← НАЗАД
              </button>
            )}
            <button
              className="button"
              disabled={!valid || busy}
              onClick={() => (step === 7 ? submit() : setStep((s) => s + 1))}
            >
              {busy
                ? "СОЗДАЁМ…"
                : step === 7
                  ? "ПОДТВЕРДИТЬ ДЕМО ↗"
                  : "ПРОДОЛЖИТЬ →"}
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
