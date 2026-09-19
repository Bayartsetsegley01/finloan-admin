import { customers } from "@/lib/mock/customers";
import type { Customer } from "@/types/customer";

import { ApiError, simulateRequest } from "./client";

export function getCustomers(): Promise<Customer[]> {
  return simulateRequest(() => customers);
}

export function getCustomerById(id: string): Promise<Customer> {
  return simulateRequest(() => {
    const customer = customers.find((c) => c.id === id);
    if (!customer) throw new ApiError(`Customer ${id} not found`, 404);
    return customer;
  });
}
