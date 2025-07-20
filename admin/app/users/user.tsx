
import axiosInstance from '../axiosInstance/axiosInstance';

interface User {
    email: string,
    firstName: string,
    phoneNumber: string
}

export default  async function Users () {
    let user: User | null = null;

    try {
        const res = await axiosInstance.get('/admin/users');
        user = res.data;
    } catch (error) {
        console.error('Error fetching user:', error);
    }

    if (!user) {
        return <div>Error loading user data.</div>;
    }

    return (
        <div>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Phone number:</strong> {user.phoneNumber}</p>
        </div>
    );
}