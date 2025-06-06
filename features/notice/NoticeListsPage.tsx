'use client';
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useRouter } from 'next/router';
import useSWR from 'swr';

// SWR fetcher
const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then(res => res.json());

export default function NoticeListsPage() {
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

    const handleEdit = (id: number) => {
        router.push(`/notices/edit/${id}`);
    };
    return (
        <div className="w-full p-8 bg-gray-100 h-auto">
            <h2 className="text-center font-bold text-2xl mb-10">お知らせ一覧</h2>
            <div className="max-w-6xl mx-auto space-y-6">
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
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}