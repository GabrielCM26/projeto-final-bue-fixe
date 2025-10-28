import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import Card from "@/components/LoginCard";

export default function loginPage(){
 const [email, setEmail] = useState ("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState("") 


async function handleSubmit(e) {
    e.preventDefault();
}

//if (!email || !password) {
   //setError("Preenche o email a password")
//}

//api 
//const res = await fetch("/api")

//seterror("")

return (

    <main className="flex min-h-screen items-center justify-center bg-neutral-900">
        <Card />
    </main>


);
}