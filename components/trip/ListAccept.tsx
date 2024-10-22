import { ProductModel } from "models/product";
import { ScheduleModel } from "models/schedule";
import { View, Image, Text, FlatList, StyleSheet } from "react-native"
import defaultImage from '../../assets/no-image.jpg';

interface ListAcceptProps {
    mapAccept: ScheduleModel[];
    productProp: Record<number, ProductModel>;
}

const ListAccept: React.FC<ListAcceptProps> = ({ mapAccept, productProp }) => {
    const getImageSrc = (imageData: string | undefined) => {
        if (!imageData) return defaultImage;
        try {
            return Buffer.from(imageData, 'base64').toString('binary');
        } catch {
            return defaultImage;
        }
    };

    const renderItem = ({ item }: { item: ScheduleModel }) => {
        const product = productProp[item.productId];
        const imageSrc = getImageSrc(product?.imageProductData?.[0]?.image);

        const formattedPrice = product?.price ?? "0";
        const pricePerNight = Number(formattedPrice.replace(/[^\d.-]/g, ''));
        const provisional = pricePerNight * item.numberOfDays;
        const serviceCharge = provisional * 0.2;
        const totalAmount = provisional + serviceCharge;
        const formattedTotalAmount = totalAmount.toLocaleString();

        const statusText = item.status === 'pending' ? "(Chỉ trừ tiền khi đã duyệt)" : "(Đã thanh toán)";

        return (
            <View style={styles.containerItem}>
                <Image
                    source={{ uri: imageSrc }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.textItem}>
                    <Text style={styles.text}>{product.title}</Text>
                    <Text style={styles.text}>Chủ nhà: {product.userProductData.name}</Text>
                    <Text style={styles.text}>{product.price} VND/đêm</Text>
                    <Text style={styles.text}>Ngày: {item.startDate} - {item.endDate}</Text>
                    <Text style={styles.text}>Số đêm: {item.numberOfDays} đêm</Text>
                    <Text style={styles.text}>Khách: {item.guestCount} người</Text>
                    <Text style={styles.textTotal}>Tổng thanh toán: {formattedTotalAmount} VND</Text>
                    <Text style={styles.text}>{statusText}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleStatus}>Đã duyệt</Text>
            <FlatList
                data={mapAccept}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleStatus: {
        fontSize: 24,
        color: '#000',
        marginBottom: 15,
    },
    image: {
        width: '100%',
        height: 250,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    containerItem: {
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
    },
    textItem: {
        padding: 20,
    },
    text: {
        fontSize: 18,
        color: '#000',
        paddingVertical: 2,
    },
    textTotal: {
        fontSize: 20,
        color: '#000',
        fontWeight: 'bold',
        paddingVertical: 2,
        paddingTop: 10,
        borderTopWidth: 0.5,
    },
});

export default ListAccept;