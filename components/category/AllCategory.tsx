import { useNavigation } from "@react-navigation/native";
import { API } from "constants/enum";
import { CategoryModel } from "models/category";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { ProductByCategoryNavigationProp } from "types";

const AllCategory = () => {

    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const navigation = useNavigation<ProductByCategoryNavigationProp>();

    const handleGoBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API.URL}/get-all-category`);
            const data = await response.json();
            setCategories(data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const renderItem = ({ item }: { item: CategoryModel }) => {
        let imageBase64 = '';
        if (item.image) {
            imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
        }

        return (
            <TouchableOpacity
                onPress={() => handleItemPress(item.id, item.title)}
                style={styles.itemContainer}
            >
                {imageBase64 ? (
                    <Image
                        source={{ uri: imageBase64 }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholder} />
                )}
                <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
        );
    };

    const renderGridItem = ({ item }: { item: CategoryModel }) => (
        <View style={styles.gridItem}>
            {renderItem({ item })}
        </View>
    );

    const handleItemPress = (id: number, title: string) => {
        navigation.navigate('ProductByCategory', { categoryId: id, categoryTitle: title });
    };

    return (
        <View style={styles.container}>
            <View style={styles.arrowBack}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Danh sách</Text>
            </View>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderGridItem}
                numColumns={3} // Display 3 items per row
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 20,
    },
    arrowBack: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginRight: 30,
    },
    listContainer: {
        paddingBottom: 16,
    },
    gridItem: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    itemContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    image: {
        width: 70,
        height: 70,
    },
    placeholder: {
        width: 50,
        height: 50,
        backgroundColor: '#ccc',
    },
    itemTitle: {
        marginTop: 8,
        textAlign: 'center',
        color: '#000',
        fontSize: 18,
    },
});

export default AllCategory;