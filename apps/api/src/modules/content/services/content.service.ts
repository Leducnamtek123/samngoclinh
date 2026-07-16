import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { Injectable } from '@nestjs/common';
import { IContentArticleItem } from '@modules/content/interfaces/content.interface';
import { ContentRepository } from '@modules/content/repositories/content.repository';

@Injectable()
export class ContentService {
    constructor(private readonly contentRepository: ContentRepository) {}

    async listArticles(): Promise<IResponseReturn<{ items: IContentArticleItem[] }>> {
        return {
            data: {
                items: await this.contentRepository.listArticles(),
            },
        };
    }
}
