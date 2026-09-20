import { MoonIcon, LockClosedIcon } from "@heroicons/react/24/outline"
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { api } from "~/root";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetPassword = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if(password != confirmPassword) {
            return toast.error("Passwords doesn't match");
        }

        const payload = {
            'password': password
        }

        try {
            const token = searchParams;
            const response = await api.post(`/auth/reset-password?${token}`, payload);
            toast.success(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        
        } catch (error: unknown) {
            toast.error('An error has occured')
        }
    }



    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-full max-w-md mx-auto px-6 py-24 flex flex-col justify-center">
                <div className="p-8 rounded-3xl border border-white/10 shadow-2xl relative">
                    <div className="text-center mb-8">
                        <MoonIcon className="w-12 h-12 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                    </div>

                    <form className="space-y-6" onSubmit={handleResetPassword}>
                        <div>
                            <div className="relative">
                            <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                type="password" 
                                placeholder="New Password"
                                className="w-full border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                            />
                            </div>
                        </div>
                        <div>
                            <div className="relative">
                            <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                type="password" 
                                placeholder=" Confirm New Password"
                                className="w-full border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                            />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-3 rounded-xl font-semibold transition-all border cursor-pointer"
                        >
                            Confirm Reset Password
                        </button>
                    </form>

                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </div>
    )

}