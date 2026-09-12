import { MoonIcon, EnvelopeIcon, LockClosedIcon, ArrowLeftIcon, UserIcon, CalendarDaysIcon, UserGroupIcon, ChevronDownIcon  } from "@heroicons/react/24/outline";
import { useState } from "react";
import { api } from "~/root";
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
            const response = await api.post("/auth/register", payload);
            navigate('/login');
        } catch (error: unknown) {

        }
    }



    return (
        <div className="w-screen h-screen flex justify-center overflow-scroll">
            <div className="w-full max-w-md flex flex-col justify-center">
                <div className="p-8 rounded-3xl border border-white/10 shadow-2xl relative ">
                    <Link to="/login" className="inline-flex items-center gap-2 transition-colors mb-4 text-sm font-medium">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Login
                    </Link>
                    <div className="text-center mb-8">
                        <MoonIcon className="w-12 h-12 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                        <p>Start your journey to better sleep</p>
                    </div>

                    <form 
                        className="space-y-5"
                        onSubmit={handleRegister}
                    >
                        <div>
                            <label className="block text-sm font-medium mb-2">
                            Full Name
                            </label>
                            <div className="relative">
                            <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                onChange={(e) => setFullName(e.target.value)}
                                value={fullName}
                                type="text" 
                                placeholder="John Doe"
                                className="w-full border rounded-xl py-3 pl-10 pr-4  focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                            />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Date of Birth
                            </label>
                            <div className="relative">
                                <CalendarDaysIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    onChange={(e) => setDob(e.target.value)}
                                    value={dob}
                                    type="date" 
                                    className="w-full border rounded-xl py-3 pl-10 pr-4  focus:outline-none focus:ring-2 focus:border-transparent transition-all [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Gender
                            </label>
                            <div className="relative">
                                <UserGroupIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
                                <select 
                                    onChange={(e) => setGender(e.target.value)}
                                    value={gender}
                                    defaultValue=""
                                    className="w-full border  rounded-xl py-3 pl-10 pr-10  focus:outline-none focus:ring-2  focus:border-transparent transition-all appearance-none"
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
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
                                className="w-full border rounded-xl py-3 pl-10 pr-4  focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                            />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                            <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                type="password" 
                                placeholder="••••••••"
                                className="w-full border rounded-xl py-3 pl-10 pr-4  focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                            />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                            <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                type="password" 
                                placeholder="••••••••"
                                className="w-full border rounded-xl py-3 pl-10 pr-4  focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                            />
                            </div>
                            <p className="mt-2 text-xs">
                            Must be at least 8 characters long
                            </p>
                        </div>

                        <div className="pt-2">
                            <button 
                            type="submit"
                            className="w-full py-3 rounded-xl font-semibold transition-all border cursor-pointer"
                            >
                            Create Account
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm">
                    Already have an account?{' '}
                        <Link to="/login" className="font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
            
        </div>
    )
}