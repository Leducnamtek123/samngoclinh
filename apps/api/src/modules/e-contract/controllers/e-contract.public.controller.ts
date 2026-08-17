import { Controller, Get, Param, Query, Res, VERSION_NEUTRAL } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { EContractService, IPublicContractVerification } from '@modules/e-contract/services/e-contract.service';
import { EContractTemplateService, IContractTemplateItem } from '@modules/e-contract/services/e-contract.template.service';
import { IResponseReturn } from '@common/response/interfaces/response.interface';

@ApiTags('modules.public.eContract')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/contracts',
})
export class EContractPublicController {
    constructor(
        private readonly eContractService: EContractService,
        private readonly eContractTemplateService: EContractTemplateService
    ) {}

    @ApiOperation({
        summary: 'Lấy danh sách các mẫu hợp đồng và điều khoản HTML',
        description: 'Trả về toàn bộ danh sách các mẫu văn bản hợp đồng và điều khoản hiện có.',
    })
    @Response('eContract.listTemplates')
    @Get('/templates')
    async listTemplates(): Promise<IResponseReturn<IContractTemplateItem[]>> {
        const templates = await this.eContractTemplateService.listTemplates();
        return {
            data: templates,
        };
    }

    @ApiOperation({
        summary: 'Lấy nội dung mẫu hợp đồng hoặc điều khoản theo slug (HTML Template)',
        description: 'Tải văn bản mẫu HTML mới nhất của hợp đồng hoặc điều khoản, có hỗ trợ điền tự động placeholder.',
    })
    @ApiParam({
        name: 'slug',
        required: true,
        type: 'string',
        example: 'hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh',
    })
    @Response('eContract.getTemplate')
    @Get('/templates/:slug')
    async getTemplate(
        @Param('slug') slug: string,
        @Query() query: Record<string, string>
    ): Promise<IResponseReturn<IContractTemplateItem>> {
        const template = await this.eContractTemplateService.getTemplate(slug, query);
        return {
            data: template,
        };
    }

    @ApiOperation({
        summary: 'Xác thực hợp đồng điện tử công khai qua mã QR',
        description: 'Cho phép quét mã QR để tra cứu tính pháp lý, tính toàn vẹn và thông tin chứng thực hợp đồng.',
    })
    @ApiParam({
        name: 'code',
        required: true,
        type: 'string',
        example: 'CTR-SNL-2026/7090',
    })
    @ApiResponse({
        status: 200,
        description: 'Thông tin xác thực hợp đồng',
    })
    @Response('eContract.verify')
    @Get(['/verify', '/verify/:code', '/verify/:p1/:p2', '/verify/:p1/:p2/:p3'])
    async verifyContract(
        @Param('code') code?: string,
        @Param('p1') p1?: string,
        @Param('p2') p2?: string,
        @Param('p3') p3?: string,
        @Query('code') queryCode?: string
    ): Promise<IResponseReturn<IPublicContractVerification>> {
        const resolvedCode = queryCode || code || [p1, p2, p3].filter(Boolean).join('/');
        return this.eContractService.verifyContractByCode(resolvedCode);
    }

    @ApiOperation({
        summary: 'Tải hoặc xem trực tiếp file PDF hợp đồng có dấu mộc điện tử',
        description: 'Xuất stream file PDF chính thức kèm đầy đủ dấu mộc, chữ ký và mã QR tra cứu.',
    })
    @ApiParam({
        name: 'code',
        required: true,
        type: 'string',
        example: 'CTR-SNL-2026/7090',
    })
    @Get(['/pdf', '/:code/pdf', '/:p1/:p2/pdf', '/:p1/:p2/:p3/pdf'])
    async getContractPdf(
        @Param('code') code: string | undefined,
        @Param('p1') p1: string | undefined,
        @Param('p2') p2: string | undefined,
        @Param('p3') p3: string | undefined,
        @Query('code') queryCode: string | undefined,
        @Res() res: ExpressResponse
    ): Promise<void> {
        const resolvedCode = queryCode || code || [p1, p2, p3].filter(Boolean).join('/');
        const { buffer, fileName } = await this.eContractService.getContractPdfBuffer(resolvedCode);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${fileName}"`,
            'Content-Length': buffer.length,
            'Cache-Control': 'public, max-age=3600',
        });

        res.end(buffer);
    }

    @ApiOperation({
        summary: 'Tải hoặc xem trực tiếp file PDF Phụ lục hợp đồng đã ký số',
        description: 'Xuất stream file PDF chính thức của phụ lục hợp đồng kèm đầy đủ dấu mộc, chữ ký và mã QR tra cứu.',
    })
    @ApiParam({
        name: 'code',
        required: true,
        type: 'string',
        example: 'CTR-SNL-2026/7090',
    })
    @ApiParam({
        name: 'amendmentCode',
        required: true,
        type: 'string',
        example: 'AMD-CTR-SNL-2026/7090-01',
    })
    @Get([
        '/amendments/pdf',
        '/:code/amendments/:amendmentCode/pdf',
        '/:p1/:p2/amendments/:a1/pdf',
        '/:p1/:p2/amendments/:a1/:a2/pdf',
    ])
    async getAmendmentPdf(
        @Param('code') code: string | undefined,
        @Param('p1') p1: string | undefined,
        @Param('p2') p2: string | undefined,
        @Param('amendmentCode') amendmentCode: string | undefined,
        @Param('a1') a1: string | undefined,
        @Param('a2') a2: string | undefined,
        @Query('code') queryCode: string | undefined,
        @Query('amendmentCode') queryAmdCode: string | undefined,
        @Res() res: ExpressResponse
    ): Promise<void> {
        const resolvedCode = queryCode || code || [p1, p2].filter(Boolean).join('/');
        const resolvedAmdCode = queryAmdCode || amendmentCode || [a1, a2].filter(Boolean).join('/');
        const { buffer, fileName } = await this.eContractService.getAmendmentPdfBuffer(resolvedCode, resolvedAmdCode);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${fileName}"`,
            'Content-Length': buffer.length,
            'Cache-Control': 'public, max-age=3600',
        });

        res.end(buffer);
    }
}
