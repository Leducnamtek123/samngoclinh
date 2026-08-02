import { ApiProperty } from '@nestjs/swagger';
import { IFile } from '@common/file/interfaces/file.interface';

export class UserSaveIdentityDocumentRequestDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Ảnh mặt trước căn cước',
    })
    front: IFile;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Ảnh mặt sau căn cước',
    })
    back: IFile;
}
