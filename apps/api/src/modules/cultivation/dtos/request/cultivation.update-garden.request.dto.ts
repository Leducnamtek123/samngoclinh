import { PartialType } from '@nestjs/swagger';
import { CultivationCreateGardenRequestDto } from './cultivation.create-garden.request.dto';

export class CultivationUpdateGardenRequestDto extends PartialType(CultivationCreateGardenRequestDto) {}
