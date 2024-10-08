import React, { useState, useEffect } from 'react';
import { Image, Modal, View, Text, FlatList, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LocationListModal = ({ locModalVisible, hideLocModal, authState, selectedSurvey }) => {
  const [locationDetails, setLocationDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      setLoading(true);
      try {
        const surveyResponse = await axios.get('https://stapi.simplifiedtrade.com/app/v2/surveys/json');
        const selectedSurveyData = surveyResponse.data.find(
          (survey) => survey.surveyName === selectedSurvey.surveyName
        );

        if (selectedSurveyData) {
          setLocationDetails(selectedSurveyData.completions || []);
        }

        // Fetch the store data
        const storeResponse = await axios.get('https://stapi.simplifiedtrade.com/app/v2/stores/json');
        setStoreData(storeResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedSurvey) {
      fetchSurveyDetails();
    }
  }, [authState.token, selectedSurvey]);

  const handleLocationPress = async (item) => {
    hideLocModal(); // Close the modal

    // Find the coordinates for the selected locationName
    const matchingStore = storeData.find(store => store.name === item.locationName);
    const coordinates = matchingStore ? { lat: matchingStore.lat, lon: matchingStore.lon } : { lat: null, lon: null };

    navigation.navigate('SpecificSurvey', { 
      location: item.locationName, 
      selectedSurvey, 
      selectedLocation: item,
      coordinates // Pass the coordinates to the next screen
    });
  };

  const LocationItem = React.memo(({ item, onPress }) => (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.locationItem}>
        <View style={styles.textContainer}>
          <Text style={styles.locationName}>{item.locationName}</Text>
          <Text style={styles.locationDetail}>Street: {item.locationStreet || 'N/A'}</Text>
          <Text style={styles.locationDetail}>City: {item.locationCity || 'N/A'}</Text>
          <Text style={styles.locationDetail}>Zip: {item.locationZip || 'N/A'}</Text>
          <Text style={styles.locationDetail}>State: {item.locationState || 'N/A'}</Text>
        </View>
        <View style={styles.shapeContainer}>
          <Text style={styles.completionsText}>{item.completions || '0'}</Text>
        </View>
        <Image
          source={require('../images/vector2.png')}
          style={styles.icon}
        />
      </View>
    </TouchableOpacity>
  ));

  const renderLocationItem = ({ item }) => (
    <LocationItem item={item} onPress={handleLocationPress} />
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={locModalVisible}
      onRequestClose={hideLocModal}
    >
      <TouchableWithoutFeedback onPress={hideLocModal}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              <FlatList
                data={locationDetails}
                keyExtractor={(item) => item.surId}
                renderItem={renderLocationItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )}
            {!loading && (
              <TouchableOpacity onPress={hideLocModal}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  locationDetail: {
    fontSize: 12,
    color: 'gray',
  },
  shapeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#333333",
    height: 24,
    width: 24,
    borderRadius: 50,
    marginRight: 5,
  },
  completionsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
  },
  icon: {
    width: 10.5,
    height: 22,
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#cccccc',
  },
  closeButton: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: 'blue',
  },
});

export default LocationListModal;
