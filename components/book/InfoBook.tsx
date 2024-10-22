import { useNavigation, useRoute } from '@react-navigation/native';
import { API } from 'constants/enum';
import { differenceInDays, eachDayOfInterval, format, parse } from 'date-fns';
import userAuth from 'hooks/authUser';
import { ProductModel } from 'models/product';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { HomeScreenNavigationProp, InfoBookRouteProp } from 'types';
import CalendarPicker from 'react-native-calendar-picker';
import { ScheduleModel } from 'models/schedule';
import { vietnameseMonths, vietnameseWeekdays } from 'constants/converMonths';
import { Visa, Amex, Discovel } from '../../assets/payment';
import { launchImageLibrary, ImageLibraryOptions } from "react-native-image-picker";
import RNFS from 'react-native-fs';

const InfoBook = () => {

    const navigation = useNavigation<HomeScreenNavigationProp>();
    const route = useRoute<InfoBookRouteProp>();
    const { productId, startDate, endDate, numberOfDays: initialNumberOfDays, guestCount: initialGuestCount } = route.params;
    const [product, setProduct] = useState<ProductModel | null>(null);
    const [loading, setLoading] = useState(true);

    const [dateRangeSelection, setDateRangeSelection] = useState<any>({
        startDate: startDate ? parse(startDate, 'dd/MM/yyyy', new Date()) : null,
        endDate: endDate ? parse(endDate, 'dd/MM/yyyy', new Date()) : null,
        key: 'selection',
    });

    const [numberOfDays, setNumberOfDays] = useState<number>(Number(initialNumberOfDays));
    const [guestCount, setGuestCount] = useState<number>(Number(initialGuestCount));
    const { user } = userAuth();
    const [isEditingGuest, setIsEditingGuest] = useState(false);
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [schedules, setSchedules] = useState<ScheduleModel[]>([]);

    const [formData, setFormData] = useState({
        productId: 0,
        userId: 0,
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        startDate: '',
        endDate: '',
        numberOfDays: 0,
        guestCount: 0,
        image: '',
        previewImgURL: '',
        phoneNumber: '',
        pay: '',
    });

    const handleGoBack = () => navigation.goBack();

    useEffect(() => {
        if (productId) {
            fetchProductData(productId);
            fetchSchedules(productId);
        }
    }, [productId]);

    useEffect(() => {
        if (dateRangeSelection.startDate && dateRangeSelection.endDate) {
            const days = differenceInDays(new Date(dateRangeSelection.endDate), new Date(dateRangeSelection.startDate));
            setNumberOfDays(days);
        }
    }, [dateRangeSelection]);

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

    const fetchSchedules = async (productId: any) => {
        try {
            const response = await fetch(`${API.URL}/get-all-schedule-by-userId?productId=${productId}`);
            const data = await response.json();
            setSchedules(data.data);
        } catch (error) {
            console.error('Failed to fetch schedules', error);
        }
    };

    const isValidDate = (date: any) => {
        return date instanceof Date && !isNaN(date as any);
    };

    const displayStartDate = isValidDate(dateRangeSelection.startDate)
        ? format(dateRangeSelection.startDate, 'dd/MM/yyyy')
        : 'Invalid date';
    const displayEndDate = isValidDate(dateRangeSelection.endDate)
        ? format(dateRangeSelection.endDate, 'dd/MM/yyyy')
        : 'Invalid date';

    const handleDateEditClick = () => setIsEditingDate(!isEditingDate);
    const handleGuestEditClick = () => setIsEditingGuest(!isEditingGuest);

    const updateDateRange = (date: any, type: string) => {
        if (type === 'END_DATE') {
            setDateRangeSelection((prevState: any) => ({
                ...prevState,
                endDate: date,
            }));
        } else {
            setDateRangeSelection((prevState: any) => ({
                ...prevState,
                startDate: date,
            }));
        }
    };

    const disabledDates = schedules
        .filter((schedule) => schedule.status === 'accept')
        .reduce<Date[]>((dates, schedule) => {
            const start = parse(schedule.startDate, 'dd/MM/yyyy', new Date());
            const end = parse(schedule.endDate, 'dd/MM/yyyy', new Date());

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                console.error('Invalid start or end date for schedule:', schedule);
                return dates;
            }

            const interval = eachDayOfInterval({ start, end });
            return dates.concat(interval);
        }, []);

    const handleDecrease = () => {
        if (guestCount > 1) {
            setGuestCount(prevCount => prevCount - 1);
        }
    };

    const handleIncrease = () => {
        const maxGuests = Number(product?.guests ?? 1);
        if (guestCount < maxGuests) {
            setGuestCount(prevCount => prevCount + 1);
        }
    };

    const images = product?.imageProductData || [];
    const previewImgURLs = images.map((item: any) => {
        const imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
        return imageBase64;
    });

    const formattedPrice = product?.price ?? "0";
    const pricePerNight = Number(formattedPrice.replace(/[^\d.-]/g, ''));
    const provisional = pricePerNight * numberOfDays;
    const formattedProvisional = provisional.toLocaleString();

    const serviceCharge = provisional * 0.2;
    const formattedServiceCharge = serviceCharge.toLocaleString();

    const totalAmount = provisional + serviceCharge;
    const formattedTotalAmount = totalAmount.toLocaleString();

    const displayNumberOfDays = Number(numberOfDays)

    const handleInputChange = (field: string, value: string) => {
        // Basic validation for card number, CVV, expiry date, and phone number
        switch (field) {
            case "cardNumber":
            case "cvv":
                // Allow only numbers
                if (/^\d*$/.test(value)) {
                    setFormData({ ...formData, [field]: value });
                }
                break;
            case "expiryDate":
                // Format: MM/YY
                // Allow numbers and a single slash, and enforce MM/YY format
                const formattedValue = value
                    .replace(/[^0-9/]/g, '') // Remove invalid characters
                    .replace(/\/{2,}/g, '/') // Prevent multiple slashes
                    .replace(/(\..*)\./g, '$1') // Allow only one decimal point
                    .replace(/(\d{2})(\d)/, '$1/$2'); // Add slash after the second digit

                if (formattedValue.length <= 5) { // MM/YY max length
                    setFormData({ ...formData, [field]: formattedValue });
                }
                break;
            case "phoneNumber":
                // Allow only numbers and limit to 10 digits
                if (/^\d*$/.test(value) && value.length <= 10) {
                    setFormData({ ...formData, [field]: value });
                }
                break;
            default:
                setFormData({ ...formData, [field]: value });
        }
    };

    const handleImageSelect = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.7,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.error('ImagePicker Error:', response.errorMessage);
                Alert.alert("Error", "Failed to pick image");
            } else if (response.assets && response.assets.length > 0) {
                const selectedImageUri = response.assets[0].uri ?? '';
                try {
                    // Convert the image to Base64
                    const base64Image = await RNFS.readFile(selectedImageUri, 'base64');
                    setFormData({ ...formData, image: `data:image/jpeg;base64,${base64Image}` });
                } catch (error) {
                    console.error('Error converting image to Base64:', error);
                    Alert.alert("Error", "Failed to process image.");
                }
            } else {
                console.error('No assets found in the response');
            }
        });
    };

    type FormDataKeys = 'cardHolder' | 'cardNumber' | 'expiryDate' | 'cvv' | 'phoneNumber' | 'image';

    const handleBooking = async () => {
        const errors: { [key in FormDataKeys]: string } = {
            cardNumber: "Vui lòng nhập số thẻ.",
            cardHolder: "Vui lòng nhập tên chủ thẻ.",
            expiryDate: "Vui lòng nhập ngày hết hạn.",
            cvv: "Vui lòng nhập mã CVV.",
            image: "Vui lòng thêm ảnh!",
            phoneNumber: "Vui lòng nhập số điện thoại.",
        };

        for (const [field, message] of Object.entries(errors)) {
            if (!formData[field as FormDataKeys]) {
                Alert.alert("Đã xảy ra lỗi!", message);
                return;
            }
        }

        const initialFormData = {
            ...formData,
            productId: productId,
            userId: user?.id,
            startDate: displayStartDate,
            endDate: displayEndDate,
            numberOfDays: displayNumberOfDays,
            guestCount: guestCount,
            pay: formattedTotalAmount
        };

        try {
            const response = await fetch(`${API.URL}/create-new-schedule`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(initialFormData),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.status === 1) {
                    Alert.alert("Đã xảy ra lỗi!", "Đặt lịch thất bại!");
                } else {
                    Alert.alert("Thành công!", "Đặt lịch thành công!");
                    setTimeout(() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'HomeScreen' }],
                        });
                    }, 1500);
                }
            } else {
                Alert.alert("Error", data.message || "Đăng ký thất bại.");
            }
        } catch (error) {
            Alert.alert("Error", "Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.arrowBack}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.titleHeader}>Thanh toán</Text>
            </View>
            <ScrollView >
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View>
                        <View>
                            <View style={styles.containerRow}>
                                <Text style={styles.titleInfoBook}>Ngày {displayStartDate} - {displayEndDate}</Text>
                                <TouchableOpacity onPress={handleDateEditClick}>
                                    <Text style={styles.titleEdit}>{isEditingDate ? 'Xong' : 'Chỉnh sửa'}</Text>
                                </TouchableOpacity>
                            </View>
                            {isEditingDate && (
                                <CalendarPicker
                                    onDateChange={updateDateRange}
                                    startFromMonday={true}
                                    allowRangeSelection={true}
                                    minDate={new Date()}
                                    disabledDates={disabledDates}
                                    months={vietnameseMonths}
                                    weekdays={vietnameseWeekdays}
                                    previousTitle="Trước"
                                    nextTitle="Sau"
                                    selectedDayColor="#007bff"
                                    selectedDayTextColor="white"
                                    selectedDayStyle={{ backgroundColor: '#007bff' }}
                                    todayBackgroundColor="#007bff"
                                    textStyle={{ color: '#000' }}
                                />
                            )}
                            <View style={styles.containerRow}>
                                {isEditingGuest ? (
                                    <View style={styles.guestCountControls}>
                                        <Text style={styles.titleInfoBook}>Khách</Text>
                                        <TouchableOpacity onPress={handleDecrease}>
                                            <Text style={styles.guestCountButton}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.guestCount}>{guestCount}</Text>
                                        <TouchableOpacity onPress={handleIncrease}>
                                            <Text style={styles.guestCountButton}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <Text style={styles.titleInfoBook}>Khách {guestCount} người</Text>
                                )}
                                <TouchableOpacity onPress={handleGuestEditClick}>
                                    <Text style={styles.titleEdit}>{isEditingGuest ? 'Xong' : 'Chỉnh sửa'}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.titleInfoBook}>Nhận phòng sau {product?.checkIn}</Text>
                            <Text style={styles.titleInfoBook}>Trả phòng trước {product?.checkOut}</Text>
                        </View>
                        {previewImgURLs[0] && (
                            <Image
                                source={{ uri: previewImgURLs[0] }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        )}
                        <Text style={styles.titleInfoBook}>{product?.title}</Text>
                        <Text style={styles.title}>Chi tiết giá</Text>
                        <View style={styles.containerRow}>
                            <Text style={styles.text}>{product?.price} VND x {numberOfDays} đêm</Text>
                            <Text style={styles.text}>{formattedProvisional} VND</Text>
                        </View>
                        <View style={styles.containerRow}>
                            <Text style={styles.text}>Phí ứng dụng</Text>
                            <Text style={styles.text}>{formattedServiceCharge} VND</Text>
                        </View>
                        <View style={styles.containerTotalPrice}>
                            <Text style={styles.text}>Tổng dịch vụ</Text>
                            <Text style={styles.text}>{formattedTotalAmount} VND</Text>
                        </View>
                        <View style={styles.containerPay}>
                            <Text style={styles.title}>Thanh toán</Text>
                            <Visa width={50} height={50} />
                            <Amex width={50} height={50} />
                            <Discovel width={50} height={50} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Số thẻ"
                            value={formData.cardNumber}
                            onChangeText={(value) => handleInputChange("cardNumber", value)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Tên chủ thẻ"
                            value={formData.cardHolder}
                            onChangeText={(value) => handleInputChange("cardHolder", value)}
                        />
                        <View style={styles.containerPay}>
                            <View style={styles.withInput}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ngày hết hạn (MM/YY)"
                                    value={formData.expiryDate}
                                    onChangeText={(value) => handleInputChange("expiryDate", value)}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.withInput}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="CVV"
                                    value={formData.cvv}
                                    onChangeText={(value) => handleInputChange("cvv", value)}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <Text style={styles.title}>Bắt buộc cho chuyến đi của bạn</Text>
                        <View style={styles.marginBottom}>
                            <View style={styles.containerRow}>
                                <View>
                                    <Text style={styles.textObligatory}>Người đại diện</Text>
                                    <Text>(Chủ nhà muốn biết mặt của bạn)</Text>
                                </View>
                                {formData.image ? (
                                    <Image source={{ uri: formData.image }} style={styles.imageAvartar} />
                                ) : (
                                    <View></View>
                                )}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={handleImageSelect}>
                                        <Text style={styles.buttonText}>
                                            Thêm
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                        <View style={styles.containerRow}>
                            <View>
                                <Text style={styles.textObligatory}>Số điện thoại</Text>
                                <Text>(Chủ nhà sẽ gọi điện cho bạn)</Text>
                            </View>
                            <View style={styles.withInput}>
                                <TextInput
                                    style={styles.input}
                                    value={formData.phoneNumber}
                                    onChangeText={(value) => handleInputChange("phoneNumber", value)}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <Text style={styles.title}>Chính sách hủy</Text>
                        <View>
                            <Text style={styles.text}>Trước {displayStartDate} Hoàn tiền đầy đủ</Text>
                            <Text style={styles.text}>Trước {displayEndDate} Hoàn tiền một phần</Text>
                            <Text style={styles.text}>Sau {displayEndDate} Không hoàn tiền</Text>
                        </View>
                        <Text style={styles.title}>Quy chuẩn chung</Text>
                        <View>
                            <Text style={styles.text}>Chúng tôi yêu cầu tất cả khách phải ghi nhớ một số quy chuẩn đơn giản để làm một vị khách tuyệt vời.</Text>
                            <View style={styles.rowList}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.text}>Tuân thủ nội quy nhà</Text>
                            </View>
                            <View style={styles.rowList}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.text}>Giữ gìn ngôi nhà như thể đó là nhà bạn</Text>
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleBooking}>
                                <Text style={styles.buttonText}>
                                    Xác nhận và thanh toán
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View >
    );
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
    titleHeader: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginRight: 30,
    },
    containerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleInfoBook: {
        fontSize: 20,
        color: '#000',
        marginVertical: 10
    },
    titleEdit: {
        textDecorationLine: 'underline',
        color: '#000',
        fontSize: 20,
        marginVertical: 10
    },
    guestCountControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    guestCountButton: {
        marginHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 50,
        width: 40,
        height: 40,
        textAlign: 'center',
        lineHeight: 40,
        fontSize: 20,
        color: '#000',
    },
    guestCount: {
        fontSize: 20,
        color: '#000',
        marginHorizontal: 10,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginVertical: 10
    },
    text: {
        fontSize: 18,
        color: '#000',
        marginVertical: 5
    },
    containerTotalPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: '#e5e7eb'
    },
    containerPay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    input: {
        height: 45,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 16,
        backgroundColor: "#f9f9f9",
    },
    withInput: {
        width: '49%'
    },
    textObligatory: {
        fontSize: 18,
        color: '#000'
    },
    marginBottom: {
        marginBottom: 20
    },
    bullet: {
        marginRight: 8,
        fontSize: 18,
    },
    rowList: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    buttonContainer: {
        marginVertical: 16,
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
    imageAvartar: {
        width: 100,
        height: 100,
        borderRadius: 8,
    }
});

export default InfoBook;