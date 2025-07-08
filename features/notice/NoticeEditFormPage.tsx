'use client';
import useSWR from 'swr';

import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button"; // Assuming you have a Button component
// Fixed import - use useRouter hook instead of direct import
import { useRouter } from 'next/router';

// SWR fetcher
const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then(res => res.json());

export default function NoticeListsPage() {
    // Fixed: Use useRouter hook
    const router = useRouter();

    const { data: notices, error, isLoading, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/notices/`,
        fetcher
    );

    function getCookie(name: string) {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    }

    if (isLoading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">Error loading notices.</p>;
    if (!notices || notices.length === 0) return <p className="text-center mt-10">No notices found.</p>;

    // Delete handler
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this notice?")) return;
        const csrfToken = getCookie('csrftoken');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notices/${id}/`, {
                method: 'DELETE',
                headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {},
                credentials: 'include',
            });
            if (!res.ok) throw new Error("Failed to delete");

            // Revalidate SWR cache after delete
            mutate();
        } catch (err) {
            alert("Failed to delete notice.");
            console.error(err);
        }
    };

    // Edit handler - you can replace this with your actual navigation logic
    const handleEdit = (id: number) => {
        // Better to use router.push instead of window.location.href
        router.push(`/notices/edit/${id}`);
    };

    return (
        <div className="w-full p-8 bg-gray-100 min-h-screen">
            <h2 className="text-center font-bold text-2xl mb-10">Our Events Lists</h2>
            <div className="max-w-6xl mx-auto space-y-6">
                <div className='flex flex-row'>
                    <Button
                        className="flex justify-end bg-blue-500 text-white cursor-pointer"
                        onClick={() => router.push('/notices')}
                        variant="outline"
                        size="sm"
                    >
                        お知らせ作成
                    </Button>

                    <Button
                        className="flex justify-end bg-gray-500 text-white ml-[1rem] cursor-pointer"
                        onClick={() => router.push('/dashboard')}
                        variant="outline"
                        size="sm"
                    >
                        Back
                    </Button>
                </div>

                {notices.map((notice: { id: number; date: string; title: string; content: string }) => (
                    <Card key={notice.id} className="p-4">
                        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                            <div>
                                <span className="text-sm text-gray-500 whitespace-nowrap">
                                    {new Date(notice.date).toLocaleDateString()}
                                </span>
                                <CardTitle className="text-base font-semibold text-gray-900 truncate">
                                    {notice.title}
                                </CardTitle>
                                <p className="text-gray-700 whitespace-pre-line mt-1">{notice.content}</p>
                            </div>
                            <div className="flex gap-2 mt-3 md:mt-0">
                                <Button onClick={() => handleEdit(notice.id)} variant="outline" size="sm">
                                    Edit
                                </Button>
                                <Button onClick={() => handleDelete(notice.id)} variant="destructive" size="sm">
                                    Delete
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}