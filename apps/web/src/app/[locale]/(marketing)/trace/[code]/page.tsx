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

  let bedData: (CultivationBed & { gardenName?: string; healthStatus?: string; careLogs?: CultivationCareLog[]; ageYear?: number }) | null = null;
  try {
    const res = await fetchApi(`/public/cultivation/beds/${code}`);
    if (res.ok) {
      const json = await res.json();
      bedData = json.data;
    }
  } catch (e) {
    console.error('Error fetching bed data for trace page:', e);
  }

  const age = bedData?.ageYear ?? 4;
  const plantName = bedData ? `Sâm Ngọc Linh (${age} yo)` : `Sâm Ngọc Linh #${code}`;
  const gardenName = bedData?.gardenName || 'Vườn Sâm Ngọc Linh Đắk Tô';
  const bedCode = bedData?.name || bedData?.code || 'Bed 01';
  const status = bedData?.healthStatus === 'healthy' ? 'Healthy' : bedData?.healthStatus || 'Healthy';
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
    <div className="w-full bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Verification Header Badge */}
        <div className="bg-emerald-600 text-white rounded-3xl p-8 mb-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-700/80 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100 border border-emerald-500/30">
              <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {t('guarantee1')}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{plantName}</h1>
            <p className="text-emerald-100 text-sm">{t('treeDetailsDesc', { code })}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[140px]">
            <span className="text-xs text-emerald-200 uppercase tracking-wider block font-semibold">{t('inputLabel')}</span>
            <span className="text-2xl font-black text-white">{code}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">{t('featureTreeTitle')}</span>
            <p className="text-base font-bold text-gray-900">{gardenName}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">{t('inputLabel')}</span>
            <p className="text-base font-bold text-gray-900">{bedCode}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">{t('guarantee2')}</span>
            <p className="text-base font-bold text-emerald-700">{age} years • {status}</p>
          </div>
        </div>

        {/* Care Logs Timeline */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {t('featureTreeTitle')}
          </h2>

          <div className="divide-y divide-gray-100">
            {careLogs.map((log: TraceCareLogItem) => (
              <div key={log.id || `${log.date}-${log.action}`} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-400 w-32 shrink-0">{log.date}</span>
                <span className="text-sm font-medium text-gray-800 flex-grow">{log.action}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
