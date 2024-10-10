import { useNavigation } from "@react-navigation/native";
import { API } from "constants/enum";
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ProfileStackScreenNavigationProp, RegisterNavigationProp } from "types";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation<RegisterNavigationProp | ProfileStackScreenNavigationProp>();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Đã xảy ra lỗi!", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate email format
        if (!emailRegex.test(email)) {
            Alert.alert("Đã xảy ra lỗi!", "Định dạng email không chính xác.");
            return;
        }

        const initialFormData = {
            email,
            password
        };

        try {
            // Make API call to /api/create-new-user
            const response = await fetch(`${API.URL}/log-in-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(initialFormData),
            });

            const data = await response.json();

            if (response.ok) {
                // Check if the user already exists
                if (data.status === 1) {
                    Alert.alert("Đã xảy ra lỗi!", "Thiếu thông số!");
                } else if (data.status === 2) {
                    Alert.alert("Đã xảy ra lỗi!", "Không tìm thấy người dùng!");
                } else if (data.status === 3) {
                    Alert.alert("Đã xảy ra lỗi!", "Sai mật khẩu!");
                } else if (data.status === 4) {
                    Alert.alert("Đã xảy ra lỗi!", "Người dùng bị chặn, liên hệ để tìm hiểu!");
                } else {
                    Alert.alert("Thành công!", "Đăng nhập thành công!");
                    setTimeout(() => {
                        navigation.navigate("ProfileStackScreen");
                    }, 1500);
                    // Reset the form fields after successful login
                    setEmail("");
                    setPassword("");

                }
            } else {
                Alert.alert("Error", data.message || "Đăng ký thất bại.");
            }
        } catch (error) {
            Alert.alert("Error", "Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng nhập</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    style={styles.iconEye}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#000" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <Text>Bạn chưa có tài khoản?</Text>
                <TouchableOpacity
                    style={styles.seeMoreButton}
                    onPress={() => {
                        navigation.navigate('Register');
                    }}
                >
                    <Text style={styles.buttonTextRegiste}>Đăng ký</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center",
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 16,
        backgroundColor: "#f9f9f9",
    },
    button: {
        backgroundColor: "#007BFF",
        paddingVertical: 14,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 20,
    },
    seeMoreButton: {
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonTextRegiste: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        textDecorationLine: 'underline',
        paddingLeft: 10
    },
    inputPassword: {
        height: 50,
        width: 310,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: "#f9f9f9",
        fontSize: 18,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 16,
        backgroundColor: "#f9f9f9",
    },
    iconEye: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        marginRight: 15,
    },
});

export default Login;
