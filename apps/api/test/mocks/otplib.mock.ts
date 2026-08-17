export enum HashAlgorithm {
    SHA1 = 'sha1',
    SHA256 = 'sha256',
    SHA512 = 'sha512',
}

export enum OTPStrategy {
    TOTP = 'totp',
    HOTP = 'hotp',
}

export const generateSecret = () => 'JBSWY3DPEHPK3PXP';
export const generateURI = ({ issuer, label, secret }: any) =>
    `otpauth://totp/${issuer}:${label}?secret=${secret}&issuer=${issuer}`;
export const verifySync = ({ token, secret }: any) =>
    token === '123456' || Boolean(secret);

export default {
    HashAlgorithm,
    OTPStrategy,
    generateSecret,
    generateURI,
    verifySync,
};
