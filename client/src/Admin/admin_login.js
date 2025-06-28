import React, { useState } from 'react';
import axiosInstance from '../components/axiosInstance'


const LoginAdmin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [toggle, setToggle] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })


    const handleLogin = async (e) =>{
        e.preventDefault();
        try{
            const res = await axiosInstance.post('/admin/login')

        }catch(err){

        }
    }
    return(
        <div>

        </div>
    )
}