'use client';

import { EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useRef } from "react";
import useSWR from "swr";

// TypeScript types (adjust based on your Django model)
type Reservation = {
    id: number;
    title: string;
    start: string; // ISO 8601
    end: string;
    user?: number;
};

const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then(res => res.json());

// Cookie helper for CSRF
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export default function ReservationPage() {
    const calendarRef = useRef<FullCalendar | null>(null);

    // Fetch reservation data
    const { data: reservations, isLoading: reservationsLoading, mutate: mutateReservation } = useSWR<Reservation[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/calendar/`,
        fetcher
    );

    // Handle clicking on an event
    const handleClick = (arg: EventClickArg) => {
        alert(`イベント: ${arg.event.title}\n開始: ${arg.event.startStr}\n終了: ${arg.event.endStr}`);
    };

    // Handle selecting a time range to create new booking
    const handleSelect = async (arg: any) => {
        const title = prompt("予約タイトルを入力してください:");
        if (!title) return;

        const csrfToken = getCookie('csrftoken');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {})
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: title,
                    start: arg.startStr,
                    end: arg.endStr,
                })
            });

            if (res.ok) {
                await mutateReservation(); // re-fetch updated data
            } else {
                alert("予約に失敗しました。");
            }
        } catch (error) {
            alert("サーバー通信エラーが発生しました。");
        }
    };

    return (
        <div className="w-full bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
                予約カレンダー
            </h1>

            {reservationsLoading && (
                <div className="text-gray-600 my-4">読み込み中...</div>
            )}

            <FullCalendar
                locale="ja"
                allDayText="終日"
                height="auto"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                slotDuration="00:30:00"
                selectable={true}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5], // 月〜金
                    startTime: "00:00",
                    endTime: "24:00"
                }}
                weekends={true}
                titleFormat={{ year: "numeric", month: "short" }}
                headerToolbar={{
                    start: "title",
                    center: "prev,next today",
                    end: "dayGridMonth,timeGridWeek"
                }}
                ref={calendarRef}
                eventClick={handleClick}
                select={handleSelect}
                events={
                    reservations?.map((res: Reservation): EventInput => ({
                        id: res.id.toString(),
                        title: res.title,
                        start: res.start,
                        end: res.end,
                    })) || []
                }
            />
        </div>
    );
}
