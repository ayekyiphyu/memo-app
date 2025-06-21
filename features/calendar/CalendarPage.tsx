'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';

export default function CalendarPage() {
    const [events, setEvents] = useState<EventInput[]>([]);

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
        <div className="w-full bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
                公開予約カレンダー
            </h1>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl">
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
                    eventClick={(info) => alert(`予約タイトル: ${info.event.title}`)}
                />
            </div>
        </div>
    );
}
