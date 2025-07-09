import React, { useEffect } from 'react';
import axiosInstance from '../../components/axiosInstance';


const Users =  () => {

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const res = await axiosInstance.get("admin/users");
            }catch(err){
                console.error(err);
            }
        }
        fetchUsers();
    }, []);

    return(
        <div>
            <div></div>
        </div>
    )
}

export default Users;