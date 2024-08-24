import React, { useState } from "react";
import { Image, StyleSheet, View, FlatList, TouchableOpacity, Alert } from "react-native";
import { Pressable } from "react-native";
import Text from "../components/text";

const TapOnMyLocationSuggested = ({ onAddNewLocationPress, onClose, onLocationSelect }) => {
  const [isPressed, setIsPressed] = useState(false);

  const data = [
    { id: "1", title: "046 Save Mart ANGELS CAMP", distance: "0.7m", count: "125" },
    { id: "2", title: "Sunset Groceries", distance: "1.2m", count: "0" },
    { id: "3", title: "Ocean View Mall", distance: "0.5m", count: "125" },
    { id: "4", title: "Palm Heights Plaza", distance: "0.8m", count: "10" },
    { id: "5", title: "Harbor Walk Plaza", distance: "1.0m", count: "125" },
    { id: "6", title: "City Center Market", distance: "0.9m", count: "40" },
    { id: "7", title: "Bayview Square", distance: "1.5m", count: "80" },
    { id: "8", title: "Metroplex Mall", distance: "1.2m", count: "60" },
    { id: "9", title: "Central Park Plaza", distance: "1.8m", count: "20" },
    { id: "10", title: "Golden Gate Plaza", distance: "1.3m", count: "90" },
  ];


  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handleLocationPress = (locationTitle) => {
    onClose();
    setTimeout(() => {
      onLocationSelect(locationTitle); // Call the parent callback with selected location title
    }, 300); // Small delay to allow the modal to close before navigating
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity onPress={() => handleLocationPress(item.title)}>
        <View style={styles.card}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>{item.title}</Text>
            <Text style={styles.locationDetails}>1212 Beryl St ({item.distance})</Text>
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

      <View style={styles.modalBottom}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 16 }}
        />

        <View style={styles.addButtonContainer}>
          <Pressable
            style={[styles.addButton, isPressed && styles.addButtonPressed]}
            onPress={onAddNewLocationPress}
            // onPressIn={handlePressIn}
            // onPressOut={handlePressOut}
            >
            <Text style={styles.addButtonLabel}>Add New Location</Text>
          </Pressable>
        </View>
      </View>
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
    backgroundColor: '#A9A9A9', // Dark gray color
    borderRadius: 2.5, // Half of the height for a rounded bar
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
    // fontWeight: "700",
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
    flex: 1, // Ensure the modal bottom takes remaining space
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 0, // Removed border radius
    elevation: 0, // Removed shadow/elevation
    marginBottom: 0, // Removed bottom margin
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
    backgroundColor: "#E0E0E0", // Light grey color for separator
    marginVertical: 8, // Some vertical space around the separator
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
    backgroundColor: 'black', // Change button color to black when pressed
  },
});

export default TapOnMyLocationSuggested;
