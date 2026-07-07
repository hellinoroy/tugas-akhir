import { MoonIcon, EnvelopeIcon, LockClosedIcon, ArrowLeftIcon, UserIcon, CalendarDaysIcon, UserGroupIcon, ChevronDownIcon  } from "@heroicons/react/24/outline";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Link } from 'react-router';

export default function Register() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleRegister = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if(password != confirmPassword) {
            return
        }
        const payload = {
            'name': fullName,
            email,
            password,
            dob,
            gender
        }
        try {
            const response = await axios.post(
                import.meta.env.VITE_API_BASE_URL + "/auth/register",
                payload
            );
            navigate('/login');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Server error:", error.response?.data.message);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    }



    return (
        <div className="bg-gradient-to-b from-zinc-950 via-neutral-900 to-zinc-950 w-screen h-screen flex justify-center overflow-scroll">
            <div className="w-full max-w-md flex flex-col justify-center">
                <div className="bg-zinc-800/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl relative ">
                    <Link to="/login" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors mb-4 text-sm font-medium">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Login
                    </Link>
                    <div className="text-center mb-8">
                        <MoonIcon className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-zinc-200">Start your journey to better sleep</p>
                    </div>

                    <form 
                        className="space-y-5"
                        onSubmit={handleRegister}
                    >
                        <div>
                            <label className="block text-sm font-medium text-zinc-200 mb-2">
                            Full Name
                            </label>
                            <div className="relative">
                            <UserIcon className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                onChange={(e) => setFullName(e.target.value)}
                                value={fullName}
                                type="text" 
                                placeholder="John Doe"
                                className="w-full bg-zinc-900/50 border border-zinc-500/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-300/50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                            />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-200 mb-2">
                                Date of Birth
                            </label>
                            <div className="relative">
                                <CalendarDaysIcon className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    onChange={(e) => setDob(e.target.value)}
                                    value={dob}
                                    type="date" 
                                    className="w-full bg-zinc-900/50 border border-zinc-500/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-300/50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-200 mb-2">
                                Gender
                            </label>
                            <div className="relative">
                                <UserGroupIcon className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <select 
                                    onChange={(e) => setGender(e.target.value)}
                                    value={gender}
                                    defaultValue=""
                                    className="w-full bg-zinc-900/50 border border-zinc-500/30 rounded-xl py-3 pl-10 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all appearance-none"
                                >
                                    <option value="" disabled className="bg-zinc-800 text-zinc-400">Select</option>
                                    <option value="male" className="bg-zinc-800">Male</option>
                                    <option value="female" className="bg-zinc-800">Female</option>
                                </select>
                                <ChevronDownIcon className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
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
                            <label className="block text-sm font-medium text-zinc-200 mb-2">
                                Password
                            </label>
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
                        <div>
                            <label className="block text-sm font-medium text-zinc-200 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                            <LockClosedIcon className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                type="password" 
                                placeholder="••••••••"
                                className="w-full bg-zinc-900/50 border border-zinc-500/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-300/50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                            />
                            </div>
                            <p className="mt-2 text-xs text-zinc-300/70">
                            Must be at least 8 characters long
                            </p>
                        </div>

                        <div className="pt-2">
                            <button 
                            type="submit"
                            className="w-full bg-zinc-600 hover:bg-zinc-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-zinc-500/25"
                            >
                            Create Account
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-zinc-200">
                    Already have an account?{' '}
                        <Link to="/login" className="text-zinc-400 font-semibold hover:text-zinc-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
            
        </div>
    )
}