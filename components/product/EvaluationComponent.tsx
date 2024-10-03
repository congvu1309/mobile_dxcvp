import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";

interface EvaluationComponentProps {
    productId: number;
}

const EvaluationComponent: React.FC<EvaluationComponentProps> = ({ productId }) => {
    const [review, setReview] = useState("");
    const [comments, setComments] = useState<string[]>([]);
    const [rating, setRating] = useState<number | null>(null);

    const handleAddComment = () => {
    };

    return (
        <View>
            <Text style={styles.title}>Đánh giá</Text>
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
                    value={review}
                    onChangeText={setReview}
                    multiline
                    numberOfLines={4}
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleAddComment}>
                        <Text style={styles.buttonText}>
                            Gửi đánh giá
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EvaluationComponent;