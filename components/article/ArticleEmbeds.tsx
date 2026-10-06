'use client';

import { type ComponentType, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArticleConstellation } from './ArticleConstellation';
import { UnicodeLens } from './UnicodeLens';

/**
 * Interactive widgets inside article bodies. The body HTML (content/posts/<slug>.html) holds a static
 * version of each one so the page is complete before JavaScript runs; once the page loads, the matching
 * component takes that spot over. Add a widget by giving its container an id here.
 */
const EMBEDS: Record<string, ComponentType> = {
  'article-constellation': ArticleConstellation,
  'widget-unicode-lens': UnicodeLens,
};

export function ArticleEmbeds() {
  const [hosts, setHosts] = useState<Array<[HTMLElement, ComponentType]>>([]);

  useEffect(() => {
    const found = Object.entries(EMBEDS).flatMap(([id, Embed]) => {
      const el = document.getElementById(id);
      if (!el) return [];
      el.replaceChildren(); // the static stand-in; the component renders the live version
      return [[el, Embed] as [HTMLElement, ComponentType]];
    });
    setHosts(found);
    return () => setHosts([]);
  }, []);

  return hosts.map(([el, Embed]) => createPortal(<Embed />, el, el.id));
}
