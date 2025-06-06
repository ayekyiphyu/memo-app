'use client';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import dynamic from 'next/dynamic';


const DynamicCustomSlider = dynamic(() => import('@/components/slider/Slider'), {
    ssr: false,
});

const DynamicContractPage = dynamic(() => import('@/features/contract/ContractPage'), {
    ssr: false,
});


const DynamicNoticePage = dynamic(() => import('@/features/notice/NoticeListsPage'), {
    ssr: false,
});

const DynamicCalendarPage =
    dynamic(() => import('@/features/calendar/CalendarPage'), {
        ssr: false,
    });
export default function Home() {
    return (
        <>
            {/* <div>
                <AdminManagementSystem />
                <AdminManagementSystem />
        </div > */}

            <Header />
            <main className="w-full">
                <div className="w-full">
                    <DynamicCustomSlider />
                </div>
                <div className="flex justify-center">
                    <DynamicCalendarPage />
                </div>
                <div className='flex justify-center'>
                    <DynamicNoticePage />
                </div>


                <DynamicContractPage />

            </main>
            <Footer />
        </>
    );
}
