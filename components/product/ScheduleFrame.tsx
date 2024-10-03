import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { differenceInDays, format, eachDayOfInterval, parse } from 'date-fns';
import CalendarPicker, { ChangedDate } from 'react-native-calendar-picker';

interface ScheduleFrameProps {
    priceProduct: string | undefined;
    schedules: Array<any> | undefined;
    guests: string | undefined;
}

const ScheduleFrame: React.FC<ScheduleFrameProps> = ({
    priceProduct,
    schedules,
    guests
}) => {

    const [selectionRange, setSelectionRange] = useState<{
        startDate: Date | null;
        endDate: Date | null;
    }>({
        startDate: null,
        endDate: null,
    });
    const [guestCount, setGuestCount] = useState(1);

    const vietnameseMonths = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const vietnameseWeekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    const { startDate, endDate } = selectionRange;
    const numberOfDays = endDate && startDate ? differenceInDays(endDate, startDate) : 0;
    const formattedPrice = priceProduct ?? "0";
    const pricePerNight = Number(formattedPrice.replace(/[^\d.-]/g, ''));
    const provisional = pricePerNight * numberOfDays;
    const formattedProvisional = provisional.toLocaleString();
    const serviceCharge = provisional * 0.2;
    const formattedServiceCharge = serviceCharge.toLocaleString();
    const totalAmount = provisional + serviceCharge;
    const formattedTotalAmount = totalAmount.toLocaleString();

    const disabledDates = schedules && schedules.length > 0
        ? schedules
            .filter((schedule) => schedule.status === 'accept' || schedule.status === 'in-use')
            .reduce<Date[]>((dates, schedule) => {
                const start = parse(schedule.startDate, 'dd/MM/yyyy', new Date());
                const end = parse(schedule.endDate, 'dd/MM/yyyy', new Date());
                const interval = eachDayOfInterval({ start, end });
                return dates.concat(interval);
            }, [])
        : [];

    const handleDateChange = (date: Date | null, type: ChangedDate) => {
        if (type === 'START_DATE') {
            // Reset endDate when a new startDate is selected
            setSelectionRange({
                startDate: date,
                endDate: null,
            });
        } else if (type === 'END_DATE') {
            setSelectionRange((prev) => ({ ...prev, endDate: date }));
        }
    };

    const handleIncrease = () => {
        if (guestCount < Number(guests ?? 1)) {
            setGuestCount(prevCount => prevCount + 1);
        }
    };

    const handleDecrease = () => {
        if (guestCount > 1) {
            setGuestCount(prevCount => prevCount - 1);
        }
    };

    const handleClickReservation = () => {

    }

    return (
        <View style={styles.scheduleFrame}>
            <Text style={styles.price}>{priceProduct} VND/đêm</Text>
            <CalendarPicker
                onDateChange={handleDateChange}
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
            <Text style={styles.selectedDate}>
                {selectionRange.startDate ? format(selectionRange.startDate, 'dd/MM/yyyy') : 'Chưa chọn'}
                {' - '}
                {selectionRange.endDate ? format(selectionRange.endDate, 'dd/MM/yyyy') : 'Chưa chọn'}
            </Text>
            <View style={styles.guestCountContainer}>
                <Text style={styles.guestCountLabel}>Số khách:</Text>
                <View style={styles.guestCountControls}>
                    <TouchableOpacity onPress={handleDecrease}>
                        <Text style={styles.guestCountButton}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.guestCount}>{guestCount}</Text>
                    <TouchableOpacity onPress={handleIncrease}>
                        <Text style={styles.guestCountButton}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Text style={styles.provisionalLabel}>{priceProduct} VND x {numberOfDays} đêm = {formattedProvisional} VND</Text>
                <Text style={styles.serviceChargeLabel}>Phí dịch vụ: {formattedServiceCharge} VND</Text>
                <Text style={styles.totalAmountLabel}>Tổng cộng: {formattedTotalAmount} VND</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleClickReservation}>
                    <Text style={styles.buttonText}>
                        Đặt lịch
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    scheduleFrame: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 20,
    },
    price: {
        fontSize: 22,
        marginVertical: 10,
        color: '#000',
    },
    selectedDate: {
        fontSize: 18,
        marginVertical: 10,
    },
    guestCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    guestCountLabel: {
        fontSize: 18,
        marginRight: 8,
    },
    guestCountControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    guestCountButton: {
        backgroundColor: '#EFF2F7',
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
    provisionalLabel: {
        fontSize: 18,
    },
    serviceChargeLabel: {
        fontSize: 18,
        paddingVertical: 5
    },
    totalAmountLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 16,
    },
    buttonContainer: {
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ScheduleFrame;