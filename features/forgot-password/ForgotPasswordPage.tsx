'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

// Cookie取得関数
function getCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // パスワードリセット要求
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError('メールアドレスを入力してください');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('正しいメールアドレスを入力してください');
            return;
        }

        setIsLoading(true);
        setError('');

        const csrfToken = getCookie('csrftoken');

        try {
            // Fixed: Use correct API endpoint URL
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            console.log('Making request to:', `${apiUrl}/password-reset/request/`);

            const res = await fetch(`${apiUrl}/password-reset/request/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
                },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });

            console.log('Response status:', res.status);
            console.log('Response headers:', res.headers);

            // Check if response is actually JSON
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await res.text();
                console.error('Non-JSON response received:', textResponse);
                throw new Error('サーバーから予期しない応答が返されました');
            }

            const data = await res.json();

            if (res.ok) {
                setIsSuccess(true);
                setError(''); // Clear any previous errors
            } else {
                // Handle different types of errors
                if (data.error) {
                    setError(data.error);
                } else if (data.errors) {
                    // Handle validation errors from Django serializer
                    const errorMessages = Object.values(data.errors).flat();
                    setError(errorMessages.join(', '));
                } else {
                    setError(data.message || 'パスワードリセットの送信に失敗しました');
                }
            }
        } catch (error) {
            console.error('Password reset error:', error);
            setError('ネットワークエラーが発生しました。インターネット接続を確認してください');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        router.push('/login');
    };

    const handleTryAgain = () => {
        setIsSuccess(false);
        setEmail('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back to Login Button */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={handleBackToLogin}
                        className="text-gray-600 hover:text-gray-800 p-0 h-auto font-normal"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        ログインに戻る
                    </Button>
                </div>

                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-2">
                        {/* Logo/Icon */}
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>

                        <CardTitle className="text-2xl font-bold text-gray-900">
                            パスワードをお忘れですか？
                        </CardTitle>
                        <p className="text-gray-600 text-sm mt-2">
                            {isSuccess
                                ? 'リセットリンクを送信しました'
                                : 'メールアドレスを入力してパスワードリセットリンクを受け取ってください'
                            }
                        </p>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {isSuccess ? (
                            // Success State
                            <div className="text-center space-y-6">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        メールを送信しました
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        <strong>{email}</strong> にパスワードリセットリンクを送信しました。
                                        メールをご確認ください。
                                    </p>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-blue-800 text-sm">
                                        <strong>注意:</strong> メールが届かない場合は、迷惑メールフォルダもご確認ください。
                                        リンクの有効期限は1時間です。
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={handleBackToLogin}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                    >
                                        ログインページに戻る
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={handleTryAgain}
                                        className="w-full"
                                    >
                                        別のメールアドレスで試す
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Form State
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div>
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        メールアドレス
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            // Clear error when user starts typing
                                            if (error) setError('');
                                        }}
                                        placeholder="your-email@example.com"
                                        className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        disabled={isLoading}
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isLoading || !email}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            送信中...
                                        </div>
                                    ) : (
                                        'リセットリンクを送信'
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Additional Help */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        アカウントをお持ちでない場合は{' '}
                        <button
                            onClick={() => router.push('/register')}
                            className="text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                            新規登録
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}