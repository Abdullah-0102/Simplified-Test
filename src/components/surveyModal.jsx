import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for local storage

const SurveyModal = ({ isSubmitModalVisible, toggleSubmitModal }) => {
    const [sendNowActive, setSendNowActive] = useState(true);
    const [loading, setLoading] = useState(false);

    const toggleSendNow = () => {
        setSendNowActive(!sendNowActive);
    };

    const submitSurvey = async () => {
        if (sendNowActive) {
            // Proceed with normal submission process
            setLoading(true);
            try {
                // Your existing submission logic here
                // ...
            } catch (error) {
                console.error('Submission failed:', error);
            } finally {
                setLoading(false);
            }
        } else {
            // Show confirmation message and store survey data locally
            Alert.alert(
                "Survey Saved",
                "Your survey has been saved. You can send it later when you're connected to Wi-Fi.",
                [{ text: "OK", onPress: () => saveSurveyData() }]
            );
        }
    };

    const saveSurveyData = async () => {
        // Replace with your actual survey data
        const surveyData = {
            // Example survey data structure
            question1: 'Answer 1',
            question2: 'Answer 2',
            // Add more questions as needed
        };

        try {
            const existingSurveys = await AsyncStorage.getItem('savedSurveys');
            const surveys = existingSurveys ? JSON.parse(existingSurveys) : [];
            surveys.push(surveyData);
            await AsyncStorage.setItem('savedSurveys', JSON.stringify(surveys));
            console.log('Survey data saved successfully!');
        } catch (error) {
            console.error('Failed to save survey data:', error);
        }
    };

    return (
      <Modal visible={isSubmitModalVisible} transparent={true} animationType="fade">
        <BlurView
            style={styles.blurBackground}
            blurType="light"
            blurAmount={2}
            reducedTransparencyFallbackColor="white"
        />
        <View style={styles.bottomModal}>
            <View style={styles.surveyParent}>
                <Text style={styles.survey}>Survey</Text>
                <TouchableOpacity onPress={toggleSubmitModal}>
                <Image
                    style={styles.iconX}
                    resizeMode="cover"
                    source={require("../images/cross.png")}
                />
                </TouchableOpacity>
            </View>
            <View style={styles.rectangle} />
            <View style={styles.textGroup}>
                <Text style={styles.text4}>{title}</Text>
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
            <TouchableOpacity style={styles.typebuttonType2secondary1} onPress={submitSurvey}>
                {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" /> // Loader when submitting
                ) : (
                    <Text style={styles.submitSurveyText}>Submit Survey</Text>
                )}
            </TouchableOpacity>
        </View>
      </Modal>
    );
};

const styles = StyleSheet.create({
    blurBackground: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      },
      bottomModal: {
        width: "100%",
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
      },
      surveyParent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      },
      survey: {
        fontSize: 24,
        color: 'black',
        fontFamily: "SourceSans3-Bold",
      },
      iconX: {
        width: 25,
        height: 25,
      },
      textGroup: {
        marginBottom: 20,
      },
      text4: {
        fontSize: 16,
        marginBottom: 10,
        color: 'black',
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
        color: "#007bff", // blue color
      },
      textInactive: {
        color: "#555", // grey color
      },
      rectangle: {
        width: "100%",
        height: 1,
        backgroundColor: "#ccc",
        marginBottom: 20,
      },
      typebuttonType2secondary1: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
      },
      submitSurveyText: {
        fontSize: 16,
        color: "white",
      },
    
      selectionOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
      },
      selectionText: {
        fontSize: 16,
        color: '#007bff',
      },
      closeModalButton: {
        padding: 15,
      },
      closeModalButtonText: {
        color: '#ff0000',
        fontSize: 16,
        textAlign: 'center',
      },
});

export default SurveyModal;
