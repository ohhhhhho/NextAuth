"use client"
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function SnsLogin(){
    const {data : session} = useSession();
    if (session) {
        redirect('/');
      }
    return(
        <>
        <div className="flex items-center justify-center gap-1 *:py-2 *:px-5 *:ring-1 *:rounded-md *:ring-neutral-400">
            <Link href={'/'}>Kakao</Link>
            <Button onClick={() => signIn("google")}>Google</Button>
        </div>
        </>
    )
}