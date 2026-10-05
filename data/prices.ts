export type Zone = {
  id: string;
  name: string;
  time: string;
  price: number;
  category: string;
  point: [number, number];
};
export const zones: Zone[] = [
  {
    id: "face",
    name: "Лицо",
    time: "15–20",
    price: 6000,
    category: "ЛИЦО",
    point: [50, 12],
  },
  {
    id: "armpits",
    name: "Подмышки",
    time: "10–15",
    price: 4000,
    category: "ТЕЛО",
    point: [63, 28],
  },
  {
    id: "arms",
    name: "Руки",
    time: "20–30",
    price: 8000,
    category: "ТЕЛО",
    point: [72, 38],
  },
  {
    id: "stomach",
    name: "Живот",
    time: "15–20",
    price: 5000,
    category: "ТЕЛО",
    point: [50, 39],
  },
  {
    id: "back",
    name: "Спина",
    time: "25–35",
    price: 10000,
    category: "ТЕЛО",
    point: [50, 30],
  },
  {
    id: "bikini",
    name: "Бикини",
    time: "15–20",
    price: 6000,
    category: "БИКИНИ",
    point: [50, 50],
  },
  {
    id: "deep-bikini",
    name: "Глубокое бикини",
    time: "20–30",
    price: 7500,
    category: "БИКИНИ",
    point: [50, 54],
  },
  {
    id: "legs",
    name: "Ноги полностью",
    time: "40–50",
    price: 14000,
    category: "НОГИ",
    point: [58, 76],
  },
  {
    id: "shins",
    name: "Голени",
    time: "20–30",
    price: 8000,
    category: "НОГИ",
    point: [42, 84],
  },
  {
    id: "thighs",
    name: "Бёдра",
    time: "25–30",
    price: 8500,
    category: "НОГИ",
    point: [43, 65],
  },
  {
    id: "set-1",
    name: "BARE SET 01",
    time: "30–45",
    price: 10500,
    category: "КОМПЛЕКСЫ",
    point: [50, 50],
  },
  {
    id: "set-2",
    name: "BARE SET 02",
    time: "50–70",
    price: 17000,
    category: "КОМПЛЕКСЫ",
    point: [50, 72],
  },
];
export const money = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(n) + " ₸";
export const categories = [
  "ПОПУЛЯРНЫЕ",
  "ЛИЦО",
  "ТЕЛО",
  "БИКИНИ",
  "НОГИ",
  "КОМПЛЕКСЫ",
];
export const setDescription = (id: string) =>
  id === "set-1"
    ? "Подмышки + глубокое бикини"
    : id === "set-2"
      ? "Подмышки + глубокое бикини + голени"
      : "";
