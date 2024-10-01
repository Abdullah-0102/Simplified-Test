import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import * as Updates from "expo-updates";
import { Image } from "expo-image";
import LinearGradient from "react-native-linear-gradient";
import Text from "../components/text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar } from "react-native-paper"; // Make sure to install react-native-paper

import TapOnMyLocationSuggested from "./tapOnLocation";
import AddNewLocation1 from "./addNewLocation-1";
import AddNewLocation2 from "./addNewLocation-2";
import AddNewLocation3 from "./addNewLocation-3";
import LocationListModal from "../components/locationListModal";

import { AuthContext } from "../contexts/authContext";

const Homepage = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loc1Model, setLoc1Model] = useState(false);
  const [loc2Model, setLoc2Model] = useState(false);
  const [loc3Model, setLoc3Model] = useState(false);
  const [surveySelect, setSurveySelect] = useState("");
  const [locSelect, setLocSelect] = useState("");
  const [locModalVisible, setLocModalVisible] = useState(false);
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [storeData, setStoreData] = useState([]); // New state for storing store data
  const [token, setToken] = useState(route.params?.token || ""); // Use token from route or empty string
  const [savedSurveys, setSavedSurveys] = useState([]); // State for saved surveys
  const [hasSavedSurveys, setHasSavedSurveys] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress

  const { authState } = useContext(AuthContext);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date()); // State for last refresh time

  // Extract the locations object from authState
  const locationsObject = authState.locations || {};
  const locationNames = Object.values(locationsObject).flatMap((loc) =>
    Object.values(loc)
  ); // Extract location names from nested objects

  useEffect(() => {
    const checkSavedSurveys = async () => {
      const existingSurveys = await AsyncStorage.getItem("savedSurveys");
      if (existingSurveys) {
        const parsedSurveys = JSON.parse(existingSurveys);
        setSavedSurveys(parsedSurveys);
        setHasSavedSurveys(parsedSurveys.length > 0);
      } else {
        console.log("No Saved Surveys.");
      }
    };

    checkSavedSurveys();
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      if (storedToken) {
        setToken(storedToken); // Set token from AsyncStorage if available
        console.log("Token retrieved:", storedToken);
      } else {
        // If no token is available, redirect to the login screen
        console.log("No token found, navigating to login.");
        navigation.navigate("Login");
      }
    };
    fetchToken();
  }, [navigation]);

  const fetchSavedSurveys = async () => {
    if (!token) {
      console.error("No valid token found. Cannot fetch saved surveys.");
      return; // Exit if token is invalid
    }

    setLoading1(true);
    setUploadProgress(0); // Reset progress

    try {
      const existingSurveys = await AsyncStorage.getItem("savedSurveys");
      if (existingSurveys) {
        const parsedSurveys = JSON.parse(existingSurveys);
        console.log("Parsed Surveys:", parsedSurveys);
        setSavedSurveys(parsedSurveys);

        if (parsedSurveys.length > 0) {
          const totalQuestions = parsedSurveys.reduce(
            (total, survey) => total + survey.data.length,
            0
          );
          let processedQuestions = 0;
          for (let i = 0; i < parsedSurveys.length; i++) {
            const survey = parsedSurveys[i];
            const { surId, lat, lon } = survey;

            console.log(`Starting survey ID: ${surId}`);

            // Start the survey first
            const startResponse = await fetch(
              `https://stapi.simplifiedtrade.com/app/v2/${surId}/start/${lat}/${lon}`,
              {
                method: "PATCH",
                headers: {
                  "x-st3-token": token,
                },
              }
            );

            const rawStartResponse = await startResponse.text();
            console.log("Raw start response:", rawStartResponse);

            if (!startResponse.ok) {
              console.error("Error starting survey:", rawStartResponse);
              continue; // Skip to the next survey if starting fails
            }

            console.log("Survey started successfully");

            for (const question of survey.data) {
              const { questionId, pluginCode, answer } = question;

              await submitAnswer(surId, questionId, answer, token, pluginCode);

              // Update processed questions count
              processedQuestions++;
              setUploadProgress((processedQuestions / totalQuestions) * 100);

              if (
                pluginCode === "IMGL" &&
                Array.isArray(answer) &&
                answer.length > 0
              ) {
                console.log("Uploading images for question:", questionId);
                await uploadImages(surId, questionId, answer, token);
              }
            }
          }
          await AsyncStorage.removeItem("savedSurveys");
          console.log("All saved surveys uploaded successfully!");
        } else {
          console.log("No saved surveys found.");
        }
      } else {
        console.log("No saved surveys found.");
      }
    } catch (error) {
      console.error("Failed to retrieve saved surveys:", error);
    } finally {
      setLoading1(false); // Ensure loading is set to false at the end
    }
  };

  useEffect(() => {
    const checkSavedSurveys = async () => {
      const existingSurveys = await AsyncStorage.getItem("savedSurveys");
      if (existingSurveys) {
        const parsedSurveys = JSON.parse(existingSurveys);
        setSavedSurveys(parsedSurveys);
      }
    };

    checkSavedSurveys();
  }, []);

  const uploadImages = async (surId, questionId, images, token) => {
    for (let index = 0; index < images.length; index++) {
      const image = images[index];

      // Create a FormData object
      const formData = new FormData();

      // Determine the file type based on the image name or URI
      const fileType = image.name.split(".").pop().toLowerCase(); // Get the file extension
      const mimeType = `image/${fileType}`; // Construct the MIME type

      formData.append("file", {
        uri: image.uri, // The URI of the image
        name: image.name, // The name of the file
        type: mimeType, // Set the MIME type dynamically
      });

      console.log(`Uploading image ${index + 1} for question ${questionId}...`);

      try {
        const uploadResponse = await fetch(
          `https://stapi.simplifiedtrade.com/app/v2/${surId}/upload/${questionId}/${index}`,
          {
            method: "POST",
            headers: {
              "x-st3-token": token,
            },
            body: formData,
          }
        );

        // Log the response status code
        console.log(
          `Response status for question ${questionId}, image ${index}:`,
          uploadResponse.status
        );

        // Check if the response is OK (status code 204)
        if (uploadResponse.ok) {
          const rawUploadResponse = await uploadResponse.text();
          console.log(
            `Upload response for question ${questionId}, image ${index}:`,
            rawUploadResponse
          );
        } else {
          console.error(
            `Failed to upload image for question ${questionId}:`,
            uploadResponse.statusText
          );
          throw new Error(
            `Failed to upload image for question ${questionId}: ${uploadResponse.statusText}`
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // Submit answer function
  const submitAnswer = async (surId, questionId, answer, token, pluginCode) => {
    let body;

    console.log(`Question ID: ${questionId}, Answer:`, answer);

    // Check if the answer is valid for submission
    if (pluginCode === "IMGL") {
      // Handle image uploads
      const finalAnswer = JSON.stringify(
        answer.map((img, index) => ({
          key: index.toString(),
          name: img.name,
          uri: img.uri, // Include URI if needed
        }))
      );

      body = JSON.stringify({
        question_id: questionId,
        answers: {
          answer_content: [finalAnswer],
        },
      });
    } else if (pluginCode === "CHO1" || pluginCode === "CHOM") {
      // Handle choice questions
      body = JSON.stringify({
        question_id: questionId,
        answers: {
          option: Array.isArray(answer) ? answer : [answer],
        },
      });
    } else if (
      pluginCode === "TXT" ||
      pluginCode === "MNY" ||
      pluginCode === "NUM" ||
      pluginCode === "STR5" ||
      pluginCode === "DATE"
    ) {
      // Ensure that text responses are handled correctly
      body = JSON.stringify({
        question_id: questionId,
        answers: {
          answer_content: [answer], // Wrap the answer in an array
        },
      });
    } else {
      // Log and skip submission for unsupported question types
      console.log(
        `Skipping submission for Question ID: ${questionId} due to un-tackled pluginCode: ${pluginCode}`
      );
      return; // Exit the function early
    }

    console.log(`Submitting answer for question ${questionId}:`, body);

    try {
      const response = await fetch(
        `https://stapi.simplifiedtrade.com/app/v2/${surId}/answer`,
        {
          method: "PATCH",
          headers: {
            "x-st3-token": token,
            "Content-Type": "application/json", // Ensure the content type is set correctly
          },
          body: body,
        }
      );

      const rawAnswerResponse = await response.text();
      console.log("Raw answer response:", rawAnswerResponse);

      if (!response.ok) {
        console.error(
          `Failed to submit answer for question ${questionId}:`,
          rawAnswerResponse
        );
        throw new Error(
          `Failed to submit answer for question ${questionId}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error in submission process:", error);
    }
  };

  // Fetch Survey Data
  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const surveyResponse = await fetch(
          "https://stapi.simplifiedtrade.com/app/v2/surveys/json",
          {
            method: "GET",
            headers: {
              "x-st3-token":
                "TVgxL2w5YjBiN05RWnNGRmhibEg4Z2wxc3hML21RN0dqSkFESVJCZFpQcTYwQklyQ3VjTzEwUGsxWlNDUnZFdzloOGxzL1A5Z1F5ZGRHQXhRWTVMQ0E9PQ==",
              "Content-Type": "application/json", // Optional, depending on your API requirements
            },
          }
        );
        const storeResponse = await fetch(
          "https://stapi.simplifiedtrade.com/app/v2/stores/json"
        );

        if (!surveyResponse.ok || !storeResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const surveyData = await surveyResponse.json();
        const storeData = await storeResponse.json();

        setSurveyData(surveyData); // Set survey data
        setStoreData(storeData); // Set store data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, []);

  const cardsData = [
    {
      title: "Recurring Reload Copying 2 Survey Machine",
      location: `+ ${locationNames.length} Locations`, // Dynamic location count
      info1: "Ends May 31st 2024",
      info2: "3 hours ago",
      shapeText: "125",
    },
    {
      title: "Another Survey Title",
      location: "+ 1500 Locations",
      info1: "Ends June 15th 2024",
      info2: "5 hours ago",
      shapeText: "200",
    },
    {
      title: "Survey XYZ",
      location: "+ 1200 Locations",
      info1: "Ends July 5th 2024",
      info2: "1 day ago",
      shapeText: "90",
    },
    {
      title: "Annual Customer Feedback",
      location: "+ 3000 Locations",
      info1: "Ends August 10th 2024",
      info2: "2 days ago",
      shapeText: "300",
    },
    {
      title: "Product Satisfaction Survey",
      location: "+ 1800 Locations",
      info1: "Ends Sep 20th 2024",
      info2: "1 week ago",
      shapeText: "180",
    },
    {
      title: "Employee Engagement Survey",
      location: "+ 2500 Locations",
      info1: "Ends Oct 15th 2024",
      info2: "2 weeks ago",
      shapeText: "250",
    },
    {
      title: "Customer Experience Evaluation",
      location: "+ 2800 Locations",
      info1: "Ends Nov 5th 2024",
      info2: "3 weeks ago",
      shapeText: "280",
    },
    {
      title: "Market Research Survey",
      location: "2102 Vons REDONDO BEACH",
      info1: "Ends Dec 1st 2024",
      info2: "1 month ago",
      shapeText: "200",
    },
  ];

  const handleImageClick = () => {
    if (hasSavedSurveys) {
      fetchSavedSurveys(); // Call fetchSavedSurveys if there are saved surveys
    } else {
      handleImagePress(); // Otherwise, call the existing handler
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleLoc1Modal = () => {
    setLoc1Model(!loc1Model);
  };

  const toggleLoc2Modal = () => {
    setLoc2Model(!loc2Model);
  };

  const toggleLoc3Modal = () => {
    setLoc3Model(!loc3Model);
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    // Implement your search logic here if needed
  };

  const handleLocationSelect = (locationTitle) => {
    setSearchText(locationTitle || "");
    toggleModal();
  };

  const handleLocationTap = (title) => {
    setLocSelect(title);
    toggleLoc3Modal();
  };

  const handleSurveyTap = (surveyTitle) => {
    setSurveySelect(surveyTitle);
    toggleLoc2Modal();
  };

  const handleImagePress = () => {
    navigation.navigate("HowItWorks");
  };

  const handleGetHelpPress = () => {
    navigation.navigate("GetHelp");
  };

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Utility function to get the ordinal suffix for the day (e.g., 'st', 'nd', 'rd', 'th')
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // For 11th, 12th, 13th, etc.
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Function to format the expiry date
  const formatExpiryDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `Ends ${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
  };

  const filteredSurveys =
    searchText.trim() === ""
      ? surveyData
      : surveyData.filter((survey) => {
          const searchTextLower = searchText.toLowerCase();
          // Check if surveyName or any locationName in completions matches the searchText
          return (
            survey.surveyName.toLowerCase().includes(searchTextLower) ||
            survey.completions.some((location) =>
              location.locationName.toLowerCase().includes(searchTextLower)
            )
          );
        });

  const handleLocationPress = (survey) => {
    setLocModalVisible(!locModalVisible);
    setSelectedSurvey(survey);
  };

  const hideLocModal = () => {
    setLocModalVisible(!locModalVisible);
  };

  const handleLocationNavigation = (locationName, survey, location) => {
    // Navigate to SpecificSurvey with location and selectedSurvey
    const matchingStore = storeData.find(
      (store) => store.name === locationName
    );
    const coordinates = matchingStore
      ? { lat: matchingStore.lat, lon: matchingStore.lon }
      : { lat: null, lon: null };

    navigation.navigate("SpecificSurvey", {
      location: locationName,
      selectedSurvey: survey,
      selectedLocation: location,
      token: token,
      coordinates, // Pass the coordinates to the next screen
    });
  };

  const checkSavedSurveyData = async () => {
    try {
      const savedData = await AsyncStorage.getItem("surveyData");
      if (savedData !== null) {
        const parsedData = JSON.parse(savedData);
        console.log("Saved Survey Data:", parsedData); // Log the data to the console
      } else {
        console.log("No saved survey data found.");
      }
    } catch (error) {
      console.error("Error retrieving survey data from AsyncStorage:", error);
    }
  };

  //refresh page function
  const handleRefresh = async () => {
    try {
      await Updates.reloadAsync(); // Reload the app
      setLastRefreshTime(new Date()); // Set the new refresh time
    } catch (error) {
      console.log("Error reloading app:", error);
    }
  };

  // Get the last refresh time
  const getRefreshMessage = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastRefreshTime) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInSeconds < 60) {
      return "Refreshed few seconds ago";
    } else if (diffInMinutes <= 10) {
      return `Refreshed ${diffInMinutes} minute${
        diffInMinutes > 1 ? "s" : ""
      } ago`;
    } else {
      return "Refreshed much time ago";
    }
  };

  return (
    <View style={styles.homepage}>
      <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={handleGetHelpPress}
      >
        <Image
          style={styles.menuIcon}
          source={require("../images/drawer-icon.png")}
        />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image source={require("../images/logo-1.png")} style={styles.logo} />
      </View>
      {loading1 ? (
        <View style={styles.loadingContainer1}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText1}>
            Uploading... {uploadProgress}%
          </Text>
          <ProgressBar
            progress={uploadProgress / 100}
            color="#6200ee"
            style={styles.progressBar1}
          />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={handleImageClick}
        >
          <Image
            style={[styles.vectorIcon, hasSavedSurveys && styles.redIcon]}
            source={require("../images/vector1.png")}
          />
        </TouchableOpacity>
      )}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Image
            style={styles.searchIcon}
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
        <TouchableOpacity onPress={toggleModal}>
          <LinearGradient
            style={styles.gradientBackground}
            locations={[0, 1]}
            colors={["#0d54cf", "#072b69"]}
            useAngle={true}
            angle={180}
          >
            <Image
              style={styles.locationIcon}
              source={require("../images/location-icon.png")}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={styles.surveysParent}>
        <Text style={[styles.surveys, styles.textTypo1]}>Surveys</Text>
        <Text style={styles.responses}>Responses</Text>
      </View>

      {/* Pending Surveys */}
      {/* <TouchableOpacity
        style={[styles.pendingSurveys]}
        onPress={checkSavedSurveyData}
      >
        <Text style={styles.pendingSurveysText}>Pending Surveys</Text>
      </TouchableOpacity> */}

      {/* Repeatable card view */}
      <ScrollView style={styles.cardScrollView}>
        {filteredSurveys.map((survey, index) => {
          const locationCount = survey.completions.length;

          const displayLocation =
            searchText.trim() === ""
              ? `+ ${locationCount} Locations`
              : survey.completions.some((location) =>
                  location.locationName
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                )
              ? survey.completions.find((location) =>
                  location.locationName
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                ).locationName
              : `+ ${locationCount} Locations`;

          // Filter saved surveys to match both surId and checksum for this survey
          const completionSurIds = survey.completions.map(
            (completion) => completion.surId
          );
          const matchingSavedSurveys = savedSurveys.filter(
            (savedSurvey) =>
              completionSurIds.includes(savedSurvey.surId) &&
              savedSurvey.checksum === survey.checksum
          );
          const pendingCount = matchingSavedSurveys.length;

          // Debugging logs
          console.log("Matching Saved Surveys:", matchingSavedSurveys);
          console.log(
            "Pending Count for survey:",
            survey.surveyName,
            pendingCount
          );

          return (
            <TouchableOpacity key={index} activeOpacity={0.95}>
              <View style={styles.cardContainer}>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (
                      searchText.trim() !== "" &&
                      survey.completions.some((location) =>
                        location.locationName
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      )
                    ) {
                      const location = survey.completions.find((location) =>
                        location.locationName
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      );
                      handleLocationNavigation(
                        location.locationName,
                        survey,
                        location
                      );
                    } else {
                      handleLocationPress(survey);
                    }
                  }}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{survey.surveyName}</Text>
                    <Text style={styles.cardlocation}>{displayLocation}</Text>
                    <View
                      style={[
                        styles.infoContainer,
                        { width: survey.expiryDate.length * 8.5 },
                      ]}
                    >
                      <Text style={styles.infoText}>
                        {formatExpiryDate(survey.expiryDate)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Display pending count only if it's greater than 0 */}
                <View style={styles.shapeCount}>
                  {pendingCount > 0 ? (
                    <View style={styles.shapePendingContainer}>
                      <Text style={styles.shapeText}>{pendingCount}</Text>
                    </View>
                  ) : null}

                  <View style={styles.shapeContainer}>
                    <Text style={styles.shapeText}>{survey.count}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        {/* refresing module */}
        <TouchableOpacity
          style={styles.refreshContainer}
          onPress={handleRefresh}
        >
          <Text style={styles.refreshText}>Refresh List</Text>
          <Text style={styles.refreshTime}>{getRefreshMessage()}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Suggested Locations Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalOverlay}>
            <View style={styles.modalWrapper}>
              <TapOnMyLocationSuggested
                onAddNewLocationPress={toggleLoc1Modal}
                onClose={toggleModal}
                onLocationSelect={handleLocationSelect}
                storeData={storeData}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Add new Location - 1 Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loc1Model}
        onRequestClose={toggleLoc1Modal}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalOverlay}>
            <View style={styles.modalWrapper}>
              <AddNewLocation1
                onClose={toggleLoc1Modal}
                onSurveyTap={handleSurveyTap}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Add New Location-2 Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loc2Model}
        onRequestClose={toggleLoc2Modal}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalOverlay}>
            <View style={styles.modalWrapper}>
              <AddNewLocation2
                onClose={toggleLoc2Modal}
                surveySelected={surveySelect}
                onLocationTap={handleLocationTap}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Add New Location-3 Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loc3Model}
        onRequestClose={toggleLoc3Modal}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalOverlay}>
            <View style={styles.modalWrapper}>
              <AddNewLocation3
                onClose={toggleLoc3Modal}
                surveySelected={surveySelect}
                locationSelected={locSelect}
                toggleModel1={toggleLoc1Modal}
                toggleModel2={toggleLoc2Modal}
                toggleModel3={toggleLoc3Modal}
                toggleModel={toggleModal}
                handleLocationSelect={handleLocationSelect}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <LocationListModal
        locModalVisible={locModalVisible}
        hideLocModal={hideLocModal}
        authState={authState}
        selectedSurvey={selectedSurvey}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  homepage: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    paddingTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0.5, 0.5, 0.5, 0.8)", // Semi-transparent to simulate blur
    justifyContent: "flex-end",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  menuIcon: {
    position: "absolute",
    top: 40,
    left: -157,
    width: 30,
    height: 30,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center", // Center the logo horizontally
    height: 80,
  },
  logo: {
    width: 150,
    height: 150,
  },
  touchableOpacity: {
    position: "absolute",
  },
  vectorIcon: {
    position: "absolute",
    top: 40,
    right: -157,
    width: 30,
    height: 30,
  },
  redIcon: {
    tintColor: "red", // Change color to red
  },
  loadingContainer1: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0.5, 0.5, 0.5, 0.8)", // Semi-transparent background
    zIndex: 1000, // Ensure it appears above other elements
  },
  loadingText1: {
    marginTop: 20,
    fontSize: 18,
    color: "#fff", // Change text color for better visibility
  },
  progressBar1: {
    width: "80%",
    height: 10,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 20,
    marginLeft: 15,
    flex: 1, // Ensure it takes remaining space
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666666",
    flex: 1, // Take remaining space
    fontFamily: "Outfit-Regular", // Apply the global font family here
    fontWeight: "400",
  },
  gradientBackground: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginRight: 15,
  },
  locationIcon: {
    width: 25,
    height: 25,
  },
  surveysParent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // Ensure it takes full width
    paddingHorizontal: 25, // Add padding as needed
    paddingTop: 20,
  },
  surveys: {
    fontSize: 20, // Adjust size as needed
    fontWeight: "500",
    color: "#666666",
  },
  responses: {
    fontSize: 14,
    color: "#666666",
  },
  pendingSurveys: {
    backgroundColor: "#3366ff",
    padding: 5,
    width: "90%",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  pendingSurveysText: {
    color: "#ffffff",
  },
  cardScrollView: {
    // marginTop: 20,
    width: "100%",
  },
  cardContainer: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
    width: "100%",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    color: "black",
    width: "100%",
  },
  cardlocation: {
    color: "#007bff",
    fontSize: 11,
    marginTop: 3,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#F0F8FF",
    paddingVertical: 6,
    justifyContent: "flex-start",
    borderRadius: 20,
    paddingLeft: 10,
  },
  infoText: {
    width: "100%",
    color: "black",
    fontSize: 11,
  },
  lightGrayText: {
    color: "#999999", // Light gray color
    fontSize: 12, // Adjust the font size as needed
    marginTop: 5,
    marginLeft: 8,
  },
  shapeCount: {
    position: "absolute",
    top: 50,
    right: 10,
    flexDirection: "row",
  },
  shapePendingContainer: {
    justifyContent: "center",
    alignItems: "center", // Center items horizontally
    backgroundColor: "red",
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  shapeContainer: {
    justifyContent: "center",
    alignItems: "center", // Center items horizontally
    backgroundColor: "#333333",
    height: 40,
    width: 40,
    borderRadius: 50,
    marginLeft: 5,
  },
  shapeText: {
    fontSize: 12, // Adjust font size as needed
    color: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  //refreshing
  refreshContainer: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: "7%",
    paddingTop: 10,
  },
  refreshText: {
    color: "#007bff",
    fontSize: 14,
  },
  refreshTime: {
    color: "#5E5E5E",
    fontSize: 12,
  },
});

export default Homepage;
