'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SigninPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        signIn('credentials', {
            email,
            password,
            redirectTo: '/',
        });
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-3xl font-bold">로그인</h1>
            <p className="text-gray-700">인프런 계정으로 로그인할 수 있어요.</p>

            <form
                className="flex flex-col gap-2 min-w-[300px]"
                onSubmit={handleSubmit}
            >
                <label htmlFor="email">이메일</label>
                <input
                    type="email"
                    placeholder="example@inflab.com"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-gray-200 rounded-md p-2"
                />
                <label htmlFor="password">비밀번호</label>
                <input
                    type="password"
                    placeholder="example@inflab.com"
                    value={password}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 border-gray-200 rounded-sm p-2"
                />
                <button
                    type="submit"
                    className="bg-green-500 font-bold cursor-pointer text-white rounded-md p-2"
                >
                    로그인
                </button>
                <Link href="/signup" className="text-center">
                    회원가입
                </Link>
            </form>
        </div>
    );
}
