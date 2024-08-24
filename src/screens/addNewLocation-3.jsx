import React, { useState } from "react";
import { Image, StyleSheet, View, TouchableOpacity, Switch, TextInput, Modal } from "react-native";
import { BlurView } from "@react-native-community/blur";
import Text from "../components/text";
import { useNavigation } from '@react-navigation/native';

const AddNewLocation3 = ({ onClose, toggleModel, toggleModel1, toggleModel2, toggleModel3, handleLocationSelect, locationSelected }) => {
  const [sendNowActive, setSendNowActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  const navigation = useNavigation();

  const toggleSendNow = () => {
    setSendNowActive(!sendNowActive);
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const handleSubmit = () => {
    setSuccessModalVisible(true);
  };

  const toggleSuccessModal = () => {
    setSuccessModalVisible(false);
    toggleModel();
    toggleModel1();
    toggleModel2();
    toggleModel3();
    handleLocationSelect(locationSelected);
    navigation.navigate('HomePage'); // Assuming 'Homepage' is the name of the home screen route
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
        </View>
        <View style={styles.statusBarSegment}>
          <View style={styles.statusBarLineActive} />
          <View style={styles.statusBarIndicatorActive}>
            <Text style={styles.statusBarIndicatorTextActive}>3</Text>
          </View>
          <Text style={styles.statusBarTextActive}>Submit</Text>
          <View style={styles.statusBarLineInactive1} />
        </View>
        <View style={styles.statusBarEndLine} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.textGroup}>
          <Text style={styles.text4}>Recurring Reload Copying 2 Survey Machine</Text>
          <View style={styles.textGroup1}>
            <Text style={styles.text6}>Enter Missing Store Info (Store # Name City) <Text style={styles.requiredText}>*Required*</Text></Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Ex. 23 Smart & Final Los Angelos"
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
          <View style={styles.frameView}>
            <TouchableOpacity style={styles.sendNowParent} onPress={toggleSendNow}>
              <Text style={styles.sendNow}>Send Now</Text>
              <View style={styles.switchContainer}>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={sendNowActive ? '#007bff' : '#f4f3f4'}
                  onValueChange={toggleSendNow}
                  value={sendNowActive}
                  style={styles.switch}
                  touchSoundDisabled={true}
                />
              </View>
            </TouchableOpacity>
            <Text style={[styles.text5, sendNowActive ? styles.textActive : styles.textInactive]}>
              {sendNowActive ? "Results will be sent now." : "You can send later."}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.typebuttonType2secondary1} onPress={handleSubmit}>
          <Text style={styles.submitSurveyText}>Submit Survey</Text>
        </TouchableOpacity>
      </View>


      <Modal visible={isSuccessModalVisible} transparent={true} animationType="fade">
        <BlurView
          style={styles.blur}
          blurType="light"
          blurAmount={5}
          reducedTransparencyFallbackColor="white"
        />
        <View style={styles.modalContainer}>
          <View style={styles.innerModal}>
            <Image
              style={styles.tickImage}
              source={require('../images/tick-1.png')}
              resizeMode="cover"
            />
            <Text style={styles.successText}>Survey Submitted Successfully</Text>
            <TouchableOpacity style={styles.closeButton} onPress={toggleSuccessModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '60%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalTop: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    marginTop: 3,
    marginBottom: 5,
    paddingTop: 14,
    // paddingHorizontal: 16,
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
  contentContainer: {
    paddingHorizontal: 20,
  },
  textGroup: {
    marginTop: 10,
    marginBottom: 20,
  },
  text4: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
    fontFamily: 'Outfit-SemiBold',
  },
  textGroup1: {
    marginTop: 10,
    marginBottom: 20,
  },
  text6: {
    fontSize: 12,
    color: 'black',
    fontFamily: 'Outfit-Regular',
  },
  requiredText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
  },
  frameView: {
    flexDirection: "column",
    marginTop: 10,
  },
  sendNowParent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  sendNow: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'Outfit-SemiBold',
  },
  text5: {
    fontSize: 13,
    marginBottom: 10,
  },
  switchContainer: {
    justifyContent: 'center',
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.3 }],
  },
  textActive: {
    color: "#007bff",
  },
  textInactive: {
    color: "#555",
  },
  typebuttonType2secondary1: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  submitSurveyText: {
    fontSize: 16,
    color: "white",
  },
  searchContainer: {
    backgroundColor: 'white',
    flexDirection: "row",
    alignItems: "center",
    // paddingVertical: 20,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0", // Changed background color to a light gray
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 20,
    marginLeft: 15,
    borderWidth: 0.5, // Added border width
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

  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  innerModal: {
    width: '80%',
    backgroundColor: 'rgba(211, 211, 211, 0.95)', // Lighter shade of grey with opacity
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000', // Shadow color
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },

  tickImage: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    marginBottom: 20,
    color: "black",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default AddNewLocation3;
