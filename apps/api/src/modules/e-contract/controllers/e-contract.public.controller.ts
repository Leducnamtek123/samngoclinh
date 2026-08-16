import { Controller, Get, Param, Query, Res, VERSION_NEUTRAL } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
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
        example: 'CTR-O20260815123',
    })
    @ApiResponse({
        status: 200,
        description: 'Thông tin xác thực hợp đồng',
    })
    @Response('eContract.verify')
    @Get('/verify/:code')
    async verifyContract(
        @Param('code') code: string
    ): Promise<IResponseReturn<IPublicContractVerification>> {
        return this.eContractService.verifyContractByCode(code);
    }

    @ApiOperation({
        summary: 'Tải hoặc xem trực tiếp file PDF hợp đồng có dấu mộc điện tử',
        description: 'Xuất stream file PDF chính thức kèm đầy đủ dấu mộc, chữ ký và mã QR tra cứu.',
    })
    @ApiParam({
        name: 'code',
        required: true,
        type: 'string',
        example: 'CTR-O20260815123',
    })
    @Get('/:code/pdf')
    async getContractPdf(
        @Param('code') code: string,
        @Res() res: ExpressResponse
    ): Promise<void> {
        const { buffer, fileName } = await this.eContractService.getContractPdfBuffer(code);

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
        example: 'CTR-O20260815123',
    })
    @ApiParam({
        name: 'amendmentCode',
        required: true,
        type: 'string',
        example: 'AMD-CTR-O20260815123-01',
    })
    @Get('/:code/amendments/:amendmentCode/pdf')
    async getAmendmentPdf(
        @Param('code') code: string,
        @Param('amendmentCode') amendmentCode: string,
        @Res() res: ExpressResponse
    ): Promise<void> {
        const { buffer, fileName } = await this.eContractService.getAmendmentPdfBuffer(code, amendmentCode);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${fileName}"`,
            'Content-Length': buffer.length,
            'Cache-Control': 'public, max-age=3600',
        });

        res.end(buffer);
    }
}
