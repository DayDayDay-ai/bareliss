export type BookingRequest = {
  zoneId: string;
  specialist: string;
  date: string;
  time: string;
  name: string;
  phone: string;
};
export type BookingResult = { id: string; mode: "mock" | "live" };
export interface BookingAdapter {
  submit(request: BookingRequest): Promise<BookingResult>;
}
// Replace this adapter with a server-backed CRM endpoint. Never expose CRM secrets in browser code.
export const bookingAdapter: BookingAdapter = {
  async submit(request) {
    await new Promise((r) => setTimeout(r, 350));
    return {
      id: "DEMO-" + Date.now().toString(36).toUpperCase(),
      mode: "mock",
    };
  },
};
export const mockSlots = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
