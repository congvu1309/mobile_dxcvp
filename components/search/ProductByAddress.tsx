import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { ProductByAddressRouteProp } from 'types';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ProductModel } from 'models/product';
import { API } from 'constants/enum';

const ProductByAddress = () => {

    const route = useRoute<ProductByAddressRouteProp>();
    const navigation = useNavigation();
    const { province } = route.params;
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [loading, setLoading] = useState(true);

    const handleGoBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        if (province) {
            fetchProductData(province);
        } else {
            setProducts([]);
        }
    }, [province]);

    const fetchProductData = async (province: any) => {
        try {
            const response = await fetch(`${API.URL}/get-all-product?address=${province}`);
            const data = await response.json();
            setProducts(data.data);
        } catch (error) {
            console.error('Failed to fetch product data:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: ProductModel }) => {

        let imageSrc = '';
        const imageProductData = item.imageProductData?.[0];
        if (imageProductData?.image) {
            try {
                imageSrc = Buffer.from(imageProductData.image, 'base64').toString('binary');
            } catch (error) {
                imageSrc = '';
            }
        }

        return (
            <TouchableOpacity onPress={() => handleItemPress(item.id)} style={styles.itemContainer}>
                <Image
                    source={{ uri: imageSrc }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemUserProductData}>Chủ nhà: {item.userProductData.name}</Text>
                <Text style={styles.itemPrice}>{item.price} VND/đêm</Text>

            </TouchableOpacity>
        );
    };

    const handleItemPress = (id: number) => {
        // Handle the item press (e.g., navigate or show details)
        console.log('Item ID:', id);
        // Add your navigation logic here
    };

    return (
        <View style={styles.container}>
            <View style={styles.arrowBack}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>{province}</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    // contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={<Text style={styles.subTitle}>Hiện chưa có dịch vụ.</Text>}
                />
            )}
        </View>
    );
};

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
        marginRight: 20
    },
    subTitle: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 350,
    },
    listContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    itemContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemTitle: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
    },
    itemUserProductData: {
        fontSize: 16,
        textAlign: 'center',
    },
    itemPrice: {
        fontSize: 16,
        textAlign: 'center',
    },
    placeholder: {
        width: 50,
        height: 50,
        backgroundColor: '#ccc',
    },
});

export default ProductByAddress;
