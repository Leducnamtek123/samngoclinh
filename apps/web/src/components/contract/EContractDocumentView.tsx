type EContractDocumentViewProps = {
  contract: any;
};

export const EContractDocumentView = ({ contract }: EContractDocumentViewProps) => {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-4 max-h-80 overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed font-normal shadow-inner">
      <h4 className="font-extrabold text-slate-900 text-center uppercase tracking-wide text-sm sm:text-base pb-2 border-b border-slate-200">
        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />
        <span className="text-xs font-bold text-slate-600 uppercase">Độc lập - Tự do - Hạnh phúc</span>
      </h4>

      <div className="text-center font-bold text-slate-900 py-2">
        HỢP ĐỒNG ĐẦU TƯ & ỦY QUYỀN CHĂM SÓC SÂM NGỌC LINH<br />
        <span className="text-xs text-slate-500 font-normal">Mã số: {contract.code || contract.id}</span>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-slate-900">BÊN A (BÊN ỦY THÁC / NHÀ ĐẦU TƯ):</p>
        <p>Họ tên: <span className="font-bold text-slate-900">{contract.userName || contract.user?.name || 'Nhà Đầu Tư'}</span></p>
        <p>Số CMND/CCCD: <span className="font-bold text-slate-900">{contract.userIdentityNumber || 'Đã xác minh'}</span></p>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-slate-900">BÊN B (BÊN NHẬN ỦY THÁC & CHĂM SÓC):</p>
        <p>Đơn vị: Công Ty Cổ Phần Rượu Sâm Ngọc Linh</p>
        <p>Địa chỉ vườn sâm: Vườn sâm Trà Linh, Huyện Nam Trà My / Kon Tum</p>
      </div>

      <div className="space-y-2 border-t border-slate-200 pt-3">
        <p className="font-bold text-slate-900">ĐIỀU 1: NỘI DUNG HỢP ĐỒNG</p>
        <p>
          Bên A ủy quyền cho Bên B thực hiện toàn bộ quy trình chăm sóc, bảo vệ và thu hoạch cây sâm giống theo đúng tiêu chuẩn kỹ thuật hữu cơ sinh thái.
        </p>
        <p className="font-bold text-slate-900 pt-2">ĐIỀU 2: QUYỀN VÀ NGHĨA VỤ</p>
        <p>
          - Bên B cam kết cập nhật nhật ký tăng trưởng định kỳ và đảm bảo quyền lợi thu hoạch sâm thành phẩm cho Bên A theo thời hạn thỏa thuận.
        </p>
        <p>
          - Bên A có quyền theo dõi quá trình phát triển trực tuyến qua hệ thống phần mềm công nghệ.
        </p>
      </div>
    </div>
  );
};
