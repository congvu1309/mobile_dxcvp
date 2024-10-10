import { useNavigation } from "@react-navigation/native";
import { API } from "constants/enum";
import userAuth from "hooks/authUser";
import { useEffect, useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ProfileStackScreenNavigationProp } from "types";

const ChangePassword = () => {
    const { user } = userAuth();
    const navigation = useNavigation<ProfileStackScreenNavigationProp>();
    const id = user?.id;

    const [formData, setFormData] = useState({
        id: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (id) {
            fetchUserById(id);
        }
    }, [id]);

    const fetchUserById = async (userId: any) => {
        try {
            const response = await fetch(`${API.URL}/get-user-by-id?id=${userId}`);
            const data = await response.json();
            const fetchedUser = data.data;

            setFormData({
                ...formData,
                id: fetchedUser.id,
            });
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };

    const handleInputChange = (field: any, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleUpdate = async () => {
        if (!formData.password || !formData.confirmPassword) {
            Alert.alert("Đã xảy ra lỗi!", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            Alert.alert("Đã xảy ra lỗi!", "Mật khẩu không khớp.");
            return;
        }

        try {
            const response = await fetch(`${API.URL}/update-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.status === 1) {
                    Alert.alert("Đã xảy ra lỗi!", "Cập nhật thất bại!");
                } else {
                    Alert.alert("Thành công!", "Cập nhật thành công!");
                    setTimeout(() => {
                        navigation.navigate("ProfileStackScreen");
                    }, 1500);
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

            <View style={styles.arrowBack}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Đổi mật khẩu</Text>
            </View>

            <Text style={styles.label}>Mật khẩu:</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange("password", value)}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    style={styles.iconEye}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nhập lại mật khẩu:</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange("confirmPassword", value)}
                    secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                    style={styles.iconEye}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
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
    updateButton: {
        backgroundColor: "#28A745",
        alignItems: "center",
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
    },
    arrowBack: {
        position: 'absolute',
        top: 30,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginRight: 30,
    },
});

export default ChangePassword;