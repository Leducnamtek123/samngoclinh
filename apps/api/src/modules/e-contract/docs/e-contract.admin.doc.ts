import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { EContractCreateRequestDto } from '@modules/e-contract/dtos/request/e-contract.create.request.dto';
import { EContractUpdateRequestDto } from '@modules/e-contract/dtos/request/e-contract.update.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function EContractAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Create a new contract for a user',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: EContractCreateRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('eContract.create')
    );
}

export function EContractAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List all contracts',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('eContract.list')
    );
}

export function EContractAdminGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get details of a single contract by ID or Code',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Contract ID or Code',
                    required: true,
                    type: 'string',
                },
            ],
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('eContract.get')
    );
}

export function EContractAdminUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Update details of a contract',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Contract ID',
                    required: true,
                    type: 'string',
                },
            ],
            bodyType: EnumDocRequestBodyType.json,
            dto: EContractUpdateRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('eContract.update')
    );
}

export function EContractAdminDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Delete a contract',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Contract ID',
                    required: true,
                    type: 'string',
                },
            ],
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('eContract.delete')
    );
}

export function EContractAdminCheckExpiryDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Trigger contract expiry scans and reminder alerts',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('eContract.checkExpiry')
    );
}
