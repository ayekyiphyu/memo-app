'use client';

import { Button } from "@/components/ui/button";
import { RadioStation } from "@/lib/type";
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, HelpCircle, Music, Play, Snowflake, Sun } from "lucide-react";
import { ReactElement, useEffect, useState } from 'react';

// Toast Component (improved design)
interface ToastProps {
    title: string;
    description?: string;
    onClose: () => void;
}

interface WeatherData {
    temperature: number;
    condition: string;
    description: string;
    windSpeed: number;
    icon: ReactElement;
    source: string;
}

const Toast = ({ title, description, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-md">
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-2xl p-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                        </div>
                        {description && (
                            <p className="mt-2 text-sm text-gray-600 ml-11">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 ml-3 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
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

// WeatherWidget component with improved design
const WeatherWidget = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState<string | null>(null);

    function getWeatherIcon(weatherCode: number): ReactElement {
        if (weatherCode === 0) return <Sun className="w-8 h-8 text-yellow-500" />;
        if ([1, 2, 3].includes(weatherCode)) return <Cloud className="w-8 h-8 text-gray-500" />;
        if ([45, 48].includes(weatherCode)) return <CloudFog className="w-8 h-8 text-gray-400" />;
        if ([51, 53, 55].includes(weatherCode)) return <CloudDrizzle className="w-8 h-8 text-blue-400" />;
        if ([61, 63, 65].includes(weatherCode)) return <CloudRain className="w-8 h-8 text-blue-600" />;
        if ([71, 73, 75].includes(weatherCode)) return <Snowflake className="w-8 h-8 text-blue-300" />;
        if ([80, 81, 82].includes(weatherCode)) return <CloudRain className="w-8 h-8 text-blue-500" />;
        if ([95, 96, 99].includes(weatherCode)) return <CloudLightning className="w-8 h-8 text-yellow-600" />;
        return <HelpCircle className="w-8 h-8 text-gray-400" />;
    }

    const fetchGoogleWeatherData = async () => {
        try {
            const lat = 35.6895; // Tokyo
            const lon = 139.6917;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Weather API error');

            const data = await response.json();

            setWeather({
                temperature: data.current_weather.temperature,
                condition: "See icon",
                description: "Tokyo",
                windSpeed: data.current_weather.windspeed,
                icon: getWeatherIcon(data.current_weather.weathercode),
                source: 'Today Weather'
            });
        } catch (error) {
            console.error(error);
            setWeatherError("Failed to fetch weather data");
            setWeather(null);
        } finally {
            setWeatherLoading(false);
        }
    };

    useEffect(() => {
        fetchGoogleWeatherData();
    }, []);

    if (weatherLoading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 text-center min-w-[200px]">
                <div className="animate-pulse space-y-3">
                    <div className="h-8 bg-blue-200 rounded-full w-16 mx-auto"></div>
                    <div className="h-6 bg-blue-200 rounded w-24 mx-auto"></div>
                    <div className="h-4 bg-blue-200 rounded w-20 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (weatherError) {
        return (
            <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-6 text-center min-w-[200px]">
                <p className="text-red-600 text-sm mb-3">{weatherError}</p>
                <button
                    onClick={fetchGoogleWeatherData}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!weather) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center min-w-[200px]">
                <p className="text-gray-500 text-sm">No weather data available</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 text-center min-w-[200px] border border-white/50 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">{weather.source}</h3>
            <div className="mb-4 flex justify-center">{weather.icon}</div>
            <p className="text-gray-600 text-sm mb-2">{weather.description}</p>
            <p className="text-3xl font-bold text-gray-800 mb-2">{weather.temperature}°C</p>
            <p className="text-gray-500 text-sm">Wind: {weather.windSpeed} m/s</p>
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
                    credentials: 'include',
                });
                const data = await res.json();

                const mappedEvents = data.map((booking: any) => ({
                    id: booking.id.toString(),
                    title: booking.title,
                    start: `${booking.date}T${booking.start_time}`,
                    end: `${booking.date}T${booking.end_time}`,
                    backgroundColor: '#6366f1',
                    borderColor: '#4f46e5',
                    textColor: '#fff'
                }));

                setEvents(mappedEvents);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [stations, setStations] = useState<RadioStation[]>([]);
    const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);

    const fetchRadioStations = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('https://de1.api.radio-browser.info/json/stations/search?limit=20&order=clickcount&reverse=true');
            const data: RadioStation[] = await response.json();
            setStations(data);
            console.log('Radio stations:', data);
        } catch (error) {
            console.error('Error fetching radio stations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        {/* Radio Player Section */}
                        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl p-6 flex-1 max-w-md">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                        <Music className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-800">Radio Player</h2>
                                </div>
                                <Button
                                    variant="default"
                                    onClick={fetchRadioStations}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl px-6 shadow-lg"
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    {isLoading ? 'Loading...' : 'Browse Stations'}
                                </Button>
                            </div>

                            {stations.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-600">Popular Stations</h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {stations.slice(0, 5).map((station) => (
                                            <div
                                                key={station.stationuuid}
                                                className={`flex items-center justify-between cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 ${currentStation?.stationuuid === station.stationuuid
                                                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md transform scale-[1.02]'
                                                    : 'hover:bg-gray-50 hover:shadow-sm'
                                                    }`}
                                                onClick={() => setCurrentStation(station)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${currentStation?.stationuuid === station.stationuuid
                                                        ? 'bg-blue-500 animate-pulse'
                                                        : 'bg-green-500'
                                                        }`}></div>
                                                    <span className="font-medium text-sm">{station.name}</span>
                                                </div>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                    {station.country}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentStation && (
                                <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-sm font-medium text-gray-700">
                                            🎵 Now Playing: <span className="font-semibold text-blue-600">{currentStation.name}</span>
                                        </h3>
                                        <audio
                                            src={currentStation.url_resolved}
                                            controls
                                            autoPlay
                                            className="w-full rounded-lg"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Weather Widget */}
                        <div className="flex-shrink-0">
                            <WeatherWidget />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Calendar Container */}
                <div className="relative">
                    {/* Background decoration */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl blur opacity-20"></div>

                    {/* Calendar Card */}
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 px-8 py-8 border-b border-gray-100/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Reservation Calendar
                                        </h2>
                                        <p className="text-gray-600 text-sm mt-1">Manage your bookings and appointments</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-600">Live Updates</span>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Body */}
                        <div className="p-8">
                            <div className="calendar-container">
                                <style jsx global>{`
                                    .fc-theme-standard .fc-scrollgrid {
                                        border: none;
                                        border-radius: 1rem;
                                        overflow: hidden;
                                        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                                    }
                                    .fc-theme-standard td, .fc-theme-standard th {
                                        border: 1px solid #f1f5f9;
                                    }
                                    .fc-theme-standard .fc-scrollgrid-section > td {
                                        border: none;
                                    }
                                    .fc-button-primary {
                                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                                        border: none;
                                        border-radius: 0.75rem;
                                        padding: 0.5rem 1rem;
                                        font-weight: 500;
                                        transition: all 0.2s ease;
                                    }
                                    .fc-button-primary:hover {
                                        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                                        transform: translateY(-1px);
                                        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                                    }
                                    .fc-button-primary:disabled {
                                        opacity: 0.6;
                                        transform: none;
                                    }
                                    .fc-col-header-cell {
                                        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                                        font-weight: 600;
                                        color: #475569;
                                        padding: 1rem 0.5rem;
                                    }
                                    .fc-daygrid-day {
                                        transition: all 0.2s ease;
                                    }
                                    .fc-daygrid-day:hover {
                                        background: #f8fafc;
                                    }
                                    .fc-daygrid-day-number {
                                        font-weight: 500;
                                        color: #374151;
                                        padding: 0.5rem;
                                    }
                                    .fc-event {
                                        border-radius: 0.5rem;
                                        border: none;
                                        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
                                        font-weight: 500;
                                    }
                                    .fc-toolbar-title {
                                        font-size: 1.5rem;
                                        font-weight: 700;
                                        color: #1f2937;
                                    }
                                `}</style>
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
                                        today: 'Today',
                                        month: 'Month',
                                        week: 'Week',
                                        day: 'Day'
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
                                    validRange={{
                                        start: new Date().toISOString().split('T')[0]
                                    }}
                                    eventDidMount={(info) => {
                                        info.el.style.cursor = 'pointer';
                                        info.el.style.transition = 'all 0.2s ease';

                                        info.el.addEventListener('mouseenter', () => {
                                            info.el.style.transform = 'scale(1.05)';
                                            info.el.style.zIndex = '10';
                                            info.el.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
                                        });

                                        info.el.addEventListener('mouseleave', () => {
                                            info.el.style.transform = 'scale(1)';
                                            info.el.style.zIndex = '1';
                                            info.el.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.2)';
                                        });
                                    }}
                                />
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 px-8 py-6 border-t border-gray-100/50">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-600 gap-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span>予約をクリックすると詳細が表示されます</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span>最終更新: {new Date().toLocaleString('ja-JP')}</span>
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