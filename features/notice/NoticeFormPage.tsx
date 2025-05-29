'use client';
import React from 'react';



// SWR fetcher
const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then(res => res.json());

export default function NoticeFormPage() {
    return (
        <div className="w-full p-8 bg-gray-100 min-h-screen">
            <h2 className="text-center font-bold text-2xl mb-10">お知らせ新規作成作成</h2>
            <div className="max-w-6xl mx-auto space-y-6">

            </div>
        </div>
    );
}
