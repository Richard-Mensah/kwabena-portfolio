"use client";

import { useEffect } from "react";
import { useGame } from "@/components/game/GameProvider";

/** Records a case-study visit for the Studio Archive. */
export function TrackView({ slug }: { slug: string }) {
  const { markViewed, ready } = useGame();
  useEffect(() => {
    if (ready) markViewed(slug);
  }, [ready, slug, markViewed]);
  return null;
}
