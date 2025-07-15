import { Button } from "@/components/ui/button";
import { useHeaderStore } from "@/store/userHeaderStore";
import { LogIn, Phone, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
    const isLoggedIn = useHeaderStore((state) => state.isLoggedIn);
    const setLoggedIn = useHeaderStore((state) => state.setisLoggedIn);
    const router = useRouter();

    const handleLogin = () => {
        router.push("/login");
    };

    const handleSignUp = () => {
        router.push("/register");
    };

    const handleform = () => {
        router.push("/contact-form");
    }


    //handle phone call
    const handlePhoneCall = (phoneNumber: string) => {
        window.location.href = `tel:${phoneNumber}`;
    };


    const phoneNumbers = {
        office: "+1-234-567-8900",
        mobile: "+1-234-567-8901",
        support: "+1-800-123-4567"
    };

    return (
        <header
            className="w-full flex items-center justify-between px-8 py-4 shadow-lg"
            style={{
                background: "#4f8cfb", // Beautiful, soft blue
                boxShadow: "0 4px 24px 0 rgba(80, 143, 245, 0.15)",
                color: "white", // Ensure text remains visible
            }}
        >
            <div className="flex items-center gap-3">

                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow" style={{ marginBottom: "0px", color: "#ffffff" }}>
                    ReserveIt
                </h1>
            </div>

            {!isLoggedIn && (
                <div className="flex gap-4">
                    <Button
                        onClick={handleLogin}
                        className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-2 rounded-xl shadow hover:bg-blue-50 transition cursor-pointer"
                    >
                        <LogIn className="w-5 h-5" />
                        Login
                    </Button>
                    <Button
                        onClick={handleSignUp}
                        className="flex items-center gap-2 bg-yellow-50 text-yellow-800 font-semibold px-6 py-2 rounded-xl shadow hover:bg-yellow-100 transition cursor-pointer"
                    >
                        <UserPlus className="w-5 h-5" />
                        Register
                    </Button>
                    <Button
                        onClick={() => handlePhoneCall(phoneNumbers.support)}
                        className="pointer cursor-pointer group flex items-center gap-3 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-8 py-4 rounded-xl shadow-[0_6px_0_#b45309,0_12px_24px_rgba(180,83,9,0.3)] hover:shadow-[0_4px_0_#b45309,0_8px_16px_rgba(180,83,9,0.5)] active:shadow-[0_2px_0_#b45309,0_4px_8px_rgba(180,83,9,0.3)] hover:translate-y-[-2px] active:translate-y-[2px] transition-all duration-150"
                    >
                        <Phone />
                        <div className="text-left">
                            <div className="text-lg font-bold">24/7 Support</div>

                        </div>
                    </Button>

                </div>
            )
            }
        </header >
    );
}