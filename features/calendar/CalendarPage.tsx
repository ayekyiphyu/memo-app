
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid"; // 👈 追加
import interactionPlugin from "@fullcalendar/interaction"; // 👈 select機能に必要
import { EventClickArg } from "@fullcalendar/core";
import React, { useRef } from "react";

export default function CalendarPage() {
    const calendarRef = useRef<FullCalendar | null>(null);

    const handleClick = (arg: EventClickArg) => {
        alert(`イベント: ${arg.event.title}`);
    };

    const handleSelect = (arg: any) => {
        alert(`選択された日付: ${arg.startStr} ～ ${arg.endStr}`);
    };

    return (
        <div className="w-full bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-gray-900 text-center">
                Calendar
            </h1>
            <FullCalendar
                locale="ja"
                allDayText="終日"
                height="auto"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // 👈 修正ポイント
                initialView="dayGridMonth"
                slotDuration="00:30:00"
                selectable={true}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: "00:00",
                    endTime: "24:00"
                }}
                weekends={true}
                titleFormat={{
                    year: "numeric",
                    month: "short"
                }}
                headerToolbar={{
                    start: "title",
                    center: "prev,next today",
                    end: "dayGridMonth,timeGridWeek"
                }}
                ref={calendarRef}
                eventClick={handleClick}
                select={handleSelect}
            />
        </div>
    );
}
