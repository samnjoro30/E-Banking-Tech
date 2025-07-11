"use client"

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface FormData  {
   Username: string;
   Password: string;
}

export default function LoginAdmin(){

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string>('');
    const [ error, setError ] = useState<string>('')
    const [ formData, setFormData] = useState<FormData>({
        Username: '',
        Password: '',
    })
    const navigate = useRouter();

    const {Username, Password} = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try{
            const response = await axios.post("/admin/login", formData )

            setMessage("Login successful")
        }catch(err: any){
            setError(err.response?.data?.message ||  'login failed try again')

        }finally{
            setLoading(false);
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
                          name="Username"
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
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
        </div>
    )

}