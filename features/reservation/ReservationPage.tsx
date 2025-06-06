'use client';

import { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useCallback, useRef, useState } from "react";
import useSWR from "swr";

// TypeScript types matching your Django model
type Reservation = {
    id: number;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    user?: number;
    created_at?: string;
    updated_at?: string;
};

const fetcher = async (url: string) => {
    const response = await fetch(url, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
        if (response.status === 403) {
            throw new Error('認証が必要です。ログインしてください。');
        }
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
};

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

function convertReservationToEvent(reservation: Reservation): EventInput {
    const startDateTime = `${reservation.date}T${reservation.start_time}`;
    const endDateTime = `${reservation.date}T${reservation.end_time}`;
    return {
        id: reservation.id.toString(),
        title: reservation.title,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: '#4f46e5',
        borderColor: '#4338ca',
    };
}

export default function ReservationPage() {
    const calendarRef = useRef<FullCalendar | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: reservations,
        isLoading: reservationsLoading,
        mutate: mutateReservation,
        error: fetchError
    } = useSWR<Reservation[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/calendar/`,
        fetcher,
        {
            onError: (error) => {
                console.error('Fetch error:', error);
                setError(error.message || 'データの取得に失敗しました。');
            }
        }
    );

    const handleClick = useCallback((arg: EventClickArg) => {
        setSelectedEvent(arg);
        setIsModalOpen(true);
    }, []);

    const handleDeleteReservation = async (id: React.Key | null | undefined) => {
        const csrfToken = getCookie('csrftoken');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/${id}/delete`, {
                method: 'DELETE',
                headers: {
                    ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {})
                },
                credentials: 'include',
            });

            if (res.ok) {
                await mutateReservation();
                setError(null);
            } else {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.detail || '予約の削除に失敗しました。');
            }
        } catch (error) {
            console.error('Delete error:', error);
            setError('サーバー通信エラーが発生しました。');
        }
    };

    const handleSelect = useCallback(async (arg: DateSelectArg) => {
        const title = prompt("予約タイトルを入力してください:");
        if (!title) {
            calendarRef.current?.getApi().unselect();
            return;
        }

        setIsCreating(true);
        setError(null);

        const reservationData = {
            title: title,
            date: arg.start.toISOString().split('T')[0],
            start_time: arg.start.toTimeString().split(' ')[0],
            end_time: arg.end.toTimeString().split(' ')[0],
        };

        const csrfToken = getCookie('csrftoken');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {})
                },
                credentials: 'include',
                body: JSON.stringify(reservationData)
            });

            if (res.ok) {
                await mutateReservation();
                setError(null);
            } else {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.error || '予約の作成に失敗しました。');
            }
        } catch (error) {
            console.error('Create error:', error);
            setError('サーバー通信エラーが発生しました。');
        } finally {
            setIsCreating(false);
            calendarRef.current?.getApi().unselect();
        }
    }, [mutateReservation]);

    const displayError = error || fetchError?.message;

    return (
        <div className="w-full bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl w-full">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
                    予約カレンダー
                </h1>

                {displayError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <strong>エラー: </strong>{displayError}
                    </div>
                )}

                {(reservationsLoading || isCreating) && (
                    <div className="text-center text-gray-600 my-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                        {isCreating ? '予約作成中...' : '読み込み中...'}
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-4">
                    <p className="text-sm">
                        <strong>使い方:</strong>
                        カレンダー上の時間帯をクリック・ドラッグして新しい予約を作成できます。
                        既存の予約をクリックすると詳細を表示し、削除することができます。
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <FullCalendar
                        locale="ja"
                        allDayText="終日"
                        height="auto"
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        slotDuration="00:30:00"
                        slotMinTime="08:00:00"
                        slotMaxTime="22:00:00"
                        selectable={true}
                        selectMirror={true}
                        businessHours={{
                            daysOfWeek: [1, 2, 3, 4, 5],
                            startTime: "09:00",
                            endTime: "18:00"
                        }}
                        weekends={true}
                        titleFormat={{ year: "numeric", month: "short" }}
                        headerToolbar={{
                            start: "prev,next today",
                            center: "title",
                            end: "dayGridMonth,timeGridWeek,timeGridDay"
                        }}
                        buttonText={{
                            today: '今日',
                            month: '月',
                            week: '週',
                            day: '日'
                        }}
                        slotLabelFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: false
                        }}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: false
                        }}
                        ref={calendarRef}
                        eventClick={handleClick}
                        select={handleSelect}
                        events={reservations?.map(convertReservationToEvent) || []}
                        eventColor="#4f46e5"
                        selectConstraint="businessHours"
                        eventConstraint="businessHours"
                        nowIndicator={true}
                        editable={false}
                        eventResizableFromStart={false}
                        eventDurationEditable={false}
                    />
                </div>

                {/* Modal for reservation detail */}
                {isModalOpen && selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">予約詳細</h2>
                            <p><strong>タイトル:</strong> {selectedEvent.event.title}</p>
                            <p><strong>日付:</strong> {selectedEvent.event.start?.toLocaleDateString('ja-JP')}</p>
                            <p><strong>時間:</strong> {selectedEvent.event.start?.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} - {selectedEvent.event.end?.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</p>
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    閉じる
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                    onClick={() => {
                                        handleDeleteReservation(selectedEvent.event.id);
                                        setIsModalOpen(false);
                                    }}
                                >
                                    削除する
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
