import { useNavigation } from "@react-navigation/native";
import { API } from "constants/enum";
import { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LoginNavigationProp } from "types";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigation = useNavigation<LoginNavigationProp>();

    const handleLogin = async () => {
        if (!email || !password || !confirmPassword || !name || !phoneNumber || !address) {
            Alert.alert("Đã xảy ra lỗi!", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate email format
        if (!emailRegex.test(email)) {
            Alert.alert("Đã xảy ra lỗi!", "Định dạng email không chính xác.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Đã xảy ra lỗi!", "Mật khẩu không khớp.");
            return;
        }

        const newUser = {
            email,
            password,
            name,
            phoneNumber,
            address,
            roleCheck: "R3",
        };

        try {
            // Make API call to /api/create-new-user
            const response = await fetch(`${API.URL}/create-new-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();

            if (response.ok) {
                // Check if the user already exists
                if (data.status === 1) {
                    Alert.alert("Đã xảy ra lỗi!", "Tài khoản đã tồn tại!");
                } else {
                    Alert.alert("Thành công!", "Đăng ký thành công!");
                    // Reset the form fields after successful registration
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setName("");
                    setPhoneNumber("");
                    setAddress("");
                    // Navigate to login page
                    navigation.navigate("Login");
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
            <Text style={styles.title}>Đăng ký</Text>
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
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                    style={styles.iconEye}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#000" />
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                value={address}
                onChangeText={setAddress}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <Text>Bạn đã có tài khoản!</Text>
                <TouchableOpacity
                    style={styles.seeMoreButton}
                    onPress={() => {
                        navigation.navigate("Login");
                    }}
                >
                    <Text style={styles.buttonTextLogin}>Đăng nhập</Text>
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
        fontSize: 18,
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
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 20,
    },
    seeMoreButton: {
        borderRadius: 8,
        alignItems: "center",
    },
    buttonTextLogin: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20,
        textDecorationLine: "underline",
        paddingLeft: 10,
    },
});

export default Register;