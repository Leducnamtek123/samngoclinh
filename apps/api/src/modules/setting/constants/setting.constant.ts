/**
 * Giá trị mặc định cho các setting nội dung tĩnh của trang chủ; trả về khi DB chưa có bản ghi,
 * admin có thể ghi đè qua endpoint cập nhật setting. Mỗi value là chuỗi JSON.
 */
export const SettingDefault: Record<string, string> = {
    homeAbout: JSON.stringify({
        description:
            'Ứng dụng iWE FARM ra đời với mục tiêu đưa người tiêu dùng chạm đến cây sâm thật – chuẩn gen – trồng đúng vùng ngay trên điện thoại.',
    }),
    homeContact: JSON.stringify({
        address: '68 Nguyễn Huệ, Phường Sài Gòn, TP Hồ Chí Minh, Việt Nam',
        phone: '0847 234 234',
        email: 'admin@iwefarm.com.vn',
    }),
    homeStats: JSON.stringify([
        {
            icon: 'grid-outline',
            value: '500.000+',
            label: 'Cây Sâm Ngọc Linh chuẩn Gen',
        },
        { icon: 'leaf-outline', value: '60.000 m2+', label: 'Vườn Sâm Ngọc Linh' },
        { icon: 'people-outline', value: '10.000+', label: 'Khách hàng hài lòng' },
        {
            icon: 'ribbon-outline',
            value: '7+',
            label: 'Năm kinh nghiệm trồng Sâm Ngọc Linh',
        },
    ]),
};
