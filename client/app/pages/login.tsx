import { MoonIcon, EnvelopeIcon, LockClosedIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from 'react-router';
import axios from "axios";
import { useNavigate } from "react-router";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        params.append('password', password);
        try {
            const response = await axios.post(
                import.meta.env.VITE_API_BASE_URL + "/auth/login",
                params,
                {
                    withCredentials: true
                }
            );
            localStorage.setItem('access_token', response.data.access_token);
            navigate('/dashboard');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Server error:", error.response?.data.message);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    }

  return (
    <div className="bg-gradient-to-b from-zinc-950 via-neutral-900 to-zinc-950 w-screen h-screen flex justify-center items-center">
        <div className="w-full max-w-md flex flex-col justify-center">
            <div className="bg-zinc-800/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
                <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors mb-4 text-sm font-medium">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Home
                </Link>
                <div className="text-center mb-8">
                    <MoonIcon className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-zinc-200">Sign in to track your sleep journey</p>
                </div>

                <form 
                    className="space-y-6"                         
                    onSubmit={handleLogin}
                >
                    <div>
                        <label className="block text-sm font-medium text-zinc-200 mb-2">
                        Email Address
                        </label>
                        <div className="relative">
                        <EnvelopeIcon className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email" 
                            placeholder="you@example.com"
                            className="w-full bg-zinc-900/50 border border-zinc-500/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-300/50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                        />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-zinc-200">
                            Password
                        </label>
                        <a href="/forgot-password" className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                            Forgot password?
                        </a>
                        </div>
                        <div className="relative">
                        <LockClosedIcon className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password" 
                            placeholder="••••••••"
                            className="w-full bg-zinc-900/50 border border-zinc-500/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-300/50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                        />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input 
                        type="checkbox" 
                        id="remember" 
                        className="w-4 h-4 rounded border-zinc-500/30 bg-zinc-900/50 text-zinc-500 focus:ring-zinc-500 focus:ring-offset-zinc-800"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-zinc-200">
                        Remember me for 30 days
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-zinc-600 hover:bg-zinc-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-zinc-500/25"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-zinc-200">
                Don't have an account?{' '}
                    <Link to="/register" className="text-zinc-400 font-semibold hover:text-zinc-300 transition-colors">
                        Sign up now
                    </Link>
                </p>
            </div>
        </div>
    </div>
  
  );
}