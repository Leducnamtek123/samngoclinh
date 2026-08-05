import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/libs/ApiClient';

export function useCountryList() {
  return useQuery({
    queryKey: ['country', 'list'],
    queryFn: async () => {
      try {
        const res = await fetchApiClient('/v1/public/country/list');
        return res?.data || res || [];
      } catch (e) {
        console.warn('Failed to fetch country list from API:', e);
        return [
          { alpha2Code: 'VN', name: 'Việt Nam', dialCode: '+84' },
          { alpha2Code: 'US', name: 'Hoa Kỳ', dialCode: '+1' },
        ];
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hr
  });
}
