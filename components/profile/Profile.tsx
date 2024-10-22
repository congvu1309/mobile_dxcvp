import { useNavigation } from "@react-navigation/native";
import { API } from "constants/enum";
import userAuth from "hooks/authUser";
import { useEffect, useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ChangePasswordNavigationProp, ProfileStackScreenNavigationProp } from "types";
import { launchImageLibrary, ImageLibraryOptions } from "react-native-image-picker";
import RNFS from 'react-native-fs';

const Profile = () => {
    const { user, logout } = userAuth();
    const [formData, setFormData] = useState({
        id: "",
        email: "",
        role: "",
        name: "",
        phoneNumber: "",
        address: "",
        avatar: "",
    });
    const navigation = useNavigation<ProfileStackScreenNavigationProp | ChangePasswordNavigationProp>();

    const id = user?.id;

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

            let imageBase64 = '';
            if (fetchedUser.avatar) {
                imageBase64 = Buffer.from(fetchedUser.avatar, 'base64').toString('binary');
            }

            // Set form data with fetched user data
            setFormData({
                id: fetchedUser.id,
                email: fetchedUser.email,
                role: fetchedUser.role,
                name: fetchedUser.name,
                phoneNumber: fetchedUser.phoneNumber,
                address: fetchedUser.address,
                avatar: imageBase64,
            });
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };

    const handleInputChange = (field: any, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleImageSelect = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.7,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.error('ImagePicker Error:', response.errorMessage);
                Alert.alert("Error", "Failed to pick image");
            } else if (response.assets && response.assets.length > 0) {
                const selectedImageUri = response.assets[0].uri ?? '';
                try {
                    // Convert the image to Base64
                    const base64Image = await RNFS.readFile(selectedImageUri, 'base64');
                    setFormData({ ...formData, avatar: `data:image/jpeg;base64,${base64Image}` });
                    console.log('Selected Image Base64:', base64Image);
                } catch (error) {
                    console.error('Error converting image to Base64:', error);
                    Alert.alert("Error", "Failed to process image.");
                }
            } else {
                console.error('No assets found in the response');
            }
        });
    };

    const handleChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    const handleUpdate = async () => {
        if (!formData.name || !formData.phoneNumber || !formData.address) {
            Alert.alert("Đã xảy ra lỗi!", "Vui lòng nhập đầy đủ thông tin.");
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
            <View style={styles.containerAvatar}>
                <TouchableOpacity onPress={handleImageSelect}>
                    {formData.avatar ? (
                        <Image source={{ uri: formData.avatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{formData.name[0]}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Email:</Text>
            <TextInput
                style={styles.input}
                value={formData.email}
                editable={false}
            />

            <Text style={styles.label}>Vai trò:</Text>
            <TextInput
                style={styles.input}
                value={formData.role === 'R3' ? 'Khách hàng' : ''}
                editable={false}
            />

            <Text style={styles.label}>Họ và tên:</Text>
            <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
            />

            <Text style={styles.label}>Số điện thoại:</Text>
            <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange("phoneNumber", value)}
            />

            <Text style={styles.label}>Địa chỉ:</Text>
            <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(value) => handleInputChange("address", value)}
            />

            <TouchableOpacity onPress={handleChangePassword} style={styles.changePasswordButton}>
                <Text style={styles.buttonText}>Đổi mật khẩu</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={logout} style={styles.logoutIcon}>
                <Icon name="log-out-outline" size={30} color="#FFF" />
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
    input: {
        height: 40,
        width: 350,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    button: {
        width: 50,
        height: 50,
        backgroundColor: "#FF0000",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    logoutIcon: {
        position: "absolute",
        bottom: 10,
        right: 30,
        backgroundColor: "#FF0000",
        padding: 10,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    containerAvatar: {
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#CCC",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    avatarText: {
        fontSize: 40,
        color: "#FFF",
    },
    changePasswordButton: {
        backgroundColor: "#007BFF",
        alignItems: "center",
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
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
});

export default Profile;