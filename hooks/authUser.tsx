import { API } from "constants/enum";
import { UserModel } from "models/user";
import { useEffect, useState } from "react";

const userAuth = () => {
    const [user, setUser] = useState<UserModel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API.URL}/get-me`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const data = await response.json();
                if (response.ok) {
                    setUser(data.data);
                } else {
                    console.error('Error fetching user data:', data);
                    setUser(null);
                }
            } catch (error) {
                console.error('Failed to get me', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { user, loading };
};

export default userAuth;