"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function CallBackPage(){
    const { data: session, status } = useSession();
    const router = useRouter()

    useEffect(() => {
        if(status === "authenticated"){
            if(session.user.signupStep2Done){
                router.replace("/dashboard")
            }else{
                router.replace("/signup/step2")
            }
        }
    }, [status, session, router])

    return (
        <p className="text-center mt-10">Redirecting...</p>
    )
}