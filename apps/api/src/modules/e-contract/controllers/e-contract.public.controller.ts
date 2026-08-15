import { Controller, Get, Param, Res, VERSION_NEUTRAL } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { EContractService, IPublicContractVerification } from '@modules/e-contract/services/e-contract.service';
import { IResponseReturn } from '@common/response/interfaces/response.interface';

@ApiTags('modules.public.eContract')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/contracts',
})
export class EContractPublicController {
    constructor(private readonly eContractService: EContractService) {}

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
}
