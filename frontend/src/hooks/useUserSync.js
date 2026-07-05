import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { syncUser } from "./../lib/api.js";

function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const {
    mutate: syncUserMutation,
    isPending,
    isSuccess,
  } = useMutation({ mutationFn: syncUser });
  useEffect(() => {
    console.log("useUserSync effect pokrenut");
    if (isSignedIn && !isPending && !isSuccess) {
      syncUserMutation({
        email: user.primaryEmailAddress.emailAddress,
        name: user.fullName || user.fistName,
        imageUrl: user.imageUrl,
      });
    }
  }, [isSignedIn, user, syncUserMutation, isPending, isSuccess]);
  return { isSynced: isSuccess };
}

export default useUserSync;
