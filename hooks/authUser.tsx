import { useNavigation } from "@react-navigation/native";
import { API } from "constants/enum";
import { UserModel } from "models/user";
import { useEffect, useState } from "react";
import { LoginNavigationProp } from "types";

const userAuth = () => {
    const [user, setUser] = useState<UserModel | null>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<LoginNavigationProp>();

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

    const logout = async (token: any) => {
        try {
            const response = await fetch(`${API.URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });

            if (response.ok) {
                setUser(null);
                setTimeout(() => {
                    navigation.navigate("Login");
                }, 1500);
            } else {
                const data = await response.json();
                console.error('Logout failed:', data.message);
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return { user, loading, logout };
};

export default userAuth;