'use client';

import { useRouter } from 'next/navigation';

/** Pixel arrow, drawn on an 8x8 grid so it stays crisp at any size. */
function PixelArrow() {
  return (
    <svg
      viewBox="0 0 8 8"
      width="16"
      height="16"
      aria-hidden="true"
      shapeRendering="crispEdges"
      fill="currentColor"
    >
      <rect x="3" y="0" width="1" height="1" />
      <rect x="2" y="1" width="1" height="1" />
      <rect x="1" y="2" width="1" height="1" />
      <rect x="0" y="3" width="8" height="2" />
      <rect x="1" y="5" width="1" height="1" />
      <rect x="2" y="6" width="1" height="1" />
      <rect x="3" y="7" width="1" height="1" />
    </svg>
  );
}

/**
 * A floating "back" button for article pages. It returns to wherever the reader came from on this site
 * (the Writing list, the home page, another article); with no earlier page it goes to the Writing list.
 */
export function ArticleBack() {
  const router = useRouter();
  const goBack = () => {
    const cameFromHere = document.referrer.startsWith(window.location.origin);
    if (cameFromHere && window.history.length > 1) router.back();
    else router.push('/blog');
  };
  return (
    <button type="button" className="nw-article-back px-box" onClick={goBack} aria-label="Go back">
      <PixelArrow />
      <span>Back</span>
    </button>
  );
}
