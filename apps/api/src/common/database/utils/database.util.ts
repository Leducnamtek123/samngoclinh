import { Injectable } from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

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
    toPlainObject<T, N = any>(data: T): N {
        return structuredClone(data as unknown) as N;
    }

    /**
     * Deep-clones `data` and casts it to a Prisma-compatible plain array.
     */
    toPlainArray<T>(data: T): any {
        return structuredClone(data);
    }
}
