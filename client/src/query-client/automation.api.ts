import { api } from "@/lib/fetcher";
import { Automation } from "@/types/automation.types";

export const AutomationEndpoints = {
  getAutomations: (): Promise<Automation[]> => api.get("/automations"),

  getAutomation: (id: string): Promise<Automation> => api.get(`/automations/${id}`),

  createAutomation: (data: Partial<Automation>): Promise<Automation> => api.post("/automations", data),

  updateAutomation: (id: string, data: Partial<Automation>): Promise<Automation> => api.put(`/automations/${id}`, data),

  deleteAutomation: (id: string): Promise<void> => api.delete(`/automations/${id}`),

  testAutomation: (id: string, email: string): Promise<{ message: string }> => api.post(`/automations/${id}/test`, { email }),
};
