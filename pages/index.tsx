'use client';
import Chatbot from '@/components/Chatbot';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bot } from 'lucide-react';
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
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 bg-blue-600 hover:bg-blue-700"
                            aria-label="Open AI Chatbot"
                        >
                            <Bot size={32} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] p-0 border-0">
                        <DialogHeader className="p-4 border-b">
                            <DialogTitle>AI Assistant</DialogTitle>
                        </DialogHeader>
                        {/* The Chatbot component is rendered here inside the dialog */}
                        <Chatbot />
                    </DialogContent>
                </Dialog>

            </main>
            <Footer />
        </>
    );
}
