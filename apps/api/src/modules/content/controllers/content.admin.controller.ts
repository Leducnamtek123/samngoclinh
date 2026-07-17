import { Body, Controller, Delete, Param, Post, Put, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { ContentArticle, EnumRoleType } from '@generated/prisma-client';
import { ContentService } from '../services/content.service';
import { ContentArticleCreateDto, ContentArticleUpdateDto } from '../dtos/content.admin.dto';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import {
    ContentAdminCreateArticleDoc,
    ContentAdminDeleteArticleDoc,
    ContentAdminUpdateArticleDoc,
} from '../docs/content.admin.doc';

@ApiTags('modules.admin.content')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/admin/content',
})
export class ContentAdminController {
    constructor(private readonly contentService: ContentService) {}

    @ContentAdminCreateArticleDoc()
    @Response('content.create')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/articles')
    async createArticle(@Body() body: ContentArticleCreateDto): Promise<IResponseReturn<ContentArticle>> {
        return this.contentService.createArticle(body);
    }

    @ContentAdminUpdateArticleDoc()
    @Response('content.update')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/articles/:id')
    async updateArticle(@Param('id') id: string, @Body() body: ContentArticleUpdateDto): Promise<IResponseReturn<ContentArticle>> {
        return this.contentService.updateArticle(id, body);
    }

    @ContentAdminDeleteArticleDoc()
    @Response('content.delete')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/articles/:id')
    async deleteArticle(@Param('id') id: string): Promise<IResponseReturn<void>> {
        return this.contentService.deleteArticle(id);
    }
}
