import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import axios from 'axios';

interface MapViewComponentProps {
    districts: string | undefined;
}

const MapViewComponent: React.FC<MapViewComponentProps> = ({ districts }) => {
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
    const [region, setRegion] = useState<Region | undefined>(undefined);
    const regionRef = useRef<Region | undefined>(undefined);
    const zoomTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchCoordinates = async () => {
            if (!districts) return;

            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(districts)}&format=json&limit=1`,
                    {
                        headers: {
                            'User-Agent': 'MyApp (your-email@example.com)', 
                        },
                    }
                );
                const data = response.data;

                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    const latitude = parseFloat(lat);
                    const longitude = parseFloat(lon);
                    setCoordinates({ latitude, longitude });
                    const initialRegion = {
                        latitude,
                        longitude,
                        latitudeDelta: 0.2,
                        longitudeDelta: 0.2,
                    };
                    setRegion(initialRegion);
                    regionRef.current = initialRegion;
                } else {
                    console.error('No results found for the given district');
                }
            } catch (error) {
                console.error('Error fetching coordinates:', error);
            }
        };

        fetchCoordinates();
    }, [districts]);

    const handleZoom = (factor: number) => {
        if (regionRef.current) {
            const newRegion = {
                ...regionRef.current,
                latitudeDelta: regionRef.current.latitudeDelta * factor,
                longitudeDelta: regionRef.current.longitudeDelta * factor,
            };

            if (zoomTimeout.current) {
                clearTimeout(zoomTimeout.current);
            }

            zoomTimeout.current = setTimeout(() => {
                setRegion(newRegion);
            }, 1000);
            regionRef.current = newRegion;
        }
    };

    const handleZoomIn = () => handleZoom(0.5);
    const handleZoomOut = () => handleZoom(2);

    return (
        <View>
            <Text style={styles.title}>Nơi bạn sẽ đến</Text>
            <View style={styles.container}>
                {coordinates && region ? (
                    <>
                        <MapView
                            style={styles.map}
                            region={region}
                            onRegionChangeComplete={(reg) => {
                                regionRef.current = reg;
                                setRegion(reg);
                            }}
                            zoomEnabled={true}
                            minZoomLevel={2}
                            maxZoomLevel={20}
                        />
                        <View style={styles.zoomControls}>
                            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
                                <Text style={styles.zoomText}>+</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
                                <Text style={styles.zoomText}>-</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <Text>Đang tải bản đồ...</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 4,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#000',
    },
    title: {
        fontSize: 26,
        color: '#000',
        marginVertical: 20,
    },
    map: {
        width: '100%',
        height: 250,
        borderRadius: 10,
    },
    zoomControls: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'column',
    },
    zoomButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: 5,
    },
    zoomText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default MapViewComponent;