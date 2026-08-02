import { TermPolicyContentMetaRequestDto } from '@modules/term-policy/dtos/request/term-policy.content-meta.request.dto';
import { PickType } from '@nestjs/swagger';

export class TermPolicyRemoveContentRequestDto extends PickType(
    TermPolicyContentMetaRequestDto,
    ['language'] as const
) {}
