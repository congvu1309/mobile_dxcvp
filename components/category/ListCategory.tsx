import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { CategoryModel } from '../../models/category';
import { API } from '../../constants/enum';

const ListCategory = () => {
    const [categories, setCategories] = useState<CategoryModel[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API.URL}/get-all-category`);
            const data = await response.json();
            // Limit to 9 items
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
            <TouchableOpacity onPress={() => handleItemPress(item.id)} style={styles.itemContainer}>
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
                        console.log('Navigate to Full Categories');
                    }}
                >
                    <Text style={styles.buttonText}>Xem thêm</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const handleItemPress = (id: number) => {
        // Handle the item press (e.g., navigate or show details)
        console.log('Item ID:', id);
        // Add your navigation logic here
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderGridItem}
                numColumns={3} // Display 3 items per row
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={renderFooter} // Add "See More" button as footer
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
        width: 40,
        height: 40,
    },
    placeholder: {
        width: 50,
        height: 50,
        backgroundColor: '#ccc',
    },
    itemTitle: {
        marginTop: 8,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
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