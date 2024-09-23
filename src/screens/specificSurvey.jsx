import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert, Modal, ScrollView, Switch, TextInput, Animated, ActivityIndicator } from "react-native";
import Text from "../components/text";
import LinearGradient from "react-native-linear-gradient";
import { BlurView } from '@react-native-community/blur';
import * as ImagePicker from 'expo-image-picker';
import { useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

const SpecificSurvey = ({ route }) => {
  const { selectedSurvey, selectedLocation, coordinates } = route.params;
  const [token, setToken] = useState(route.params?.token || ''); // Use token from route or empty string
  const title = selectedSurvey.surveyName;
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [sendNowActive, setSendNowActive] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [cameraPermissions, requestCameraPermissions] = useCameraPermissions();
  const [loading, setLoading] = useState(false); // State for loading

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [animationValue] = useState(new Animated.Value(1));

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);


  useEffect(() => {
    const fetchToken = async () => {
      if (!token) {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken); // Set token from AsyncStorage if available
        } else {
          // If no token is available, redirect to the login screen
          navigation.navigate('Login');
        }
      }
    };

    fetchToken();
  }, [token]);


  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    handleAnswerChange(currentDate.toISOString(), questions[currentQuestionIndex]);
  };

  
  const navigation = useNavigation();
  
  const questions = selectedSurvey.surveyQuestions.map((question, index) => ({
    ...question,
    id: index // Assigning ID based on the index
  }));
  // const questions = selectedSurvey.surveyQuestions;

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isCurrentQuestionAnswered = () => {
    const question = questions[currentQuestionIndex];
    console.log(answers);
    if (question.isRequired) {
      if (question.pluginCode === 'CHO1') {
        return selectedOption !== null; // For single choice
      } 
      else if (question.pluginCode === 'CHOM') {
        return (answers[question.pluginCode] || []).length > 0; // For multiple choice
      } 
      else if (question.pluginCode === 'TXT') {
        return answers[question.pluginCode] && answers[question.pluginCode].length > 0; // For text input
      } 
      else if (question.pluginCode === 'MNY') { // For monetary input
        const answer = answers[question.pluginCode];
        return answer !== undefined && String(answer).trim() !== '' && !isNaN(answer); // Check if it's a valid number
      }
      else if (question.pluginCode === 'NUM') { // For monetary input
        const answer = answers[question.pluginCode];
        return answer !== undefined && String(answer).trim() !== '' && !isNaN(answer); // Check if it's a valid number
      }
      else if (question.pluginCode === 'STR5') {
        // Ensure that the selectedOption is checked correctly
        console.log("Star Rating Selected:", selectedOption);
        return selectedOption !== null; // For star rating
    }
    
      // else if (question.pluginCode === 'DATE') {
        // return answers[question.pluginCode] !== undefined; // For date input
      // }
      // Add other question types as needed
    }
    return true; // If not required or already answered
  };
  
  const goToNextQuestion = () => {
    if (isCurrentQuestionAnswered()) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        toggleModal(); // Show image upload modal
      }
    }
  };
  const nextButtonStyle = isCurrentQuestionAnswered() ? styles.nextButtonn : styles.nextButtonDisabled;


  const getRatingText = (rating) => {
    switch (rating) {
        case 1:
            return "Poor";
        case 2:
            return "Average";
        case 3:
            return "Good";
        case 4:
            return "Very Good";
        case 5:
            return "Excellent";
        default:
            return "";
      }
  };

  const handleStarRatingChange = (rating) => {
    setSelectedOption(rating); // Update selected option to the clicked star
    handleAnswerChange(rating, questions[currentQuestionIndex]); // Store the rating in answers
  };




  const handleAnswerChange = (option, question) => {
    if (question.pluginCode === 'CHO1') {
      // Check if the selected option is already the current selection
      if (answers[question.pluginCode] === option) {
          // Deselect the option by setting it to null or an equivalent value
          setAnswers((prevAnswers) => ({
              ...prevAnswers,
              [question.pluginCode]: null, // or use '' or any other value to represent no selection
          }));
          setSelectedOption(null); // Update selected option for rendering
      } 
      else {
          // Store the selected option in the answers state
          setAnswers((prevAnswers) => ({
              ...prevAnswers,
              [question.pluginCode]: option, // Store the selected option directly
          }));
          setSelectedOption(option); // Update selected option for rendering
        }
    } 
    else if (question.pluginCode === 'MNY') {
        // Update the answers state with the monetary input
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [question.pluginCode]: option, // Store the monetary input
        }));
    } 
    else if (question.pluginCode === 'NUM') {
        // Update the answers state with the monetary input
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [question.pluginCode]: option, // Store the monetary input
        }));
    } 
    else if (question.pluginCode === 'DATE') {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [question.pluginCode]: option, // Store the selected date
        }));
    } 
    else if (question.pluginCode === 'STR5') {
      // Handle star rating selection
      if (answers[question.pluginCode] === option) {
        // Deselect if the same star is clicked
          setSelectedOption(null);
          setAnswers((prevAnswers) => ({
              ...prevAnswers,
              [question.pluginCode]: null, // or any value to represent no selection
          }));
      } else {
          setSelectedOption(option); // Update selected option for rendering
          setAnswers((prevAnswers) => ({
              ...prevAnswers,
              [question.pluginCode]: option, // Store the selected star rating
          }));
      }
    }
    else if (question.pluginCode === 'TXT') {
      // Store the answer as a single value instead of an array
      setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [question.pluginCode]: option, // Store the text directly as a string
      }));
    } 
    else {
        const currentAnswers = answers[question.pluginCode] || [];
        if (currentAnswers.includes(option)) {
            // Remove from selection
            setAnswers((prevAnswers) => ({
                ...prevAnswers,
                [question.pluginCode]: currentAnswers.filter(ans => ans !== option),
            }));
        } else {
            // Add to selection
            setAnswers((prevAnswers) => ({
                ...prevAnswers,
                [question.pluginCode]: [...currentAnswers, option],
            }));
        }
    }

    // Trigger animation
    Animated.spring(animationValue, {
        toValue: 1.1, // Scale up
        friction: 3,
        useNativeDriver: true,
    }).start(() => {
        Animated.spring(animationValue, {
            toValue: 1, // Scale back down
            friction: 3,
            useNativeDriver: true,
        }).start();
    });
  };

  
  
  
  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    // console.log(question);
    if (question.isHidden) return null; // Skip hidden questions
  
    switch (question.pluginCode) {
      case 'CHO1': // Single Choice
        return (
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{question.question}</Text>
                {question.additionalText && <Text style={styles.additionalText}>{question.additionalText}</Text>}
                {question.options.map((option, index) => {
                    const isSelected = selectedOption === option.option; // Use selectedOption to determine if it's selected
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleAnswerChange(option.option, question)}
                            style={[styles.optionContainer, isSelected && styles.selectedOption]}
                        >
                            <Animated.View style={{ transform: [{ scale: isSelected ? animationValue : 1 }] }}>
                                <Text style={[styles.optionText, isSelected && styles.selectedText]}>
                                    {option.option}
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>
                    );
                })}

                {/* Display Required Message */}
                {question.isRequired && (
                    <Text style={styles.requiredText}>*Required*</Text>
                )}
            </View>
        );

      case 'CHOM': // Multiple Choice
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            {question.additionalText && <Text style={styles.additionalText}>{question.additionalText}</Text>}
            {question.options.map((option, index) => {
              const isSelected = (answers[question.pluginCode] || []).includes(option.option);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAnswerChange(option.option, question)} // Pass the question here
                  style={[styles.optionContainer, isSelected && styles.selectedOption]} // Highlight selected option
                >
                  <Animated.View style={{ transform: [{ scale: isSelected ? animationValue : 1 }] }}>
                    <Text style={[styles.optionText, isSelected && styles.selectedText]}>
                      {option.option}
                    </Text>
                    {option.additionalText && <Text style={styles.additionalText}>{option.additionalText}</Text>}
                  </Animated.View>
                </TouchableOpacity>
              );
            })}

            {/* Display Required Message */}
            {question.isRequired && (
              <Text style={styles.requiredText}>*Required*</Text>
            )}
          </View>
        );
      
      case 'DATE': // Date Picker
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {/* {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )} */}

            {/* Display Required Message */}
            {question.isRequired && (
              <Text style={styles.requiredText}>*Required*</Text>
            )}
          </View>
        );
  
      case 'IMGL': // Image Upload
        return (
          <View style={styles.uploadContainer}>
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
              <TouchableOpacity style={styles.addMoreButton} onPress={requestPermissions}>
                <Text style={styles.addMoreButtonText}>Add more +</Text>
              </TouchableOpacity>
            )}
        
            <TouchableOpacity onPress={requestPermissions}>
              <View style={styles.textContainer}>
                <Text style={[styles.text2, styles.typo]}>Upload Photo</Text>
                <Text style={[styles.text3, styles.typo]}>
                  Take one or more photos
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
  
      case 'TXT': // Monetary Input
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText1}>{question.question}</Text>
            <View style={styles.moneyInputContainer}>
              <TextInput
                placeholder="Enter additional text"
                onChangeText={(text) => handleAnswerChange(text, question)} // Handle answer change
                style={styles.moneyInput} // Apply custom styles for the input
              />
            </View>
            {/* Display Required Message */}
            {question.isRequired && (
              <Text style={styles.requiredText}>*Required*</Text>
            )}
          </View>
        );

      case 'MNY': // Monetary Input
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            <View style={styles.moneyInputContainer}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                placeholder="Enter amount"
                keyboardType="numeric" // Restrict to numeric input
                onChangeText={(text) => handleAnswerChange(text, question)} // Handle answer change
                style={styles.moneyInput} // Apply custom styles for the input
              />
            </View>
            {/* Display Required Message */}
            {question.isRequired && (
              <Text style={styles.requiredText}>*Required*</Text>
            )}
          </View>
        );
      
      case 'NUM': // Monetary Input
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            <View style={styles.moneyInputContainer}>
              <TextInput
                keyboardType="numeric" // Restrict to numeric input
                onChangeText={(text) => handleAnswerChange(text, question)} // Handle answer change
                style={styles.moneyInput} // Apply custom styles for the input
              />
            </View>
            {/* Display Required Message */}
            {question.isRequired && (
              <Text style={styles.requiredText}>*Required*</Text>
            )}
          </View>
        );

      case 'STR5': // Star Rating
        return (
            <View style={styles.questionContainer}>
                {/* <Text style={styles.questionText}>{question.question}</Text> */}
                <Text style={styles.ratingText}>{getRatingText(selectedOption)}</Text>
                <View style={styles.starContainer}>
                    {Array.from({ length: 5 }, (_, index) => {
                        const starValue = index + 1;
                        const isSelected = starValue <= selectedOption; // Select all stars up to the selected one
                        return (
                            <TouchableOpacity
                                key={starValue}
                                onPress={() => handleStarRatingChange(starValue)}
                                style={styles.starButton}
                            >
                                <Text style={[styles.star, isSelected ? styles.selectedStar : styles.unselectedStar]}>
                                    ★
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {question.isRequired && (
                    <Text style={styles.requiredText}>*Required*</Text>
                )}
            </View>
        );
  
      default:
        return null;
    }
  };
  

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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleSubmitModal = () => {
    setIsSubmitModalVisible(!isSubmitModalVisible);
  };

  const toggleSendNow = () => {
    setSendNowActive(!sendNowActive);
  };

  const toggleSuccessModal = () => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
  };

  const submitSurvey = async () => {
    const { surId } = selectedLocation; 
    const { lat, lon } = coordinates;

    console.log('Submitting survey...');
    console.log(`Survey ID: ${surId}`);
    console.log(`Latitude: ${lat}`);
    console.log(`Longitude: ${lon}`);

    setLoading(true); // Start loading

    try {
        // Step 1: Start Submission
        const startResponse = await fetch(`https://stapi.simplifiedtrade.com/app/v2/${surId}/start/${lat}/${lon}`, {
            method: 'PATCH',
            // headers: {
            //     'x-st3-token': token,
            //     'Content-Type': 'application/json',
            // },
        });

        if (!startResponse.ok) {
            const errorText = await startResponse.text();
            if (startResponse.status === 409) { // Conflict status for already started session
                console.log('Survey already started for this location. Proceeding to submit answers.');
            } else {
                throw new Error(`Failed to start submission: ${startResponse.statusText} - ${errorText}`);
            }
        } else {
            const startData = await startResponse.json();
            console.log('Survey started successfully:', startData);
        }

        // Optional: Add a delay before submitting answers
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

        // Step 2: Submit Answer for First Question (ID 0)
        const questionId = 0; // ID of the first question
        const question = questions[questionId]; // Get the question object
        const answer = answers[question.pluginCode]; // Retrieve the answer using pluginCode

        console.log(`Answer retrieved for question ID ${questionId}:`, answer); // Log the retrieved answer

        console.log(`Submitting answer for question ID: ${questionId}`);
        await submitAnswer(surId, questionId, answer, token);


        // Step 3: End Submission
        const endResponse = await fetch(`https://stapi.simplifiedtrade.com/app/v2/${surId}/end/${new Date().toISOString()}`, {
            method: 'PATCH',
            headers: {
                'x-st3-token': token,
                'Content-Type': 'application/json',
            },
        });

        if (!endResponse.ok) {
            const errorText = await endResponse.text();
            throw new Error(`Failed to end submission: ${endResponse.statusText} - ${errorText}`);
        }
        console.log('Survey ended successfully.');
        toggleSubmitModal(); // Close the submit modal
        toggleSuccessModal(); // Show success modal

    } catch (error) {
        console.error('Error submitting survey:', error);
        Alert.alert('Submission failed', 'There was an error submitting the survey. Please try again.');
    } 
    finally {
      setLoading(false); // Stop loading
    }
  };

// Helper function to submit an answer
  const submitAnswer = async (surId, questionId, answer, token) => {
    const body = JSON.stringify({
        question_id: questionId,
        answers: {
            option: Array.isArray(answer) ? answer : [answer] // Ensure it's an array for multiple choices
        }
    });

    // Log the body being sent
    console.log(`Submitting answer for question ${questionId}:`, body);

    const response = await fetch(`https://stapi.simplifiedtrade.com/app/v2/${surId}/answer`, {
        method: 'PATCH',
        headers: {
            'x-st3-token': token,
            'Content-Type': 'application/json',
        },
        body: body,
    });

    console.log(token);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit answer for question ${questionId}: ${response.statusText} - ${errorText}`);
    }
    console.log(`Answer submitted for question ${questionId} successfully.`);
  };


// Function to retrieve answers (implement this based on your state structure)
const getAnswers = () => {
    // Return the answers object in the required format
    return answers; // Adjust this line as necessary
};


  
  

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.gradientContainer}>
          <View style={[styles.greyGradient, styles.gradientPosition]} />
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

      <View style={[styles.uploadContainer, styles.card]}>
        {/* Render Questions Here */}
        <ScrollView style={styles.questionsContainer}>
          {renderQuestion()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
            <TouchableOpacity 
                style={styles.backButtonn} 
                onPress={goToPreviousQuestion} 
                disabled={currentQuestionIndex === 0}
            >
                <Text style={styles.backButtonTextt}>Back</Text>
            </TouchableOpacity>
            
            {/* Only show the top button if not on the last question */}
            {currentQuestionIndex < questions.length - 1 && (
                <TouchableOpacity 
                    style={nextButtonStyle} 
                    onPress={goToNextQuestion} 
                    disabled={!isCurrentQuestionAnswered()}
                >
                    <Text style={[styles.nextButtonTextt, !isCurrentQuestionAnswered() && styles.disabledText]}>
                        Next
                    </Text>
                </TouchableOpacity>
            )}
        </View>
      </View>

      {currentQuestionIndex === questions.length - 1 && (
        <TouchableOpacity 
          style={[styles.nextButton, !isCurrentQuestionAnswered() && styles.nextButtonDisabled]} 
          onPress={toggleSubmitModal} 
          disabled={!isCurrentQuestionAnswered()} 
        >
          <Text style={[styles.next, styles.typo]}>
            Next
          </Text>
        </TouchableOpacity>
      )}


      {/* Success Modal */}
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
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Survey Modal */}
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
              <Text style={styles.text4}>Recurring Reload Copying 2 Survey Machine</Text>
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

      {/* Showing Selected Images Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <BlurView
          style={styles.blur}
          blurType="light"
          blurAmount={5}
          reducedTransparencyFallbackColor="white"
        />
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalScrollView}>
            {selectedImages.map((uri, index) => (
              <View key={index} style={styles.modalImageWrapper}>
                <Image
                  style={styles.modalImage}
                  source={{ uri }}
                />
                <TouchableOpacity style={styles.modalRemoveButton} onPress={() => removeImage(uri)}>
                  <Text style={styles.modalRemoveText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0F0",
  },
  blur: {
    position: "absolute",
    top: 0, left: 0, bottom: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  card: {
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
    marginBottom: 10,
    color: 'black',
    fontWeight: '600',
  },
  gradientContainer: {
    width: "100%",
    marginBottom: 10,
  },
  gradient: {
    width: "50%",
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
    flexDirection: "column", 
    alignItems: "center", 
  },
  groupIcon: {
    width: 50,
    height: 50,
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
    width: 80,
    height: 80,
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
    marginTop: 20,
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
  innerModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  tickImage: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
  closeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Styling for the 'Next' Button popup modal
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

  questionsContainer: {
    width: '100%',
    paddingVertical: 20,
  },
  questionContainer: {
    marginBottom: 10,
  },
  navigationContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 10,
  },
  backButtonn: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  backButtonTextt: {
    color: 'black',
  },
  nextButtonn: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  nextButtonTextt: {
    color: 'white',
  },
  nextButtonDisabled: {
    backgroundColor: '#d3d3d3', // Light grey for disabled state
    padding: 10,
    borderRadius: 5,
    opacity: 0.7, // Optional: make it look more disabled
    // other styles...
  },
  disabledText: {
    color: '#a9a9a9', // Light grey text for disabled state
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Text color
    marginBottom: 2,
  },
  questionText1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Text color
    marginBottom: 2,
    marginBottom: 10,
  },
  optionContainer: {
    backgroundColor: '#bbdefb', // Light blue background color for options
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#90caf9', // Lighter blue border color
  },
  selectedOption: {
    backgroundColor: '#1976d2', // Dark blue for selected option
    borderColor: '#0d47a1', // Even darker border for selected
  },
  optionText: {
    fontSize: 16,
    color: '#0d47a1', // Default text color
  },
  selectedText: {
    color: '#ffffff', // White text for selected option
  },
  additionalText: {
    fontSize: 14,
    color: '#555', // Additional text color
    marginBottom: 20,
  },
  requiredText: {
    color: 'black', // or any color you prefer
    fontSize: 14, // adjust size as needed
    marginTop: 8, // space above the text
  },
  moneyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#003366', // Dark blue color
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
  },
  dollarSign: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
  },
  moneyInput: {
    flex: 1, // Take remaining space
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
    borderColor: 'transparent', // Hide the default border
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  starButton: {
    marginHorizontal: 5,
  },
  star: {
    fontSize: 40,
  },
  selectedStar: {
    color: 'gold', // Color for selected stars
  },
  unselectedStar: {
    color: 'grey', // Color for unselected stars
  },
  ratingText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  
});

export default SpecificSurvey;
