import Login from "components/auth/Login";
import userAuth from "hooks/authUser";
import { View, StyleSheet, Text } from "react-native";

const ProfileScreen = () => {

    const { user, loading } = userAuth();

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Login />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text>Welcome, {user.email}!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ProfileScreen;
