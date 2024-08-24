import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, FlatList, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import Text from "../components/text";

const AddNewLocation1 = ({ onClose, onSurveyTap }) => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const data1 = [
  //   { id: "1", title: "Walmart Supercenter" },
  //   { id: "2", title: "Target" },
  //   { id: "3", title: "Costco Wholesale" },
  //   { id: "4", title: "Best Buy" },
  //   { id: "5", title: "Home Depot" },
  //   { id: "6", title: "Lowe's Home Improvement" },
  //   { id: "7", title: "Macy's" },
  //   { id: "8", title: "Kohl's" },
  //   { id: "9", title: "Dick's Sporting Goods" },
  //   { id: "10", title: "Bed Bath & Beyond" }
  // ];

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('https://stapi.simplifiedtrade.com/app/v2/stores/json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err.message);
        Alert.alert('Error', 'Failed to fetch stores.');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);


  const handleSurveyPress = (storeName) => {
    onSurveyTap(storeName);
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity onPress={() => handleSurveyPress(item.name)}>
        <View style={styles.card}>
          <View style={styles.locationInfo}>
            {console.log(item.name)}
            <Text style={styles.locationTitle}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.modalTop}>
        <View style={styles.barContainer}>
          <View style={styles.bar} />
        </View>
        <View style={styles.modalHeader}>
          <View style={styles.container1}>
            <TouchableOpacity onPress={onClose}>
              <Image
                style={styles.backIcon}
                resizeMode="cover"
                source={require("../images/back-arrow.png")}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Location</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Image
              style={styles.closeIcon}
              resizeMode="cover"
              source={require("../images/cross.png")}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status bar with indicators and connecting line */}
      <View style={styles.statusBarContainer}>
        <View style={styles.statusBarSegment}>
          <View style={styles.statusBarLineActive} />
          <View style={styles.statusBarIndicatorActive}>
            <Text style={styles.statusBarIndicatorTextActive}>1</Text>
          </View>
          <Text style={styles.statusBarTextActive}>Select Survey</Text>
          <View style={styles.statusBarLineInactive1} />
        </View>
        <View style={styles.statusBarSegment}>
          <View style={styles.statusBarLineInactive} />
          <View style={styles.statusBarIndicatorInactive}>
            <Text style={styles.statusBarIndicatorTextInactive}>2</Text>
          </View>
          <Text style={styles.statusBarTextInactive}>Choose Location</Text>
        </View>
        <View style={styles.statusBarSegment}>
          <View style={styles.statusBarLineInactive} />
          <View style={styles.statusBarIndicatorInactive}>
            <Text style={styles.statusBarIndicatorTextInactive}>3</Text>
          </View>
          <Text style={styles.statusBarTextInactive}>Submit</Text>
        </View>
        <View style={styles.statusBarEndLine} />
      </View>

      {/* Search Box Container */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Image
            style={styles.searchIcon}
            resizeMode="cover"
            source={require("../images/search-icon.png")}
            />
          <TextInput
            style={styles.searchInput}
            placeholder="Surveys by store name"
            placeholderTextColor={"#666666"}
            value={searchText}
            onChangeText={handleSearchChange}
            autoFocus={false} 
            autoCorrect={false} 
            autoCapitalize="none" 
            keyboardType="default" 
            />
        </View>
      </View>

      <View style={styles.modalBottom}>
        <FlatList
          data={data.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '30%',
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
    justifyContent: "space-between", // Adjust as needed
    alignItems: "center",
    marginTop: 3,
    marginBottom: 5,
    paddingTop: 14,
    paddingHorizontal: 16,
  },
  container1: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  modalTitle: {
    fontSize: 22,
    color: "black",
    fontFamily: "SourceSans3-Bold",
    marginLeft: 8,
  },
  backIcon: {
    width: 25,
    height: 25,
    tintColor: "black",
    marginTop: 3,
  },
  closeIcon: {
    width: 25,
    height: 25,
    tintColor: "black",
  },
  statusBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    width: '100%', 
    backgroundColor: 'white',
  },
  statusBarSegment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statusBarLineActive: {
    width: '50%',
    height: 2,
    backgroundColor: 'blue',
    position: 'absolute',
    top: 15,
    left: 0,
  },
  statusBarLineInactive: {
    width: '100%',
    height: 2,
    backgroundColor: '#C0C0C0',
    position: 'absolute',
    top: 15,
    left: 0,
  },
  statusBarLineInactive1: {
    width: 50,
    height: 2,
    backgroundColor: '#C0C0C0',
    position: 'absolute',
    top: 15,
    left: 70,
  },
  statusBarIndicatorActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    zIndex: 1,
  },
  statusBarIndicatorTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusBarIndicatorInactive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    zIndex: 1,
  },
  statusBarIndicatorTextInactive: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusBarTextActive: {
    color: 'blue',
    fontSize: 12,
  },
  statusBarTextInactive: {
    color: '#C0C0C0',
    fontSize: 12,
  },
  statusBarEndLine: {
    height: 2,
    backgroundColor: '#C0C0C0',
    position: 'absolute',
    top: 15,
    left: '33%', 
  },
  searchContainer: {
    backgroundColor: 'white',
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0", // Changed background color to a light gray
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    marginRight: 20,
    marginLeft: 15,
    borderWidth: 1, // Added border width
    borderColor: "#000000", // Changed border color to black
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 14,
    color: "#000000", // Changed text color to black
    flex: 1,
    fontFamily: 'Outfit-Regular',
    fontWeight: "400",
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
    color: "black",
    fontFamily: "Outfit-Medium",
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
    backgroundColor: 'black', // Change button color to black when pressed
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default AddNewLocation1;
