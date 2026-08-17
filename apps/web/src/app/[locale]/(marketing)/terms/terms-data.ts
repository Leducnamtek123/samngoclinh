export interface TermPolicyItem {
  slug: string;
  title: string;
  shortDesc: string;
  lastUpdated: string;
  sections: Array<{
    heading: string;
    content: string[];
    subSections?: Array<{
      title: string;
      items: string[];
    }>;
  }>;
}

export const TERMS_POLICIES_VI: Record<string, TermPolicyItem> = {
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Chính sách bảo mật thông tin',
    shortDesc: 'Quy định về thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của khách hàng trên hệ thống Sâm Ngọc Linh.',
    lastUpdated: '15/08/2026',
    sections: [
      {
        heading: 'I. MỤC ĐÍCH VÀ PHẠM VI THU THẬP THÔNG TIN',
        content: [
          'Việc thu thập dữ liệu trên website Sâm Ngọc Linh (samngoclinh.vn) bao gồm: họ và tên, địa chỉ email, số điện thoại, địa chỉ nhận hàng, thông tin định danh eKYC (đối với khách hàng ký kết hợp đồng sở hữu cây sâm).',
          'Đây là các thông tin bắt buộc mà khách hàng cần cung cấp khi đăng ký tài khoản, đặt mua sản phẩm rượu sâm, cây sâm giống hoặc sử dụng dịch vụ ký gửi chăm sóc cây sâm.',
          'Khách hàng có trách nhiệm tự bảo mật và lưu giữ mọi hoạt động sử dụng dịch vụ dưới tên đăng ký, mật khẩu và hộp thư điện tử của mình.',
        ],
      },
      {
        heading: 'II. PHẠM VI SỬ DỤNG THÔNG TIN',
        content: [
          'Hệ thống Sâm Ngọc Linh sử dụng thông tin khách hàng cung cấp nhằm mục đích:',
          '1. Cung cấp và xử lý đơn đặt hàng, giao nhận rượu sâm và chế phẩm sâm đến địa chỉ khách hàng yêu cầu.',
          '2. Quản lý hồ sơ sở hữu cây sâm, xuất hợp đồng điện tử có chữ ký số và hỗ trợ định danh tài sản nông nghiệp số.',
          '3. Gửi thông báo về tình trạng sinh trưởng, nhật ký chăm sóc, hình ảnh camera định kỳ của cây sâm tại nông trại.',
          '4. Gửi thông báo tiếp thị, chương trình ưu đãi đặc quyền khi có sự đồng ý của khách hàng.',
          '5. Ngăn ngừa các hoạt động phá hoại, gian lận tài khoản hoặc chiếm đoạt thông tin người dùng.',
        ],
      },
      {
        heading: 'III. THỜI GIAN LƯU TRỮ THÔNG TIN',
        content: [
          'Dữ liệu cá nhân của khách hàng sẽ được lưu trữ an toàn trên hệ thống máy chủ của chúng tôi cho đến khi có yêu cầu hủy bỏ hoặc tự khách hàng đăng nhập thực hiện hủy bỏ.',
          'Đối với dữ liệu hợp đồng điện tử và nhật ký giao dịch, thông tin sẽ được lưu trữ theo quy định của Luật Giao dịch điện tử và Luật Kế toán Việt Nam.',
        ],
      },
      {
        heading: 'IV. NHỮNG NGƯỜI HOẶC TỔ CHỨC CÓ THỂ ĐƯỢC TIẾP CẬN THÔNG TIN',
        content: [
          'Chúng tôi cam kết không bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào khác ngoài các trường hợp sau:',
          '1. Các đơn vị vận chuyển đối tác (Viettel Post, GHTK...) để thực hiện giao nhận đơn hàng.',
          '2. Đơn vị cung cấp cổng thanh toán trực tuyến bảo mật được Ngân hàng Nhà nước cấp phép.',
          '3. Các cơ quan quản lý Nhà nước có thẩm quyền khi có yêu cầu bằng văn bản theo đúng quy định pháp luật.',
        ],
      },
      {
        heading: 'V. ĐỊA CHỈ CỦA ĐƠN VỊ THU THẬP VÀ QUẢN LÝ DỮ LIỆU',
        content: [
          '• Tên đơn vị: CÔNG TY CỔ PHẦN SÂM NGỌC LINH',
          '• Địa chỉ trụ sở: Xã Trà Linh, Huyện Nam Trà My, Tỉnh Quảng Nam, Việt Nam',
          '• Chi nhánh đại diện: TP. Đà Nẵng & TP. Hồ Chí Minh',
          '• Hotline hỗ trợ 24/7: 0967 234 234',
          '• Email liên hệ: hotro@samngoclinh.vn / admin@samngoclinh.vn',
        ],
      },
      {
        heading: 'VI. PHƯƠNG THỨC TIẾP CẬN VÀ CHỈNH SỬA DỮ LIỆU CÁ NHÂN',
        content: [
          'Khách hàng có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách đăng nhập vào tài khoản trên website samngoclinh.vn và chọn mục "Hồ sơ cá nhân".',
          'Khách hàng có quyền gửi khiếu nại về việc lộ thông tin cá nhân cho bên thứ ba đến Ban quản trị website qua email hotro@samngoclinh.vn hoặc hotline 0967 234 234 để được xử lý ngay lập tức.',
        ],
      },
      {
        heading: 'VII. CAM KẾT BẢO MẬT DỮ LIỆU CÁ NHÂN KHÁCH HÀNG',
        content: [
          'Thông tin cá nhân của khách hàng trên website được bảo mật tuyệt đối theo chính sách bảo vệ thông tin cá nhân và tuân thủ Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân.',
          'Hệ thống áp dụng chuẩn mã hóa SSL 256-bit toàn trình, tường lửa bảo vệ nhiều lớp và kiểm toán an ninh định kỳ nhằm đảm bảo an toàn tuyệt đối trước mọi nguy cơ xâm nhập trái phép.',
        ],
      },
    ],
  },
  'shipping-policy': {
    slug: 'shipping-policy',
    title: 'Chính sách vận chuyển & Giao nhận',
    shortDesc: 'Quy định chi tiết về phương thức giao hàng, thời gian vận chuyển và quy trình bảo quản đặc biệt đối với Sâm Ngọc Linh.',
    lastUpdated: '15/08/2026',
    sections: [
      {
        heading: 'I. CÁC PHƯƠNG THỨC GIAO NHẬN HÀNG HÓA',
        content: [
          '1. Mua và nhận hàng trực tiếp: Quý khách hàng có thể đến tham quan, mua hàng và nhận sản phẩm trực tiếp tại các Showroom chính thức hoặc Nông trại Sâm Ngọc Linh tại Nam Trà My, Quảng Nam.',
          '2. Giao hàng tận nơi toàn quốc: Áp dụng cho các sản phẩm Rượu Sâm Ngọc Linh, sâm tươi, củ sâm khô, trà sâm và chế phẩm bảo vệ sức khỏe qua các đơn vị chuyển phát nhanh chuyên nghiệp (Viettel Post, GHTK, EMS).',
          '3. Bàn giao số hóa & Ký gửi tại vườn: Đối với gói mua cây sâm giống và hợp đồng ký gửi chăm sóc, cây sâm được kích hoạt định danh điện tử, gắn mã chip QR bất biến và giao nhận quyền quản lý qua ứng dụng/website.',
        ],
      },
      {
        heading: 'II. THỜI GIAN GIAO HÀNG DỰ KIẾN',
        content: [
          '• Khu vực Nội thành Đà Nẵng, Quảng Nam: Giao hàng hỏa tốc trong vòng 2 – 4 giờ hoặc trong ngày.',
          '• Khu vực TP. Hồ Chí Minh & TP. Hà Nội: 1 – 2 ngày làm việc (chuyển phát đường bay).',
          '• Các Tỉnh, Thành phố khác: 2 – 4 ngày làm việc tùy thuộc vào tuyến huyện xã.',
          'Lưu ý: Đối với đơn hàng Củ Sâm Tươi, sản phẩm được thu hoạch trực tiếp từ vườn, đóng gói kèm rêu rừng giữ ẩm trong thùng xốp chuyên dụng và vận chuyển bằng đường hàng không hỏa tốc để đảm bảo hàm lượng Saponin và độ tươi nguyên 100%.',
        ],
      },
      {
        heading: 'III. BIỂU PHÍ VẬN CHUYỂN',
        content: [
          '• Miễn phí vận chuyển (FreeShip) toàn quốc cho các đơn hàng Rượu Sâm Ngọc Linh có giá trị từ 1.000.000 VNĐ trở lên hoặc đơn hàng theo chương trình khuyến mãi hiện hành.',
          '• Đối với các đơn hàng dưới mức miễn phí, cước vận chuyển sẽ được tính tự động theo biểu phí của đơn vị vận chuyển tại bước thanh toán.',
          '• Tất cả các kiện hàng đều được Sâm Ngọc Linh mua bảo hiểm hàng hóa giá trị cao 100%. Mọi tổn thất do rơi vỡ, thất lạc trong quá trình vận chuyển đều được chúng tôi bồi hoàn sản phẩm mới ngay lập tức.',
        ],
      },
    ],
  },
  'inspection-policy': {
    slug: 'inspection-policy',
    title: 'Chính sách kiểm hàng & Đồng kiểm',
    shortDesc: 'Quy định quyền đồng kiểm hàng hóa khi nhận hàng nhằm bảo vệ quyền lợi tối đa của khách hàng.',
    lastUpdated: '15/08/2026',
    sections: [
      {
        heading: '1. ĐỊNH NGHĨA VÀ QUYỀN ĐỒNG KIỂM',
        content: [
          'Kiểm hàng (đồng kiểm) là quá trình nhân viên giao hàng và khách hàng cùng mở kiện hàng để kiểm tra và đối chiếu các sản phẩm thực tế nhận được so với đơn hàng đã đặt trên hệ thống samngoclinh.vn.',
          '100% khách hàng khi mua sắm tại Sâm Ngọc Linh đều ĐƯỢC QUYỀN ĐỒNG KIỂM trước khi nhận hàng và thanh toán tiền (áp dụng cho cả đơn thanh toán COD lẫn đơn đã thanh toán trước).',
        ],
      },
      {
        heading: '2. PHẠM VI VÀ NỘI DUNG KIỂM TRA',
        content: [
          'Khi đồng kiểm cùng nhân viên giao vận, quý khách vui lòng kiểm tra các tiêu chí sau:',
          '• Kiểm tra tính nguyên vẹn của thùng carton bên ngoài: không rách nát, móp méo nặng, ướt sũng hay có dấu hiệu bị cạy mở trước đó.',
          '• Kiểm tra số lượng sản phẩm, chủng loại chai rượu sâm, củ sâm hoặc chế phẩm sâm theo phiếu xuất kho đính kèm.',
          '• Kiểm tra tem niêm phong, tem chống hàng giả điện tử và mã QR truy xuất nguồn gốc trên từng hộp sản phẩm.',
          'Lưu ý: Việc kiểm hàng không bao gồm mở nắp niêm phong chai rượu, không bóc tem chân không hoặc dùng thử sản phẩm.',
        ],
      },
      {
        heading: '3. QUY TRÌNH XỬ LÝ KHI PHÁT HIỆN SỰ CỐ ĐỒNG KIỂM',
        content: [
          'Nếu khi mở kiện hàng phát hiện sản phẩm bị vỡ nát, chảy rượu, thiếu hàng hoặc sai sản phẩm so với đơn đặt hàng:',
          '1. Quý khách vui lòng từ chối nhận hàng và yêu cầu nhân viên giao vận lập "Biên bản đồng kiểm" ghi rõ lý do từ chối.',
          '2. Chụp ảnh/quay video hiện trạng kiện hàng và biên bản đồng kiểm.',
          '3. Liên hệ ngay đường dây nóng: 0967 234 234 để bộ phận CSKH lập đơn giao bù sản phẩm mới nguyên vẹn trong thời gian sớm nhất.',
        ],
      },
    ],
  },
  'payment-policy': {
    slug: 'payment-policy',
    title: 'Chính sách thanh toán',
    shortDesc: 'Hướng dẫn các phương thức thanh toán an toàn, minh bạch và quy trình xuất hóa đơn GTGT điện tử.',
    lastUpdated: '15/08/2026',
    sections: [
      {
        heading: 'I. PHƯƠNG THỨC THANH TOÁN TIỀN MẶT (COD)',
        content: [
          'Quý khách thanh toán tiền mặt trực tiếp cho nhân viên giao hàng ngay sau khi nhận kiện hàng và hoàn tất đồng kiểm theo chính sách.',
          'Áp dụng cho mọi đơn hàng vật lý giao nhận trên toàn lãnh thổ Việt Nam.',
        ],
      },
      {
        heading: 'II. PHƯƠNG THỨC CHUYỂN KHOẢN NGÂN HÀNG (VIETQR)',
        content: [
          'Quý khách có thể quét mã VietQR tự động hoặc chuyển khoản trực tiếp vào tài khoản ngân hàng chính thức của Công ty:',
          '• Tên tài khoản: CÔNG TY CỔ PHẦN SÂM NGỌC LINH',
          '• Số tài khoản: 0967234234',
          '• Ngân hàng: Ngân hàng TMCP Quân Đội (MB Bank) - CN Đà Nẵng',
          '• Cú pháp chuyển khoản: [Mã đơn hàng] - [Số điện thoại]',
          'Hệ thống tự động đối soát và kích hoạt trạng thái đơn hàng "Đã thanh toán" trong vòng 1-3 phút.',
        ],
      },
      {
        heading: 'III. THANH TOÁN TRỰC TUYẾN QUA THẺ / VÍ ĐIỆN TỬ',
        content: [
          'Hỗ trợ thanh toán bảo mật qua Thẻ ATM nội địa (Napas), Thẻ tín dụng quốc tế (Visa, MasterCard, JCB) và các ví điện tử hàng đầu.',
          'Toàn bộ quy trình thanh toán được mã hóa chuẩn bảo mật quốc tế PCI DSS, cam kết không lưu giữ thông tin thẻ ngân hàng của khách hàng.',
        ],
      },
      {
        heading: 'IV. CHÍNH SÁCH XUẤT HÓA ĐƠN ĐIỆN TỬ (VAT)',
        content: [
          '100% sản phẩm và hợp đồng dịch vụ tại Sâm Ngọc Linh đều được xuất hóa đơn GTGT điện tử hợp pháp.',
          'Quý khách có nhu cầu xuất hóa đơn doanh nghiệp vui lòng tích chọn "Xuất hóa đơn VAT" và điền đầy đủ Tên công ty, Mã số thuế, Địa chỉ tại trang Thanh toán. Hóa đơn sẽ được gửi tự động qua email trong vòng 24 giờ sau khi đơn hàng hoàn tất.',
        ],
      },
    ],
  },
  'return-policy': {
    slug: 'return-policy',
    title: 'Chính sách đổi trả & Hoàn tiền',
    shortDesc: 'Cam kết bảo vệ quyền lợi tối thượng của khách hàng với chính sách đổi trả minh bạch và bồi thường chất lượng chuẩn Gen.',
    lastUpdated: '15/08/2026',
    sections: [
      {
        heading: '1. ĐIỀU KIỆN TIẾP NHẬN ĐỔI TRẢ',
        content: [
          '1.1 Đổi trả ngay khi nhận hàng: Quý khách phát hiện kiện hàng có dấu hiệu móp méo, vỡ chai rượu, rách niêm phong hoặc giao không đúng chủng loại, số lượng đã đặt.',
          '1.2 Đổi trả trong vòng 07 ngày kể từ ngày nhận hàng: Sản phẩm còn nguyên vẹn tem niêm phong, bao bì hộp quà tặng không bị rách nát, phát sinh lỗi kỹ thuật do nhà sản xuất (hở nắp, cặn bất thường không thuộc đặc tính tự nhiên của sâm).',
          '1.3 Cam kết đặc biệt về Chuẩn Gen Sâm Ngọc Linh: Chúng tôi bồi hoàn 200% giá trị đơn hàng nếu phát hiện sản phẩm không đúng nguồn gốc giống Sâm Ngọc Linh (Panax vietnamensis Ha et Grushv.) được kiểm định.',
        ],
      },
      {
        heading: '2. CÁC TRƯỜNG HỢP KHÔNG ÁP DỤNG ĐỔI TRẢ',
        content: [
          '• Sản phẩm đã bị bóc tem niêm phong, đã qua sử dụng (trừ trường hợp kiểm định chất lượng có biên bản từ cơ quan chức năng).',
          '• Sản phẩm bị hư hỏng, ẩm mốc, biến chất do khách hàng bảo quản không đúng theo hướng dẫn (để nơi nhiệt độ cao, ánh nắng trực tiếp...).',
          '• Quá thời hạn 07 ngày kể từ ngày quý khách nhận hàng thành công.',
        ],
      },
      {
        heading: '3. QUY TRÌNH VÀ THỜI GIAN HOÀN TIỀN',
        content: [
          'Bước 1: Khách hàng liên hệ hotline 0967 234 234 hoặc gửi email tới hotro@samngoclinh.vn kèm hình ảnh/video sản phẩm cần đổi trả.',
          'Bước 2: Bộ phận CSKH tiếp nhận, xác minh tình trạng đơn hàng trong vòng 24 giờ.',
          'Bước 3: Đơn vị vận chuyển sẽ đến tận nhà quý khách để thu hồi sản phẩm hoàn toàn miễn phí.',
          'Bước 4: Sâm Ngọc Linh gửi sản phẩm thay thế mới hoặc hoàn lại 100% tiền qua tài khoản ngân hàng của quý khách trong vòng 3 – 5 ngày làm việc.',
        ],
      },
    ],
  },
};

