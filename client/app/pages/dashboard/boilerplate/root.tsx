import { Outlet } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Boilerplate() {
    const [user, setUser] = useState('');

    const getUser = async () => {
        try {
            const response = await axios.get(
                import.meta.env.VITE_API_BASE_URL + "/auth/me",
                { headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }}
            );
            setUser(response.data.name);
            console.log(response);
            return response.data.user; 
        } catch (error) {
            return null; 
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="flex h-screen flex-col">
            <Header username={user} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 min-h-0 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}