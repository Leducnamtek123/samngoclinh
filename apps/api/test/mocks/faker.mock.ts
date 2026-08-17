function createFakerProxy(): any {
    const fn: any = (..._args: any[]) => 'mock-value';
    return new Proxy(fn, {
        get: (_target, prop) => {
            if (prop === 'then' || prop === 'Symbol(Symbol.toStringTag)') {
                return undefined;
            }
            return createFakerProxy();
        },
        apply: (_target, _thisArg, _args) => {
            return 'mock-value';
        },
    });
}

export const faker = createFakerProxy();
export default faker;
