import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { provincesWithDistricts } from 'constants/location';
import { ProductByAddresNavigationProp } from 'types'; // import the typed navigation

const SearchBar = () => {
    
    const [selectedProvince, setSelectedProvince] = useState<{ key: string; value: string } | null>(null);

    // Use typed navigation
    const navigation = useNavigation<ProductByAddresNavigationProp>();

    const provincesOptions = provincesWithDistricts.map(province => ({
        key: province.id.toString(),
        value: province.name,
    }));

    const handleProvincesChange = (key: string) => {
        const selectedOption = provincesOptions.find(option => option.key === key) || null;
        setSelectedProvince(selectedOption);
    };

    const handleSearchSubmit = () => {
        if (selectedProvince) {
            navigation.navigate('ProductByAddress', { province: selectedProvince.value });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.dropdownContainer}>
                    <SelectList
                        data={provincesOptions}
                        setSelected={handleProvincesChange}
                        boxStyles={styles.boxStyles}
                        inputStyles={styles.inputStyles}
                        dropdownStyles={styles.dropdownStyles}
                        dropdownItemStyles={styles.dropdownItemStyles}
                        dropdownTextStyles={styles.dropdownTextStyles}
                        placeholder='Địa diểm bạn muốn đến'
                        searchPlaceholder='Địa diểm bạn muốn đến'
                        maxHeight={220}
                        notFoundText='Không tìm thấy địa điểm nào'
                    />
                </View>
                <TouchableOpacity
                    onPress={handleSearchSubmit}
                    style={styles.button}
                >
                    <Icon name='search' size={24} color='white' />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 15,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    dropdownContainer: {
        flex: 1,
        marginRight: 10,
    },
    boxStyles: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 10,
    },
    inputStyles: {
        fontSize: 18,
    },
    dropdownStyles: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: '#fff',
        width: 360,
    },
    dropdownItemStyles: {
        marginHorizontal: 25
    },
    dropdownTextStyles: {
        fontSize: 18,
        color: 'black'
    },
    button: {
        width: 50,
        height: 50,
        backgroundColor: '#FF0000',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SearchBar;
