import { Module } from '@nestjs/common';
import { ContactRepository } from '@modules/contact/repositories/contact.repository';
import { ContactService } from '@modules/contact/services/contact.service';

@Module({
    providers: [ContactService, ContactRepository],
    exports: [ContactService, ContactRepository],
    imports: [],
})
export class ContactModule {}
