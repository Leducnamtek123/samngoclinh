import { TermPolicyAcceptRequestDto } from '@modules/term-policy/dtos/request/term-policy.accept.request.dto';
import { TermPolicyContentMetaRequestDto } from '@modules/term-policy/dtos/request/term-policy.content-meta.request.dto';
import { TermPolicyContentsRequestDto } from '@modules/term-policy/dtos/request/term-policy.content.request.dto';
import { IntersectionType, PickType } from '@nestjs/swagger';

export class TermPolicyCreateRequestDto extends IntersectionType(
    TermPolicyAcceptRequestDto,
    TermPolicyContentsRequestDto,
    PickType(TermPolicyContentMetaRequestDto, ['version'] as const)
) {}
