
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import CustomSlider from "@/components/slider/Slider";

export default function Home() {
    return (
        <>
            <Header />
            <div className="w-full">
                <CustomSlider />
            </div>
            <Footer></Footer>
        </>
    );
}
