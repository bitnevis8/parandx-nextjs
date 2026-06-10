'use client';

import { SparklesIcon } from '@heroicons/react/24/outline';
import { EXPERT_COMMUNITY_HEADER } from '../../copy/friendlyFa';
import HomeLatestExperts from './HomeLatestExperts';
import HomeExpertSignupCta from './HomeExpertSignupCta';
import LatestExpertsIllustration from './LatestExpertsIllustration';
import HomeSectionHeader from './HomeSectionHeader';
import { EXPERT_BLOCK_SHELL } from './homeExpertTheme';

/** بلوک یکپارچه: آخرین متخصصین + دعوت به ثبت‌نام */
export default function HomeExpertCommunityBlock({ city, cityName }) {
  if (!city?.id) return null;

  return (
    <div id="home-path-expert" className={`${EXPERT_BLOCK_SHELL} scroll-mt-28`}>
      <HomeSectionHeader
        icon={SparklesIcon}
        title={EXPERT_COMMUNITY_HEADER.title}
        description={EXPERT_COMMUNITY_HEADER.description}
      />

      <HomeLatestExperts city={city} embedded />
      <div className="relative">
        <LatestExpertsIllustration />
        <HomeExpertSignupCta cityName={cityName} embedded />
      </div>
    </div>
  );
}
