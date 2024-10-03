import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import ListCategory from 'components/category/ListCategory';
import ListProduct from 'components/product/ListProduct';
import SearchBar from 'components/search/SearchBar';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <SearchBar />
            <ScrollView style={styles.scrollView}>
                <View style={styles.section}>
                    <ListCategory />
                </View>
                <View style={styles.section}>
                    <ListProduct />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 5,
    },
    scrollView: {
        marginTop: 10,
    },
    section: {
        marginBottom: 10,
    },
});

export default HomeScreen;
