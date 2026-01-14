
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DemoPage(){
    const [loading, setLoading] = useState(false);
    const[loading2, setLoading2] = useState(false);

    const handleBlocking = async () => {
        setLoading(true);
        await fetch('/api/demo/blocking', {method: 'POST'});
        setLoading(false);
    }

    const handleBackground = async()=>{
        setLoading2(true)
        await fetch('/api/demo/background',{method: 'POST'});
        setLoading2(false);
    }

    const handleClientError=()=>{
        throw new Error("Client error: Something went wrong in the browser!");
    }

    const handleApiError = async()=>{
        await  fetch("/api/demo/error",{method: "POST"});
    };

    const handleInngestError = async()=>{
        await fetch('/api/demo/inngest-error', {method:"POST"});
    };

    return (
    <div className="p-8 space-x-4 ">
    <Button onClick={handleBlocking} disabled={loading} >
        {loading ? "Loading...": "Blocking "}
    </Button>
    <Button   onClick={handleBackground} disabled={loading2}>
         {loading2 ? "Loading2...": "Background "}
    </Button>

    <Button variant="destructive" onClick={handleClientError}>
        Client Error
    </Button>
    <Button variant="destructive" onClick={handleApiError}>
        Api Error
    </Button>
    <Button variant="destructive" onClick={handleInngestError}>
        Inngest Error
    </Button>
    </div>
    )
}