import { Text, View, StyleSheet, Image } from "react-native";

interface TitleAndImageProps {
    productTitle: string | undefined;
    imageProductData: Array<{ image: string }> | undefined;
    districts: string | undefined;
    provinces: string | undefined;
    guests: string | undefined;
    bedrooms: string | undefined;
    beds: string | undefined;
    bathrooms: string | undefined;
}

const TitleAndImage: React.FC<TitleAndImageProps> = ({
    productTitle,
    imageProductData = [],
    districts,
    provinces,
    guests,
    bedrooms,
    beds,
    bathrooms
}) => {

    const previewImgURLs = imageProductData.map((item) => {
        const imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
        return imageBase64;
    });

    return (
        <View>
            <Text style={styles.title}>{productTitle}</Text>
            {previewImgURLs.length > 0 && (
                <Image
                    source={{ uri: previewImgURLs[0] }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}
            {previewImgURLs.length > 1 && (
                <View style={styles.gridImage}>
                    {previewImgURLs.slice(1, 5).map((url) => (
                        <Image
                            key={url}
                            source={{ uri: url }}
                            style={styles.imageMap}
                            resizeMode="cover"
                        />
                    ))}
                </View>
            )}
            <Text style={styles.address}>Toàn bộ tại {districts}, {provinces}</Text>
            <View style={styles.design}>
                {guests && <Text style={styles.designTitle}>{guests} khách</Text>}
                {guests && <Text style={styles.dot}>•</Text>}
                {bedrooms && <Text style={styles.designTitle}>{bedrooms} phòng ngủ</Text>}
                {bedrooms && <Text style={styles.dot}>•</Text>}
                {beds && <Text style={styles.designTitle}>{beds} giường</Text>}
                {beds && <Text style={styles.dot}>•</Text>}
                {bathrooms && <Text style={styles.designTitle}>{bathrooms} phòng tắm</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 26,
        color: '#000',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 10,
    },
    gridImage: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imageMap: {
        width: '49%',
        height: 180,
        borderRadius: 10,
        marginBottom: 10,
    },
    address: {
        fontSize: 20,
        color: '#000',
        marginBottom: 10,
    },
    design: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    designTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 5,
    },
    dot: {
        fontSize: 20,
        color: '#888',
    },
});

export default TitleAndImage;