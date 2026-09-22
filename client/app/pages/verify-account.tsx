import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { api } from "~/root";

export default function VerifyAccount() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [message, setMessage] = useState("Please wait.....")


    useEffect(() => {
    const verify = async () => {
        try {
            const token = searchParams;

            const response = await api.post(
                `/auth/verify-account?${token}`
            );

            setMessage(response.data.message);

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error: any) {
            console.error(error);
            setMessage(
                error.response?.data?.detail || "An error has occurred"
            );
        }
    };

    verify();
    }, [])

    return (
        <div>
            {message}
        </div>
    )


}