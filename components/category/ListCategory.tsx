import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { CategoryModel } from '../../models/category';
import { API } from '../../constants/enum';
import { useNavigation } from '@react-navigation/native';
import { AllCategoryNavigationProp, ProductByCategoryNavigationProp } from 'types';

const ListCategory = () => {

    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const navigation = useNavigation<AllCategoryNavigationProp | ProductByCategoryNavigationProp>();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API.URL}/get-all-category`);
            const data = await response.json();
            setCategories(data.data.slice(0, 6));
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

    const renderFooter = () => {
        return (
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.seeMoreButton}
                    onPress={() => {
                        navigation.navigate('AllCategory');
                    }}
                >
                    <Text style={styles.buttonText}>Xem thêm</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const handleItemPress = (id: number, title: string) => {
        navigation.navigate('ProductByCategory', { categoryId: id, categoryTitle: title });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderGridItem}
                numColumns={3}
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        width: 35,
        height: 35,
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
        fontSize: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 5,
        marginBottom: 5,
        marginRight: 17
    },
    seeMoreButton: {
        backgroundColor: '#ff0000',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ListCategory;