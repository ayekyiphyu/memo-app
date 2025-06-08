'use client';

import { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import useSWR from "swr";

// TypeScript types matching your Django model
type Reservation = {
    id: number;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    user: number; // ユーザーIDを必須にする
    username?: string; // ユーザー名（表示用）
    created_at?: string;
    updated_at?: string;
};

type User = {
    id: number;
    username: string;
    is_superuser?: boolean;
};

const fetcher = async (url: string) => {
    const response = await fetch(url, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
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

function convertReservationToEvent(reservation: Reservation, currentUserId?: number): EventInput {
    const startDateTime = `${reservation.date}T${reservation.start_time}`;
    const endDateTime = `${reservation.date}T${reservation.end_time}`;

    // 自分の予約かどうかで色を変える
    const isOwnReservation = currentUserId && reservation.user === currentUserId;

    return {
        id: reservation.id.toString(),
        title: isOwnReservation
            ? reservation.title
            : `${reservation.title} (${reservation.username || 'ユーザー'})`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: isOwnReservation ? '#10b981' : '#6b7280', // 自分：緑、他人：グレー
        borderColor: isOwnReservation ? '#059669' : '#4b5563',
        textColor: '#ffffff',
        extendedProps: {
            isOwn: isOwnReservation,
            userId: reservation.user,
            username: reservation.username
        }
    };
}

export default function ReservationsCalendar() {
    const router = useRouter();
    const calendarRef = useRef<FullCalendar | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 現在のユーザー情報を取得
    const { data: currentUser } = useSWR<User>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/userinfo/`,
        fetcher
    );

    // 全ての予約を取得（自分と他人の予約両方）
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
        if (!id) {
            setError('削除する予約のIDが見つかりません。');
            return;
        }

        // 自分の予約でない場合は削除を禁止
        const reservation = reservations?.find(r => r.id.toString() === id.toString());
        if (reservation && currentUser && reservation.user !== currentUser.id) {
            setError('他のユーザーの予約は削除できません。');
            return;
        }

        setIsDeleting(true);
        setError(null);

        const csrfToken = getCookie('csrftoken');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {})
                },
                credentials: 'include',
            });

            if (res.ok) {
                await mutateReservation();
                setError(null);
                setIsModalOpen(false);
            } else {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.error || errorData.detail || '予約の削除に失敗しました。');
            }
        } catch (error) {
            console.error('Delete error:', error);
            setError('サーバー通信エラーが発生しました。');
        } finally {
            setIsDeleting(false);
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
                setError(errorData.error || errorData.detail || '予約の作成に失敗しました。');
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

    // 自分の予約数と他人の予約数を計算
    const myReservationsCount = reservations?.filter(r => currentUser && r.user === currentUser.id).length || 0;
    const othersReservationsCount = reservations?.filter(r => currentUser && r.user !== currentUser.id).length || 0;

    return (
        <div className="w-full bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl w-full">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
                    予約カレンダー
                </h1>

                <button
                    className="w-full bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2 rounded-lg font-medium transition-all py-2 px-4 mb-4"
                    onClick={() => router.back()}
                >
                    戻る
                </button>

                {displayError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <strong>エラー: </strong>{displayError}
                    </div>
                )}

                {(reservationsLoading || isCreating || isDeleting) && (
                    <div className="text-center text-gray-600 my-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                        {isCreating ? '予約作成中...' : isDeleting ? '予約削除中...' : '読み込み中...'}
                    </div>
                )}

                {/* 予約統計の表示 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
                        <p className="text-sm">
                            <strong>あなたの予約:</strong> {myReservationsCount}件
                            <span className="ml-2 text-xs">(緑色で表示)</span>
                        </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded">
                        <p className="text-sm">
                            <strong>他のユーザーの予約:</strong> {othersReservationsCount}件
                            <span className="ml-2 text-xs">(グレー色で表示・読み取り専用)</span>
                        </p>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-4">
                    <p className="text-sm">
                        <strong>使い方:</strong>
                        カレンダー上の時間帯をクリック・ドラッグして新しい予約を作成できます。
                        <span className="block mt-1">
                            ⚠️ 緑色の予約（あなたの予約）のみ編集・削除が可能です。
                            グレーの予約（他のユーザーの予約）は表示のみです。
                        </span>
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
                        events={reservations?.map(r => convertReservationToEvent(r, currentUser?.id)) || []}
                        selectConstraint="businessHours"
                        eventConstraint="businessHours"
                        nowIndicator={true}
                        editable={false}
                        eventResizableFromStart={false}
                        eventDurationEditable={false}
                        noEventsText="予約がありません"
                    />
                </div>

                {/* Modal for reservation detail */}
                {isModalOpen && selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                予約詳細
                                {selectedEvent.event.extendedProps?.isOwn ? (
                                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">あなたの予約</span>
                                ) : (
                                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">他のユーザーの予約</span>
                                )}
                            </h2>

                            <div className="space-y-2 mb-4">
                                <p><strong>タイトル:</strong> {selectedEvent.event.title}</p>
                                <p><strong>日付:</strong> {selectedEvent.event.start?.toLocaleDateString('ja-JP')}</p>
                                <p><strong>時間:</strong> {selectedEvent.event.start?.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} - {selectedEvent.event.end?.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</p>
                                {!selectedEvent.event.extendedProps?.isOwn && (
                                    <p><strong>予約者:</strong> {selectedEvent.event.extendedProps?.username || 'ユーザー'}</p>
                                )}
                            </div>

                            {displayError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-4 text-sm">
                                    {displayError}
                                </div>
                            )}

                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setError(null);
                                    }}
                                    disabled={isDeleting}
                                >
                                    閉じる
                                </button>

                                {/* 自分の予約の場合のみ削除ボタンを表示 */}
                                {selectedEvent.event.extendedProps?.isOwn && (
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:bg-red-300"
                                        onClick={() => handleDeleteReservation(selectedEvent.event.id)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? '削除中...' : '予約を削除'}
                                    </button>
                                )}

                                {/* 他人の予約の場合の説明 */}
                                {!selectedEvent.event.extendedProps?.isOwn && (
                                    <p className="text-sm text-gray-500 italic">
                                        他のユーザーの予約は削除できません
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}