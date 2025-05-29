'use client';
import React from 'react';
import useSWR from 'swr';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

// SWR fetcher
const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then(res => res.json());

export default function NoticePage() {
    // Fetch notices list
    const { data: notices, error, isLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/notices/`,
        fetcher
    );
    if (isLoading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">Error loading notices.</p>;
    if (!notices || notices.length === 0) return <p className="text-center mt-10">No notices found.</p>;
    return (
        <div className="w-full p-8 bg-gray-100 min-h-screen">
            <h2 className="text-center font-bold text-2xl mb-10">お知らせ</h2>
            <div className="max-w-6xl mx-auto space-y-6">
                {notices.map((notice: { id: number; date: string; title: string; content: string }) => (
                    <Card key={notice.id} className="p-4">
                        <CardHeader className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                {new Date(notice.date).toLocaleDateString()}
                            </span>
                            <CardTitle className="text-base font-semibold text-gray-900 truncate">
                                {notice.title}
                                <p className="text-gray-700 whitespace-pre-line">{notice.content}</p>
                            </CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
