import { Module } from '@nestjs/common';
import { ContentRepository } from '@modules/content/repositories/content.repository';
import { ContentService } from '@modules/content/services/content.service';

@Module({
    controllers: [],
    providers: [ContentService, ContentRepository],
    exports: [ContentService],
    imports: [],
})
export class ContentModule {}
