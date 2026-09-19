import type { Customer, CustomerInput } from "@/types/customer";

/**
 * In-memory "database". Mutations live only for the current browser session,
 * which is enough to demo create → refetch flows without a backend.
 */
export const customers: Customer[] = [
  { id: "CU-2041", name: "Г.Бат-Эрдэнэ", phone: "+976 9911 4827", email: "baterdene.g@example.com" },
  { id: "CU-2042", name: "Б.Номин", phone: "+976 8808 2153", email: "nomin.b@example.com" },
  { id: "CU-2043", name: "Э.Тэмүүлэн", phone: "+976 9919 6042", email: "temuulen.e@example.com" },
  { id: "CU-2044", name: "Д.Энхжин", phone: "+976 9595 3318", email: "enkhjin.d@example.com" },
  { id: "CU-2045", name: "О.Мөнхзул", phone: "+976 8899 7264", email: "munkhzul.o@example.com" },
  { id: "CU-2046", name: "С.Ариунбаяр", phone: "+976 9909 1576", email: "ariunbayar.s@example.com" },
  { id: "CU-2047", name: "Ц.Гэрэлмаа", phone: "+976 8585 4409", email: "gerelmaa.ts@example.com" },
  { id: "CU-2048", name: "Н.Хулан", phone: "+976 9494 8821", email: "khulan.n@example.com" },
  { id: "CU-2049", name: "Ж.Отгонбаяр", phone: "+976 9911 0735", email: "otgonbayar.j@example.com" },
  { id: "CU-2050", name: "Ч.Соёлмаа", phone: "+976 8811 5590", email: "soyolmaa.ch@example.com" },
  { id: "CU-2051", name: "Б.Билгүүн", phone: "+976 9977 2246", email: "bilguun.b@example.com" },
  { id: "CU-2052", name: "Л.Уянга", phone: "+976 8080 3617", email: "uyanga.l@example.com" },
  { id: "CU-2053", name: "Т.Анужин", phone: "+976 9900 6483", email: "anujin.t@example.com" },
  { id: "CU-2054", name: "Х.Сүхбат", phone: "+976 9696 1152", email: "sukhbat.kh@example.com" },
];

const normalizePhone = (phone: string) => phone.replace(/\D/g, "").slice(-8);

/** Returns the existing customer with the same phone number, or registers a new one. */
export function upsertCustomer(input: CustomerInput): Customer {
  const existing = customers.find((c) => normalizePhone(c.phone) === normalizePhone(input.phone));
  if (existing) return existing;

  const lastId = customers.reduce((max, c) => Math.max(max, Number(c.id.replace("CU-", ""))), 2000);
  const digits = normalizePhone(input.phone);
  const created: Customer = {
    id: `CU-${lastId + 1}`,
    name: input.name.trim(),
    phone: `+976 ${digits.slice(0, 4)} ${digits.slice(4)}`,
    email: input.email.trim(),
  };
  customers.push(created);
  return created;
}
