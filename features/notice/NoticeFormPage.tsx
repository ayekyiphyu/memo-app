'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { z } from 'zod';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import router from 'next/router';

const formSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 2 characters.' }).max(50),
    date: z.date({ required_error: 'Please select a date.' }),
    content: z.string().min(1, { message: 'Content is required.' }),
});

type FormSchemaType = z.infer<typeof formSchema>;

// Fetcher function
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

// Cookie utility function
function getCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export default function NoticeFormPage() {
    // SWR for fetching notices
    const { data: memos, isLoading: memosLoading, mutate: mutateMemos } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/notices/`,
        fetcher
    );

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            date: new Date(),
            content: '',
        },
    });

    const onSubmit = async (data: FormSchemaType) => {
        try {
            console.log('Submitted:', data);

            const csrfToken = getCookie('csrftoken');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notices/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: data.title,
                    date: format(data.date, 'yyyy-MM-dd'), //data format
                    content: data.content,
                }),
            });

            if (response.ok) {
                // Reset form after successful submission
                form.reset();
                // Refresh the data
                mutateMemos();
                console.log('Notice created successfully');
            } else {
                console.error('Failed to create notice');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="w-full p-8 bg-gray-100 min-h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded shadow">
                    {/* Title */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter event title..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Date Picker with Popover */}
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Content */}
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter content description..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                    <Button variant="outline" className='ml-[2rem]' type="button" onClick={() => router.push('/dashboard')}>
                        Back to Dashboard
                    </Button>
                </form>
            </Form>
        </div>
    );
}