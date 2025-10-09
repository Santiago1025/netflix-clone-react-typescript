export const j = (...classNames: (string | undefined)[]) => {
  return classNames.filter(Boolean).join(" ");
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const shareLink = (opts: Omit<ShareData, "files">) => {
  if (typeof navigator.share === "function") {
    navigator.share(opts);
  } else {
    if (opts.url) {
      copyToClipboard(opts.url);
    }
  }
};
