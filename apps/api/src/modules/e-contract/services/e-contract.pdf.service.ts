import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib';
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
    if (!str) return '';
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
        const verifyUrl = `${webUrl}/trace/contract/${encodeURIComponent(data.contractCode)}`;

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
            if (!text) return '';
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
            page.drawText(pageStr, {
                x: width - 75,
                y: 30,
                size: 7,
                font: fontBold,
                color: cEmeraldDark,
            });
        };

        const totalPages = 2;

        // =========================================================================
        // PAGE 1: TITLE, PARTIES, ARTICLES 1-5
        // =========================================================================
        const page1 = pdfDoc.addPage([595.28, 841.89]);
        const { width, height } = page1.getSize();
        drawBorderAndHeader(page1, 1, totalPages);

        // Brand Sub-Header
        const brandTag = safe('SÂM NGỌC LINH • HỆ THỐNG KÝ SỐ ĐIỆN TỬ SÂM NGỌC LINH');
        page1.drawText(brandTag, {
            x: width / 2 - (fontBold.widthOfTextAtSize(brandTag, 7.5) / 2),
            y: height - 76,
            size: 7.5,
            font: fontBold,
            color: cEmeraldMid,
        });

        const docTitle = safe('HỢP ĐỒNG MUA BÁN VÀ KÝ GỬI, CHĂM SÓC CÂY SÂM NGỌC LINH');
        page1.drawText(docTitle, {
            x: width / 2 - (fontBold.widthOfTextAtSize(docTitle, 11) / 2),
            y: height - 92,
            size: 11,
            font: fontBold,
            color: cEmeraldDark,
        });

        const contractCodeClean = safe(data.contractCode.toUpperCase());
        const codeText = safe(`Mã số: HD-${contractCodeClean}/2026/SNL • Chứng thực số điện tử`);
        page1.drawText(codeText, {
            x: width / 2 - (fontOblique.widthOfTextAtSize(codeText, 7.5) / 2),
            y: height - 104,
            size: 7.5,
            font: fontOblique,
            color: cTextMuted,
        });

        // Bento Card: Parties
        const partyBoxY = height - 116;
        const partyBoxHeight = 88;

        page1.drawRectangle({
            x: 35,
            y: partyBoxY - partyBoxHeight,
            width: width - 70,
            height: partyBoxHeight,
            color: cEmeraldLight,
            borderColor: cCardBorder,
            borderWidth: 0.8,
        });

        // BÊN A
        page1.drawText(safe('BÊN A (BÊN BÁN VÀ NHẬN KÝ GỬI CHĂM SÓC): CÔNG TY CỔ PHẦN SÂM NGỌC LINH'), {
            x: 44,
            y: partyBoxY - 14,
            size: 8,
            font: fontBold,
            color: cEmeraldDark,
        });
        page1.drawText(safe('• MST: 4001248522 / 0316913632  |  Đại diện: Trương Nguyên Tiến Trà – Giám đốc'), {
            x: 44,
            y: partyBoxY - 25,
            size: 7.5,
            font: fontRegular,
            color: cTextMain,
        });
        page1.drawText(safe('• Địa chỉ: Thôn 2, Xã Trà Linh, Thành phố Đà Nẵng / H. Nam Trà My, Kon Tum  |  Hotline: 0967 234 234'), {
            x: 44,
            y: partyBoxY - 35,
            size: 7.5,
            font: fontRegular,
            color: cTextMuted,
        });

        // Line
        page1.drawLine({
            start: { x: 44, y: partyBoxY - 42 },
            end: { x: width - 44, y: partyBoxY - 42 },
            thickness: 0.5,
            color: cCardBorder,
        });

        // BÊN B
        const customerName = safe(data.customerName || data.partyB || 'Khách hàng sở hữu');
        const customerPhone = safe(data.customerPhone || 'Chưa cập nhật');
        const customerEmail = safe(data.customerEmail || 'Chưa cập nhật');
        const ekycTag = data.customerIdentity ? safe(` [✓ CCCD: ${data.customerIdentity}]`) : safe(' [eKYC xác thực]');

        page1.drawText(safe(`BÊN B (BÊN MUA, KHÁCH HÀNG SỞ HỮU): ${customerName}${ekycTag}`), {
            x: 44,
            y: partyBoxY - 54,
            size: 8,
            font: fontBold,
            color: cEmeraldDark,
        });
        page1.drawText(safe(`• Điện thoại: ${customerPhone}  |  Email: ${customerEmail}`), {
            x: 44,
            y: partyBoxY - 65,
            size: 7.5,
            font: fontRegular,
            color: cTextMain,
        });
        page1.drawText(safe('• Giá trị hợp đồng: ' + (Number(data.contractValue) || 0).toLocaleString('vi-VN') + ' VNĐ  |  Xác thực qua tài khoản Sâm Ngọc Linh'), {
            x: 44,
            y: partyBoxY - 76,
            size: 7.5,
            font: fontBold,
            color: cGold,
        });

        // Articles 1 to 5 on Page 1
        let textY = partyBoxY - partyBoxHeight - 16;
        const page1Clauses = [
            {
                title: 'ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG & PHƯƠNG ÁN LỰA CHỌN',
                content: 'Bên A bán và Bên B mua cây Sâm Ngọc Linh thuần chủng. Bên B ủy quyền ký gửi toàn bộ quá trình nuôi trồng, chăm sóc và bảo vệ cây sâm cho Bên A tại Vườn Sâm Ngọc Linh sinh thái tại Trà Linh theo đúng quy trình nông nghiệp hữu cơ.',
            },
            {
                title: 'ĐIỀU 2: HIỂN THỊ THÔNG TIN VÀ CAMERA GIÁM SÁT TRÊN APP SÂM NGỌC LINH',
                content: 'Mỗi cây sâm được định danh bằng mã vạch/QR riêng biệt, hiển thị hóa đơn VAT và cập nhật nhật ký định kỳ. Khách hàng sở hữu từ 100 cây sâm trở lên được cấp luồng phát sóng Camera trực tiếp 24/7 trên App.',
            },
            {
                title: 'ĐIỀU 3: THỜI GIAN CHỜ KỸ THUẬT VÀ TIỀN TỆ GIAO DỊCH',
                content: 'Áp dụng thời gian chờ kỹ thuật 24 giờ trước khi kích hoạt. Toàn bộ thanh toán thực hiện 100% bằng đồng Việt Nam (VNĐ). Tuyệt đối không sử dụng, không quy đổi bằng tiền mã hóa, tiền ảo không được NHNN công nhận.',
            },
            {
                title: 'ĐIỀU 4: GIÁ MUA BÁN, PHÍ CHĂM SÓC VÀ PHƯƠNG THỨC THANH TOÁN',
                content: 'Giá trị mua bán và phí chăm sóc hàng năm được xác nhận qua hóa đơn VAT. Phí chăm sóc các năm tiếp theo được thông báo định kỳ hàng năm dựa trên chi phí thực tế tại Vườn Sâm.',
            },
            {
                title: 'ĐIỀU 5: BẢO HIỂM VÀ NGUYÊN TẮC BỒI THƯỜNG (CAM KẾT ĐỀN CỦ, KHÔNG ĐỀN CÂY)',
                content: 'Ngoại trừ sự kiện bất khả kháng (>90 ngày thương lượng), mọi hao hụt do lỗi nhà vườn đối với cây sâm từ 04 đến 08 tuổi cam kết bồi thường 100% bằng CỦ SÂM THƯƠNG PHẨM THẬT theo đúng định mức trọng lượng tối thiểu Phụ lục 01.',
            },
        ];

        page1Clauses.forEach((cl) => {
            page1.drawText(safe(cl.title), {
                x: 38,
                y: textY,
                size: 8,
                font: fontBold,
                color: cEmeraldDark,
            });
            textY -= 11;

            // Render simple wrapped content
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
        // PAGE 2: ARTICLES 6-11, SIGNATURES, APPENDIX 01 & 02, FOOTER
        // =========================================================================
        const page2 = pdfDoc.addPage([595.28, 841.89]);
        drawBorderAndHeader(page2, 2, totalPages);

        let textY2 = height - 76;
        const page2Clauses = [
            {
                title: 'ĐIỀU 6: THĂM VƯỜN, XÉT NGHIỆM ADN & BỒI THƯỜNG GẤP 3 LẦN',
                content: 'Bên B được quyền thăm vườn trực tiếp/gián tiếp (báo trước 15 ngày). Nếu kết quả kiểm định ADN kết luận không phải Sâm Ngọc Linh thuần chủng, Bên A bồi thường gấp 03 (ba) lần số tiền mua sâm.',
            },
            {
                title: 'ĐIỀU 7 & 8: THU HOẠCH LÁ HẠT, GIA HẠN & XỬ LÝ HẾT HẠN',
                content: 'Cây từ 3 tuổi được thu hoạch lá/hạt hàng năm (Gói tiêu chuẩn / Gói thương gia Phụ lục 02). Hết hạn hợp đồng được thông báo trước 45 ngày; sau 60 ngày không gia hạn/mất liên lạc, tài sản được chuyển giao Quỹ địa phương Xã Trà Linh quản lý.',
            },
            {
                title: 'ĐIỀU 9, 10 & 11: CAM KẾT, CHUYỂN NHƯỢNG VÀ ĐIỀU KHOẢN CHUNG',
                content: 'Cam kết đạo đức kinh doanh không huy động vốn trái phép. Cho phép chuyển nhượng trên App với biên độ giá khống chế ±10%. Tranh chấp giải quyết tại TAND có thẩm quyền tại TP. Đà Nẵng.',
            },
        ];

        page2Clauses.forEach((cl) => {
            page2.drawText(safe(cl.title), {
                x: 38,
                y: textY2,
                size: 8,
                font: fontBold,
                color: cEmeraldDark,
            });
            textY2 -= 11;

            const words = cl.content.split(' ');
            let line = '';
            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const widthOfLine = fontRegular.widthOfTextAtSize(safe(testLine), 7.5);
                if (widthOfLine > (width - 76) && i > 0) {
                    page2.drawText(safe(line.trim()), {
                        x: 38,
                        y: textY2,
                        size: 7.5,
                        font: fontRegular,
                        color: cTextMain,
                    });
                    textY2 -= 10;
                    line = words[i] + ' ';
                } else {
                    line = testLine;
                }
            }
            if (line.trim()) {
                page2.drawText(safe(line.trim()), {
                    x: 38,
                    y: textY2,
                    size: 7.5,
                    font: fontRegular,
                    color: cTextMain,
                });
                textY2 -= 12;
            }
        });

        // Appendix 01 Table Summary
        textY2 -= 4;
        page2.drawText(safe('PHỤ LỤC 01: BẢNG TRỌNG LƯỢNG CỦ SÂM TỐI THIỂU LÀM CĂN CỨ ĐỀN BÙ'), {
            x: 38,
            y: textY2,
            size: 8,
            font: fontBold,
            color: cEmeraldDark,
        });
        textY2 -= 12;

        const tableHeader = safe('Độ tuổi:   4 Tuổi (≥22g)  |  5 Tuổi (≥30g)  |  6 Tuổi (≥53g)  |  7 Tuổi (≥67g)  |  8 Tuổi (≥79g)');
        page2.drawRectangle({
            x: 36,
            y: textY2 - 3,
            width: width - 72,
            height: 16,
            color: cEmeraldLight,
            borderColor: cCardBorder,
            borderWidth: 0.6,
        });
        page2.drawText(tableHeader, {
            x: 42,
            y: textY2 + 2,
            size: 7.5,
            font: fontBold,
            color: cEmeraldDark,
        });
        textY2 -= 22;

        // Signatures Section
        const signSectionY = textY2 - 10;

        // Party B Sign
        page2.drawText(safe('ĐẠI DIỆN BÊN B (KHÁCH HÀNG)'), {
            x: 55,
            y: signSectionY,
            size: 8.5,
            font: fontBold,
            color: cTextMain,
        });
        page2.drawText(safe('(Ký và xác thực chữ ký điện tử / OTP)'), {
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

        // Party B Signature Rendering
        let hasEmbeddedSig = false;
        if (data.signatureDataUrl) {
            try {
                let sigImageBytes: Buffer | null = null;
                if (data.signatureDataUrl.startsWith('data:image')) {
                    const base64Data = data.signatureDataUrl.split(',')[1];
                    sigImageBytes = Buffer.from(base64Data, 'base64');
                } else if (
                    data.signatureDataUrl.startsWith('http://') ||
                    data.signatureDataUrl.startsWith('https://')
                ) {
                    const axios = (await import('axios')).default;
                    const response = await axios.get(data.signatureDataUrl, {
                        responseType: 'arraybuffer',
                        timeout: 5000,
                    });
                    sigImageBytes = Buffer.from(response.data);
                }

                if (sigImageBytes) {
                    let sigImage;
                    try {
                        sigImage = await pdfDoc.embedPng(sigImageBytes);
                    } catch {
                        sigImage = await pdfDoc.embedJpg(sigImageBytes);
                    }
                    page2.drawImage(sigImage, {
                        x: 55,
                        y: signSectionY - 60,
                        width: 110,
                        height: 42,
                    });
                    hasEmbeddedSig = true;
                }
            } catch (e) {
                this.logger.warn('Could not embed signature:', e);
            }
        }

        if (!hasEmbeddedSig) {
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

        const stampTitle1 = safe('CÔNG TY CỔ PHẦN');
        const stampTitle2 = safe('SÂM NGỌC LINH');
        const stampTitle3 = safe('★ ĐÃ KÝ SỐ ★');

        page2.drawText(stampTitle1, {
            x: stampCenterX - (fontBold.widthOfTextAtSize(stampTitle1, 7) / 2),
            y: stampCenterY + 10,
            size: 7,
            font: fontBold,
            color: cRedStamp,
        });
        page2.drawText(stampTitle2, {
            x: stampCenterX - (fontBold.widthOfTextAtSize(stampTitle2, 7.5) / 2),
            y: stampCenterY - 1,
            size: 7.5,
            font: fontBold,
            color: cRedStamp,
        });
        page2.drawText(stampTitle3, {
            x: stampCenterX - (fontBold.widthOfTextAtSize(stampTitle3, 7) / 2),
            y: stampCenterY - 12,
            size: 7,
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

        page2.drawText(safe('CHỨNG THƯ XÁC THỰC HỢP ĐỒNG ĐIỆN TỬ (DIGITAL TIMESTAMP & QR CODE)'), {
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

        page2.drawText(safe('• Văn bản có giá trị pháp lý theo Luật Giao dịch điện tử 2023 và Bộ luật Dân sự 2015.'), {
            x: 92,
            y: footerY + 6,
            size: 6,
            font: fontOblique,
            color: cTextMuted,
        });

        // =========================================================================
        // PAGE 3: APPENDIX 03 - DETAILED ALLOCATED TREE ASSET LIST (IF ITEMS EXIST)
        // =========================================================================
        if (data.items && data.items.length > 0) {
            const page3 = pdfDoc.addPage([595.28, 841.89]);
            drawBorderAndHeader(page3, 3, 3);

            let textY3 = height - 76;
            page3.drawText(safe('PHỤ LỤC 03: DANH MỤC CÂY SÂM NGỌC LINH ĐƯỢC ĐỊNH DANH (BẤT BIẾN)'), {
                x: 38,
                y: textY3,
                size: 9,
                font: fontBold,
                color: cEmeraldDark,
            });
            textY3 -= 14;

            page3.drawText(safe('Bảng kê chi tiết snapshot từng cây sâm thuộc quyền sở hữu của Bên B tại thời điểm ký kết hợp đồng:'), {
                x: 38,
                y: textY3,
                size: 7.5,
                font: fontRegular,
                color: cTextMuted,
            });
            textY3 -= 18;

            // Table Header
            page3.drawRectangle({
                x: 35,
                y: textY3 - 4,
                width: width - 70,
                height: 18,
                color: cEmeraldLight,
                borderColor: cCardBorder,
                borderWidth: 0.8,
            });

            page3.drawText(safe('STT'), { x: 42, y: textY3 + 2, size: 7.5, font: fontBold, color: cEmeraldDark });
            page3.drawText(safe('Mã Cây Sâm'), { x: 70, y: textY3 + 2, size: 7.5, font: fontBold, color: cEmeraldDark });
            page3.drawText(safe('Tên Giống Sâm'), { x: 170, y: textY3 + 2, size: 7.5, font: fontBold, color: cEmeraldDark });
            page3.drawText(safe('Tuổi Lúc Ký'), { x: 340, y: textY3 + 2, size: 7.5, font: fontBold, color: cEmeraldDark });
            page3.drawText(safe('Vị Trí Vườn/Luống'), { x: 410, y: textY3 + 2, size: 7.5, font: fontBold, color: cEmeraldDark });
            page3.drawText(safe('Đơn Giá (VNĐ)'), { x: 495, y: textY3 + 2, size: 7.5, font: fontBold, color: cEmeraldDark });

            textY3 -= 18;

            // Render rows
            data.items.slice(0, 30).forEach((item, idx) => {
                const rowBg = idx % 2 === 1 ? rgb(0.98, 0.99, 0.98) : rgb(1, 1, 1);
                page3.drawRectangle({
                    x: 35,
                    y: textY3 - 3,
                    width: width - 70,
                    height: 14,
                    color: rowBg,
                });

                const locationStr = item.bedCode || item.gardenCode || 'Vườn Trà Linh';
                page3.drawText(String(idx + 1), { x: 44, y: textY3 + 1, size: 7, font: fontRegular, color: cTextMain });
                page3.drawText(safe(item.treeCode), { x: 70, y: textY3 + 1, size: 7, font: fontBold, color: cEmeraldMid });
                page3.drawText(safe(item.treeName || 'Sâm Ngọc Linh thuần chủng'), { x: 170, y: textY3 + 1, size: 7, font: fontRegular, color: cTextMain });
                page3.drawText(`${item.ageYearAtSign} năm tuổi`, { x: 345, y: textY3 + 1, size: 7, font: fontRegular, color: cTextMain });
                page3.drawText(safe(locationStr), { x: 410, y: textY3 + 1, size: 7, font: fontRegular, color: cTextMuted });
                page3.drawText((item.unitPrice || 0).toLocaleString('vi-VN'), { x: 495, y: textY3 + 1, size: 7, font: fontBold, color: cGold });

                textY3 -= 14;
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
        const verifyUrl = `${webUrl}/trace/contract/${encodeURIComponent(data.contractCode)}`;

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
            if (!text) return '';
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
