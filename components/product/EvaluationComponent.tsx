import { API } from "constants/enum";
import userAuth from "hooks/authUser";
import { EvaluationModel } from "models/evaluation";
import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface EvaluationComponentProps {
    productId: number;
}

const EvaluationComponent: React.FC<EvaluationComponentProps> = ({ productId }) => {

    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState<number | null>(null);
    const { user } = userAuth();
    const [evaluations, setEvaluations] = useState<EvaluationModel[]>([]);
    const [editingEvaluation, setEditingEvaluation] = useState<EvaluationModel | null>(null);
    const userId = String(user?.id);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if (productId || user) {
            fetchEvaluationData(productId);
        }
    }, [productId, user]);

    const fetchEvaluationData = async (productId: any) => {
        try {
            const response = await fetch(`${API.URL}/get-evaluation?productId=${productId}`);
            const data = await response.json();
            const evaluationsData = data.data;

            const userEvaluationIndex = evaluationsData.findIndex((evaluation: EvaluationModel) => String(evaluation.userId) === userId);

            if (userEvaluationIndex !== -1) {
                const userEvaluation = evaluationsData.splice(userEvaluationIndex, 1)[0];
                setEvaluations([userEvaluation, ...evaluationsData]);
            } else {
                setEvaluations(evaluationsData);
            }
        } catch (error) {
            console.error('Failed to fetch evaluation data', error);
        }
    };

    const handleAddComment = async () => {
        if (!rating || !reviewText) {
            Alert.alert("Đã xảy ra lỗi!", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const initialFormData = {
            id: editingEvaluation ? editingEvaluation.id : 0,
            userId: Number(user?.id),
            productId: productId,
            reviewText,
            rating,
        };

        const apiURL = editingEvaluation
            ? `${API.URL}/update-evaluation`
            : `${API.URL}/create-new-evaluation`;

        const method = "POST";

        try {
            const response = await fetch(apiURL, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(initialFormData),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.status === 1) {
                    Alert.alert("Thất bại", "Không thể gửi đánh giá.");
                } else {
                    Alert.alert("Thành công", "Đánh giá của bạn đã được gửi.");
                    setReviewText("");
                    setRating(null);
                    setEditingEvaluation(null);
                    fetchEvaluationData(productId);
                }
            } else {
                Alert.alert("Error", data.message || "Submission failed.");
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred. Please try again.");
        }
    };

    const handleEdit = (evaluation: EvaluationModel) => {
        setReviewText(evaluation.text);
        setRating(evaluation.rating);
        setEditingEvaluation(evaluation);
    };

    const userEvaluation = !evaluations.find((evaluation) => String(evaluation.userId) === userId);

    const renderEvaluations = () => {

        const evaluationsToShow = showAll ? evaluations : evaluations.slice(0, 4);

        if (!editingEvaluation && evaluationsToShow.length > 0) {
            return (
                <View style={styles.renderEvaluationsContainer}>
                    {evaluationsToShow.map((evaluation) => {

                        let imageBase64 = '';
                        if (evaluation.userEvaluationData.avatar) {
                            imageBase64 = Buffer.from(evaluation.userEvaluationData.avatar, 'base64').toString('binary');
                        }

                        return (
                            <View key={evaluation.id} style={styles.formEvaluation}>
                                <View style={styles.evaluationContainer}>
                                    <View style={styles.userInfoContainer}>
                                        <View style={styles.avatarContainer}>
                                            {evaluation.userEvaluationData.avatar ? (
                                                <Image
                                                    source={{ uri: imageBase64 }}
                                                    style={styles.avatar}
                                                />
                                            ) : (
                                                <Text style={styles.avatarText}>
                                                    {evaluation.userEvaluationData.name?.charAt(0).toUpperCase() ?? "A"}
                                                </Text>
                                            )}
                                        </View>
                                        <View style={styles.userDetails}>
                                            <Text style={styles.userName}>{evaluation.userEvaluationData.name}</Text>
                                            <Text style={styles.userAddress}>{evaluation.userEvaluationData.address}</Text>
                                            <View style={styles.ratingContainer}>
                                                {[...Array(Math.floor(evaluation.rating))].map((_, i) => (
                                                    <Ionicons key={i} name="star" size={20} color="#FFD700" />
                                                ))}
                                                {evaluation.rating % 1 !== 0 && <Ionicons name="star-half" size={20} color="#FFD700" />}
                                                {[...Array(5 - Math.ceil(evaluation.rating))].map((_, i) => (
                                                    <Ionicons key={i} name="star-outline" size={20} color="#ccc" />
                                                ))}
                                            </View>
                                        </View>
                                        {String(evaluation.userId) === userId && (
                                            <TouchableOpacity
                                                style={styles.editButton}
                                                onPress={() => handleEdit(evaluation)}
                                            >
                                                <Text style={styles.editButtonText}>Sửa</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <Text style={styles.reviewText}>{evaluation.text}</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
            );
        }
        return null;
    };

    return (
        <View>
            <Text style={styles.title}>Đánh giá</Text>

            {user && (userEvaluation || editingEvaluation) && (
                <View style={styles.container}>
                    <View style={styles.starsContainer}>
                        {[...Array(5)].map((_, index) => (
                            <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
                                <Text style={[styles.star, { color: index < (rating || 0) ? '#FFD700' : '#ccc' }]}>★</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput
                        style={styles.input}
                        value={reviewText}
                        onChangeText={setReviewText}
                        multiline
                        numberOfLines={4}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleAddComment}>
                            <Text style={styles.buttonText}>
                                {editingEvaluation ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {renderEvaluations()}

            {!editingEvaluation && evaluations.length > 4 && (
                <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.showAllButton}>
                    <Text style={styles.showAllButtonText}>
                        {showAll ? "Ẩn bớt" : "Xem tất cả đánh giá"}
                    </Text>
                </TouchableOpacity>
            )}

            {!editingEvaluation && evaluations.length === 0 && (
                <Text style={styles.evaluationLenght}>Chưa có đánh giá nào</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 26,
        color: '#000',
        marginVertical: 20,
    },
    input: {
        height: 80,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 12,
        backgroundColor: "#f9f9f9",
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    star: {
        fontSize: 30,
        marginHorizontal: 2,
    },
    buttonContainer: {
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#ff0000',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    evaluationLenght: {
        fontSize: 20,
        color: '#000',
        paddingVertical: 10,
    },
    renderEvaluationsContainer: {
        paddingVertical: 10,
    },
    formEvaluation: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    evaluationContainer: {
        paddingVertical: 10,
    },
    userInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    avatarContainer: {
        height: 64,
        width: 64,
        borderRadius: 32,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: 32,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: "bold",
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    userAddress: {
        fontSize: 14,
        color: "#888",
    },
    ratingContainer: {
        flexDirection: "row",
        marginTop: 4,
    },
    editButton: {
        backgroundColor: "#ff0000",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        position: 'absolute',
        right: 0,
        top: 10,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 14,
    },
    reviewText: {
        fontSize: 16,
        color: "#333",
        marginTop: 5,
    },
    showAllButton: {
        padding: 10,
        backgroundColor: '#ff0000',
        borderRadius: 8,
        alignItems: 'center',
    },
    showAllButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default EvaluationComponent;
