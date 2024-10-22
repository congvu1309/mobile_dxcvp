import Login from "components/auth/Login";
import { API } from "constants/enum";
import userAuth from "hooks/authUser";
import { ProductModel } from "models/product";
import { ScheduleModel } from "models/schedule";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import ListAccept from "components/trip/ListAccept";
import ListPending from "components/trip/ListPending";
import { ScrollView } from 'react-native-virtualized-view';
import { useNavigation } from "@react-navigation/native";
import { HomeScreenNavigationProp } from "types";

const TripScreen = () => {
    const { user, loading } = userAuth();
    const [products, setProducts] = useState<Record<number, ProductModel>>({});
    const [schedules, setSchedules] = useState<ScheduleModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation<HomeScreenNavigationProp>();

    useEffect(() => {
        if (user) {
            fetchScheduleData();
        }
    }, [user, loading]);

    const fetchScheduleData = async () => {
        try {
            if (user) {
                setIsLoading(true);
                const scheduleResponse = await fetch(`${API.URL}/get-all-schedule-by-userId?userId=${user.id}`);
                const jsonSchedule = await scheduleResponse.json();
                const dataSchedule = jsonSchedule.data;
                setSchedules(dataSchedule);

                const productPromises = dataSchedule.map(async (schedule: ScheduleModel) => {
                    const productResponse = await fetch(`${API.URL}/get-product-by-id?id=${schedule.productId}`);
                    return productResponse.json();
                });

                const productResponses = await Promise.all(productPromises);
                const productsMap: Record<number, ProductModel> = {};
                productResponses.forEach((jsonProduct) => {
                    productsMap[jsonProduct.data.id] = jsonProduct.data;
                });

                setProducts(productsMap);
            }
        } catch (error) {
            console.error('Failed to fetch schedule or product data', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Login />
            </View>
        );
    }

    const acceptSchedules = schedules.filter(schedule => schedule.status === 'accept');
    const pendingSchedules = schedules.filter(schedule => schedule.status === 'pending');

    return (
        <View style={styles.containerTrip}>
            <View style={styles.arrowBack}>
                <Text style={styles.title}>Chuyến đi của bạn</Text>
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.containerView}>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.section}>
                            {acceptSchedules.length > 0 && (
                                <ListAccept
                                    productProp={products}
                                    mapAccept={acceptSchedules}
                                />
                            )}
                        </View>
                        <View style={styles.section}>
                            {pendingSchedules.length > 0 && (
                                <ListPending
                                    productProp={products}
                                    mapPending={pendingSchedules}
                                />
                            )}
                        </View>
                        <View style={styles.section}>
                            {schedules.length === 0 && (
                                <View style={styles.noScheduleContainer}>
                                    <Text style={styles.titleNoSchedule}>Bạn chưa có lịch trình nào</Text>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => navigation.navigate("HomeScreen")}
                                    >
                                        <Text style={styles.buttonText}>Quay lại trang chủ để thêm hành trình mới</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerTrip: {
        flex: 1,
        marginTop: 30,
    },
    containerView: {
        flex: 1,
        padding: 10,
    },
    arrowBack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        flex: 1,
        paddingBottom: 20
    },
    noScheduleContainer: {
        marginTop: 300,
        alignItems: 'center',
    },
    titleNoSchedule: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        marginBottom: 15,
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
    scrollView: {
        // marginTop: 10,
    },
    section: {
        marginBottom: 10,
    },
});

export default TripScreen;