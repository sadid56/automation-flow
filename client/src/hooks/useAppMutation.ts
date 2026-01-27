import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type MutationOptions<TData, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateKeys?: readonly (readonly any[])[];
  successMessage?: string;
  errorMessage?: string;
};

export function useAppMutation<TData, TVariables>({
  mutationFn,
  invalidateKeys = [],
  successMessage,
  errorMessage,
}: MutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      if (successMessage) toast.success(successMessage);
    },
    onError: (error: any) => {
      toast.error(error?.message || errorMessage || "Something went wrong");
    },
  });
}
