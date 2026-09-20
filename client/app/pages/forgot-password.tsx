// Make loading state
import { ArrowLeftIcon, MoonIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import { useState } from "react";
import { Link } from "react-router"

import { Bounce, toast, ToastContainer } from "react-toastify";
import { api } from "~/root";

export default function ForgotPassword() {
    
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if(!email) {
            return toast.error('Email cannot be empty');
        }
        const payload = {
            'email': email
        }

        try {
            toast.success("If user exist email instruction for reseting password has been sent");
            await api.post("/auth/forgot-password", payload);
            
        } catch (error: unknown) {
            toast.error('An error has occured')
        }
    }



    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-full max-w-md mx-auto px-6 py-24 flex flex-col justify-center">
                <div className="p-8 rounded-3xl border border-white/10 shadow-2xl relative">
                    <Link to="/login" className="inline-flex items-center gap-2 transition-colors mb-4 text-sm font-medium">
                    <ArrowLeftIcon className="w-4 h-4" />
                        Back to Login
                    </Link>
                    <div className="text-center mb-8">
                        <MoonIcon className="w-12 h-12 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                        <p className="text-sm">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleForgotPassword}>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                            Email Address
                            </label>
                            <div className="relative">
                            <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type="email" 
                                placeholder="you@example.com"
                                className="w-full border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                            />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-3 rounded-xl font-semibold transition-all border cursor-pointer"
                        >
                            Send Reset Link
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm">
                    Remember your password?{' '}
                    <Link to="/login" className="font-semibold transition-colors">
                        Sign in
                    </Link>
                    </p>
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