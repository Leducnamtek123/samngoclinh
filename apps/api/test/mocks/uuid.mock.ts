import { randomUUID } from 'crypto';

export const v4 = () => randomUUID();
export const validate = (val: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);
export const version = () => 4;
export const NIL = '00000000-0000-0000-0000-000000000000';
export const MAX = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

export default {
    v4,
    validate,
    version,
    NIL,
    MAX,
};
