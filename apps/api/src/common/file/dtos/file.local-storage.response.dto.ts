import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LocalStorageResponseDto {
    @ApiProperty({
        required: true,
        example: faker.system.filePath(),
        description: 'Relative storage key/path under the uploads directory',
    })
    @Expose()
    key: string;

    @ApiProperty({
        required: true,
        example: `/uploads/${faker.system.filePath()}`,
        description: 'Relative URL to access the file (served under /uploads)',
    })
    @Expose()
    url: string;

    @ApiProperty({
        required: true,
        example: 'image/jpeg',
        description: 'MIME type of the file',
    })
    @Expose()
    mime: string;

    @ApiProperty({
        required: true,
        example: 'jpg',
        description: 'File extension',
    })
    @Expose()
    extension: string;

    @ApiProperty({
        required: true,
        example: 1024,
        description: 'Size of the file in bytes',
    })
    @Expose()
    size: number;
}
