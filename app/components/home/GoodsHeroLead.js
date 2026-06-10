'use client';

import { GOODS_HERO_INTRO } from '../../copy/goodsPageFa';
import { focusHomePath } from '../../utils/homePathFocus';
import { HOME_PAGE_LEAD } from './homePageTheme';

const PATH_LINK_CLASS =
  'font-normal text-amber-700 transition hover:text-amber-800 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-amber-500/40';

export default function GoodsHeroLead() {
  return (
    <p className={HOME_PAGE_LEAD}>
      <button
        type="button"
        className={PATH_LINK_CLASS}
        onClick={() => focusHomePath(['home-path-search'], { focusSearch: true })}
      >
        {GOODS_HERO_INTRO.leadSearch}
      </button>
      {' ، '}
      <button
        type="button"
        className={PATH_LINK_CLASS}
        onClick={() => focusHomePath(['home-path-map'])}
      >
        {GOODS_HERO_INTRO.leadMap}
      </button>
      {' ، یا '}
      <button
        type="button"
        className={PATH_LINK_CLASS}
        onClick={() => focusHomePath(['home-path-need'])}
      >
        {GOODS_HERO_INTRO.leadNeed}
      </button>
      {' '}
      {GOODS_HERO_INTRO.leadSuffix}
    </p>
  );
}