export const TERMS_POLICIES_EN: Record<string, TermPolicyItem> = {
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    shortDesc: 'Regulations on collecting, using, storing and protecting personal data on the Ngoc Linh Ginseng system.',
    lastUpdated: '15/08/2026',
    sections: [
      {
        heading: 'I. PURPOSE AND SCOPE OF DATA COLLECTION',
        content: [
          'Data collection on the Ngoc Linh Ginseng platform includes: full name, email address, phone number, shipping address, and eKYC verification information for tree ownership contracts.',
          'This is required information when registering an account, purchasing products, or using digital ginseng care services.',
          'Users are responsible for safeguarding their account credentials, passwords, and registered email inbox.',
        ],
      },
      {
        heading: 'II. SCOPE OF INFORMATION USAGE',
        content: [
          'We use the collected information for: 1. Processing orders and delivering authentic ginseng products; 2. Managing tree ownership records and issuing digital signature contracts; 3. Sending growth tracking updates and farm camera feeds; 4. Preventing fraudulent activities and securing user accounts.',
        ],
      },
      {
        heading: 'III. SECURITY COMMITMENT',
        content: [
          'Customer personal data is strictly protected under 256-bit SSL encryption, multi-layered firewalls, and regular security audits.',
        ],
      },
    ],
  },
  'shipping-policy': {
    slug: 'shipping-policy',
    title: 'Shipping & Delivery Policy',
    shortDesc: 'Detailed terms on shipping methods, delivery timeframes, and dedicated packaging for Ngoc Linh Ginseng.',
    lastUpdated: '15/08/2026',
    sections: [
      {
        heading: 'I. DELIVERY METHODS',
        content: [
          '1. Direct pickup at our official showrooms or farms in Nam Tra My, Quang Nam.',
          '2. Nationwide expedited shipping with 100% transit insurance.',
          '3. Digital transfer & Farm custody for tree ownership contracts.',
        ],
      },
      {
        heading: 'II. ESTIMATED TIMEFRAMES',
        content: [
          '• Express local delivery: within 2 - 4 hours.',
          '• Major cities: 1 - 2 business days via air freight.',
          '• Other provinces: 2 - 4 business days.',
        ],
      },
    ],
  },
  'inspection-policy': {
    slug: 'inspection-policy',
    title: 'Inspection Policy',
    shortDesc: '100% right of visual inspection before receiving and completing payment.',
    lastUpdated: '15/08/2026',
    sections: [
      {
        heading: 'I. RIGHT OF INSPECTION',
        content: [
          'All customers have the right to co-inspect the package integrity, seal stickers, and QR traceability codes upon delivery.',
        ],
      },
    ],
  },
  'payment-policy': {
    slug: 'payment-policy',
    title: 'Payment Policy',
    shortDesc: 'Guidelines on payment methods, secure processing, and electronic VAT invoicing.',
    lastUpdated: '15/08/2026',
    sections: [
      {
        heading: 'I. ACCEPTED PAYMENT METHODS',
        content: [
          '1. Cash on Delivery (COD) for physical items.',
          '2. Automatic bank transfer via VietQR.',
          '3. International credit/debit cards (Visa, MasterCard, JCB) via PCI-DSS certified gateways.',
        ],
      },
    ],
  },
  'return-policy': {
    slug: 'return-policy',
    title: 'Return & Refund Policy',
    shortDesc: '7-day hassle-free return and 200% DNA authenticity guarantee.',
    lastUpdated: '15/08/2026',
    sections: [
      {
        heading: 'I. RETURN CONDITIONS',
        content: [
          '1. Free replacement upon delivery if the package or bottle is damaged.',
          '2. 7-day return window for manufacturing defects with intact seals.',
          '3. 200% refund guarantee if any sample fails authentic Ngoc Linh ginseng DNA verification.',
        ],
      },
    ],
  },
};

export const TERMS_POLICIES = TERMS_POLICIES_VI;

export function getTermsPolicies(locale?: string): Record<string, TermPolicyItem> {
  return locale === 'en' ? TERMS_POLICIES_EN : TERMS_POLICIES_VI;
}
