'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserStore } from "@/store/userStore";
import getCookie from '@/types/getCookies';
import { FormData } from '@/types/types';
import { Home, Loader2, LogIn, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';

// Login fetcher function for SWR
async function loginUser(url: string, { arg }: { arg: FormData }) {
    // Get CSRF token from cookie
    const csrfToken = getCookie('csrftoken');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(arg),
    });

    const responseText = await response.text();
    let data;

    try {
        data = JSON.parse(responseText);
    } catch (e) {
        throw new Error('Invalid server response');
    }

    if (!response.ok) {
        throw new Error(data.error || `Login failed (${response.status})`);
    }

    return data;
}

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    // Use SWR mutation for login
    const { trigger, error, isMutating, data } = useSWRMutation(`/auth/login/`, loginUser);


    // Check for registration success message
    useEffect(() => {
        const registered = searchParams?.get('registered');
        if (registered === 'true') {
            setRegistrationSuccess(true);
        }
    }, [searchParams]);

    // Handle successful login
    useEffect(() => {
        if (data && data.user) {
            useUserStore.getState().setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log("user", data.user.is_superuser);
            if (data.user.is_superuser) {
                router.push('/dashboard');
            } else {
                router.push('/dashboard');
            }
        }
    }, [data, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await trigger(formData);
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                {/* Logo Section */}
                <div className="flex justify-center pt-6 pb-2">
                    <div className="relative">
                        <img
                            src="assest/images/logo_01.png"
                            alt="Logo"
                            className="h-20 w-auto object-contain drop-shadow-lg"
                        />
                    </div>
                </div>

                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-3xl font-bold text-gray-800 tracking-tight">
                        ログイン
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                        アカウントにサインインしてください
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Success Alert */}
                    {registrationSuccess && (
                        <Alert className="border-green-200 bg-green-50">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <AlertTitle className="text-green-800 font-semibold">
                                    登録完了
                                </AlertTitle>
                            </div>
                            <AlertDescription className="text-green-700 mt-1">
                                登録が完了しました。ログインしてください。
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive" className="border-red-200 bg-red-50">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <AlertTitle className="text-red-800 font-semibold">
                                    エラー
                                </AlertTitle>
                            </div>
                            <AlertDescription className="text-red-700 mt-1">
                                {error.message}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                メールアドレス
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                パスワード
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            disabled={isMutating}
                        >
                            {isMutating ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    <span>ログイン中...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <LogIn className="h-5 w-5" />
                                    <span>ログイン</span>
                                </div>
                            )}
                        </Button>
                    </form>

                    {/* Forgot Password Link */}
                    <div className="text-center">
                        <Link href="/forgot-password">
                            <Button
                                variant="link"
                                className="text-sm text-blue-600 hover:text-blue-700 p-0 font-medium hover:underline transition-colors"
                            >
                                パスワードをお忘れですか？
                            </Button>
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">または</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600 text-center">
                            アカウントをお持ちでないですか？
                        </p>

                        <Link href="/register">
                            <Button
                                variant="outline"
                                className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                            >
                                <User className="h-5 w-5 mr-2" />
                                新規登録
                            </Button>
                        </Link>

                        <Link href="/">
                            <Button
                                variant="outline"
                                className="mt-[20px] w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                            >
                                <Home className="h-5 w-5 mr-2" />
                                ホームページに戻る
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;