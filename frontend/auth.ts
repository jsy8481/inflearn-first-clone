import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { comparePassword } from '@/lib/password-utils';
import * as jwt from 'jsonwebtoken';
import type { JWT } from 'next-auth/jwt';

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {
                    label: '이메일',
                    type: 'email',
                    placeholder: '이메일 입력',
                },
                password: { label: '비밀번호', type: 'password' },
            },
            async authorize(credentials) {
                // 이메일과 패스워드를 받아서 어떻게 인증처리

                // 검증
                if (
                    !credentials ||
                    !credentials?.email ||
                    !credentials?.password
                ) {
                    throw new Error('이메일과 패스워드를 입력해주세요.');
                }

                // db 에서 유저 찾기
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string,
                    },
                });

                if (!user) {
                    throw new Error('존재하지 않는 이메일입니다.');
                }

                // 3. 비밀번호 일치 여부 확인
                const passwordsMatch = comparePassword(
                    credentials.password as string,
                    user.hashedPassword as string,
                );

                if (!passwordsMatch) {
                    throw new Error('비밀번호가 일치하지 않습니다.');
                }

                return user;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    jwt: {
        encode: async ({ secret, token }) => {
            const encodedToken = await jwt.sign(
                token as jwt.JwtPayload,
                secret as string,
            );
            return encodedToken;
        },
        decode: async ({ secret, token }) => {
            return jwt.verify(token as string, secret as string) as JWT;
        },
    },
    pages: {},
    callbacks: {},
    adapter: PrismaAdapter(prisma),
    useSecureCookies: process.env.NODE_ENV === 'production',
    trustHost: true,
    secret: process.env.AUTH_SECRET,
});
