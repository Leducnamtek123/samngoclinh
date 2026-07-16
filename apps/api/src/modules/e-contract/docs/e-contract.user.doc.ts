import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { EContractSignRequestDto } from '@modules/e-contract/dtos/request/e-contract.sign.request.dto';
import { EContractRenewRequestDto } from '@modules/e-contract/dtos/request/e-contract.renew.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function EContractUserListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get list of contracts for the current logged in user',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('eContract.list')
    );
}

export function EContractUserGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get details of a contract',
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
        DocResponse('eContract.get')
    );
}

export function EContractUserSignDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Sign a contract',
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
            dto: EContractSignRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('eContract.sign')
    );
}

export function EContractUserRenewDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Renew / Extend a contract',
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
            dto: EContractRenewRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('eContract.renew')
    );
}
