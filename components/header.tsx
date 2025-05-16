"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "./ui/button";

export default function Header(){
    const {data : session} = useSession();
    return(
        <>
        {session && session.user ? (
            <Button onClick={() =>signOut()}>LogOut</Button>

        ):(
            <Link href={'/login'}>Login</Link>
        )}
        </>
    )
}