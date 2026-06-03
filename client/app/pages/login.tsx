import { MoonIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router";


export default function LoginPage() {
    return (
 <div className="w-full max-w-md mx-auto px-6 py-24 flex flex-col justify-center">
      <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <MoonIcon className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-indigo-200">Sign in to track your sleep journey</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">
              Email Address
            </label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-indigo-200">
                Password
              </label>
              <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-indigo-500/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 rounded border-indigo-500/30 bg-slate-900/50 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-800"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-indigo-200">
              Remember me for 30 days
            </label>
          </div>

          <button 
            type="button"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-indigo-500/25"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-indigo-200">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
    )

}