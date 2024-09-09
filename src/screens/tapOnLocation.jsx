import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, FlatList, TouchableOpacity, Pressable, ActivityIndicator, Platform, Alert } from "react-native";
import Geolocation from '@react-native-community/geolocation'; 
import { promptForEnableLocationIfNeeded, isLocationEnabled } from 'react-native-android-location-enabler';
import Text from "../components/text";

// Utility function to calculate distance between two coordinates (in kilometers)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance = R * c; // Distance in km
  return distance;
};

const TapOnMyLocationSuggested = ({ onAddNewLocationPress, onClose, onLocationSelect, storeData }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [locations, setLocations] = useState([]);
  const [storedLocations, setStoredLocations] = useState(null); // State to store cached locations
  const [loading, setLoading] = useState(false); // Loader state
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // console.log(storedLocations.slice(0,10));
    if (!storedLocations) {
      handleLocationCheck();
    } else {
      // If locations are already cached, load them directly
      setLocations(storedLocations);
    }
  }, []);

  const handleLocationCheck = async () => {
    if (Platform.OS === 'android') {
      const enabled = await isLocationEnabled();
      if (!enabled) {
        try {
          const result = await promptForEnableLocationIfNeeded();
          setLoading(true); // Start loading
          if (result === 'enabled' || result === 'already-enabled') {
            getCurrentLocation();
          }
        } catch (error) {
          Alert.alert('Location Error', 'Please enable your location services!');
          onClose();
          setLoading(false); // Stop loading
        }
      } else {
        setLoading(true); // Start loading
        getCurrentLocation();
      }
    } else {
      setLoading(true); // Start loading
      getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        setCurrentLocation({ latitude, longitude });
        findClosestLocations(latitude, longitude);
      },
      (error) => {
        console.log(error);
        Alert.alert("Location Error", "Please enable location services to fetch your current location.");
        setLoading(false); // Stop loading
      },
      {
        enableHighAccuracy: false,
        timeout: 60000,
        maximumAge: 10000,
      }
    );
  };

  const findClosestLocations = (latitude, longitude) => {
    const validLocations = storeData.filter(location => location.lat !== 0 && location.lon !== 0); // Filter out locations with lat/lon as 0

    const sortedLocations = validLocations
      .map((location) => ({
        ...location,
        distance: calculateDistance(latitude, longitude, location.lat, location.lon),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10); // Take the top 10 closest locations

    setLocations(sortedLocations);
    setStoredLocations(sortedLocations); // Cache the locations
    setLoading(false); // Stop loading
  };

  const handleLocationPress = (locationTitle) => {
    onClose();
    setTimeout(() => {
      onLocationSelect(locationTitle); 
    }, 300); 
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity onPress={() => handleLocationPress(item.name)}>
        <View style={styles.card}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>{item.name}</Text>
            <Text style={styles.locationDetails}>
              {item.address ? `${item.address} (${item.distance.toFixed(2)} km)` : 'No address listed'}
            </Text>
          </View>
          <Image
            style={styles.vectorIcon}
            resizeMode="contain"
            source={require("../images/vector2.png")}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.modalTop}>
        <View style={styles.barContainer}>
          <View style={styles.bar} />
        </View>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Suggested Locations</Text>
          <TouchableOpacity onPress={onClose}>
            <Image
              style={styles.closeIcon}
              resizeMode="cover"
              source={require("../images/cross.png")}
            />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <Text style={styles.loadingText}>Loading nearest locations...</Text>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <View style={styles.modalBottom}>
          <FlatList
            data={locations}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 16 }}
          />

          <View style={styles.addButtonContainer}>
            <Pressable
              style={[styles.addButton, isPressed && styles.addButtonPressed]}
              onPress={onAddNewLocationPress}
            >
              <Text style={styles.addButtonLabel}>Add New Location</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '55%',
  },
  modalTop: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    width: 40,
    height: 5,
    backgroundColor: '#A9A9A9',
    borderRadius: 2.5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    paddingTop: 14,
  },
  modalTitle: {
    fontSize: 22,
    color: "black",
    fontFamily: "SourceSans3-Bold",
  },
  closeIcon: {
    width: 25,
    height: 25,
    tintColor: "black",
  },
  modalBottom: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flex: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    color: "#333333",
    fontFamily: "Outfit-SemiBold",
  },
  locationDetails: {
    fontSize: 14,
    color: "#666666",
  },
  vectorIcon: {
    width: 25,
    height: 25,
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  addButtonContainer: {
    marginTop: 12,
  },
  addButton: {
    backgroundColor: 'white',
    borderColor: '#00008B',
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#00008B',
  },
  addButtonPressed: {
    color: 'white',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default TapOnMyLocationSuggested;
