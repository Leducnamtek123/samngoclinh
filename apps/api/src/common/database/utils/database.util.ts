import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';

/**
 * UUID helpers and deep-clone casts to Prisma `JsonObject` types.
 */
@Injectable()
export class DatabaseUtil {
    checkIdIsValid(id: string): boolean {
        return id ? uuidValidate(id) : false;
    }

    createId(): string {
        return uuidv4();
    }

    /**
     * Deep-clones `data` and casts it to a Prisma-compatible plain object.
     */
    toPlainObject<T, N = Prisma.InputJsonValue>(data: T): N {
        return structuredClone(data as unknown) as N;
    }

    /**
     * Deep-clones `data` and casts it to a Prisma-compatible plain array.
     */
    toPlainArray<T>(data: T): Prisma.InputJsonValue {
        return structuredClone(data as unknown) as Prisma.InputJsonValue;
    }
}
