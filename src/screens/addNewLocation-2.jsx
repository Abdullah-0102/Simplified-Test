import React, { useState } from "react";
import { Image, StyleSheet, View, FlatList, TouchableOpacity, TextInput, Alert, Modal, ScrollView } from "react-native";
import Text from "../components/text";
import LinearGradient from "react-native-linear-gradient";
import { BlurView } from '@react-native-community/blur';

import * as ImagePicker from 'expo-image-picker';
import { useCameraPermissions } from 'expo-camera';

const AddNewLocation2 = ({ surveySelected, onClose, onLocationTap }) => {
  const [searchText, setSearchText] = useState("");
  const [locationSelect, setLocationSelect] = useState(false);
  const [locationTitle, setLocationTitle] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();

  const locationsData = [
    { id: "1", locationName: "0012 Alb SCA (New)" },
    { id: "2", locationName: "0023 NYC Manhattan (Central)" },
    { id: "3", locationName: "0034 LAX Los Angeles (West)" },
    { id: "4", locationName: "0045 CHI Chicago (North)" },
    { id: "5", locationName: "0056 MIA Miami (South)" },
    { id: "6", locationName: "0067 DAL Dallas (East)" },
    { id: "7", locationName: "0078 SFO San Francisco (Bay)" },
    { id: "8", locationName: "0089 ATL Atlanta (Downtown)" },
    { id: "9", locationName: "0090 SEA Seattle (Pacific)" }
  ];

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const handleLocationSelect = (title) => {
    setLocationSelect(!locationSelect);
    setLocationTitle(title);
  };
  
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  
  const handleNextPress = () => {
    onLocationTap(locationTitle);
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity onPress={() => handleLocationSelect(item.locationName)}>
        <View style={styles.card}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>{item.locationName}</Text>
            {/* <Text style={styles.locationTitle}>{surveySelected}</Text> */}
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );

  const requestPermissions = async () => {
    try {
      const { status: cameraStatus } = await requestCameraPermissions();
  
      if (cameraStatus !== 'granted') {
        Alert.alert('Camera permissions are required to capture photos.');
      } else {
        handleImagePick(true);
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const handleImagePick = async (fromCamera) => {
    try {
      if (fromCamera) {
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          quality: 1,
        });

        if (!result.canceled) {
          setSelectedImages([...selectedImages, ...result.assets.map(asset => asset.uri)]);
        }
      }
    } catch (error) {
      console.log('Error while capturing image: ', error);
    }
  };

  const removeImage = (uri) => {
    setSelectedImages(selectedImages.filter(imageUri => imageUri !== uri));
  };


  const showAfterLocationSelect = () => {
    return (
      <View style={styles.container2}>
        <View style={styles.card1}>
            <Text style={styles.title}>{surveySelected}</Text>
            <Text style={styles.locationTitle2}>{locationTitle}</Text>
          <View style={styles.gradientContainer}>
            <View
              style={[
                styles.greyGradient,
                styles.gradientPosition,
              ]}
            />
            <LinearGradient
              style={[styles.gradient, styles.gradientPosition]}
              locations={[0, 1]}
              colors={["#072b69", "#0d54cf"]}
              useAngle={true}
              angle={270}
            />
          </View>
          <View style={styles.infoContainer}>
            <Image
              style={styles.frameIcon}
              resizeMode="cover"
              source={require("../images/tick-1.png")}
            />
            <Text style={[styles.text1, styles.typo]}>
              Location Verified
            </Text>
          </View>
        </View>
  
        <View style={[styles.uploadContainer, styles.card1]}>
          {selectedImages.length === 0 ? (
            <Image
              style={styles.groupIcon}
              resizeMode="cover"
              source={require("../images/upload.png")}
            />
          ) : (
            <View style={styles.selectedImagesContainer}>
              {selectedImages.slice(0, 2).map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    style={styles.selectedImage}
                    resizeMode="cover"
                    source={{ uri }}
                  />
                  <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(uri)}>
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {selectedImages.length > 2 && (
                <TouchableOpacity onPress={toggleModal}>
                  <Text style={styles.moreImagesText}>+{selectedImages.length - 2} more</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
  
          {selectedImages.length > 0 && (
            <TouchableOpacity style={styles.addMoreButton} onPress={handleImagePick}>
              <Text style={styles.addMoreButtonText}>Add more +</Text>
            </TouchableOpacity>
          )}
  
          <TouchableOpacity onPress={handleImagePick}>
            <View style={styles.textContainer}>
              <Text style={[styles.text2, styles.typo]}>Upload Photo</Text>
              <Text style={[styles.text3, styles.typo]}>
                Take one or more photos
              </Text>
            </View>
          </TouchableOpacity>
        </View>
  
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={[styles.next, styles.typo]}>Next</Text>
        </TouchableOpacity>
  
        <Modal visible={isModalVisible} transparent={true} animationType="fade">
          <BlurView
            style={styles.blur}
            blurType="light"
            blurAmount={5}
            reducedTransparencyFallbackColor="white"
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.modalScrollView}>
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.modalImageWrapper}>
                    <Image
                      style={styles.modalImage}
                      resizeMode="cover"
                      source={{ uri }}
                    />
                    <TouchableOpacity style={styles.removeImageButtonModal} onPress={() => removeImage(uri)}>
                      <Text style={styles.removeImageTextModal}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.closeModalButton} onPress={toggleModal}>
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  

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
        </View>
        <View style={styles.statusBarSegment}>
          <View style={styles.statusBarLineActive} />
          <View style={styles.statusBarIndicatorActive}>
            <Text style={styles.statusBarIndicatorTextActive}>2</Text>
          </View>
          <Text style={styles.statusBarTextActive}>Choose Location</Text>
          <View style={styles.statusBarLineInactive1} />
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

      {locationSelect? (
        showAfterLocationSelect()
      ) : (
        <>
        <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
                <Image
                    style={styles.searchIcon}
                    resizeMode="cover"
                    source={require("../images/search-icon.png")}
                    />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Location / Number#"
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
            data={locationsData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 16 }}
            />
        </View>
        </>
      )}
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
      container2: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
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
        width: '100%',
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
      separator: {
        height: 1,
        backgroundColor: "#E0E0E0", 
        marginVertical: 8, 
      },



    // Stylings for the dynamic part
    // blur: {
    //     position: "absolute",
    //     top: 0, left: 0, bottom: 0, right: 0,
    //     backgroundColor: 'rgba(0,0,0,0.5)'
    //   },
      card1: {
        backgroundColor: "white",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
        padding: 20,
      },
      title: {
        fontSize: 13,
        marginBottom: 5,
        color: 'black',
        fontWeight: '700',
      },
      locationTitle2: {
        fontSize: 13,
        marginBottom: 10,
        color: 'blue',
        fontWeight: '600',
      },
      gradientContainer: {
        width: "100%",
        marginBottom: 10,
      },
      gradient: {
        width: "70%",
        height: "100%",
        backgroundColor: "transparent",
      },
      greyGradient: {
        width: "100%",
        backgroundColor: "#E0E0E0",
        opacity: 0.8,
      },
      gradientPosition: {
        height: 12,
        borderRadius: 15,
        top: 0,
        left: 0,
        position: "absolute",
      },
      infoContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: 10,
      },
      frameIcon: {
        width: 20,
        height: 20,
        marginRight: 7,
      },
      text1: {
        fontSize: 13,
        color: "#5cb85c",
        marginTop: 2,
      },
      uploadContainer: {
        height: 200,
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: 'center',
        paddingVertical: 20,
      },
      groupIcon: {
        width: 60,
        height: 60,
        marginBottom: 10, 
      },
      textContainer: {
        alignItems: "center", 
      },
      text2: {
        fontSize: 16,
        fontWeight: "600",
        color: 'black',
      },
      text3: {
        fontSize: 14,
        color: "#777",
      },
      selectedImagesContainer: {
        flexDirection: "row",
      },
      selectedImage: {
        width: 60,
        height: 60,
        marginRight: 10,
        borderRadius: 10,
      },
      imageWrapper: {
        position: "relative",
      },
      removeImageButton: {
        position: "absolute",
        top: -3,
        right: 7,
        backgroundColor: "black",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
      },
      removeImageText: {
        color: "white",
        fontSize: 17,
        paddingBottom: 5,
      },
      removeImageButtonModal: {
        position: "absolute",
        top: -4,
        right: -2,
        backgroundColor: "black",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
      },
      removeImageTextModal: {
        color: "white",
        fontSize: 17,
        paddingBottom: 5,
      },
      moreImagesText: {
        fontSize: 14,
        color: "#777",
        alignSelf: "center",
        marginTop: 25,
      },
      addMoreButton: {
        backgroundColor: "#ffffff",
        padding: 7,
        alignItems: "center",
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 50,
        marginVertical: 10,
      },
      addMoreButtonText: {
        fontSize: 14,
        color: "blue",
      },
      nextButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 5,
        marginBottom: 30,
      },
      next: {
        fontSize: 16,
        color: "white",
      },
      modalContent: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 16,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
      },
      modalScrollView: {
        flexDirection: "row",
        flexWrap: "wrap",
      },
      modalImageWrapper: {
        position: "relative",
        margin: 5,
      },
      modalImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
      },
      closeModalButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        marginRight: 10,
      },
      closeModalButtonText: {
        fontSize: 16,
        color: "white",
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
});

export default AddNewLocation2;
