import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from 'pdf-lib';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import fontkit from '@pdf-lib/fontkit';

export interface IEContractPdfItem {
    treeCode: string;
    treeName: string;
    ageYearAtSign: number;
    gardenCode?: string | null;
    bedCode?: string | null;
    unitPrice?: number;
}

export interface IEContractPdfData {
    contractCode: string;
    contractTitle?: string;
    partyA?: string;
    partyB?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerIdentity?: string; // CCCD from eKYC
    treeCode?: string;
    contractValue: number;
    terms?: string;
    content?: string;
    signedAt: string;
    expiredAt: string;
    signatureDataUrl?: string;
    clientIp?: string;
    items?: IEContractPdfItem[];
}

export interface IAmendmentPdfData {
    contractCode: string;
    amendmentCode: string;
    amendmentNumber: number;
    title?: string;
    partyA?: string;
    partyB?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerIdentity?: string;
    previousExpiredAt: string;
    newExpiredAt: string;
    extendedMonths: number;
    amendmentValue: number;
    signedAt: string;
    signatureDataUrl?: string;
    clientIp?: string;
    items?: IEContractPdfItem[];
}

export interface IGeneratedPdfResult {
    pdfBuffer: Buffer;
    documentHash: string;
    qrUrl: string;
}

function sanitizeFallback(str?: string | null): string {
    if (!str) {return '';}
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^\x20-\x7E\n\r\t]/g, '');
}

@Injectable()
export class EContractPdfService {
    private readonly logger = new Logger(EContractPdfService.name);

    constructor(private readonly configService: ConfigService) {}

    async generateSignedContractPdf(data: IEContractPdfData): Promise<IGeneratedPdfResult> {
        const webUrl = this.configService.get<string>('HOME_URL') || 'http://localhost:3002';
        const verifyUrl = `${webUrl}/vi/trace/contract/${encodeURIComponent(data.contractCode)}`;

        // 1. Generate High-Res QR Code PNG
        const qrBuffer = await QRCode.toBuffer(verifyUrl, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 220,
            color: {
                dark: '#064e3b',
                light: '#ffffff',
            },
        });

