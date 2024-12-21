import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { FaUserCircle } from 'react-icons/fa';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;
            setUser(currentUser);
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="flex flex-col items-center mt-10 text-white">
            <FaUserCircle size={120} className="text-gray-400 mb-4" />
            <p className="text-lg">{user?.email || "Loading..."}</p>
        </div>
    );
};

export default UserProfile;
