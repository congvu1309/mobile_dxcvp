import { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native"
import Markdown from 'react-native-markdown-display';

interface IntroduceAndUtilitiesProps {
    description: string | undefined;
    checkIn: string | undefined;
    checkOut: string | undefined;
    guests: string | undefined;
    displayedUtilities: Array<{ id: string, label: string, image: string }> | undefined;
    showFullUtilities: boolean;
    setShowFullUtilities: (value: boolean) => void;
}

const IntroduceAndUtilities: React.FC<IntroduceAndUtilitiesProps> = ({
    description,
    checkIn,
    checkOut,
    guests,
    displayedUtilities = [],
    showFullUtilities,
    setShowFullUtilities,
}) => {

    const [showFullDescription, setShowFullDescription] = useState(false);

    const truncateDescription = (description: string, wordLimit: number) => {
        const words = description.split(/\s+/);
        if (words.length <= wordLimit) {
            return description;
        }
        return words.slice(0, wordLimit).join(' ') + '...';
    };

    const truncatedDescription = truncateDescription(description ?? '', 200);

    const handleToggleDescription = () => {
        setShowFullDescription((prev) => !prev);
    };

    const handleToggleUtilities = () => {
        setShowFullUtilities(!showFullUtilities);
    };

    return (
        <View>
            <Text style={styles.titleDescription}>Giới thiệu về chỗ ở này</Text>
            <Markdown style={{ text: { color: '#000' } }}>
                {showFullDescription ? description : truncatedDescription}
            </Markdown>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleToggleDescription}>
                    <Text style={styles.buttonText}>
                        {showFullDescription ? "Ẩn" : "Xem thêm"}
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.titleUtilities}>Các tiện ích ở đây</Text>
            <View style={styles.gridUtilities}>
                {displayedUtilities.map((utility: any) => {

                    let imageBase64 = '';
                    if (utility.image) {
                        imageBase64 = Buffer.from(utility.image, 'base64').toString('binary');
                    }

                    return (
                        <View
                            key={utility.id}
                            style={styles.viewUtility}
                        >
                            <Image
                                source={{ uri: imageBase64 }}
                                style={styles.imageUtility}
                                resizeMode="cover"
                            />
                            <Text style={styles.labelUtility}>{utility.label}</Text>
                        </View>
                    );
                })}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleToggleUtilities}>
                    <Text style={styles.buttonText}>
                        {showFullUtilities ? "Ẩn" : "Xem thêm "}
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.houseRulesTitle}>Nội quy nhà</Text>
            <View style={styles.houseRules}>
                <Text style={styles.houseTitle}>Nhận phòng sau: {checkIn}</Text>
                <Text style={styles.houseTitle}>Trả phòng trước: {checkOut}</Text>
                <Text style={styles.houseTitle}>Tối đa {guests} khách</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    titleDescription: {
        fontSize: 26,
        color: '#000',
    },
    gridUtilities: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    titleUtilities: {
        fontSize: 26,
        color: '#000',
        marginBottom: 30
    },
    buttonContainer: {
        marginVertical: 20,
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
    viewUtility: {
        alignItems: 'center',
        marginBottom: 20,
        paddingLeft: 25,
    },
    imageUtility: {
        width: 100,
        height: 100,
    },
    labelUtility: {
        fontSize: 18,
        color: '#000',
    },
    houseRulesTitle: {
        fontSize: 26,
        color: '#000',
        marginBottom: 10,
    },
    houseRules: {
        marginBottom: 20,
    },
    houseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 5,
    }
})

export default IntroduceAndUtilities;