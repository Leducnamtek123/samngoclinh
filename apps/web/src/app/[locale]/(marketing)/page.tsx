import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/libs/Api';
import { Link } from '@/libs/I18nNavigation';

type IndexPageProps = {
  params: Promise<{ locale: string }>;
};

const plantImages: Record<number, string> = {
  1: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8",
  2: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMm0MsRntVMXJuZkq_isCb_qWD3-uvCuw7p3HKx0E-SWSpRdnCX13R14A5EkaBtLx0vmjYQa9E1AquPBXvMm4zbWQDvVaQQPjjBm16XxTYavFOm4o1KWFxMlGCevWg0QI8T27IldHLjvAOiCs1EeCWCXrhj79MnkffrdbmPfTMyjAjF3Wv0iwhVac1vCXcUBBnMZ7ZMLMT_ih8W6NH1PapFilnZDUzOs5D6CkUAPi6cZLtA3IMEEkn",
  3: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwOfxMRZ0h75uLjdlmrI0cV9AfkTbemFMZbzQV2ml1hDWNs3u8ea5Wg8lEJumqvUILIHEPnHFfJ7g_ZTZgjbWMhtISGs7t2aBscmfqlxKbhMwbdOAQi_bUkAGVIzywaz-aYnTVvFljr1q6oAX62EM_BZ8P8pmSJd-PdVMLjcys1I7HBn8frTYK9sYyfUYntqo0TjDh4ZlKw5ywZaoVtbs1eVRdr7_ydCigwtwc2zB1Yv8P3Pj9FipK",
  5: "https://lh3.googleusercontent.com/aida-public/AB6AXuDN_cdkuLhVIBynCVVMt_jJrNdBpWZYbNfHnstBfzO3ioIdAHBgoHsU6qraZ2PWYHn9lKRrOeWwaqNljZ2SsrLH6dzjOE5qXOJ6lT9c3kNI24Gsy9hnUCZ-6n3HDgEdflTum3apS4ouS0MuMMmaPTTA81qjyXTgwAcs9P1vLAIkWBPILaYvwnRBXDxWPYjz936UCj7XsbrmZeI_O-ityf8kBpVw3vtYPJXOAA8wGyGMzshkAVHLR-Ck"
};

const plantOrigins: Record<number, string> = {
  1: "Nam Trà My",
  2: "Đắk Glei",
  3: "Hợp tác xã",
  5: "Đỉnh Ngọc Linh"
};

const articleImages: Record<string, string> = {
  "bao-chi-noi-ve-iwe-farm": "https://lh3.googleusercontent.com/aida-public/AB6AXuPhqOeKYOiUfS4imUS-mP7FKEt7RyFWA6h9zcMoQCPkFJnLJdwiIPRmHCC0AWYblEuR6d6bJn6CFksSKCYpPd8gxBiVwR7mLUYyf_Z-334b2SiRWzIiROLDGWKHy0Y-QMoeVC3vW_yctMjYkDvyB9u0CqatiK5RbKa5MWzjQGybt5yJe1-N-pBtsudJ0pwoLQW21Htm3nM3YyCwPNapryMZBwK2ysD0btYoDo0SI7FNFytQEBYjz48",
  "cup-vang-nen-tang-nong-nghiep-thong-minh": "https://lh3.googleusercontent.com/aida-public/AB6AXuCl-Y12_9-sl_LoKH5v957vcLQl1qHlS9Qw8nI4p4JSU8pmBS5grM0BwPxcQXJd897ulLd4xTRXTordF5to1prfnIftJnXCfGo1d_GMzB7KvI-wkC913UCQq7guYEY4h7LkSi-OcRbeZKTLEAGJGzukQNOBi1HnF49u7ylb6zt2skbfkynIdB-XEnDOYYJfPM66_qClngJyYNMojwhAFVitXO59xaolyde4U3qMPzd9bjvI5XEzRWN8",
  "faq-sam-ngoc-linh": "https://lh3.googleusercontent.com/aida-public/AB6AXuAKgctCQk83ormjDyhpWu9sYAIM_6IS57FhJMPi2fA9rjI_Cde_N7byQ57Zdetq4xCzaVfYTtxPKXZMlmG3h5szK9ihjXb3jbwpGh6RXboGoYoi0qw-zzNxCBIyfNVfjFXTFCAL1wvxvYK9R9x4W37CuZzdBzvAzaIBgkwSxjfFY5kBT890ek1LzjzHk1rDbid77iCoCoLSdbMJQcno70PjO8lYza338AGHFR_DmJR5mLIHfD9Eubol"
};

