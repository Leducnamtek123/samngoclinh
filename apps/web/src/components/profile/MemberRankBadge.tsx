'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export type MemberRankType = 'bronze' | 'silver' | 'gold' | 'diamond' | 'vip';

interface RankConfig {
  id: MemberRankType;
  badgePath: string;
  bgGradient: string;
  textColor: string;
  borderColor: string;
}

const RANK_CONFIGS: Record<MemberRankType, RankConfig> = {
  bronze: {
    id: 'bronze',
    badgePath: '/images/ranks/rank-bronze.png',
    bgGradient: 'bg-gradient-to-r from-amber-900/10 via-amber-700/10 to-amber-950/10 dark:from-amber-950/40 dark:to-amber-900/20',
    textColor: 'text-amber-900 dark:text-amber-300',
    borderColor: 'border-amber-700/30 dark:border-amber-700/50',
  },
  silver: {
    id: 'silver',
    badgePath: '/images/ranks/rank-silver.png',
    bgGradient: 'bg-gradient-to-r from-slate-200/50 via-slate-100/50 to-slate-300/30 dark:from-slate-800 dark:to-slate-900',
    textColor: 'text-slate-800 dark:text-slate-200',
    borderColor: 'border-slate-300 dark:border-slate-600',
  },
  gold: {
    id: 'gold',
    badgePath: '/images/ranks/rank-gold.png',
    bgGradient: 'bg-gradient-to-r from-yellow-100/80 via-amber-100/60 to-yellow-200/40 dark:from-yellow-950/50 dark:to-amber-950/30',
    textColor: 'text-amber-950 dark:text-yellow-300',
    borderColor: 'border-yellow-500/40 dark:border-yellow-500/60',
  },
  diamond: {
    id: 'diamond',
    badgePath: '/images/ranks/rank-diamond.png',
    bgGradient: 'bg-gradient-to-r from-sky-100/80 via-cyan-100/60 to-sky-200/40 dark:from-sky-950/50 dark:to-cyan-950/30',
    textColor: 'text-sky-950 dark:text-sky-300',
    borderColor: 'border-sky-400/40 dark:border-sky-400/60',
  },
  vip: {
    id: 'vip',
    badgePath: '/images/ranks/rank-vip.png',
    bgGradient: 'bg-gradient-to-r from-emerald-100/90 via-teal-100/70 to-emerald-200/50 dark:from-emerald-950/60 dark:to-teal-950/40',
    textColor: 'text-emerald-950 dark:text-emerald-300',
    borderColor: 'border-emerald-500/50 dark:border-emerald-400/60',
  },
};

const normalizeRank = (rawRank?: string): MemberRankType => {
  if (!rawRank) return 'bronze';
  const lower = rawRank.toLowerCase().trim();
  if (lower.includes('vip') || lower.includes('tinh hoa') || lower.includes('elite')) return 'vip';
  if (lower.includes('kim cương') || lower.includes('diamond')) return 'diamond';
  if (lower.includes('vàng') || lower.includes('gold')) return 'gold';
  if (lower.includes('bạc') || lower.includes('silver')) return 'silver';
  return 'bronze';
};

type MemberRankBadgeProps = {
  rank?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
};

export const MemberRankBadge: React.FC<MemberRankBadgeProps> = ({
  rank = 'bronze',
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const t = useTranslations('memberRank');
  const rankKey = normalizeRank(rank);
  const config = RANK_CONFIGS[rankKey];

  const getRankLabel = (key: MemberRankType) => {
    switch (key) {
      case 'bronze':
        return t('bronze');
      case 'silver':
        return t('silver');
      case 'gold':
        return t('gold');
      case 'diamond':
        return t('diamond');
      case 'vip':
        return t('vip');
      default:
        return t('bronze');
    }
  };

  const label = getRankLabel(rankKey);

  const imageSizes = {
    sm: { width: 20, height: 20, textClass: 'text-[10px] py-0.5 px-2 gap-1.5' },
    md: { width: 28, height: 28, textClass: 'text-xs py-1 px-2.5 gap-2' },
    lg: { width: 44, height: 44, textClass: 'text-sm py-1.5 px-3.5 gap-2.5' },
  };

  const currentSize = imageSizes[size] || imageSizes.md;

  return (
    <div
      className={`inline-flex items-center rounded-full border shadow-2xs font-extrabold transition-transform hover:scale-105 ${config.bgGradient} ${config.textColor} ${config.borderColor} ${currentSize.textClass} ${className}`}
    >
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src={config.badgePath}
          alt={label}
          width={currentSize.width}
          height={currentSize.height}
          className="object-contain drop-shadow-xs"
        />
      </div>
      {showLabel && <span className="tracking-wide">{label}</span>}
    </div>
  );
};
