import { useFooterStore } from '@/store/useFooterStore';
import React from 'react';

const Footer: React.FC = () => {
    const showFooter = useFooterStore((state: { showFooter: any; }) => state.showFooter);

    if (!showFooter) return null;

    return (
        <footer style={{
            background: "linear-gradient(120deg, #4f8cfb 0%, #235390 50%, #a770ef 100%)",
            boxShadow: "0 4px 24px 0 rgba(80, 143, 245, 0.15)",
            color: "#ffffff"
        }} className="w-full text-center text-gray-500 py-4 border-t mt-8 text-sm">
            &copy; {new Date().getFullYear()} Created by Phyu 2025. All rights reserved.
        </footer>
    );
};

export default Footer;
