import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ListCategory from '../category/ListCategory';
import ListProduct from '../product/ListProduct';

const HomeScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View>
                <ListCategory />
            </View>

            <View style={styles.section}>
                <ListProduct />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 20,
    },
    section: {
        marginBottom: 20,
    },
});

export default HomeScreen;
