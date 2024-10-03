import { useNavigation, useRoute } from "@react-navigation/native";
import { API } from "constants/enum";
import { ProductModel } from "models/product";
import { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons";
import { DetailProductRouteProp } from "types";
import { UtilitiesModel } from "models/utilities";
import { ScheduleModel } from "models/schedule";
import TitleAndImage from "./TitleAndImage";
import IntroduceAndUtilities from "./IntroduceAndUtilities";
import ScheduleFrame from "./ScheduleFrame";
import MapViewComponent from "./MapViewComponent";
import EvaluationComponent from "./EvaluationComponent";

const DetailProduct = () => {

    const route = useRoute<DetailProductRouteProp>();
    const navigation = useNavigation();
    const { productId } = route.params;
    const [product, setProduct] = useState<ProductModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [utilities, setUtilities] = useState<UtilitiesModel[]>([]);
    const [showFullUtilities, setShowFullUtilities] = useState(false);
    const [schedules, setSchedules] = useState<ScheduleModel[]>([]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        if (productId) {
            fetchProductData(productId);
            fetchSchedules(productId)
        }

        fetchUtilitiesData();
    }, [productId]);

    const fetchProductData = async (productId: any) => {
        try {
            const response = await fetch(`${API.URL}/get-product-by-id?id=${productId}`);
            const data = await response.json();
            setProduct(data.data);
        } catch (error) {
            console.error('Failed to fetch product data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUtilitiesData = async () => {
        try {
            const response = await fetch(`${API.URL}/get-all-utilities`);
            const data = await response.json();
            setUtilities(data.data);
        } catch (error) {
            console.error('Error fetching Utilities:', error);
        }
    };

    const fetchSchedules = async (productId: any) => {
        try {
            const response = await fetch(`${API.URL}/get-all-schedule-by-userId?productId=${productId}`);
            const data = await response.json();
            setSchedules(data.data);
        } catch (error) {
            console.error('Failed to fetch schedules', error);
        }
    };

    const utilitiesData = product?.utilityProductData ?? [];
    const utilityId = utilitiesData.map((item: any) => item.utilityId);

    const utilitiesOptions = utilities.map(utility => ({
        value: utility.id.toString(),
        label: utility.title,
        image: utility.image,
    }));

    const utilityLookup = new Map<string, { id: string, label: string; image: string }>();
    utilitiesOptions.forEach(option => {
        utilityLookup.set(option.value, {
            id: option.value,
            label: option.label,
            image: option.image,
        });
    });
    const utilityDetails = utilityId.map((id: any) => utilityLookup.get(id.toString()) ?? { id: '', label: '', image: '' });
    const displayedUtilities = showFullUtilities ? utilityDetails : utilityDetails.slice(0, 6);

    return (
        <View style={styles.container}>
            <View style={styles.arrowBack}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View>
                        <TitleAndImage
                            productTitle={product?.title}
                            imageProductData={product?.imageProductData}
                            districts={product?.districts}
                            provinces={product?.provinces}
                            guests={product?.guests}
                            bedrooms={product?.bedrooms}
                            beds={product?.beds}
                            bathrooms={product?.bathrooms}
                        />
                        <IntroduceAndUtilities
                            description={product?.description}
                            checkIn={product?.checkIn}
                            checkOut={product?.checkOut}
                            guests={product?.guests}
                            displayedUtilities={displayedUtilities}
                            showFullUtilities={showFullUtilities}
                            setShowFullUtilities={setShowFullUtilities}
                        />
                        <ScheduleFrame
                            priceProduct={product?.price}
                            schedules={schedules}
                            guests={product?.guests}
                        />
                        <MapViewComponent
                            districts={product?.districts}
                        />
                        <EvaluationComponent
                            productId={productId}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 10,
    },
    scrollView: {
        marginTop: 10,
    },
    arrowBack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default DetailProduct;