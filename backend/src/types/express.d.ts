// Express Request 타입 확장
// Passport의 req.user 타입 정의

declare namespace Express {
    export interface User {
        sub: string;
        username: string;
        email?: string;
        picture?: null;
        iat?: number;
    }
}
