import React, { useState } from 'react';
import axiosInstance from '../components/axiosInstance'


const LoginAdmin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [toggle, setToggle] = useState(false);
    const [message, setMessage] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const {email, password} = formData;

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleLogin = async (e) =>{
        e.preventDefault();
        try{
            const res = await axiosInstance.post('/admin/login', {email, password});
            setMessage('Login successful. Directing shortly')
        }catch(err){
            setError(err.response?.data?.message || 'login failed try again')
            console.err("admin login error issue", err.response?.data);
        }
    }
    return(
        <div>
            <div>
                <h2>E-Banking Tech</h2>
                <h3>Admin Login</h3>
                <div>
                    <form onSubmit={handleLogin}>
                        <div>
                            <label>Email</label>
                            <input 
                               name="email"
                               type="email"
                               value={email}
                               onChange={onChange}
                               className='input-field'
                               required
                            />
                        </div>
                        <div>
                            <label>Password</label>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={ onChange }
                                className="input-field"
                                required
                            />
                        </div>
                        {error && <p style={{ color: 'red' }}> {error}</p>}
                        <button>
                            login
                        </button>
                    </form>
                    {message && <p style={{ color: 'green' }}> {message} </p>}
                </div>

            </div>
        </div>
    )
}
export default LoginAdmin;