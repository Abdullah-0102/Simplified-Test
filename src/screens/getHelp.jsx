import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import Text from "../components/text";
import { useNavigation } from "@react-navigation/native";

const GetHelpScreen = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image
            style={styles.backIcon}
            resizeMode="cover"
            source={require("../images/back-arrow.png")}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Get Help</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.helpBox}>
          <Image
            style={styles.helpImage}
            resizeMode="contain"
            source={require("../images/help.png")} 
          />
          <Text style={styles.email}>simplifiedtrade@help.com</Text>
          <Text style={styles.helpText}>
            Contact your admin for further assistance.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  backIcon: {
    height: 24,
    width: 24,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: 'Outfit-Medium',
    color: "#000",
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
  },
  helpBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Only for Android
  },
  helpImage: {
    width: 80,
    height: 80,
    marginTop: 10,
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
    fontFamily: 'Outfit-Medium',
  },
  helpText: {
    fontSize: 14,
    color: "#2E2E2E",
    textAlign: "center",
  },
});

export default GetHelpScreen;
