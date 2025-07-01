import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import RegisterPage from "@/features/register/RegisterPage";
export default function Register() {
    return (


        <div className="register-page">
            <Header />
            <div className="content-wrapper">
                <RegisterPage />
            </div>
            <Footer />
        </div>
    );
}
