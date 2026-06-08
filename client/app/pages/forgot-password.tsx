import { ArrowLeftIcon, MoonIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router"

export default function ForgotPassword() {
    return (
        <div className="bg-gradient-to-b from-zinc-950 via-neutral-900 to-zinc-950 w-screen h-screen flex justify-center items-center">
            <div className="w-full max-w-md mx-auto px-6 py-24 flex flex-col justify-center">
                <div className="bg-zinc-800/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl relative">
                    <Link to="/login" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors mb-4 text-sm font-medium">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Login
                    </Link>
                    <div className="text-center mb-8">
                    <MoonIcon className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-zinc-200 text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    </div>

                    <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-200 mb-2">
                        Email Address
                        </label>
                        <div className="relative">
                        <EnvelopeIcon className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="email" 
                            placeholder="you@example.com"
                            className="w-full bg-zinc-900/50 border border-zinc-500/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-300/50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all"
                        />
                        </div>
                    </div>

                    <button 
                        type="button"
                        className="w-full bg-zinc-600 hover:bg-zinc-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-zinc-500/25"
                    >
                        Send Reset Link
                    </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-zinc-200">
                    Remember your password?{' '}
                    <Link to="/login" className="text-zinc-400 font-semibold hover:text-zinc-300 transition-colors">
                        Sign in
                    </Link>
                    </p>
                </div>
            </div>
        </div>
    )

}