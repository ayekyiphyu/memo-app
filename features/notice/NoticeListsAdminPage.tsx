'use client';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useRouter } from 'next/router';
import { useState } from "react";
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

    // State for which notice is currently being edited
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newDate, setNewDate] = useState(''); // Add date state

    // Helper function to format date for input[type="date"]
    const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    };

    // Start editing a notice - fill the form fields
    const startEditing = (notice: { id: number; title: string; content: string; date: string }) => {
        setEditingId(notice.id);
        setNewTitle(notice.title);
        setNewContent(notice.content);
        setNewDate(formatDateForInput(notice.date)); // Set the date in input format
    };

    // Cancel editing mode
    const cancelEditing = () => {
        setEditingId(null);
        setNewTitle('');
        setNewContent('');
        setNewDate(''); // Reset date
    };

    // Save edited notice
    const saveEdit = async () => {
        if (!editingId) return;

        const csrfToken = getCookie('csrftoken');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notices/${editingId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: newTitle,
                    content: newContent,
                    date: newDate // Include date in the update
                }),
            });

            if (!res.ok) {
                alert('Failed to update notice');
                return;
            }

            // Refresh list data
            await mutate();

            // Reset editing state
            cancelEditing();

            alert('Notice updated successfully!');
        } catch (error) {
            alert('Error updating notice');
            console.error(error);
        }
    };

    // Delete handler (same as your code)
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
            mutate();
        } catch (err) {
            alert("Failed to delete notice.");
            console.error(err);
        }
    };

    if (isLoading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">Error loading notices.</p>;
    if (!notices || notices.length === 0) return <p className="text-center mt-10">No notices found.</p>;

    return (
        <div className="w-full p-8 bg-gray-100 min-h-screen">
            <h2 className="text-center font-bold text-2xl mb-10">Our Events Lists</h2>

            <div className="max-w-6xl mx-auto space-y-6">
                <div className='flex flex-row mb-6'>
                    <Button
                        onClick={() => router.push('/notices')}
                        variant="outline"
                        size="sm"
                    >
                        お知らせ作成
                    </Button>

                    <Button
                        onClick={() => router.push('/dashboard')}
                        variant="outline"
                        size="sm"
                        className="ml-4"
                    >
                        Back
                    </Button>
                </div>

                {notices.map((notice: { id: number; date: string; title: string; content: string }) => (
                    <Card key={notice.id} className="p-4">
                        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                            <div className="flex-grow">
                                {editingId === notice.id ? (
                                    <>
                                        {/* Editable date picker when in edit mode */}
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                className="border rounded p-2 w-full max-w-xs"
                                                value={newDate}
                                                onChange={(e) => setNewDate(e.target.value)}
                                            />
                                        </div>

                                        {/* Editable title */}
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                className="border rounded p-2 w-full"
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                            />
                                        </div>

                                        {/* Editable content */}
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Content
                                            </label>
                                            <textarea
                                                className="border rounded p-2 w-full"
                                                rows={4}
                                                value={newContent}
                                                onChange={(e) => setNewContent(e.target.value)}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(notice.date).toLocaleDateString()}
                                        </span>
                                        <CardTitle className="text-base font-semibold text-gray-900 truncate">
                                            {notice.title}
                                        </CardTitle>
                                        <p className="text-gray-700 whitespace-pre-line mt-1">{notice.content}</p>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-2 mt-3 md:mt-0">
                                {editingId === notice.id ? (
                                    <>
                                        <Button onClick={saveEdit} variant="outline" size="sm">
                                            Save
                                        </Button>
                                        <Button onClick={cancelEditing} variant="destructive" size="sm">
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => startEditing(notice)} variant="outline" size="sm">
                                            Edit
                                        </Button>
                                        <Button onClick={() => handleDelete(notice.id)} variant="destructive" size="sm">
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}