const articleCategoryNames: Record<string, string> = {
  "news": "Thị trường",
  "event": "Khoa học",
  "faq": "Kiến thức",
  "investment": "Đầu tư"
};

async function getPlants() {
  try {
    const res = await fetchApi('/public/catalog/plants', {
      cache: 'no-store'
    });
    if (!res.ok) {
      console.error('Failed to fetch plants:', res.statusText);
      return [];
    }
    const json = await res.json();
    return json.data?.items || [];
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
}

async function getArticles() {
  try {
    const res = await fetchApi('/public/content/articles', {
      cache: 'no-store'
    });
    if (!res.ok) {
      console.error('Failed to fetch articles:', res.statusText);
      return [];
    }
    const json = await res.json();
    return json.data?.items || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Rượu Sâm Ngọc Linh | Số Hóa Chuỗi Giá Trị Sâm Ngọc Linh',
    description: 'Ứng dụng tiên phong mua, sở hữu và theo dõi quá trình sinh trưởng của sâm Ngọc Linh thật qua điện thoại.',
  };
}

export default async function Index(props: IndexPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const apiPlants = await getPlants();
  const apiArticles = await getArticles();

  const fallbackPlants = [
    {
      id: "NL-302",
      name: "Ginseng Asset NL-302",
      ageYear: 3,
      price: 15500000,
      code: "NL-D922",
      origin: "Nam Trà My",
      health: "98% Sức khỏe",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8"
    },
    {
      id: "NL-510",
      name: "Ginseng Asset NL-510",
      ageYear: 5,
      price: 42000000,
      code: "NL-D441",
      origin: "Đắk Glei",
      health: "",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMm0MsRntVMXJuZkq_isCb_qWD3-uvCuw7p3HKx0E-SWSpRdnCX13R14A5EkaBtLx0vmjYQa9E1AquPBXvMm4zbWQDvVaQQPjjBm16XxTYavFOm4o1KWFxMlGCevWg0QI8T27IldHLjvAOiCs1EeCWCXrhj79MnkffrdbmPfTMyjAjF3Wv0iwhVac1vCXcUBBnMZ7ZMLMT_ih8W6NH1PapFilnZDUzOs5D6CkUAPi6cZLtA3IMEEkn"
    },
    {
      id: "seedling",
      name: "Combo Seedling Pack",
      ageYear: 0,
      price: 5200000,
      code: "05 Cây",
      origin: "Hợp tác xã",
      health: "",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwOfxMRZ0h75uLjdlmrI0cV9AfkTbemFMZbzQV2ml1hDWNs3u8ea5Wg8lEJumqvUILIHEPnHFfJ7g_ZTZgjbWMhtISGs7t2aBscmfqlxKbhMwbdOAQi_bUkAGVIzywaz-aYnTVvFljr1q6oAX62EM_BZ8P8pmSJd-PdVMLjcys1I7HBn8frTYK9sYyfUYntqo0TjDh4ZlKw5ywZaoVtbs1eVRdr7_ydCigwtwc2zB1Yv8P3Pj9FipK",
      badge: "Mới về"
    },
    {
      id: "imperial",
      name: "Imperial Root Collection",
      ageYear: 10,
      price: 285000000,
      code: "NL-IMP-01",
      origin: "Đỉnh Ngọc Linh",
      health: "",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDN_cdkuLhVIBynCVVMt_jJrNdBpWZYbNfHnstBfzO3ioIdAHBgoHsU6qraZ2PWYHn9lKRrOeWwaqNljZ2SsrLH6dzjOE5qXOJ6lT9c3kNI24Gsy9hnUCZ-6n3HDgEdflTum3apS4ouS0MuMMmaPTTA81qjyXTgwAcs9P1vLAIkWBPILaYvwnRBXDxWPYjz936UCj7XsbrmZeI_O-ityf8kBpVw3vtYPJXOAA8wGyGMzshkAVHLR-Ck",
      badge: "Hiếm"
    }
  ];

  const fallbackArticles = [
    {
      id: "art-1",
      slug: "bao-chi-noi-ve-iwe-farm",
      title: "Sâm Ngọc Linh chính thức được định danh tài sản số trên sàn quốc tế",
      category: "news",
      publishedAt: "20/05/2026",
      summary: "Bước tiến quan trọng giúp nâng tầm giá trị thương hiệu sâm Việt Nam trên bản đồ thảo dược thế giới thông qua nền tảng công nghệ Blockchain...",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuPhqOeKYOiUfS4imUS-mP7FKEt7RyFWA6h9zcMoQCPkFJnLJdwiIPRmHCC0AWYblEuR6d6bJn6CFksSKCYpPd8gxBiVwR7mLUYyf_Z-334b2SiRWzIiROLDGWKHy0Y-QMoeVC3vW_yctMjYkDvyB9u0CqatiK5RbKa5MWzjQGybt5yJe1-N-pBtsudJ0pwoLQW21Htm3nM3YyCwPNapryMZBwK2ysD0btYoDo0SI7FNFytQEBYjz48"
    },
    {
      id: "art-2",
      slug: "cup-vang-nen-tang-nong-nghiep-thong-minh",
      title: "Phát hiện thêm 2 hợp chất Saponin mới trong mẫu sâm 10 năm tuổi",
      category: "event",
      publishedAt: "15/05/2026",
      summary: "Các nhà khoa học tại Viện Nghiên cứu Dược liệu vừa công bố kết quả phân tích định lượng cho thấy hàm lượng dược chất vượt trội trong giống sâm mới...",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl-Y12_9-sl_LoKH5v957vcLQl1qHlS9Qw8nI4p4JSU8pmBS5grM0BwPxcQXJd897ulLd4xTRXTordF5to1prfnIftJnXCfGo1d_GMzB7KvI-wkC913UCQq7guYEY4h7LkSi-OcRbeZKTLEAGJGzukQNOBi1HnF49u7ylb6zt2skbfkynIdB-XEnDOYYJfPM66_qClngJyYNMojwhAFVitXO59xaolyde4U3qMPzd9bjvI5XEzRWN8"
    },
    {
      id: "art-3",
      slug: "faq-sam-ngoc-linh",
      title: "Hướng dẫn tham gia đầu tư vườn sâm kỹ thuật số cho người mới",
      category: "faq",
      publishedAt: "10/05/2026",
      summary: "Làm thế nào để bắt đầu hành trình đầu tư vào \"vàng xanh\" của Việt Nam một cách an toàn và hiệu quả nhất thông qua nền tảng...",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKgctCQk83ormjDyhpWu9sYAIM_6IS57FhJMPi2fA9rjI_Cde_N7byQ57Zdetq4xCzaVfYTtxPKXZMlmG3h5szK9ihjXb3jbwpGh6RXboGoYoi0qw-zzNxCBIyfNVfjFXTFCAL1wvxvYK9R9x4W37CuZzdBzvAzaIBgkwSxjfFY5kBT890ek1LzjzHk1rDbid77iCoCoLSdbMJQcno70PjO8lYza338AGHFR_DmJR5mLIHfD9Eubol"
    }
  ];

  const displayedPlants = apiPlants.length > 0 ? apiPlants.map((item: any) => ({
    id: item.id,
    name: item.name,
    ageYear: item.ageYear,
    price: item.price,
    code: item.id,
    origin: plantOrigins[item.ageYear] || "Hợp tác xã",
    health: item.ageYear === 3 ? "98% Sức khỏe" : "",
    image: plantImages[item.ageYear] || "https://lh3.googleusercontent.com/aida-public/AB6AXuBwOfxMRZ0h75uLjdlmrI0cV9AfkTbemFMZbzQV2ml1hDWNs3u8ea5Wg8lEJumqvUILIHEPnHFfJ7g_ZTZgjbWMhtISGs7t2aBscmfqlxKbhMwbdOAQi_bUkAGVIzywaz-aYnTVvFljr1q6oAX62EM_BZ8P8pmSJd-PdVMLjcys1I7HBn8frTYK9sYyfUYntqo0TjDh4ZlKw5ywZaoVtbs1eVRdr7_ydCigwtwc2zB1Yv8P3Pj9FipK",
    badge: item.ageYear === 1 ? "Mới về" : (item.ageYear === 5 ? "Hiếm" : undefined)
  })) : fallbackPlants;

  const displayedArticles = apiArticles.length > 0 ? apiArticles.map((item: any) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: articleCategoryNames[item.category] || "Tin tức",
    publishedAt: new Date(item.publishedAt).toLocaleDateString('vi-VN'),
    summary: item.summary,
    image: articleImages[item.slug] || "https://lh3.googleusercontent.com/aida-public/AB6AXuPhqOeKYOiUfS4imUS-mP7FKEt7RyFWA6h9zcMoQCPkFJnLJdwiIPRmHCC0AWYblEuR6d6bJn6CFksSKCYpPd8gxBiVwR7mLUYyf_Z-334b2SiRWzIiROLDGWKHy0Y-QMoeVC3vW_yctMjYkDvyB9u0CqatiK5RbKa5MWzjQGybt5yJe1-N-pBtsudJ0pwoLQW21Htm3nM3YyCwPNapryMZBwK2ysD0btYoDo0SI7FNFytQEBYjz48"
  })) : fallbackArticles;


  return (
    <div className="w-full bg-brand-bg text-gray-800">
      {/* Hero Banner Section */}
      <section className="relative w-full bg-[#1C3F24] overflow-hidden py-16 sm:py-24 border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-8 text-white">
              <div className="inline-flex items-center gap-2 bg-secondary/15 text-secondary border border-secondary/30 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V9m0 0a4 4 0 10-8 0m8 0a4 4 0 118 0M7 21h10" />
                </svg>
                Sâm Ngọc Linh Kỹ Thuật Số
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display-lg text-white leading-tight">
                  Rượu Sâm Ngọc Linh
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 max-w-xl font-medium leading-relaxed">
                  Khám phá các sản phẩm và bắt đầu phát triển hoạt động đầu tư số hóa của bạn.
                </p>
              </div>

              {/* Contact Information */}
              <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-300 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Số điện thoại</p>
                    <p className="font-semibold text-white">0847 234 234</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-semibold text-white">admin@ruousamngoclinh.vn</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/trading-floor" className="bg-secondary text-white hover:bg-secondary-hover px-8 py-4 rounded-lg font-bold transition-all shadow-lg shadow-secondary/20 block text-center">
                  Khám phá Marketplace
                </Link>
                <Link href="/profile?tabs=assets" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-lg font-bold transition-all block text-center">
                  Xem Vườn Của Tôi
                </Link>
              </div>
            </div>

            {/* Right Graphic Column */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full overflow-hidden border-8 border-white/10 shadow-2xl flex items-center justify-center bg-white">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMsiW4ViCyUtMk4AfTXxRrJiQcT8tKQAUyVZSXqxfcf1L9lTee9CFuEtFGMMjXYCiQ171omUJD_nKj17QENbeUhZY9asWGZwU2oUtaEVYL2WrPG-leo-Rl4Z4xzRajZWEEFUdZuNQ-Oabmc8mly-VTAvsgCjL5V8dXv3dSEEgjgGwV9kzzLxA9nRYYRqkuY1002C6NkxdMXfId3twLyXv07FUV5yuZvj7I3k8B5ftQ2qY81eNSId_e" 
                  alt="Sâm Ngọc Linh" 
                />
              </div>
              {/* Floating Accent */}
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl bg-white hidden sm:block">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMm0MsRntVMXJuZkq_isCb_qWD3-uvCuw7p3HKx0E-SWSpRdnCX13R14A5EkaBtLx0vmjYQa9E1AquPBXvMm4zbWQDvVaQQPjjBm16XxTYavFOm4o1KWFxMlGCevWg0QI8T27IldHLjvAOiCs1EeCWCXrhj79MnkffrdbmPfTMyjAjF3Wv0iwhVac1vCXcUBBnMZ7ZMLMT_ih8W6NH1PapFilnZDUzOs5D6CkUAPi6cZLtA3IMEEkn" 
                  alt="Sâm non" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Company Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-secondary font-bold tracking-widest uppercase text-xs block">
            Giới thiệu về công ty
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-primary font-display-lg">
            Rượu Sâm Ngọc Linh
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-body-md max-w-2xl mx-auto">
            Rượu Sâm Ngọc Linh là ứng dụng đầu tiên tại Việt Nam cho phép bạn mua - sở hữu - chăm sóc và theo dõi sản phẩm Rượu Sâm Ngọc Linh thật chỉ bằng điện thoại.
          </p>
          <div className="w-16 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Digital Plant Catalog */}
      <section id="shop" className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-gray-200 pb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-primary font-display-lg">
              Cây Giống Digital
            </h2>
            <p className="text-gray-500 text-sm">
              Sở hữu và theo dõi quá trình sinh trưởng của cây sâm thật thông qua định danh số.
            </p>
          </div>
          <button className="text-primary hover:text-secondary font-semibold text-sm flex items-center gap-1.5 transition-colors">
            Xem tất cả cây giống ➜
          </button>
        </div>

        {/* Plant Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedPlants.map((item: any) => (
            <div key={item.id} className="group border border-gray-200/80 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white flex flex-col justify-between">
              <div>
                <div className="relative h-56 overflow-hidden bg-gray-50">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                    src={item.image} 
                    alt={item.name} 
                  />
                  <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">
                    Tuổi: {item.ageYear > 0 ? `${item.ageYear} Năm` : "Mầm"}
                  </div>
                  {item.badge && (
                    <div className="absolute top-3 right-3 bg-secondary text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">
                      {item.badge}
                    </div>
                  )}
                  {item.health && (
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 border border-gray-100">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span className="text-[11px] font-bold text-gray-800">{item.health}</span>
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-lg text-primary">{item.name}</h3>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Mã số: {item.code}</span>
                    <span className="font-semibold text-primary">{item.origin}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Giá đầu tư</p>
                    <p className="font-bold text-primary text-base">{item.price.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <button className="p-2.5 bg-primary/5 hover:bg-primary hover:text-white text-primary rounded-lg transition-all duration-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Botanical Extract Products */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl relative z-10 border border-gray-200 bg-white">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLuXy8pynMd9n3uXsIueZ4qIRS2WNO0S4OEociDUZ_OyEZNaaqmMzxQ2xn2TO1IzDsBxZez1hYYesLk5evUcf75DHGB6J89oP-T8CWiodimudqIPHhntR8tHXqs3WDjqTYLhivQBhpgoPMxRa-FwV3P9s54pTKKTQfO9M8wIlID3bDRQm0izlE87wrSRO5ngMAFxl77dCeBDEM9rDTRosaAxQgqmOSHb2J34UZsKnm8kBXTD-zhLyW" 
                  alt="Tinh hoa Sâm Ngọc Linh" 
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary rounded-2xl -z-10 opacity-5"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-secondary/20 rounded-2xl -z-10"></div>
            </div>
            
            <div className="space-y-6">
              <span className="text-secondary font-bold tracking-wider uppercase text-xs">
                Sản phẩm cao cấp
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary leading-tight font-display-lg">
                Tinh hoa dược liệu từ núi rừng Ngọc Linh
              </h2>
              <p className="text-gray-600 leading-relaxed font-body-md">
                Khám phá các dòng sản phẩm chiết xuất từ sâm Ngọc Linh nguyên chất, được chứng thực nguồn gốc qua Blockchain và quy trình sản xuất khép kín đạt chuẩn chất lượng quốc tế.
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm">Chứng thực Blockchain</h4>
                    <p className="text-gray-500 text-xs mt-1">Mỗi sản phẩm đi kèm một mã số định danh duy nhất để truy xuất nguồn gốc tuyệt đối.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm">Hàm lượng Saponin tối đa</h4>
                    <p className="text-gray-500 text-xs mt-1">Công nghệ chiết xuất lạnh giữ trọn vẹn 52 loại saponin tinh túy của sâm Ngọc Linh.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Education Section */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-primary font-display-lg">
            Tin Tức &amp; Kiến Thức
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Cập nhật những chuyển động mới nhất về thị trường sâm Ngọc Linh và công nghệ nông nghiệp số.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedArticles.map((article: any) => (
            <article key={article.id} className="flex flex-col group cursor-pointer space-y-4">
              <div className="h-52 rounded-xl overflow-hidden border border-gray-200">
                <img 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                  src={article.image} 
                  alt={article.title} 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-secondary font-bold uppercase tracking-wider">
                  <span>{article.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{article.publishedAt}</span>
                </div>
                <h3 className="font-bold text-base text-primary group-hover:text-secondary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display-lg text-white">
            Sẵn sàng sở hữu tài sản xanh của riêng bạn?
          </h2>
          <p className="text-gray-300 text-sm max-w-lg mx-auto">
            Gia nhập cộng đồng 5000+ nhà đầu tư đang cùng chúng tôi bảo tồn và phát triển di sản sâm Ngọc Linh.
          </p>
          <div className="pt-4">
            <button className="bg-secondary hover:bg-secondary-hover text-white px-10 py-4 rounded-lg font-bold transition-all shadow-lg shadow-secondary/15">
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
