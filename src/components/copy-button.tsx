"use client"

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "usehooks-ts";

import { Button } from "./ui/button";

type Props = {
  content: string;
}

export function CopyButton(props: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [_, copy] = useCopyToClipboard();

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsCopied(false), 1000);

    return () => clearTimeout(timeoutId);
  }, [isCopied]);

  const onCopy = () => {
    copy(props.content);
    toast.info(`"${props.content}" copied to clipboard`);

    setIsCopied(true);
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onCopy}
    >
      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </Button>
  )
}