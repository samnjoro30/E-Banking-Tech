"use client"

import { useState } from 'react';
import axios from 'axios';

export default function LoginAdmin(){

    const [loading, setLoading] = useState(false);
    const [ message, setMessage] = useState('')


    const handleSubmit = async () => {

        try{
            const response = await axios.post("/admin/login" )

            setMessage("Login successful")
        }catch(erro){

        }
    }
    return(
        <div></div>
    )

}