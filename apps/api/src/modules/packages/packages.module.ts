import { Module } from '@nestjs/common';
import { PackagesService } from './services/packages.service';
import { PackagesAdminController } from './controllers/packages.admin.controller';
import { PackagesUserController } from './controllers/packages.user.controller';

@Module({
    controllers: [PackagesAdminController, PackagesUserController],
    providers: [PackagesService],
    exports: [PackagesService],
})
export class PackagesModule {}
