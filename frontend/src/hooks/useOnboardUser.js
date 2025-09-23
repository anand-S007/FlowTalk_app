import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { completeOnboarding } from "../lib/api";

export const useOnboardUser = () => {
  const queryClient = useQueryClient();

  const {mutateAsync, isPending} = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("User onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["userAuth"] });
    }
  });

  return {
    onboardingMutation: mutateAsync,
    isPending
  }
};
