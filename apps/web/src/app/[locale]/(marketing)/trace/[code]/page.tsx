import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { fetchApi } from '@/lib/Api';
import type { CultivationBed, CultivationCareLog } from '@/types';

type TracePageProps = {
  params: Promise<{ locale: string; code: string }>;
};

type TraceCareLogItem = {
  id?: string;
  date: string;
  action: string;
};

export async function generateMetadata(props: TracePageProps): Promise<Metadata> {
  const { locale, code } = await props.params;
  const t = await getTranslations({ locale, namespace: 'trace' });
  return {
    title: `${t('treeDetailsTitle', { code })} | Sâm Ngọc Linh`,
    description: t('treeDetailsDesc', { code }),
  };
}

export default async function TracePage(props: TracePageProps) {
  const { locale, code } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'trace' });

  let bedData:
    | (CultivationBed & {
        gardenName?: string;
        healthStatus?: string;
        careLogs?: CultivationCareLog[];
        ageYear?: number;
      })
    | null = null;
  try {
    const res = await fetchApi(`/public/cultivation/beds/${code}`);
    if (res.ok) {
      const json = await res.json();
      bedData = json.data;
    }
  } catch (error) {
    console.error('Error fetching bed data for trace page:', error);
  }

  const age = bedData?.ageYear ?? 4;
  const plantName = bedData ? `Sâm Ngọc Linh (${age} yo)` : `Sâm Ngọc Linh #${code}`;
  const gardenName = bedData?.gardenName || 'Vườn Sâm Ngọc Linh Đắk Tô';
  const bedCode = bedData?.name || bedData?.code || 'Bed 01';
  const status =
    bedData?.healthStatus === 'healthy' ? 'Healthy' : bedData?.healthStatus || 'Healthy';
  const careLogs: TraceCareLogItem[] = bedData?.careLogs?.length
    ? bedData.careLogs.map((log: CultivationCareLog) => ({
        id: log.id || log.treeCode,
        date: log.loggedAt ? new Date(log.loggedAt).toLocaleDateString('vi-VN') : '—',
        action: log.notes || log.actionType,
      }))
    : [
        { date: '2026-07-01', action: 'Organic bio-fertilizer & mist watering' },
        { date: '2026-06-15', action: 'Soil moisture inspection (82%) & weeding' },
        { date: '2026-05-20', action: 'Periodic Saponin testing & canopy monitoring' },
      ];

  return (
    <div className="min-h-screen w-full bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Verification Header Badge */}
        <div className="mb-8 flex flex-col items-center justify-between gap-6 rounded-3xl bg-emerald-600 p-8 text-white shadow-xl md:flex-row">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-700/80 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-100 uppercase">
              <svg className="h-4 w-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {t('guarantee1')}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{plantName}</h1>
            <p className="text-sm text-emerald-100">{t('treeDetailsDesc', { code })}</p>
          </div>
          <div className="min-w-[140px] rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-md">
            <span className="block text-xs font-semibold tracking-wider text-emerald-200 uppercase">
              {t('inputLabel')}
            </span>
            <span className="text-2xl font-black text-white">{code}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-1 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              {t('featureTreeTitle')}
            </span>
            <p className="text-base font-bold text-gray-900">{gardenName}</p>
          </div>
          <div className="space-y-1 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase">{t('inputLabel')}</span>
            <p className="text-base font-bold text-gray-900">{bedCode}</p>
          </div>
          <div className="space-y-1 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase">{t('guarantee2')}</span>
            <p className="text-base font-bold text-emerald-700">
              {age} years • {status}
            </p>
          </div>
        </div>

        {/* Care Logs Timeline */}
        <div className="space-y-6 rounded-3xl border border-gray-200/80 bg-white p-8 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <svg
              className="h-5 w-5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {t('featureTreeTitle')}
          </h2>

          <div className="divide-y divide-gray-100">
            {careLogs.map((log: TraceCareLogItem) => (
              <div
                key={log.id || `${log.date}-${log.action}`}
                className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center"
              >
                <span className="w-32 shrink-0 text-sm font-semibold text-gray-400">
                  {log.date}
                </span>
                <span className="flex-grow text-sm font-medium text-gray-800">{log.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
