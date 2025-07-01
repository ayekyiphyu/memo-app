import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import ContactFormPage from "@/features/contact-form/ContactFormPage";

export default function ContactForm() {
    return (
        <div className="contact-page">
            <Header />
            <div className="content-wrapper">
                <ContactFormPage />
            </div>
            <Footer />
        </div>
    );
}
