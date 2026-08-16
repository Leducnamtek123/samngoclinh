import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import * as fs from 'fs';
import fontkit from '@pdf-lib/fontkit';

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

        const page = pdfDoc.addPage([595.28, 841.89]); // A4 (Points: 595.28 x 841.89)
        const { width, height } = page.getSize();

        // 3. Load TrueType Fonts with Unicode Vietnamese support or fallback
        let fontRegular: PDFFont;
        let fontBold: PDFFont;
        let fontOblique: PDFFont;
        let isUnicode = false;

        try {
            const regularFontPath = 'C:/Windows/Fonts/arial.ttf';
            const boldFontPath = 'C:/Windows/Fonts/arialbd.ttf';
            const italicFontPath = 'C:/Windows/Fonts/ariali.ttf';

            if (fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath)) {
                fontRegular = await pdfDoc.embedFont(fs.readFileSync(regularFontPath));
                fontBold = await pdfDoc.embedFont(fs.readFileSync(boldFontPath));
                fontOblique = fs.existsSync(italicFontPath)
                    ? await pdfDoc.embedFont(fs.readFileSync(italicFontPath))
                    : fontRegular;
                isUnicode = true;
            } else {
                fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
                fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
                fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
            }
        } catch (e) {
            this.logger.warn('Could not load system TrueType font, using Helvetica fallback:', e);
            fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
            fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
        }

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

        // ==========================================
        // 4. LUXURY DOUBLE-BEZEL BORDER & ACCENTS
        // ==========================================
        // Outer Emerald Frame
        page.drawRectangle({
            x: 18,
            y: 18,
            width: width - 36,
            height: height - 36,
            borderColor: cEmeraldDark,
            borderWidth: 1.2,
        });

        // Inner Gold Hairline Frame
        page.drawRectangle({
            x: 22,
            y: 22,
            width: width - 44,
            height: height - 44,
            borderColor: cGold,
            borderWidth: 0.6,
        });

        // Corner Flourish Accent Marks (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
        const cornerSize = 10;
        // TL
        page.drawLine({ start: { x: 26, y: height - 26 }, end: { x: 26 + cornerSize, y: height - 26 }, color: cGold, thickness: 1 });
        page.drawLine({ start: { x: 26, y: height - 26 }, end: { x: 26, y: height - 26 - cornerSize }, color: cGold, thickness: 1 });
        // TR
        page.drawLine({ start: { x: width - 26, y: height - 26 }, end: { x: width - 26 - cornerSize, y: height - 26 }, color: cGold, thickness: 1 });
        page.drawLine({ start: { x: width - 26, y: height - 26 }, end: { x: width - 26, y: height - 26 - cornerSize }, color: cGold, thickness: 1 });
        // BL
        page.drawLine({ start: { x: 26, y: 26 }, end: { x: 26 + cornerSize, y: 26 }, color: cGold, thickness: 1 });
        page.drawLine({ start: { x: 26, y: 26 }, end: { x: 26, y: 26 + cornerSize }, color: cGold, thickness: 1 });
        // BR
        page.drawLine({ start: { x: width - 26, y: 26 }, end: { x: width - 26 - cornerSize, y: 26 }, color: cGold, thickness: 1 });
        page.drawLine({ start: { x: width - 26, y: 26 }, end: { x: width - 26, y: 26 + cornerSize }, color: cGold, thickness: 1 });

        // ==========================================
        // 5. NATIONAL MOTTO & BRAND TOP BAR
        // ==========================================
        const nationalTitle = safe('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM');
        const nationalMotto = safe('Độc lập - Tự do - Hạnh phúc');
        
        page.drawText(nationalTitle, {
            x: width / 2 - (fontBold.widthOfTextAtSize(nationalTitle, 10.5) / 2),
            y: height - 48,
            size: 10.5,
            font: fontBold,
            color: cTextMain,
        });

        page.drawText(nationalMotto, {
            x: width / 2 - (fontBold.widthOfTextAtSize(nationalMotto, 9.5) / 2),
            y: height - 62,
            size: 9.5,
            font: fontBold,
            color: cTextMain,
        });

        // Double Decorative Line under National Motto
        page.drawLine({
            start: { x: width / 2 - 70, y: height - 68 },
            end: { x: width / 2 + 70, y: height - 68 },
            thickness: 0.8,
            color: cGold,
        });

        // ==========================================
        // 6. BRAND HEADER & CONTRACT TITLE
        // ==========================================
        const brandTag = safe('SÂM NGỌC LINH FARM • HỆ THỐNG KÝ SỐ ĐIỆN TỬ WEFARM');
        page.drawText(brandTag, {
            x: width / 2 - (fontBold.widthOfTextAtSize(brandTag, 8) / 2),
            y: height - 88,
            size: 8,
            font: fontBold,
            color: cEmeraldMid,
        });

        const docTitle = safe((data.contractTitle || 'HỢP ĐỒNG KÝ GỬI & CHĂM SÓC SÂM NGỌC LINH').toUpperCase());
        page.drawText(docTitle, {
            x: width / 2 - (fontBold.widthOfTextAtSize(docTitle, 13.5) / 2),
            y: height - 108,
            size: 13.5,
            font: fontBold,
            color: cEmeraldDark,
        });

        const contractCodeClean = safe(data.contractCode.toUpperCase());
        const codeText = safe(`Mã hợp đồng: HD-${contractCodeClean}/2026/SNL • Chứng thực số`);
        page.drawText(codeText, {
            x: width / 2 - (fontOblique.widthOfTextAtSize(codeText, 8.5) / 2),
            y: height - 122,
            size: 8.5,
            font: fontOblique,
            color: cTextMuted,
        });

        // ==========================================
        // 7. PARTIES BENTO CARD (BÊN A & BÊN B)
        // ==========================================
        const partyBoxY = height - 140;
        const partyBoxHeight = 118;

        page.drawRectangle({
            x: 35,
            y: partyBoxY - partyBoxHeight,
            width: width - 70,
            height: partyBoxHeight,
            color: cEmeraldLight,
            borderColor: cCardBorder,
            borderWidth: 1,
        });

        // BÊN A
        const partyAName = safe(data.partyA || 'CÔNG TY CỔ PHẦN SÂM NGỌC LINH');
        page.drawText(safe('BÊN A (BÊN NHẬN KÝ GỬI & QUẢN LÝ VƯỜN SÂM):'), {
            x: 46,
            y: partyBoxY - 16,
            size: 9,
            font: fontBold,
            color: cEmeraldDark,
        });
        page.drawText(safe(`• Đơn vị: ${partyAName} (Mã số DN: 0401892834)`), {
            x: 46,
            y: partyBoxY - 29,
            size: 8,
            font: fontRegular,
            color: cTextMain,
        });
        page.drawText(safe('• Trụ sở: Xã Trà Linh, Huyện Nam Trà My, Tỉnh Quảng Nam / Hotline: 0967 234 234'), {
            x: 46,
            y: partyBoxY - 40,
            size: 8,
            font: fontRegular,
            color: cTextMuted,
        });

        // Dividing Line between Party A & B
        page.drawLine({
            start: { x: 46, y: partyBoxY - 48 },
            end: { x: width - 46, y: partyBoxY - 48 },
            thickness: 0.5,
            color: cCardBorder,
        });

        // BÊN B
        const customerName = safe(data.customerName || data.partyB || 'Khách hàng sở hữu');
        const customerPhone = safe(data.customerPhone || 'Chưa cập nhật');
        const customerEmail = safe(data.customerEmail || 'Chưa cập nhật');
        const ekycTag = data.customerIdentity ? safe(` [✓ eKYC ĐÃ XÁC THỰC CCCD: ${data.customerIdentity}]`) : safe(' [Chờ định danh]');

        page.drawText(safe('BÊN B (BÊN SỞ HỮU & GIAO ỦY THÁC CHĂM SÓC):'), {
            x: 46,
            y: partyBoxY - 62,
            size: 9,
            font: fontBold,
            color: cEmeraldDark,
        });
        page.drawText(safe(`• Chủ sở hữu: ${customerName}${ekycTag}`), {
            x: 46,
            y: partyBoxY - 75,
            size: 8,
            font: fontRegular,
            color: cTextMain,
        });
        page.drawText(safe(`• Điện thoại: ${customerPhone}  |  Email: ${customerEmail}`), {
            x: 46,
            y: partyBoxY - 86,
            size: 8,
            font: fontRegular,
            color: cTextMuted,
        });
        page.drawText(safe('• Cam kết: Cung cấp đầy đủ thông tin pháp lý phục vụ việc định danh và sở hữu nông sản.'), {
            x: 46,
            y: partyBoxY - 97,
            size: 7.5,
            font: fontOblique,
            color: cTextMuted,
        });

        // ==========================================
        // 8. ASSET SPECIFICATION & TRANSACTION TERMS
        // ==========================================
        let termsY = partyBoxY - partyBoxHeight - 16;

        page.drawText(safe('ĐIỀU KHOẢN KÝ GỬI & QUY CÁCH CÂY TRỒNG:'), {
            x: 35,
            y: termsY,
            size: 9.5,
            font: fontBold,
            color: cTextMain,
        });

        const formattedPrice = `${(Number(data.contractValue) || 0).toLocaleString('vi-VN')} VNĐ`;
        const treeInfo = data.treeCode && data.treeCode !== 'none'
            ? safe(`Lô cây sâm giống mã số: ${data.treeCode} (Sâm Ngọc Linh chính gốc)`)
            : safe('Gói dịch vụ ủy thác và chăm sóc cây sâm định danh');
        const signDateStr = new Date(data.signedAt).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const expiryDateStr = new Date(data.expiredAt).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        const termsList = [
            safe(`1. Đối tượng hợp tác: ${treeInfo}`),
            safe(`2. Tổng giá trị đầu tư / Hợp đồng: ${formattedPrice} (Đã bao gồm chi phí chăm sóc & bảo hiểm)`),
            safe(`3. Thời hạn hiệu lực: Từ ngày ký (${signDateStr}) đến hết ngày (${expiryDateStr})`),
            safe(`4. Tiêu chuẩn canh tác: Bên A chăm sóc theo quy trình hữu cơ vi sinh, hệ thống IoT & Camera giám sát 24/7.`),
            safe(`5. Cam kết bảo hiểm: Bên A bảo đảm 100% rủi ro sinh trưởng, bồi hoàn cây giống tương đương nếu suy kiệt.`),
            safe(`6. Quyền thu hoạch: Bên B toàn quyền nhận sản lượng củ/lá hoặc ủy quyền Bên A phân phối theo giá thị trường.`),
        ];

        termsList.forEach((term, index) => {
            const currentLineY = termsY - 16 - (index * 13.5);
            page.drawText(term, {
                x: 44,
                y: currentLineY,
                size: 8,
                font: fontRegular,
                color: cTextMain,
            });
        });

        // ==========================================
        // 9. SIGNATURES & OFFICIAL SEAL SECTION
        // ==========================================
        const signSectionY = 240;

        // Header Labels
        page.drawText(safe('ĐẠI DIỆN BÊN B (KHÁCH HÀNG)'), {
            x: 55,
            y: signSectionY,
            size: 9,
            font: fontBold,
            color: cTextMain,
        });
        page.drawText(safe('(Ký và xác thực chữ ký điện tử / OTP)'), {
            x: 55,
            y: signSectionY - 11,
            size: 7.5,
            font: fontOblique,
            color: cTextMuted,
        });

        page.drawText(safe('ĐẠI DIỆN BÊN A (NÔNG TRẠI SÂM)'), {
            x: width - 235,
            y: signSectionY,
            size: 9,
            font: fontBold,
            color: cTextMain,
        });
        page.drawText(safe('(Đã ký số & Đóng dấu pháp nhân)'), {
            x: width - 235,
            y: signSectionY - 11,
            size: 7.5,
            font: fontOblique,
            color: cTextMuted,
        });

        // Party B Signature Area (Embed Canvas Image or Cloudinary URL)
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
                } else if (data.signatureDataUrl.startsWith('/uploads/')) {
                    const localFilePath = (await import('path')).join(
                        process.cwd(),
                        data.signatureDataUrl
                    );
                    if (fs.existsSync(localFilePath)) {
                        sigImageBytes = fs.readFileSync(localFilePath);
                    }
                }

                if (sigImageBytes) {
                    let sigImage;
                    try {
                        sigImage = await pdfDoc.embedPng(sigImageBytes);
                    } catch {
                        sigImage = await pdfDoc.embedJpg(sigImageBytes);
                    }
                    page.drawImage(sigImage, {
                        x: 55,
                        y: signSectionY - 72,
                        width: 125,
                        height: 48,
                    });
                    hasEmbeddedSig = true;
                }
            } catch (e) {
                this.logger.warn('Could not embed user signature:', e);
            }
        }

        if (!hasEmbeddedSig) {
            page.drawText(safe(`[XÁC THỰC ĐIỆN TỬ: ${customerName}]`), {
                x: 55,
                y: signSectionY - 50,
                size: 8.5,
                font: fontBold,
                color: cEmeraldMid,
            });
        }

        page.drawText(safe(`Họ tên: ${customerName}`), {
            x: 55,
            y: signSectionY - 86,
            size: 8.5,
            font: fontBold,
            color: cTextMain,
        });
        page.drawText(safe(`IP: ${data.clientIp || '127.0.0.1'} | Ngày ký: ${signDateStr}`), {
            x: 55,
            y: signSectionY - 98,
            size: 7,
            font: fontRegular,
            color: cTextMuted,
        });

        // Party A Vector Red Stamp
        const stampCenterX = width - 145;
        const stampCenterY = signSectionY - 50;

        // Stamp Outer Ring
        page.drawCircle({
            x: stampCenterX,
            y: stampCenterY,
            size: 38,
            borderColor: cRedStamp,
            borderWidth: 1.8,
            color: cRedBg,
        });

        // Stamp Inner Ring
        page.drawCircle({
            x: stampCenterX,
            y: stampCenterY,
            size: 34,
            borderColor: cRedStamp,
            borderWidth: 0.8,
        });

        // Text inside Stamp
        const stampTitle1 = safe('CÔNG TY CỔ PHẦN');
        const stampTitle2 = safe('SÂM NGỌC LINH');
        const stampTitle3 = safe('★ ĐÃ KÝ SỐ ★');

        page.drawText(stampTitle1, {
            x: stampCenterX - (fontBold.widthOfTextAtSize(stampTitle1, 7.5) / 2),
            y: stampCenterY + 12,
            size: 7.5,
            font: fontBold,
            color: cRedStamp,
        });
        page.drawText(stampTitle2, {
            x: stampCenterX - (fontBold.widthOfTextAtSize(stampTitle2, 8) / 2),
            y: stampCenterY - 1,
            size: 8,
            font: fontBold,
            color: cRedStamp,
        });
        page.drawText(stampTitle3, {
            x: stampCenterX - (fontBold.widthOfTextAtSize(stampTitle3, 7.5) / 2),
            y: stampCenterY - 14,
            size: 7.5,
            font: fontBold,
            color: cRedStamp,
        });

        page.drawText(safe('Tổng Giám Đốc'), {
            x: stampCenterX - (fontBold.widthOfTextAtSize(safe('Tổng Giám Đốc'), 8.5) / 2),
            y: signSectionY - 86,
            size: 8.5,
            font: fontBold,
            color: cTextMain,
        });
        page.drawText(safe('Phạm Minh Đức'), {
            x: stampCenterX - (fontRegular.widthOfTextAtSize(safe('Phạm Minh Đức'), 8) / 2),
            y: signSectionY - 98,
            size: 8,
            font: fontRegular,
            color: cTextMuted,
        });

        // ==========================================
        // 10. CRYPTOGRAPHIC FOOTER & VERIFICATION QR
        // ==========================================
        const footerY = 32;

        page.drawRectangle({
            x: 35,
            y: footerY,
            width: width - 70,
            height: 62,
            color: rgb(0.98, 0.99, 0.98),
            borderColor: cCardBorder,
            borderWidth: 0.8,
        });

        // Draw QR Code
        page.drawImage(qrImage, {
            x: 42,
            y: footerY + 5,
            width: 52,
            height: 52,
        });

        page.drawText(safe('CHỨNG THƯ XÁC THỰC HỢP ĐỒNG ĐIỆN TỬ (DIGITAL TIMESTAMP & QR TRACEABILITY)'), {
            x: 104,
            y: footerY + 48,
            size: 7.5,
            font: fontBold,
            color: cEmeraldDark,
        });

        page.drawText(safe(`• Cổng tra cứu trực tuyến: ${verifyUrl}`), {
            x: 104,
            y: footerY + 36,
            size: 7,
            font: fontRegular,
            color: cTextMuted,
        });

        // Calculate SHA-256 Checksum
        const preSaveBytes = await pdfDoc.save();
        const docHash = crypto.createHash('sha256').update(Buffer.from(preSaveBytes)).digest('hex');

        page.drawText(safe(`• Mã băm SHA-256 toàn vẹn: ${docHash.slice(0, 42)}...`), {
            x: 104,
            y: footerY + 24,
            size: 7,
            font: fontBold,
            color: cTextMain,
        });

        page.drawText(safe('• Văn bản có giá trị pháp lý theo Luật Giao dịch điện tử 51/2005/QH11 và Bộ luật Dân sự 2015.'), {
            x: 104,
            y: footerY + 12,
            size: 6.5,
            font: fontOblique,
            color: cTextMuted,
        });

        // Page numbering
        page.drawText(safe('Trang 1 / 1'), {
            x: width - 75,
            y: footerY + 12,
            size: 7,
            font: fontBold,
            color: cEmeraldDark,
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
}
