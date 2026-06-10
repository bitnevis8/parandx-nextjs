'use client';

import { HERO_INTRO } from '../../copy/friendlyFa';
import { focusHomePath } from '../../utils/homePathFocus';
import { HOME_PAGE_LEAD } from './homePageTheme';

const PATH_LINK_CLASS =
  'font-normal text-teal-700 transition hover:text-teal-800 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-teal-500/40';

export default function HomeHeroLead() {
  return (
    <p className={HOME_PAGE_LEAD}>
      <button
        type="button"
        className={PATH_LINK_CLASS}
        onClick={() => focusHomePath(['home-path-search'], { focusSearch: true })}
      >
        {HERO_INTRO.leadSearch}
      </button>
      {' ، '}
      <button
        type="button"
        className={PATH_LINK_CLASS}
        onClick={() => focusHomePath(['home-path-map'])}
      >
        {HERO_INTRO.leadMap}
      </button>
      {' ، یا '}
      <button
        type="button"
        className={PATH_LINK_CLASS}
        onClick={() => focusHomePath(['home-path-request'])}
      >
        {HERO_INTRO.leadRequest}
      </button>
      {' '}
      {HERO_INTRO.leadSuffix}
    </p>
  );
}
