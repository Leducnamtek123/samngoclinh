import { Body, Controller, Delete, Param, Post, Put, VERSION_NEUTRAL, UploadedFile, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { CatalogPlant, CatalogProduct, EnumRoleType } from '@generated/prisma-client';
import { CatalogService } from '../services/catalog.service';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { FileUploadSingle } from '@common/file/decorators/file.decorator';
import { IFile } from '@common/file/interfaces/file.interface';
import { FileExtensionPipe } from '@common/file/pipes/file.extension.pipe';
import { EnumFileExtensionImage } from '@common/file/enums/file.enum';
import { RequestRequiredPipe } from '@common/request/pipes/request.required.pipe';
import { v2 as cloudinary } from 'cloudinary';
import {
    CatalogPlantCreateDto,
    CatalogPlantUpdateDto,
    CatalogProductCreateDto,
    CatalogProductUpdateDto,
} from '../dtos/catalog.admin.dto';
import {
    CatalogAdminCreatePlantDoc,
    CatalogAdminCreateProductDoc,
    CatalogAdminDeletePlantDoc,
    CatalogAdminDeleteProductDoc,
    CatalogAdminUpdatePlantDoc,
    CatalogAdminUpdateProductDoc,
} from '../docs/catalog.admin.doc';

@ApiTags('modules.admin.catalog')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/catalog',
})
export class CatalogAdminController {
    constructor(private readonly catalogService: CatalogService) {}

    @CatalogAdminCreatePlantDoc()
    @Response('catalog.create')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/plants')
    async createPlant(@Body() body: CatalogPlantCreateDto): Promise<IResponseReturn<CatalogPlant>> {
        return this.catalogService.createPlant(body);
    }

    @CatalogAdminUpdatePlantDoc()
    @Response('catalog.update')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/plants/:id')
    async updatePlant(@Param('id') id: string, @Body() body: CatalogPlantUpdateDto): Promise<IResponseReturn<CatalogPlant>> {
        return this.catalogService.updatePlant(id, body);
    }

    @CatalogAdminDeletePlantDoc()
    @Response('catalog.delete')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/plants/:id')
    async deletePlant(@Param('id') id: string): Promise<IResponseReturn<CatalogPlant>> {
        return this.catalogService.deletePlant(id);
    }

    @CatalogAdminCreateProductDoc()
    @Response('catalog.create')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/shop-items')
    async createProduct(@Body() body: CatalogProductCreateDto): Promise<IResponseReturn<CatalogProduct>> {
        return this.catalogService.createProduct(body);
    }

    @CatalogAdminUpdateProductDoc()
    @Response('catalog.update')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/shop-items/:id')
    async updateProduct(@Param('id') id: string, @Body() body: CatalogProductUpdateDto): Promise<IResponseReturn<CatalogProduct>> {
        return this.catalogService.updateProduct(id, body);
    }

    @CatalogAdminDeleteProductDoc()
    @Response('catalog.delete')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/shop-items/:id')
    async deleteProduct(@Param('id') id: string): Promise<IResponseReturn<CatalogProduct>> {
        return this.catalogService.deleteProduct(id);
    }

    @Response('catalog.listPlants')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @FileUploadSingle()
    @HttpCode(HttpStatus.OK)
    @Post('/upload')
    async uploadFile(
        @UploadedFile(
            RequestRequiredPipe,
            FileExtensionPipe([
                EnumFileExtensionImage.jpeg,
                EnumFileExtensionImage.png,
                EnumFileExtensionImage.jpg,
            ])
        )
        file: IFile
    ): Promise<IResponseReturn<{ url: string }>> {
        try {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });

            const uploadFromBuffer = (buffer: Buffer): Promise<any> => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'samngoclinh',
                        },
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
                    uploadStream.end(buffer);
                });
            };

            const result = await uploadFromBuffer(file.buffer);
            return {
                data: {
                    url: result.secure_url,
                },
            };
        } catch (e: any) {
            console.error('CLOUDINARY UPLOAD FAILED:', e);
            throw new Error(`Cloudinary upload failed: ${e?.message || e}`);
        }
    }
}