        // 2. Initialize PDF Document
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);

        // 3. Load TrueType Fonts with Unicode Vietnamese support or fallback
        const { fontRegular, fontBold, fontOblique, isUnicode } = await this.loadFonts(pdfDoc);

        const safe = (text?: string | null): string => {
            if (!text) {return '';}
            return isUnicode ? text : sanitizeFallback(text);
        };

        const qrImage = await pdfDoc.embedPng(qrBuffer);

        // Palette Tokens
        const cEmeraldDark = rgb(0.02, 0.31, 0.23);    // #064e3b
        const cEmeraldMid = rgb(0.04, 0.45, 0.28);     // #059669
        const cEmeraldLight = rgb(0.94, 0.98, 0.95);   // #f0fdf4
        const cGold = rgb(0.75, 0.55, 0.15);           // #d97706
        const cTextMain = rgb(0.08, 0.12, 0.18);       // #0f172a
        const cTextMuted = rgb(0.38, 0.45, 0.55);      // #64748b
        const cCardBorder = rgb(0.85, 0.90, 0.86);     // #dcfce7
        const cRedStamp = rgb(0.85, 0.15, 0.15);       // #dc2626
        const cRedBg = rgb(0.99, 0.94, 0.94);

        const drawBorderAndHeader = (page: PDFPage, pageNum: number, totalPages: number) => {
            const { width, height } = page.getSize();
            // Outer Frame
            page.drawRectangle({
                x: 18,
                y: 18,
                width: width - 36,
                height: height - 36,
                borderColor: cEmeraldDark,
                borderWidth: 1.2,
            });

            // Inner Gold Frame
            page.drawRectangle({
                x: 22,
                y: 22,
                width: width - 44,
                height: height - 44,
                borderColor: cGold,
                borderWidth: 0.6,
            });

            // Corner Marks
            const cornerSize = 8;
            page.drawLine({ start: { x: 26, y: height - 26 }, end: { x: 26 + cornerSize, y: height - 26 }, color: cGold, thickness: 0.8 });
            page.drawLine({ start: { x: 26, y: height - 26 }, end: { x: 26, y: height - 26 - cornerSize }, color: cGold, thickness: 0.8 });
            page.drawLine({ start: { x: width - 26, y: height - 26 }, end: { x: width - 26 - cornerSize, y: height - 26 }, color: cGold, thickness: 0.8 });
            page.drawLine({ start: { x: width - 26, y: height - 26 }, end: { x: width - 26, y: height - 26 - cornerSize }, color: cGold, thickness: 0.8 });
            page.drawLine({ start: { x: 26, y: 26 }, end: { x: 26 + cornerSize, y: 26 }, color: cGold, thickness: 0.8 });
            page.drawLine({ start: { x: 26, y: 26 }, end: { x: 26, y: 26 + cornerSize }, color: cGold, thickness: 0.8 });
            page.drawLine({ start: { x: width - 26, y: 26 }, end: { x: width - 26 - cornerSize, y: 26 }, color: cGold, thickness: 0.8 });
            page.drawLine({ start: { x: width - 26, y: 26 }, end: { x: width - 26, y: 26 + cornerSize }, color: cGold, thickness: 0.8 });

            // National Motto
            const nationalTitle = safe('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM');
            const nationalMotto = safe('Độc lập - Tự do - Hạnh phúc');
            page.drawText(nationalTitle, {
                x: width / 2 - (fontBold.widthOfTextAtSize(nationalTitle, 9.5) / 2),
                y: height - 44,
                size: 9.5,
                font: fontBold,
                color: cTextMain,
            });
            page.drawText(nationalMotto, {
                x: width / 2 - (fontBold.widthOfTextAtSize(nationalMotto, 8.5) / 2),
                y: height - 56,
                size: 8.5,
                font: fontBold,
                color: cTextMain,
            });
            page.drawLine({
                start: { x: width / 2 - 60, y: height - 61 },
                end: { x: width / 2 + 60, y: height - 61 },
                thickness: 0.7,
                color: cGold,
            });

            // Running Page number
            const pageStr = safe(`Trang ${pageNum} / ${totalPages}`);
            page.drawText(pageStr, { x: width - 75, y: 30, size: 7, font: fontBold, color: cEmeraldDark });
        };

        const totalPages = (data.items && data.items.length > 0) ? 4 : 3;

        const drawWrappedText = (page: PDFPage, text: string, startX: number, startY: number, maxLineWidth: number, font: PDFFont, fontSize: number, lineSpacing: number, color: any): number => {
            const words = text.split(' ');
            let line = '';
            let curY = startY;
            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                if (font.widthOfTextAtSize(safe(testLine), fontSize) > maxLineWidth && i > 0) {
                    page.drawText(safe(line.trim()), { x: startX, y: curY, size: fontSize, font: font, color: color });
                    curY -= lineSpacing;
                    line = words[i] + ' ';
                } else { line = testLine; }
            }
            if (line.trim()) {
                page.drawText(safe(line.trim()), { x: startX, y: curY, size: fontSize, font: font, color: color });
                curY -= lineSpacing;
            }
            return curY;
        };

        const page1 = pdfDoc.addPage([595.28, 841.89]);
        const { width, height } = page1.getSize();
        drawBorderAndHeader(page1, 1, totalPages);

        const brandTag = safe('SÂM NGỌC LINH • HỆ THỐNG KÝ SỐ ĐIỆN TỬ SÂM NGỌC LINH');
        page1.drawText(brandTag, { x: width / 2 - (fontBold.widthOfTextAtSize(brandTag, 7.5) / 2), y: height - 74, size: 7.5, font: fontBold, color: cEmeraldMid });
        const docTitle = safe('HỢP ĐỒNG MUA BÁN VÀ KÝ GỬI, CHĂM SÓC CÂY SÂM NGỌC LINH');
        page1.drawText(docTitle, { x: width / 2 - (fontBold.widthOfTextAtSize(docTitle, 10.5) / 2), y: height - 88, size: 10.5, font: fontBold, color: cEmeraldDark });
        const contractCodeClean = safe(data.contractCode.toUpperCase());
        const codeText = safe(`Mã số: HD-${contractCodeClean}/2026/SNL • Chứng thực số điện tử`);
        page1.drawText(codeText, { x: width / 2 - (fontOblique.widthOfTextAtSize(codeText, 7) / 2), y: height - 100, size: 7, font: fontOblique, color: cTextMuted });

        const partyBoxY = height - 110;
        const partyBoxHeight = 84;
        page1.drawRectangle({ x: 35, y: partyBoxY - partyBoxHeight, width: width - 70, height: partyBoxHeight, color: cEmeraldLight, borderColor: cCardBorder, borderWidth: 0.8 });
        page1.drawText(safe('BÊN A (BÊN BÁN VÀ NHẬN KÝ GỬI CHĂM SÓC): CÔNG TY CỔ PHẦN SÂM NGỌC LINH'), { x: 42, y: partyBoxY - 13, size: 7.5, font: fontBold, color: cEmeraldDark });
        page1.drawText(safe('• MST: 4001248522 / 0316913632  |  Đại diện: Trương Nguyên Tiến Trà – Giám đốc'), { x: 42, y: partyBoxY - 23, size: 7, font: fontRegular, color: cTextMain });
        page1.drawText(safe('• Địa chỉ: Thôn 2, Xã Trà Linh, H. Nam Trà My, Kon Tum / Đà Nẵng  |  Hotline: 0967 234 234'), { x: 42, y: partyBoxY - 33, size: 7, font: fontRegular, color: cTextMuted });
        page1.drawLine({ start: { x: 42, y: partyBoxY - 39 }, end: { x: width - 42, y: partyBoxY - 39 }, thickness: 0.5, color: cCardBorder });

        const customerName = safe(data.customerName || data.partyB || 'Khách hàng sở hữu');
        const customerPhone = safe(data.customerPhone || 'Chưa cập nhật');
        const customerEmail = safe(data.customerEmail || 'Chưa cập nhật');
        const ekycTag = data.customerIdentity ? safe(` [✓ CCCD: ${data.customerIdentity}]`) : safe(' [eKYC xác thực]');
        page1.drawText(safe(`BÊN B (BÊN MUA, KHÁCH HÀNG SỞ HỮU): ${customerName}${ekycTag}`), { x: 42, y: partyBoxY - 50, size: 7.5, font: fontBold, color: cEmeraldDark });
        page1.drawText(safe(`• Điện thoại: ${customerPhone}  |  Email: ${customerEmail}`), { x: 42, y: partyBoxY - 60, size: 7, font: fontRegular, color: cTextMain });
        page1.drawText(safe('• Giá trị hợp đồng: ' + (Number(data.contractValue) || 0).toLocaleString('vi-VN') + ' VNĐ  |  Xác thực qua tài khoản Sâm Ngọc Linh'), { x: 42, y: partyBoxY - 70, size: 7, font: fontBold, color: cGold });

        let textY = partyBoxY - partyBoxHeight - 14;
        page1.drawText(safe('Căn cứ Bộ luật Dân sự 2015, Luật Thương mại, Luật Trồng trọt, Luật Giao dịch điện tử 2023 và nhu cầu thỏa thuận của các Bên:'), { x: 38, y: textY, size: 6.8, font: fontOblique, color: cTextMuted });
        textY -= 14;

        const page1Articles = [
            { title: 'ĐIỀU 1. ĐỐI TƯỢNG HỢP ĐỒNG, PHƯƠNG ÁN LỰA CHỌN VÀ QUY ĐỊNH NGUỒN CUNG', content: '1.1. Bên A đồng ý bán và Bên B đồng ý mua số lượng Cây Sâm thuần chủng được nuôi trồng tại Vườn Sâm Ngọc Linh tại Thôn 2, Xã Trà Linh theo đúng quy trình nông nghiệp hữu cơ.\n1.2. Bên B lựa chọn phương án mua và ký gửi lại Vườn Sâm Ngọc Linh để nhờ Bên A hỗ trợ, chăm sóc duy trì hợp đồng. Cây sâm được cấp mã định danh vạch/QR riêng biệt theo dõi trên hệ thống App.' },
            { title: 'ĐIỀU 2. QUY ĐỊNH VỀ HIỂN THỊ THÔNG TIN VÀ TÍNH NĂNG QUẢN LÝ GIAO DỊCH TRÊN APP', content: '2.1. Hiển thị chi tiết hóa đơn bán hàng (VAT), mã định danh riêng của từng cây sâm, số lượng, độ tuổi và nhật ký sinh trưởng định kỳ.\n2.2. Camera giám sát: Khách hàng sở hữu từ 100 cây sâm trở lên được cấp quyền truy cập camera phát sóng trực tiếp 24/7 để quan sát luống sâm thực tế tại vườn.' },
            { title: 'ĐIỀU 3. QUY ĐỊNH VỀ THỜI GIAN CHỜ KỸ THUẬT VÀ TIỀN TỆ GIAO DỊCH', content: '3.1. Thời gian chờ kỹ thuật: Áp dụng thời gian chờ kiểm duyệt kỹ thuật là 01 ngày (24 giờ) trước khi kích hoạt vận hành.\n3.2. Tiền tệ giao dịch: 100% bằng đồng Việt Nam (VNĐ). Tuyệt đối không sử dụng tiền mã hóa, tiền ảo không được NHNN và pháp luật công nhận.' },
            { title: 'ĐIỀU 4. GIÁ MUA BÁN, PHÍ CHĂM SÓC VÀ PHƯƠNG THỨC THANH TOÁN', content: `4.1. Tổng giá trị mua bán cây sâm là: ${(Number(data.contractValue) || 0).toLocaleString('vi-VN')} VNĐ (đã bao gồm thuế VAT).\n4.2. Phí chăm sóc hàng năm được xác nhận qua hóa đơn VAT. Phí chăm sóc các năm tiếp theo được thông báo định kỳ hàng năm dựa trên chi phí thực tế tại Vườn Sâm.` }
        ];

        page1Articles.forEach((art) => {
            page1.drawText(safe(art.title), { x: 38, y: textY, size: 7.5, font: fontBold, color: cEmeraldDark });
            textY -= 10;
            art.content.split('\n').forEach((p) => { textY = drawWrappedText(page1, p, 38, textY, width - 76, fontRegular, 7, 9.5, cTextMain); textY -= 2; });
            textY -= 5;
        });

        const page2 = pdfDoc.addPage([595.28, 841.89]);
        drawBorderAndHeader(page2, 2, totalPages);
        let textY2 = height - 76;

        page2.drawText(safe('ĐIỀU 5. QUY ĐỊNH VỀ BẢO HIỂM CÂY SÂM, BẤT KHẢ KHÁNG VÀ HÌNH THỨC BỒI THƯỜNG'), { x: 38, y: textY2, size: 7.5, font: fontBold, color: cEmeraldDark });
        textY2 -= 10;
        textY2 = drawWrappedText(page2, '5.1. Bất khả kháng: Thiên tai bão lũ, dịch bệnh thực vật bất thường hoặc sự cố khách quan được thương lượng xử lý (>90 ngày).', 38, textY2, width - 76, fontRegular, 7, 9.5, cTextMain);
        textY2 -= 2;
        const box5Y = textY2 - 32;
        page2.drawRectangle({ x: 38, y: box5Y, width: width - 76, height: 32, color: cEmeraldLight, borderColor: cEmeraldMid, borderWidth: 0.8 });
        page2.drawText(safe('5.2. CAM KẾT ĐỀN CỦ, KHÔNG ĐỀN CÂY:'), { x: 44, y: box5Y + 20, size: 7, font: fontBold, color: cEmeraldDark });
        page2.drawText(safe('Đối với cây sâm từ 04 đến 08 tuổi bị thiệt hại do lỗi chăm sóc của nhà vườn, Bên A cam kết bồi thường bằng'), { x: 44, y: box5Y + 10, size: 6.8, font: fontRegular, color: cTextMain });
        page2.drawText(safe('CỦ SÂM THẬT đạt trọng lượng tối thiểu theo quy định tại Phụ lục 01, hoàn toàn không đền bằng cây giống non.'), { x: 44, y: box5Y + 1, size: 6.8, font: fontBold, color: cEmeraldDark });
        textY2 = box5Y - 8;

        page2.drawText(safe('ĐIỀU 6. QUY ĐỊNH THĂM VƯỜN, XÉT NGHIỆM ADN/DNA VÀ BỒI THƯỜNG CHẤT LƯỢNG'), { x: 38, y: textY2, size: 7.5, font: fontBold, color: cEmeraldDark });
        textY2 -= 10;
        textY2 = drawWrappedText(page2, '6.1. Bên B có quyền thăm vườn trực tiếp hoặc yêu cầu video gián tiếp qua App (báo trước 15 ngày).', 38, textY2, width - 76, fontRegular, 7, 9.5, cTextMain);
        textY2 -= 2;
        const box6Y = textY2 - 22;
        page2.drawRectangle({ x: 38, y: box6Y, width: width - 76, height: 22, color: cRedBg, borderColor: cRedStamp, borderWidth: 0.8 });
        page2.drawText(safe('6.2. Trường hợp kết quả kiểm định ADN kết luận không phải Sâm Ngọc Linh thuần chủng, Bên A cam kết'), { x: 44, y: box6Y + 12, size: 6.8, font: fontRegular, color: cTextMain });
        page2.drawText(safe('đền bù gấp 03 (ba) lần toàn bộ số tiền mua sâm cho Bên B.'), { x: 44, y: box6Y + 3, size: 6.8, font: fontBold, color: cRedStamp });
        textY2 = box6Y - 8;

        const remainingArticles = [
            { title: 'ĐIỀU 7. QUY ĐỊNH THU HOẠCH LÁ, HẠT HẰNG NĂM (CÂY TỪ 03 TUỔI TRỞ LÊN)', content: 'Khách hàng được quyền thu hoạch lá và hạt sâm hằng năm theo Gói Tiêu chuẩn hoặc Gói Thương gia gửi hỏa tốc riêng (chi tiết tại Phụ lục 02), hoặc yêu cầu nhà vườn thu mua lại theo giá thị trường tại thời điểm thu hoạch.' },
            { title: 'ĐIỀU 8. QUY ĐỊNH HẾT HẠN, GIA HẠN VÀ XỬ LÝ QUÁ HẠN', content: 'Hệ thống gửi cảnh báo trước 45 ngày hết hạn. Trường hợp sau 60 ngày kể từ ngày thông báo mà khách hàng không gia hạn hoặc mất liên lạc, cây và củ sâm sẽ được chuyển giao vào Quỹ địa phương Xã Trà Linh quản lý.' },
            { title: 'ĐIỀU 9. CAM KẾT TRÁCH NHIỆM CÁC BÊN', content: 'Bên A cam kết nguồn giống thuần chủng 100%, quy trình hữu cơ vi sinh, đạo đức kinh doanh không huy động vốn trái phép. Bên B thực hiện đầy đủ nghĩa vụ thanh toán và cung cấp thông tin định danh chính xác.' },
            { title: 'ĐIỀU 10. CHUYỂN NHƯỢNG, BÁN LẠI, TẶNG CHO TRÊN APP', content: 'Mọi giao dịch chuyển nhượng được thực hiện qua App với biên độ giá khống chế không quá ±10% so với giá niêm yết.' },
            { title: 'ĐIỀU 11. ĐIỀU KHOẢN CHUNG', content: 'Hợp đồng có hiệu lực kể từ ngày ký xác thực điện tử. Mọi tranh chấp được giải quyết tại TAND có thẩm quyền tại TP. Đà Nẵng. Phụ lục 01 và 02 là bộ phận không thể tách rời của Hợp đồng này.' }
        ];

        remainingArticles.forEach((art) => {
            page2.drawText(safe(art.title), { x: 38, y: textY2, size: 7.2, font: fontBold, color: cEmeraldDark });
            textY2 -= 9;
            textY2 = drawWrappedText(page2, art.content, 38, textY2, width - 76, fontRegular, 6.8, 9, cTextMain);
            textY2 -= 4;
        });

        const signSectionY = textY2 - 8;
        page2.drawLine({ start: { x: 38, y: signSectionY + 6 }, end: { x: width - 38, y: signSectionY + 6 }, thickness: 0.8, color: cCardBorder });
        page2.drawText(safe('ĐẠI DIỆN BÊN B'), { x: 60, y: signSectionY - 4, size: 8, font: fontBold, color: cTextMain });
        page2.drawText(safe('(Ký, ghi rõ họ tên và xác thực điện tử)'), { x: 60, y: signSectionY - 13, size: 6.5, font: fontOblique, color: cTextMuted });
        page2.drawText(safe('ĐẠI DIỆN BÊN A'), { x: width - 220, y: signSectionY - 4, size: 8, font: fontBold, color: cTextMain });
        page2.drawText(safe('CÔNG TY CỔ PHẦN SÂM NGỌC LINH'), { x: width - 220, y: signSectionY - 13, size: 6.5, font: fontBold, color: cEmeraldDark });

        let hasEmbeddedSig = false;
        if (data.signatureDataUrl) {
            try {
                let sigImageBytes: Buffer;
                if (data.signatureDataUrl.startsWith('data:image')) {sigImageBytes = Buffer.from(data.signatureDataUrl.split(',')[1], 'base64');}
                else {
                    const axios = (await import('axios')).default;
                    const response = await axios.get(data.signatureDataUrl, { responseType: 'arraybuffer', timeout: 5000 });
                    sigImageBytes = Buffer.from(response.data);
                }
                const sigImage = await (pdfDoc.embedPng(sigImageBytes).catch(() => pdfDoc.embedJpg(sigImageBytes)));
                page2.drawImage(sigImage, { x: 60, y: signSectionY - 56, width: 100, height: 38 });
                hasEmbeddedSig = true;
            } catch (e) { this.logger.warn('Could not embed signature:', e); }
        }

        if (!hasEmbeddedSig) {
            page2.drawRectangle({ x: 55, y: signSectionY - 42, width: 130, height: 20, color: cEmeraldLight, borderColor: cEmeraldMid, borderWidth: 0.6 });
            page2.drawText(safe('[XÁC THỰC ĐIỆN TỬ QUA TÀI KHOẢN]'), { x: 60, y: signSectionY - 34, size: 6.5, font: fontBold, color: cEmeraldDark });
        }

        const signDateStr = new Date(data.signedAt).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        page2.drawText(safe(customerName), { x: 60, y: signSectionY - 66, size: 8, font: fontBold, color: cTextMain });
        page2.drawText(safe(`Ngày ký: ${signDateStr} | IP: ${data.clientIp || '127.0.0.1'}`), { x: 60, y: signSectionY - 76, size: 6, font: fontRegular, color: cTextMuted });

        const stampCenterX = width - 145;
        const stampCenterY = signSectionY - 42;
        page2.drawCircle({ x: stampCenterX, y: stampCenterY, size: 32, borderColor: cRedStamp, borderWidth: 1.5, color: cRedBg });
        page2.drawCircle({ x: stampCenterX, y: stampCenterY, size: 28, borderColor: cRedStamp, borderWidth: 0.6 });
        page2.drawText(safe('CÔNG TY CỔ PHẦN'), { x: stampCenterX - (fontBold.widthOfTextAtSize(safe('CÔNG TY CỔ PHẦN'), 6.5) / 2), y: stampCenterY + 9, size: 6.5, font: fontBold, color: cRedStamp });
        page2.drawText(safe('SÂM NGỌC LINH'), { x: stampCenterX - (fontBold.widthOfTextAtSize(safe('SÂM NGỌC LINH'), 7) / 2), y: stampCenterY - 1, size: 7, font: fontBold, color: cRedStamp });
        page2.drawText(safe('★ ĐÃ KÝ SỐ ★'), { x: stampCenterX - (fontBold.widthOfTextAtSize(safe('★ ĐÃ KÝ SỐ ★'), 6.5) / 2), y: stampCenterY - 11, size: 6.5, font: fontBold, color: cRedStamp });
        page2.drawText(safe('Tổng Giám Đốc'), { x: stampCenterX - (fontBold.widthOfTextAtSize(safe('Tổng Giám Đốc'), 7.5) / 2), y: signSectionY - 66, size: 7.5, font: fontBold, color: cTextMain });
        page2.drawText(safe('Trương Nguyên Tiến Trà'), { x: stampCenterX - (fontRegular.widthOfTextAtSize(safe('Trương Nguyên Tiến Trà'), 7) / 2), y: signSectionY - 76, size: 7, font: fontRegular, color: cTextMuted });

        const page3 = pdfDoc.addPage([595.28, 841.89]);
        drawBorderAndHeader(page3, 3, totalPages);
        let textY3 = height - 76;

        page3.drawText(safe('PHỤ LỤC 01'), { x: width / 2 - (fontBold.widthOfTextAtSize(safe('PHỤ LỤC 01'), 10) / 2), y: textY3, size: 10, font: fontBold, color: cTextMain });
        textY3 -= 14;
        const ap1Title = safe('QUY CHUẨN ĐỘ TUỔI, HÌNH THỨC VÀ TRỌNG LƯỢNG CỦ SÂM LÀM CĂN CỨ ĐỀN BÙ');
        page3.drawText(ap1Title, { x: width / 2 - (fontBold.widthOfTextAtSize(ap1Title, 8.5) / 2), y: textY3, size: 8.5, font: fontBold, color: cEmeraldDark });
        textY3 -= 10;
        const ap1Sub = safe('(Áp dụng theo quy định tại Điều 5 và Điều 9 của Hợp đồng)');
        page3.drawText(ap1Sub, { x: width / 2 - (fontOblique.widthOfTextAtSize(ap1Sub, 7) / 2), y: textY3, size: 7, font: fontOblique, color: cTextMuted });
        textY3 -= 16;

        const tableX = 35;
        const tableWidth = width - 70;
        const col1W = 85;
        const col3W = 120;
        const col2W = tableWidth - col1W - col3W;
        page3.drawRectangle({ x: tableX, y: textY3 - 4, width: tableWidth, height: 18, color: cEmeraldDark });
        page3.drawText(safe('Độ tuổi'), { x: tableX + 8, y: textY3 + 2, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
        page3.drawText(safe('Quy chuẩn hình thức & Cấu trúc sinh trưởng'), { x: tableX + col1W + 8, y: textY3 + 2, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
        page3.drawText(safe('Trọng lượng củ tối thiểu'), { x: tableX + col1W + col2W + 12, y: textY3 + 2, size: 7.5, font: fontBold, color: rgb(1, 1, 1) });
        textY3 -= 18;

        const appendix1Rows = [
            { age: 'Cây 1 Tuổi', standard: 'Có đủ từ 01 lá kết trở lên, sức khỏe tốt, không sâu bệnh.', weight: 'Thỏa thuận thực tế' },
            { age: 'Cây 2 Tuổi', standard: 'Có đủ 02 mắt sâm, bộ lá xanh tốt khỏe mạnh.', weight: 'Thỏa thuận thực tế' },
            { age: 'Cây 3 Tuổi', standard: 'Củ sâm hình thành rõ rệt, chuẩn chủng giống, ≥ 02 mắt sâm.', weight: 'Thỏa thuận thực tế' },
            { age: 'Cây 4 Tuổi', standard: 'Đạt đúng độ tuổi năm thứ 4 trên nhật ký App.', weight: 'Từ 22 gam trở lên' },
            { age: 'Cây 5 Tuổi', standard: 'Đạt đúng độ tuổi năm thứ 5 trên nhật ký App.', weight: 'Từ 30 gam trở lên' },
            { age: 'Cây 6 Tuổi', standard: 'Đạt đúng độ tuổi năm thứ 6 trên nhật ký App.', weight: 'Từ 53 gam trở lên' },
            { age: 'Cây 7 Tuổi', standard: 'Đạt đúng độ tuổi năm thứ 7 trên nhật ký App.', weight: 'Từ 67 gam trở lên' },
            { age: 'Cây 8 Tuổi', standard: 'Đạt đúng độ tuổi năm thứ 8 trên nhật ký App.', weight: 'Từ 79 gam trở lên' },
        ];

        appendix1Rows.forEach((row, idx) => {
            const isHighlight = idx >= 3;
            const rowBg = idx % 2 === 1 ? rgb(0.98, 0.99, 0.98) : rgb(1, 1, 1);
            page3.drawRectangle({ x: tableX, y: textY3 - 4, width: tableWidth, height: 16, color: rowBg, borderColor: cCardBorder, borderWidth: 0.5 });
            page3.drawText(safe(row.age), { x: tableX + 8, y: textY3 + 1, size: 7, font: fontBold, color: cTextMain });
            page3.drawText(safe(row.standard), { x: tableX + col1W + 8, y: textY3 + 1, size: 6.8, font: fontRegular, color: cTextMain });
            if (isHighlight) {
                page3.drawRectangle({ x: tableX + col1W + col2W + 2, y: textY3 - 3, width: col3W - 4, height: 14, color: cEmeraldLight });
                page3.drawText(safe(row.weight), { x: tableX + col1W + col2W + 16, y: textY3 + 1, size: 7, font: fontBold, color: cEmeraldDark });
            } else {
                page3.drawText(safe(row.weight), { x: tableX + col1W + col2W + 16, y: textY3 + 1, size: 6.8, font: fontOblique, color: cTextMuted });
            }
            textY3 -= 16;
        });

        textY3 -= 18;
        page3.drawText(safe('PHỤ LỤC 02'), { x: width / 2 - (fontBold.widthOfTextAtSize(safe('PHỤ LỤC 02'), 10) / 2), y: textY3, size: 10, font: fontBold, color: cTextMain });
        textY3 -= 13;
        const ap2Title = safe('BIỂU PHÍ GỬI LÁ VÀ HẠT RIÊNG LẺ (GÓI THƯƠNG GIA)');
        page3.drawText(ap2Title, { x: width / 2 - (fontBold.widthOfTextAtSize(ap2Title, 8.5) / 2), y: textY3, size: 8.5, font: fontBold, color: cEmeraldDark });
        textY3 -= 14;
        const ap2BoxY = textY3 - 48;
        page3.drawRectangle({ x: 35, y: ap2BoxY, width: width - 70, height: 48, color: rgb(0.99, 0.99, 1), borderColor: rgb(0.85, 0.88, 0.95), borderWidth: 0.8 });
        page3.drawText(safe('• Phí nhân công hái gùi hạ sơn riêng lẻ: Theo thỏa thuận thực tế tại vườn sâm.'), { x: 44, y: ap2BoxY + 34, size: 7, font: fontRegular, color: cTextMain });
        page3.drawText(safe('• Phí đóng gói chuyên dụng bảo quản tươi: Tính theo định lượng thùng chuyên dụng thực tế.'), { x: 44, y: ap2BoxY + 21, size: 7, font: fontRegular, color: cTextMain });
        page3.drawText(safe('• Phí chuyển phát nhanh hỏa tốc: Theo cước thực tế của đơn vị vận chuyển tại thời điểm gửi.'), { x: 44, y: ap2BoxY + 8, size: 7, font: fontRegular, color: cTextMain });

        const footerY = 38;
        page3.drawRectangle({ x: 35, y: footerY, width: width - 70, height: 52, color: rgb(0.98, 0.99, 0.98), borderColor: cCardBorder, borderWidth: 0.8 });
        page3.drawImage(qrImage, { x: 40, y: footerY + 4, width: 44, height: 44 });
        page3.drawText(safe('CHỨNG THƯ XÁC THỰC HỢP ĐỒNG ĐIỆN TỬ (DIGITAL TIMESTAMP & QR CODE)'), { x: 92, y: footerY + 38, size: 7, font: fontBold, color: cEmeraldDark });
        page3.drawText(safe(`• Cổng tra cứu trực tuyến: ${verifyUrl}`), { x: 92, y: footerY + 27, size: 6.5, font: fontRegular, color: cTextMuted });
        const docHash = crypto.createHash('sha256').update(Buffer.from(await pdfDoc.save())).digest('hex');
        page3.drawText(safe(`• Mã băm SHA-256 toàn vẹn: ${docHash.slice(0, 44)}...`), { x: 92, y: footerY + 16, size: 6.5, font: fontBold, color: cTextMain });
        page3.drawText(safe('• Văn bản có giá trị pháp lý theo Luật Giao dịch điện tử 2023 và Bộ luật Dân sự 2015.'), { x: 92, y: footerY + 6, size: 6, font: fontOblique, color: cTextMuted });

        if (data.items && data.items.length > 0) {
            const page4 = pdfDoc.addPage([595.28, 841.89]);
            drawBorderAndHeader(page4, 4, totalPages);
            let textY4 = height - 76;
            page4.drawText(safe('PHỤ LỤC 03: DANH MỤC CÂY SÂM ĐƯỢC CẤP MÃ / KÝ GỬI CANH TÁC'), { x: 38, y: textY4, size: 8.5, font: fontBold, color: cEmeraldDark });
            textY4 -= 18;
            page4.drawRectangle({ x: 35, y: textY4 - 4, width: width - 70, height: 18, color: cEmeraldLight, borderColor: cCardBorder, borderWidth: 0.8 });
            page4.drawText(safe('STT'), { x: 42, y: textY4 + 2, size: 7.5, font: fontBold, color: cEmeraldDark });
            page4.drawText(safe('Mã Cây Sâm'), { x: 70, y: textY4 + 2, size: 7.5, font: fontBold, color: cEmeraldDark });
            page4.drawText(safe('Tên Giống Sâm'), { x: 170, y: textY4 + 2, size: 7.5, font: fontBold, color: cEmeraldDark });
            page4.drawText(safe('Tuổi Lúc Ký'), { x: 340, y: textY4 + 2, size: 7.5, font: fontBold, color: cEmeraldDark });
            page4.drawText(safe('Vị Trí Vườn/Luống'), { x: 410, y: textY4 + 2, size: 7.5, font: fontBold, color: cEmeraldDark });
            page4.drawText(safe('Đơn Giá (VNĐ)'), { x: 495, y: textY4 + 2, size: 7.5, font: fontBold, color: cEmeraldDark });
            textY4 -= 18;
            data.items.slice(0, 30).forEach((item, idx) => {
                const rowBg = idx % 2 === 1 ? rgb(0.98, 0.99, 0.98) : rgb(1, 1, 1);
                page4.drawRectangle({
                    x: 35,
                    y: textY4 - 3,
                    width: width - 70,
                    height: 14,
                    color: rowBg,
                });
                const locationStr = item.bedCode || item.gardenCode || 'Vườn Trà Linh';
                page4.drawText(String(idx + 1), { x: 44, y: textY4 + 1, size: 7, font: fontRegular, color: cTextMain });
                page4.drawText(safe(item.treeCode), { x: 70, y: textY4 + 1, size: 7, font: fontBold, color: cEmeraldMid });
                page4.drawText(safe(item.treeName || 'Sâm Ngọc Linh thuần chủng'), { x: 170, y: textY4 + 1, size: 7, font: fontRegular, color: cTextMain });
                page4.drawText(`${item.ageYearAtSign} năm tuổi`, { x: 345, y: textY4 + 1, size: 7, font: fontRegular, color: cTextMain });
                page4.drawText(safe(locationStr), { x: 410, y: textY4 + 1, size: 7, font: fontRegular, color: cTextMuted });
                page4.drawText((item.unitPrice || 0).toLocaleString('vi-VN'), { x: 495, y: textY4 + 1, size: 7, font: fontBold, color: cGold });
                textY4 -= 14;
            });
        }

        // Final Save
        const finalPdfBytes = await pdfDoc.save();
        const finalBuffer = Buffer.from(finalPdfBytes);
        const finalHash = crypto.createHash('sha256').update(finalBuffer).digest('hex');

        return {
            pdfBuffer: finalBuffer,
            documentHash: finalHash,
            qrUrl: verifyUrl,
        };
    }

    async generateAmendmentPdf(data: IAmendmentPdfData): Promise<IGeneratedPdfResult> {
        const webUrl = this.configService.get<string>('HOME_URL') || 'http://localhost:3002';
        const verifyUrl = `${webUrl}/vi/trace/contract/${encodeURIComponent(data.contractCode)}`;

        // 1. Generate High-Res QR Code PNG
        const qrBuffer = await QRCode.toBuffer(verifyUrl, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 220,
            color: {
                dark: '#064e3b',
                light: '#ffffff',
            },
        });

        // 2. Initialize PDF Document
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);

        // 3. Load TrueType Fonts with Unicode Vietnamese support or fallback
        const { fontRegular, fontBold, fontOblique, isUnicode } = await this.loadFonts(pdfDoc);

        const safe = (text?: string | null): string => {
            if (!text) {return '';}
            return isUnicode ? text : sanitizeFallback(text);
        };

        const qrImage = await pdfDoc.embedPng(qrBuffer);

        // Palette Tokens
        const cEmeraldDark = rgb(0.02, 0.31, 0.23);    // #064e3b
        const cEmeraldMid = rgb(0.04, 0.45, 0.28);     // #059669
        const cEmeraldLight = rgb(0.94, 0.98, 0.95);   // #f0fdf4
        const cGold = rgb(0.75, 0.55, 0.15);           // #d97706
        const cTextMain = rgb(0.08, 0.12, 0.18);       // #0f172a
        const cTextMuted = rgb(0.38, 0.45, 0.55);      // #64748b
        const cCardBorder = rgb(0.85, 0.90, 0.86);     // #dcfce7
        const cRedStamp = rgb(0.85, 0.15, 0.15);       // #dc2626
        const cRedBg = rgb(0.99, 0.94, 0.94);

        const drawBorderAndHeader = (page: PDFPage, pageNum: number, totalPages: number) => {
            const { width, height } = page.getSize();
            page.drawRectangle({
                x: 18,
                y: 18,
                width: width - 36,
                height: height - 36,
                borderColor: cEmeraldDark,
                borderWidth: 1.2,
            });
            page.drawRectangle({
                x: 22,
                y: 22,
                width: width - 44,
                height: height - 44,
                borderColor: cGold,
                borderWidth: 0.6,
            });

            const nationalTitle = safe('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM');
            const nationalMotto = safe('Độc lập - Tự do - Hạnh phúc');
            page.drawText(nationalTitle, {
                x: width / 2 - (fontBold.widthOfTextAtSize(nationalTitle, 9.5) / 2),
                y: height - 44,
                size: 9.5,
                font: fontBold,
                color: cTextMain,
            });
            page.drawText(nationalMotto, {
                x: width / 2 - (fontRegular.widthOfTextAtSize(nationalMotto, 9) / 2),
                y: height - 57,
                size: 9,
                font: fontRegular,
                color: cTextMuted,
            });
            page.drawLine({
                start: { x: width / 2 - 40, y: height - 63 },
                end: { x: width / 2 + 40, y: height - 63 },
                thickness: 0.8,
                color: cGold,
            });
            page.drawText(safe(`Trang ${pageNum}/${totalPages}`), {
                x: width - 75,
                y: 26,
                size: 7,
                font: fontRegular,
                color: cTextMuted,
            });
        };

        // =========================================================================
        // PAGE 1: AMENDMENT DETAILS & CLAUSES
        // =========================================================================
        const page1 = pdfDoc.addPage([595.28, 841.89]);
        const { width, height } = page1.getSize();
        drawBorderAndHeader(page1, 1, 2);

        // Document Title
        const docTitle = safe(`PHỤ LỤC HỢP ĐỒNG SỐ ${data.amendmentNumber.toString().padStart(2, '0')}`);
        const docSubTitle = safe(`(GIA HẠN DỊCH VỤ CHĂM SÓC & BẢO VỆ CÂY SÂM NGỌC LINH)`);
        page1.drawText(docTitle, {
            x: width / 2 - (fontBold.widthOfTextAtSize(docTitle, 13) / 2),
            y: height - 85,
            size: 13,
            font: fontBold,
            color: cEmeraldDark,
        });
        page1.drawText(docSubTitle, {
            x: width / 2 - (fontBold.widthOfTextAtSize(docSubTitle, 8.5) / 2),
            y: height - 99,
            size: 8.5,
            font: fontBold,
            color: cGold,
        });

        // Contract Context Box
        const contextBoxY = height - 145;
        page1.drawRectangle({
            x: 36,
            y: contextBoxY,
            width: width - 72,
            height: 38,
            color: cEmeraldLight,
            borderColor: cCardBorder,
            borderWidth: 0.8,
        });
        page1.drawText(safe(`• Căn cứ Hợp đồng gốc số: ${data.contractCode}`), {
            x: 44,
            y: contextBoxY + 24,
            size: 8,
            font: fontBold,
            color: cEmeraldDark,
        });
        page1.drawText(safe(`• Mã định danh Phụ lục: ${data.amendmentCode}  |  Ngày lập: ${new Date(data.signedAt).toLocaleDateString('vi-VN')}`), {
            x: 44,
            y: contextBoxY + 10,
            size: 7.5,
            font: fontRegular,
            color: cTextMain,
        });

        // Parties Box
        const partyBoxY = contextBoxY - 95;
        page1.drawRectangle({
            x: 36,
            y: partyBoxY,
            width: width - 72,
            height: 85,
            color: rgb(1, 1, 1),
            borderColor: cCardBorder,
            borderWidth: 0.8,
        });

        page1.drawText(safe(`BÊN A (ĐƠN VỊ QUẢN LÝ VƯỜN): ${data.partyA || 'CÔNG TY CỔ PHẦN SÂM NGỌC LINH'}`), {
            x: 44,
            y: partyBoxY + 70,
            size: 8,
            font: fontBold,
            color: cEmeraldDark,
        });
        page1.drawText(safe('• Địa chỉ: Thôn 2, Xã Trà Linh, Thành phố Đà Nẵng / H. Nam Trà My, Kon Tum  |  Hotline: 0967 234 234'), {
            x: 44,
            y: partyBoxY + 58,
            size: 7.5,
            font: fontRegular,
            color: cTextMuted,
        });

        page1.drawLine({
            start: { x: 44, y: partyBoxY + 50 },
            end: { x: width - 44, y: partyBoxY + 50 },
            thickness: 0.5,
            color: cCardBorder,
        });

        const customerName = safe(data.customerName || data.partyB || 'Khách hàng sở hữu');
        const prevExpStr = new Date(data.previousExpiredAt).toLocaleDateString('vi-VN');
        const newExpStr = new Date(data.newExpiredAt).toLocaleDateString('vi-VN');

        page1.drawText(safe(`BÊN B (CHỦ SỞ HỮU CÂY SÂM): ${customerName}`), {
            x: 44,
            y: partyBoxY + 36,
            size: 8,
            font: fontBold,
            color: cEmeraldDark,
        });
        page1.drawText(safe(`• Điện thoại: ${data.customerPhone || '—'}  |  Email: ${data.customerEmail || '—'}`), {
            x: 44,
            y: partyBoxY + 24,
            size: 7.5,
            font: fontRegular,
            color: cTextMain,
        });
        page1.drawText(safe(`• Phí dịch vụ chăm sóc gia hạn: ${(data.amendmentValue || 0).toLocaleString('vi-VN')} VNĐ  |  Gia hạn: ${data.extendedMonths} tháng`), {
            x: 44,
            y: partyBoxY + 12,
            size: 7.5,
            font: fontBold,
            color: cGold,
        });

        // Amendment Articles
        let textY = partyBoxY - 20;
        const clauses = [
            {
                title: 'ĐIỀU 1: GIA HẠN THỜI GIAN ỦY QUYỀN CHĂM SÓC & BẢO VỆ NÔNG NGHIỆP',
                content: `Bên A và Bên B thống nhất gia hạn thời hạn ủy quyền nuôi trồng, chăm sóc và bảo vệ sinh thái đối với toàn bộ số cây Sâm Ngọc Linh thuộc Hợp đồng số ${data.contractCode}. Thời hạn hiệu lực cũ kết thúc ngày ${prevExpStr}, nay được gia hạn thêm ${data.extendedMonths} tháng, thời hạn hiệu lực mới đến hết ngày ${newExpStr}.`,
            },
            {
                title: 'ĐIỀU 2: PHÍ DỊCH VỤ VÀ QUY TRÌNH THANH TOÁN CHU KỲ MỚI',
                content: `Tổng phí dịch vụ chăm sóc nông nghiệp cho chu kỳ gia hạn là ${(data.amendmentValue || 0).toLocaleString('vi-VN')} VNĐ. Mức phí này bao gồm toàn bộ vật tư hữu cơ, nhân công kỹ thuật bảo vệ 24/7 và quyền lợi nhận lá/hạt hàng năm theo quy chế nhà vườn.`,
            },
            {
                title: 'ĐIỀU 3: BẢO TOÀN QUYỀN SỞ HỮU VÀ BẢO HIỂM NÔNG NGHIỆP',
                content: 'Bên B tiếp tục giữ nguyên 100% quyền sở hữu bất biến đối với toàn bộ các cây sâm đã định danh. Bên A tiếp tục cam kết chính sách bảo hiểm đền bù củ sâm thật 100% theo đúng Phụ lục 01 của Hợp đồng gốc trong suốt chu kỳ gia hạn.',
            },
            {
                title: 'ĐIỀU 4: ĐIỀU KHOẢN THI HÀNH VÀ GIÁ TRỊ PHÁP LÝ',
                content: `Phụ lục này là một bộ phận không tách rời của Hợp đồng số ${data.contractCode}. Mọi điều khoản khác của Hợp đồng gốc không bị sửa đổi bởi Phụ lục này vẫn giữ nguyên giá trị hiệu lực pháp lý cao nhất giữa hai bên.`,
            },
        ];

        clauses.forEach((cl) => {
            page1.drawText(safe(cl.title), {
                x: 38,
                y: textY,
                size: 8,
                font: fontBold,
                color: cEmeraldDark,
            });
            textY -= 11;

            const words = cl.content.split(' ');
            let line = '';
            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const widthOfLine = fontRegular.widthOfTextAtSize(safe(testLine), 7.5);
                if (widthOfLine > (width - 76) && i > 0) {
                    page1.drawText(safe(line.trim()), {
                        x: 38,
                        y: textY,
                        size: 7.5,
                        font: fontRegular,
                        color: cTextMain,
                    });
                    textY -= 10;
                    line = words[i] + ' ';
                } else {
                    line = testLine;
                }
            }
            if (line.trim()) {
                page1.drawText(safe(line.trim()), {
                    x: 38,
                    y: textY,
                    size: 7.5,
                    font: fontRegular,
                    color: cTextMain,
                });
                textY -= 13;
            }
        });

        // =========================================================================
        // PAGE 2: ASSET LIST (IF ANY), SIGNATURES & CRYPTOGRAPHIC VERIFICATION
        // =========================================================================
        const page2 = pdfDoc.addPage([595.28, 841.89]);
        drawBorderAndHeader(page2, 2, 2);

        let textY2 = height - 80;

        // Render Trees Table if items exist
        if (data.items && data.items.length > 0) {
            page2.drawText(safe('DANH MỤC CÂY SÂM TIẾP TỤC ĐƯỢC ỦY QUYỀN CHĂM SÓC GIA HẠN:'), {
                x: 38,
                y: textY2,
                size: 8,
                font: fontBold,
                color: cEmeraldDark,
            });
            textY2 -= 14;

            page2.drawRectangle({
                x: 35,
                y: textY2 - 3,
                width: width - 70,
                height: 16,
                color: cEmeraldLight,
                borderColor: cCardBorder,
                borderWidth: 0.6,
            });

            page2.drawText(safe('STT'), { x: 42, y: textY2 + 2, size: 7, font: fontBold, color: cEmeraldDark });
            page2.drawText(safe('Mã Cây Sâm'), { x: 70, y: textY2 + 2, size: 7, font: fontBold, color: cEmeraldDark });
            page2.drawText(safe('Tên Giống Sâm'), { x: 170, y: textY2 + 2, size: 7, font: fontBold, color: cEmeraldDark });
            page2.drawText(safe('Vị Trí Vườn/Luống'), { x: 380, y: textY2 + 2, size: 7, font: fontBold, color: cEmeraldDark });
            textY2 -= 16;

            data.items.slice(0, 15).forEach((it, idx) => {
                page2.drawText(String(idx + 1), { x: 44, y: textY2, size: 7, font: fontRegular, color: cTextMain });
                page2.drawText(safe(it.treeCode), { x: 70, y: textY2, size: 7, font: fontBold, color: cEmeraldMid });
                page2.drawText(safe(it.treeName), { x: 170, y: textY2, size: 7, font: fontRegular, color: cTextMain });
                page2.drawText(safe(it.bedCode || it.gardenCode || 'Vườn Trà Linh'), { x: 380, y: textY2, size: 7, font: fontRegular, color: cTextMuted });
                textY2 -= 12;
            });
            textY2 -= 10;
        }

        // Signatures Section
        const signSectionY = textY2 - 20;

        // Party B Sign
        page2.drawText(safe('ĐẠI DIỆN BÊN B (CHỦ SỞ HỮU)'), {
            x: 55,
            y: signSectionY,
            size: 8.5,
            font: fontBold,
            color: cTextMain,
        });
        page2.drawText(safe('(Đã xác thực chữ ký điện tử / OTP)'), {
            x: 55,
            y: signSectionY - 10,
            size: 7,
            font: fontOblique,
            color: cTextMuted,
        });

        // Party A Sign
        page2.drawText(safe('ĐẠI DIỆN BÊN A (CÔNG TY SÂM NGỌC LINH)'), {
            x: width - 235,
            y: signSectionY,
            size: 8.5,
            font: fontBold,
            color: cTextMain,
        });
        page2.drawText(safe('(Đã ký số & Đóng dấu pháp nhân)'), {
            x: width - 235,
            y: signSectionY - 10,
            size: 7,
            font: fontOblique,
            color: cTextMuted,
        });

        // Embed Party B Signature
        if (data.signatureDataUrl) {
            try {
                let sigBytes: Buffer | null = null;
                if (data.signatureDataUrl.startsWith('data:image')) {
                    sigBytes = Buffer.from(data.signatureDataUrl.split(',')[1], 'base64');
                }
                if (sigBytes) {
                    let sigImg;
                    try { sigImg = await pdfDoc.embedPng(sigBytes); }
                    catch { sigImg = await pdfDoc.embedJpg(sigBytes); }
                    page2.drawImage(sigImg, { x: 55, y: signSectionY - 60, width: 110, height: 42 });
                }
            } catch {
                page2.drawText(safe(`[XÁC THỰC ĐIỆN TỬ: ${customerName}]`), {
                    x: 55,
                    y: signSectionY - 40,
                    size: 8,
                    font: fontBold,
                    color: cEmeraldMid,
                });
            }
        } else {
            page2.drawText(safe(`[XÁC THỰC ĐIỆN TỬ: ${customerName}]`), {
                x: 55,
                y: signSectionY - 40,
                size: 8,
                font: fontBold,
                color: cEmeraldMid,
            });
        }

        const signDateStr = new Date(data.signedAt).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        page2.drawText(safe(`Họ tên: ${customerName}`), {
            x: 55,
            y: signSectionY - 70,
            size: 8,
            font: fontBold,
            color: cTextMain,
        });
        page2.drawText(safe(`IP: ${data.clientIp || '127.0.0.1'} | Ngày ký: ${signDateStr}`), {
            x: 55,
            y: signSectionY - 80,
            size: 6.5,
            font: fontRegular,
            color: cTextMuted,
        });

        // Party A Vector Stamp
        const stampCenterX = width - 145;
        const stampCenterY = signSectionY - 42;
        page2.drawCircle({
            x: stampCenterX,
            y: stampCenterY,
            size: 34,
            borderColor: cRedStamp,
            borderWidth: 1.5,
            color: cRedBg,
        });
        page2.drawCircle({
            x: stampCenterX,
            y: stampCenterY,
            size: 30,
            borderColor: cRedStamp,
            borderWidth: 0.6,
        });
        page2.drawText(safe('CÔNG TY CỔ PHẦN'), {
            x: stampCenterX - (fontBold.widthOfTextAtSize(safe('CÔNG TY CỔ PHẦN'), 5.5) / 2),
            y: stampCenterY + 16,
            size: 5.5,
            font: fontBold,
            color: cRedStamp,
        });
        page2.drawText(safe('SÂM NGỌC LINH'), {
            x: stampCenterX - (fontBold.widthOfTextAtSize(safe('SÂM NGỌC LINH'), 6) / 2),
            y: stampCenterY + 7,
            size: 6,
            font: fontBold,
            color: cRedStamp,
        });
        page2.drawText(safe('★ ĐÃ KÝ SỐ ★'), {
            x: stampCenterX - (fontBold.widthOfTextAtSize(safe('★ ĐÃ KÝ SỐ ★'), 5.5) / 2),
            y: stampCenterY - 3,
            size: 5.5,
            font: fontBold,
            color: cRedStamp,
        });
        page2.drawText(safe('Tổng Giám Đốc'), {
            x: stampCenterX - (fontBold.widthOfTextAtSize(safe('Tổng Giám Đốc'), 8) / 2),
            y: signSectionY - 70,
            size: 8,
            font: fontBold,
            color: cTextMain,
        });
        page2.drawText(safe('Trương Nguyên Tiến Trà'), {
            x: stampCenterX - (fontRegular.widthOfTextAtSize(safe('Trương Nguyên Tiến Trà'), 7.5) / 2),
            y: signSectionY - 80,
            size: 7.5,
            font: fontRegular,
            color: cTextMuted,
        });

        // Cryptographic Verification Box at bottom of Page 2
        const footerY = 38;
        page2.drawRectangle({
            x: 35,
            y: footerY,
            width: width - 70,
            height: 52,
            color: rgb(0.98, 0.99, 0.98),
            borderColor: cCardBorder,
            borderWidth: 0.8,
        });

        page2.drawImage(qrImage, {
            x: 40,
            y: footerY + 4,
            width: 44,
            height: 44,
        });

        page2.drawText(safe('CHỨNG THƯ XÁC THỰC PHỤ LỤC HỢP ĐỒNG ĐIỆN TỬ (DIGITAL TIMESTAMP & QR)'), {
            x: 92,
            y: footerY + 38,
            size: 7,
            font: fontBold,
            color: cEmeraldDark,
        });
        page2.drawText(safe(`• Cổng tra cứu trực tuyến: ${verifyUrl}`), {
            x: 92,
            y: footerY + 27,
            size: 6.5,
            font: fontRegular,
            color: cTextMuted,
        });

        const preSaveBytes = await pdfDoc.save();
        const docHash = crypto.createHash('sha256').update(Buffer.from(preSaveBytes)).digest('hex');

        page2.drawText(safe(`• Mã băm SHA-256 toàn vẹn: ${docHash.slice(0, 44)}...`), {
            x: 92,
            y: footerY + 16,
            size: 6.5,
            font: fontBold,
            color: cTextMain,
        });
        page2.drawText(safe('• Phụ lục có giá trị pháp lý gắn liền với Hợp đồng gốc theo Luật GDTĐT 2023.'), {
            x: 92,
            y: footerY + 6,
            size: 6,
            font: fontOblique,
            color: cTextMuted,
        });

        // Final Save
        const finalPdfBytes = await pdfDoc.save();
        const finalBuffer = Buffer.from(finalPdfBytes);
        const finalHash = crypto.createHash('sha256').update(finalBuffer).digest('hex');

        return {
            pdfBuffer: finalBuffer,
            documentHash: finalHash,
            qrUrl: verifyUrl,
        };
    }

    /**
     * Cross-platform Unicode font loader with local assets precedence & OS fallbacks
     */
    private async loadFonts(pdfDoc: PDFDocument): Promise<{
        fontRegular: PDFFont;
        fontBold: PDFFont;
        fontOblique: PDFFont;
        isUnicode: boolean;
    }> {
        const candidateDirs = [
            path.resolve(process.cwd(), 'assets/fonts'),
            path.resolve(process.cwd(), 'apps/api/assets/fonts'),
            path.resolve(__dirname, '../../../../assets/fonts'),
            path.resolve(__dirname, '../../../assets/fonts'),
            'C:/Windows/Fonts',
            '/usr/share/fonts/truetype/dejavu',
            '/usr/share/fonts/truetype/liberation',
        ];

        let regularPath = '';
        let boldPath = '';
        let italicPath = '';

        for (const dir of candidateDirs) {
            const rPath = path.join(dir, 'arial.ttf');
            const bPath = path.join(dir, 'arialbd.ttf');
            const iPath = path.join(dir, 'ariali.ttf');

            if (fs.existsSync(rPath) && fs.existsSync(bPath)) {
                regularPath = rPath;
                boldPath = bPath;
                italicPath = fs.existsSync(iPath) ? iPath : rPath;
                break;
            }

            const rRoboto = path.join(dir, 'Roboto-Regular.ttf');
            const bRoboto = path.join(dir, 'Roboto-Bold.ttf');
            const iRoboto = path.join(dir, 'Roboto-Italic.ttf');
            if (fs.existsSync(rRoboto) && fs.existsSync(bRoboto)) {
                regularPath = rRoboto;
                boldPath = bRoboto;
                italicPath = fs.existsSync(iRoboto) ? iRoboto : rRoboto;
                break;
            }
        }

        if (regularPath && boldPath) {
            try {
                const fontRegular = await pdfDoc.embedFont(fs.readFileSync(regularPath));
                const fontBold = await pdfDoc.embedFont(fs.readFileSync(boldPath));
                const fontOblique = await pdfDoc.embedFont(fs.readFileSync(italicPath));
                return { fontRegular, fontBold, fontOblique, isUnicode: true };
            } catch (err) {
                this.logger.warn('Failed to embed TrueType font, falling back to Helvetica:', err);
            }
        }

        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
        return { fontRegular, fontBold, fontOblique, isUnicode: false };
    }
}
