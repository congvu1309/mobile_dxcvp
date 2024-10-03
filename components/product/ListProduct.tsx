import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ProductModel } from '../../models/product';
import { API } from '../../constants/enum';
import { useNavigation } from '@react-navigation/native';
import { DetailProductNavigationProp } from 'types';

const ListProduct = () => {

    const [products, setProducts] = useState<ProductModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const navigation = useNavigation<DetailProductNavigationProp>();

    useEffect(() => {
        fetchProductData(currentPage);
    }, [currentPage]);

    const fetchProductData = async (page: number) => {

        if (loading || isFetchingMore) return;
        setLoading(true);

        try {
            const response = await fetch(`${API.URL}/get-all-product?page=${page}`);
            const data = await response.json();
            const fetchedProducts = data.data.product;

            if (page === 1) {
                // On the first load, set the products
                setProducts(fetchedProducts);
            } else {
                // Append the new products to the list
                setProducts((prevProducts) => [...prevProducts, ...fetchedProducts]);
            }

            const totalCount = data.data.totalCount;
            const totalPagesCount = Math.ceil(totalCount / 20);
            setTotalPages(totalPagesCount);
        } catch (error) {
            console.error('Failed to fetch product data:', error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    const loadMoreProducts = () => {
        if (!isFetchingMore && currentPage < totalPages) {
            setIsFetchingMore(true);
            setCurrentPage((prevPage) => prevPage + 1);
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
        navigation.navigate('DetailProduct', { productId: id });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                onEndReached={loadMoreProducts}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isFetchingMore ? <ActivityIndicator size="large" color="#0000ff" /> : null}
            />
            {loading && currentPage === 1 && (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
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

export default ListProduct;