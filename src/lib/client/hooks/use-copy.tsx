import { useCallback } from "react";

import { toast } from "sonner";

export function useCopy() {
  const copy = useCallback(async (text: string) => {
    if (!navigator.clipboard) {
      toast.warning("Clipboard is not supported");

      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to the clipboard");

      return true;
    } catch (err) {
      toast.error("Failed to copy to the clipboard");

      return false;
    }
  }, []);

  return copy;
}