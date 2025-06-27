'use client';

import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useState } from 'react';

// Toast Component (shadcn/ui style)
interface ToastProps {
    title: string;
    description?: string;
    onClose: () => void;
}

const Toast = ({ title, description, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto close after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                        </div>
                        {description && (
                            <p className="mt-1 text-sm text-gray-600">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function CalendarPage() {
    const [events, setEvents] = useState<EventInput[]>([]);
    const [toast, setToast] = useState<{ title: string; description?: string } | null>(null);

    const showToast = (title: string, description?: string) => {
        setToast({ title, description });
    };

    const closeToast = () => {
        setToast(null);
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/`, {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'include', // optional if you use cookies
                });
                const data = await res.json();

                const mappedEvents = data.map((booking: any) => ({
                    id: booking.id.toString(),
                    title: booking.title,
                    start: `${booking.date}T${booking.start_time}`,
                    end: `${booking.date}T${booking.end_time}`,
                    backgroundColor: '#6b7280',
                    borderColor: '#4b5563',
                    textColor: '#fff'
                }));

                setEvents(mappedEvents);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Header Section */}


            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Calendar Container */}
                <div className="relative">
                    {/* Background decoration */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>

                    {/* Calendar Card */}
                    <div className="relative bg-white backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 px-8 py-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        予約カレンダー
                                    </h2>
                                </div>


                            </div>
                        </div>

                        {/* Calendar Body */}
                        <div className="p-8">
                            <div className="calendar-container">
                                <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    initialView="dayGridMonth"
                                    events={events}
                                    locale="ja"
                                    height="auto"
                                    headerToolbar={{
                                        start: 'prev,next today',
                                        center: 'title',
                                        end: 'dayGridMonth,timeGridWeek,timeGridDay',
                                    }}
                                    buttonText={{
                                        today: '今日',
                                        month: '月表示',
                                        week: '週表示',
                                        day: '日表示'
                                    }}
                                    eventClick={(info) => {
                                        const event = info.event;
                                        const startTime = event.start?.toLocaleTimeString('ja-JP', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });
                                        const endTime = event.end?.toLocaleTimeString('ja-JP', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });

                                        showToast(
                                            `予約詳細: ${event.title}`,
                                            `時間: ${startTime} - ${endTime}`
                                        );
                                    }}
                                    dayMaxEvents={3}
                                    moreLinkClick="popover"
                                    nowIndicator={true}
                                    weekends={true}
                                    businessHours={{
                                        daysOfWeek: [1, 2, 3, 4, 5],
                                        startTime: '09:00',
                                        endTime: '18:00',
                                    }}
                                    eventDidMount={(info) => {
                                        // Add hover effect to events
                                        info.el.style.cursor = 'pointer';
                                        info.el.style.transition = 'all 0.2s ease';

                                        info.el.addEventListener('mouseenter', () => {
                                            info.el.style.transform = 'scale(1.05)';
                                            info.el.style.zIndex = '10';
                                            info.el.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                        });

                                        info.el.addEventListener('mouseleave', () => {
                                            info.el.style.transform = 'scale(1)';
                                            info.el.style.zIndex = '1';
                                            info.el.style.boxShadow = 'none';
                                        });
                                    }}
                                />
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="bg-gray-50/50 px-8 py-4 border-t border-gray-100">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        予約をクリックすると詳細が表示されます
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    最終更新: {new Date().toLocaleString('ja-JP')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast notification */}
            {toast && (
                <Toast
                    title={toast.title}
                    description={toast.description}
                    onClose={closeToast}
                />
            )}


        </div>
    );
}