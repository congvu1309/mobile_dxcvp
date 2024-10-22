import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, FlatList } from "react-native"
import { DetailProductNavigationProp, ProductByCategoryRouteProp } from "types";
import Icon from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from "react";
import { ProductModel } from "models/product";
import { API } from "constants/enum";

const ProductByCategory = () => {

    const navigation = useNavigation<DetailProductNavigationProp>();
    const route = useRoute<ProductByCategoryRouteProp>();
    const { categoryId } = route.params;
    const { categoryTitle } = route.params;
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [loading, setLoading] = useState(true);

    const handleGoBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        if (categoryId) {
            fetchProductData(categoryId);
        } else {
            setProducts([]);
        }
    }, [categoryId]);

    const fetchProductData = async (province: any) => {
        try {
            const response = await fetch(`${API.URL}/get-all-product?categoryId=${categoryId}`);
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
        navigation.navigate('DetailProduct', { productId: id });
    };

    return (
        <View style={styles.container}>
            <View style={styles.arrowBack}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>{categoryTitle}</Text>
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
    subTitle: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 350,
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

export default ProductByCategory;