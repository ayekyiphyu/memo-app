// pages/index.tsx

import dynamic from 'next/dynamic';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

// Dynamically import Slider and ContractPage with SSR disabled
const DynamicCustomSlider = dynamic(() => import('@/components/slider/Slider'), {
    ssr: false,
});

const DynamicContractPage = dynamic(() => import('@/features/contract/ContractPage'), {
    ssr: false,
});

export default function Home() {
    return (
        <>
            <Header />
            <main className="w-full">
                <div className="w-full">
                    <DynamicCustomSlider />
                </div>
                <div className="flex">
                    <DynamicContractPage />
                </div>
            </main>
            <Footer />
        </>
    );
}
