import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { EnumAppEnvironment } from '@app/enums/app.enum';
import { MessageService } from '@common/message/services/message.service';
import { RoutesPublicModule } from '@routes/routes.public.module';
import { RoutesUserModule } from '@routes/routes.user.module';
import { RoutesAdminModule } from '@routes/routes.admin.module';
import { RoutesSystemModule } from '@routes/routes.system.module';

export default async function (app: NestApplication): Promise<void> {
    const configService = app.get(ConfigService);
    const messageService = app.get(MessageService);

    const env: string = configService.get<string>('app.env')!;
    const appName: string = configService.get<string>('app.name')!;
    const appVersion: string = configService.get<string>('app.version')!;
    const appUrl: string = configService.get<string>('app.url')!;

    const appAuthorName: string = configService.get<string>('app.author.name')!;
    const appAuthorEmail: string =
        configService.get<string>('app.author.email')!;

    const docName: string = configService.get<string>('doc.name')!;
    const docVersion: string = configService.get<string>('doc.version')!;
    const docPrefix: string = configService.get<string>('doc.prefix')!;

    const logger = new Logger(`${appName}-Doc`);

    if (env !== EnumAppEnvironment.production) {
        const documentBuild = new DocumentBuilder()
            .setTitle(docName)
            .setVersion(appVersion)
            .setOpenAPIVersion(docVersion)
            .setDescription(
                messageService.setMessage('doc.description', {
                    properties: {
                        appName,
                    },
                })
            )
            .setContact(appAuthorName, appUrl, appAuthorEmail)
            .addServer('/')
            .addBearerAuth(
                { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                'accessToken'
            )
            .addBearerAuth(
                { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                'refreshToken'
            )
            .addBearerAuth(
                { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                'google'
            )
            .addBearerAuth(
                { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                'apple'
            )
            .addApiKey(
                { type: 'apiKey', in: 'header', name: 'x-api-key' },
                'xApiKey'
            )
            .build();

        const documentAll = SwaggerModule.createDocument(app, documentBuild, {
            deepScanRoutes: true,
        });

        const documentPublic = SwaggerModule.createDocument(
            app,
            documentBuild,
            {
                deepScanRoutes: true,
                include: [RoutesPublicModule],
            }
        );

        const documentUser = SwaggerModule.createDocument(app, documentBuild, {
            deepScanRoutes: true,
            include: [RoutesUserModule],
        });

        const documentAdmin = SwaggerModule.createDocument(app, documentBuild, {
            deepScanRoutes: true,
            include: [RoutesAdminModule],
        });

        const documentSystem = SwaggerModule.createDocument(
            app,
            documentBuild,
            {
                deepScanRoutes: true,
                include: [RoutesSystemModule],
            }
        );

        try {
            writeFileSync(
                'generated/swagger.json',
                JSON.stringify(documentAll)
            );
        } catch (err: unknown) {
            logger.warn(err, 'Failed to write swagger.json');
        }

        SwaggerModule.setup(`${docPrefix}/public`, app, documentPublic, {
            jsonDocumentUrl: `${docPrefix}/public/json`,
        });
        SwaggerModule.setup(`${docPrefix}/user`, app, documentUser, {
            jsonDocumentUrl: `${docPrefix}/user/json`,
        });
        SwaggerModule.setup(`${docPrefix}/admin`, app, documentAdmin, {
            jsonDocumentUrl: `${docPrefix}/admin/json`,
        });
        SwaggerModule.setup(`${docPrefix}/system`, app, documentSystem, {
            jsonDocumentUrl: `${docPrefix}/system/json`,
        });
        SwaggerModule.setup(`${docPrefix}/all`, app, documentAll, {
            jsonDocumentUrl: `${docPrefix}/all/json`,
        });

        SwaggerModule.setup(docPrefix, app, documentAll, {
            jsonDocumentUrl: `${docPrefix}/json`,
            explorer: true,
            customSiteTitle: docName,
            ui: true,
            raw: ['json'],
            swaggerOptions: {
                urls: [
                    {
                        url: `/${docPrefix}/public/json`,
                        name: 'Public APIs',
                    },
                    {
                        url: `/${docPrefix}/user/json`,
                        name: 'User APIs',
                    },
                    {
                        url: `/${docPrefix}/admin/json`,
                        name: 'Admin APIs',
                    },
                    {
                        url: `/${docPrefix}/system/json`,
                        name: 'System APIs',
                    },
                    {
                        url: `/${docPrefix}/all/json`,
                        name: 'All APIs',
                    },
                ],
                docExpansion: 'none',
                persistAuthorization: true,
                displayOperationId: true,
                operationsSorter: 'method',
                tagsSorter: 'alpha',
                tryItOutEnabled: true,
                filter: true,
                deepLinking: true,
            },
        });

        logger.log(`Docs will serve on ${docPrefix}`, 'NestApplication');
    }
}
