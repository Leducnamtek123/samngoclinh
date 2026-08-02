import { Global, Module } from '@nestjs/common';
import { UserService } from '@modules/user/services/user.service';
import { PasswordHistoryModule } from '@modules/password-history/password-history.module';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { UserUtil } from '@modules/user/utils/user.util';
import { CountryModule } from '@modules/country/country.module';

/** Exports user service, repository, and util; controllers are wired through the router. */
@Global()
@Module({
    imports: [PasswordHistoryModule, CountryModule],
    exports: [UserService, UserRepository, UserUtil],
    providers: [UserService, UserRepository, UserUtil],
    controllers: [],
})
export class UserModule {}
