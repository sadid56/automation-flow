import { useQuery } from "@tanstack/react-query";
import { Automation } from "@/types/automation.types";
import { useAppMutation } from "./useAppMutation";
import { AutomationEndpoints } from "@/query-client/automation.api";

export function useAutomations() {
  return useQuery<Automation[]>({
    queryKey: ["automations"],
    queryFn: AutomationEndpoints.getAutomations,
  });
}

export function useAutomation(id: string) {
  return useQuery({
    queryKey: ["automation", id],
    queryFn: () => AutomationEndpoints.getAutomation(id),
    enabled: !!id,
  });
}

export const useCreateAutomation = () =>
  useAppMutation<Automation, Partial<Automation>>({
    mutationFn: AutomationEndpoints.createAutomation,
    invalidateKeys: [["automations"]],
    successMessage: "Automation created successfully",
    errorMessage: "Failed to create automation",
  });

export const useUpdateAutomation = (id: string) =>
  useAppMutation<Automation, Partial<Automation>>({
    mutationFn: (data) => AutomationEndpoints.updateAutomation(id, data),
    invalidateKeys: [["automations"], ["automation", id]],
    successMessage: "Automation updated successfully",
    errorMessage: "Failed to update automation",
  });

export const useDeleteAutomation = () =>
  useAppMutation<void, string>({
    mutationFn: AutomationEndpoints.deleteAutomation,
    invalidateKeys: [["automations"]],
    successMessage: "Automation deleted successfully",
    errorMessage: "Failed to delete automation",
  });

export const useTestAutomation = (id: string) =>
  useAppMutation<{ message: string }, string>({
    mutationFn: (email) => AutomationEndpoints.testAutomation(id, email),
    successMessage: "Test run started",
    errorMessage: "Failed to start test run",
  });
