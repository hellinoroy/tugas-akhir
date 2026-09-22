import { MoonIcon, EnvelopeIcon, LockClosedIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from 'react-router';
import { api } from "~/root";
import { useNavigate } from "react-router";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        try {
            const response = await api.post("/auth/login", params);
            localStorage.setItem('access_token', response.data.access_token);
            navigate('/dashboard');
        } catch (error: any) {
            console.log(error)
            if(error.response?.status == 401) {
                toast.warning(error.response?.data?.message || error.response?.data?.detail);
                return
            }
            
            toast.error('An error has occured')
        }
    }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
        <div className="w-full max-w-md flex flex-col justify-center">
            <div className="p-8 rounded-3xl border border-white/10 shadow-2xl">
                <Link to="/" className="inline-flex items-center gap-2   mb-4 text-sm font-medium">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Home
                </Link>
                <div className="text-center mb-8">
                    <MoonIcon className="w-12 h-12 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p>Sign in to track your sleep journey</p>
                </div>

                <form 
                    className="space-y-6"                         
                    onSubmit={handleLogin}
                >
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
                            className="w-full border border-zinc-500/30 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                        />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">
                            Password
                        </label>
                        <a href="/forgot-password" className="text-sm transition-colors">
                            Forgot password?
                        </a>
                        </div>
                        <div className="relative">
                        <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password" 
                            placeholder="••••••••"
                            className="w-full border border-zinc-500/30 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                        />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl font-semibold transition-all border cursor-pointer"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-sm ">
                Don't have an account?{' '}
                    <Link to="/register" className="font-semibold transition-colors">
                        Sign up now
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
  
  );
}