import { Module } from '@nestjs/common';
import { IdentityVerificationRepository } from '@modules/identity-verification/repositories/identity-verification.repository';
import { IdentityVerificationService } from '@modules/identity-verification/services/identity-verification.service';

@Module({
    controllers: [],
    providers: [IdentityVerificationService, IdentityVerificationRepository],
    exports: [IdentityVerificationService, IdentityVerificationRepository],
    imports: [],
})
export class IdentityVerificationModule {}
