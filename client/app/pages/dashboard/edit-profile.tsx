import { useEffect, useState } from "react"
import { api } from "~/root";

export default function DashboardSetting() {
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [dob, setDob] = useState<string>();
    const [gender, setGender] = useState<string>();
    
    useEffect(() => {
        const fetchMe = async () => {
            const response = await api.get("/auth/me");
            const data = response.data;
            setName(data.name);
            setEmail(data.email);
            setDob(data.dob);
            setGender(data.gender);
        }    
        fetchMe();
    }, [])

    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const payload = {
            name, email, dob, gender, 
        };
        
        const response = await api.put("/auth/edit-profile", payload);
        window.location.href = "/dashboard/edit-profile";
    }
        
    return (
        <div className="flex flex-col justify-center items-center h-full">
            <form 
                onSubmit={onSubmit} 
                className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100 space-y-6"
            >
                <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                </div>

                <hr className="border-gray-100" />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">
                        Name
                    </label>
                    <input 
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text" 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">
                    Email
                    </label>
                    <input 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email" 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">
                    Date of Birth
                    </label>
                    <input 
                        onChange={(e) => setDob(e.target.value)}
                        value={dob}
                        type="date" 
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-800">
                        Gender
                    </label>
                    <select
                        onChange={(e) => setGender(e.target.value)}
                        value={gender}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <button 
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition active:scale-[0.98]"
                >
                Submit Data
                </button>
            </form>
        </div>
    )
}