"use client"

import { useState } from 'react';
import axios from 'axios';

export default function LoginAdmin(){

    const [ loading, setLoading ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ formData, setFormData] = useState({
        Username: '',
        Password: '',
    })

    const {Username, Password} = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async () => {

        try{
            const response = await axios.post("/admin/login", formData )

            setMessage("Login successful")
        }catch(err){


        }
    }
    return(
        <div>
            <h1> LOGIN PANEL FOR ADMIN </h1>
            <div>
                <form onSubmit={ handleSubmit }>
                    <div>
                        <label> Username | Bank Email</label>
                        <input 
                          type = "text"
                          name="username"
                          value = {Username}
                          onChange = { onChange }
                          required
                        />
                    </div>
                    <div>
                        <label> Password </label>
                        <input
                          type="password"
                          name="Password"
                          value = { Password}
                          onChange = { onChange}
                          required
                        />

                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                    >
                        { loading ? 'Logging ...' : 'Login'}
                    </button>
                    {message && <p style={{ color: 'green' }}> {message} </p>}
                </form>
            </div>
        </div>
    )

}