import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocRequestFile,
    DocResponse,
    DocResponsePaging,
} from '@common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';
import { LocalStorageResponseDto } from '@common/file/dtos/file.local-storage.response.dto';
import {
    TermPolicyDocParamsGetContent,
    TermPolicyDocParamsId,
    TermPolicyListAdminDocQuery,
} from '@modules/term-policy/constants/term-policy.doc.constant';
import { TermPolicyUploadContentRequestDto } from '@modules/term-policy/dtos/request/term-policy.upload-content.request.dto';
import { TermPolicyContentRequestDto } from '@modules/term-policy/dtos/request/term-policy.content.request.dto';
import { TermPolicyCreateRequestDto } from '@modules/term-policy/dtos/request/term-policy.create.request.dto';
import { TermPolicyRemoveContentRequestDto } from '@modules/term-policy/dtos/request/term-policy.remove-content.request.dto';
import { TermPolicyResponseDto } from '@modules/term-policy/dtos/response/term-policy.response.dto';
import { HttpStatus, applyDecorators } from '@nestjs/common';

export function TermPolicyAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Retrieve list of terms and policies for admin',
        }),
        DocRequest({
            queries: TermPolicyListAdminDocQuery,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({
            policy: true,
            role: true,
            termPolicy: true,
        }),
        DocResponsePaging<TermPolicyResponseDto>('termPolicy.list', {
            dto: TermPolicyResponseDto,
        })
    );
}

export function TermPolicyAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Create a new term or policy',
        }),
        DocAuth({
            jwtAccessToken: true,
            xApiKey: true,
        }),
        DocGuard({
            policy: true,
            role: true,
            termPolicy: true,
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: TermPolicyCreateRequestDto,
        }),
        DocResponse<TermPolicyResponseDto>('termPolicy.create', {
            dto: TermPolicyResponseDto,
            httpStatus: HttpStatus.CREATED,
        })
    );
}

export function TermPolicyAdminDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Delete a term or policy by ID',
        }),
        DocAuth({
            jwtAccessToken: true,
            xApiKey: true,
        }),
        DocGuard({
            policy: true,
            role: true,
            termPolicy: true,
        }),
        DocRequest({
            params: TermPolicyDocParamsId,
        }),
        DocResponse<TermPolicyResponseDto>('termPolicy.create', {
            dto: TermPolicyResponseDto,
        })
    );
}

export function TermPolicyAdminUploadContentDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Upload term or policy content file (stored locally)',
        }),
        DocAuth({
            jwtAccessToken: true,
            xApiKey: true,
        }),
        DocGuard({
            policy: true,
            role: true,
            termPolicy: true,
        }),
        DocRequestFile({
            dto: TermPolicyUploadContentRequestDto,
        }),
        DocResponse<LocalStorageResponseDto>('termPolicy.uploadContent', {
            dto: LocalStorageResponseDto,
        })
    );
}

export function TermPolicyAdminUpdateContentDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Update content of a term or policy by ID',
        }),
        DocAuth({
            jwtAccessToken: true,
            xApiKey: true,
        }),
        DocGuard({
            policy: true,
            role: true,
            termPolicy: true,
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: TermPolicyContentRequestDto,
            params: TermPolicyDocParamsId,
        }),
        DocResponse('termPolicy.updateContent')
    );
}

export function TermPolicyAdminAddContentDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Add content to a term or policy by ID',
        }),
        DocAuth({
            jwtAccessToken: true,
            xApiKey: true,
        }),
        DocGuard({
            policy: true,
            role: true,
            termPolicy: true,
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: TermPolicyContentRequestDto,
            params: TermPolicyDocParamsId,
        }),
        DocResponse('termPolicy.addContent')
    );
}

export function TermPolicyAdminRemoveContentDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Remove content of a term or policy by ID',
        }),
        DocAuth({
            jwtAccessToken: true,
            xApiKey: true,
        }),
        DocGuard({
            policy: true,
            role: true,
            termPolicy: true,
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: TermPolicyRemoveContentRequestDto,
            params: TermPolicyDocParamsId,
        }),
        DocResponse('termPolicy.removeContent')
    );
}

export function TermPolicyAdminGetContentDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get content of a term or policy by ID and language',
        }),
        DocAuth({
            jwtAccessToken: true,
            xApiKey: true,
        }),
        DocGuard({
            policy: true,
            role: true,
            termPolicy: true,
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            params: TermPolicyDocParamsGetContent,
        }),
        DocResponse('termPolicy.getContent', {
            dto: LocalStorageResponseDto,
        })
    );
}

export function TermPolicyAdminPublishDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Publish a term or policy by ID',
        }),
        DocAuth({
            jwtAccessToken: true,
            xApiKey: true,
        }),
        DocGuard({
            policy: true,
            role: true,
            termPolicy: true,
        }),
        DocRequest({
            params: TermPolicyDocParamsId,
        }),
        DocResponse('termPolicy.publish')
    );
}
