import React, { useState, useContext, useRef } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Text from "../components/text";
import { useNavigation } from "@react-navigation/native";
import Video from 'react-native-video';
import { UserContext } from '../contexts/userContext';
import { ScrollView } from "react-native-gesture-handler";

const HowItWorks = () => {
  const navigation = useNavigation();
  const [isPlaying, setIsPlaying] = useState(false);
  const { isFirstTimeUser, setIsFirstTimeUser, loading } = useContext(UserContext);
  const videoRef = useRef(null); // Create a reference for the video player

  const handleBackPress = () => {
    navigation.navigate('HomePage');
  };

  const handleForwardPress = () => {
    setIsFirstTimeUser(false);
    navigation.navigate('Login');
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false); // Pause the video
    } else {
      if (videoRef.current) {
        videoRef.current.seek(0); // Reset video to the start
      }
      setIsPlaying(true); // Play the video
    }
  };

  const navigateToGetHelp = () => {
    navigation.navigate('GetHelp'); // Navigate to the GetHelp screen
  };

  const handleVideoEnd = () => {
    setIsPlaying(false); // Show the play button again when the video ends
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {isFirstTimeUser ? (
          <TouchableOpacity onPress={handleForwardPress}>
            <Text style={styles.subtitle}>Dismiss</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleBackPress}>
            <Image
              style={styles.backIcon}
              resizeMode="cover"
              source={require("../images/back-arrow.png")}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>How It Works</Text>
        {!isFirstTimeUser && (
          <TouchableOpacity onPress={navigateToGetHelp}>
            <Text style={styles.subtitle}>Get Help</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView>
        <Step
          stepNumber="01"
          title="Choose Location"
          description="Select the GPS store locator and verify store"
          separatorPosition="top"
        />
        <Step
          stepNumber="02"
          title="Choose Survey"
          description="Select the survey you want to complete first"
          separatorPosition="middle"
        />
        <Step
          stepNumber="03"
          title="Fill Survey"
          description="Fill the survey and Hit Submit!"
          separatorPosition="bottom"
        />
        <View style={styles.deviceContainer}>
          <Image
            style={styles.deviceImage}
            resizeMode="contain"
            source={require("../images/device.png")}
          />
          <TouchableOpacity
            style={styles.deviceScreen}
            onPress={handlePlayPause}
          >
            <Video
              source={require("../images/video.mp4")}
              ref={videoRef} // Reference to the video player
              style={styles.insidePicture}
              paused={!isPlaying}
              resizeMode="cover"
              onEnd={handleVideoEnd} // Handle video end event
            />
            {!isPlaying && (
              <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
                <Image
                  style={styles.playIcon}
                  resizeMode="cover"
                  source={require("../images/play.png")}
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const Step = ({ stepNumber, title, description, separatorPosition }) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepRow}>
        <View style={styles.iconContainer}>
          <Image
            style={styles.circleIcon}
            resizeMode="cover"
            source={require("../images/white-circle.png")}
          />
          <Image
            style={styles.circleIcon2}
            resizeMode="cover"
            source={require("../images/blue-circle.png")}
          />
          <Text style={styles.stepNumber}>{stepNumber}</Text>
          {separatorPosition !== 'top' && (
            <View style={styles.separator} />
          )}
        </View>
        <View style={styles.stepDescription}>
          <Text style={styles.stepTitle}>{title}</Text>
          <Text style={styles.stepText}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE",
    paddingTop: 15,
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
    color: "#000",
    fontFamily: "Outfit-Medium",
    textAlign: "center",
    marginLeft: 15,
  },
  subtitle: {
    fontSize: 15,
    color: "#000000",
    fontFamily: "Outfit-Regular",
    textAlign: "center",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 15,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 55,
    height: 55,
    position: "relative",
    alignItems: "center",
  },
  circleIcon: {
    width: 55,
    height: 55,
  },
  circleIcon2: {
    width: 45,
    height: 45,
    position: "absolute",
    top: 5,
    left: 5,
  },
  stepNumber: {
    fontFamily: "Inter-Bold",
    fontSize: 17,
    color: "#FFF",
    position: "absolute",
    top: 14,
    left: 17,
  },
  stepDescription: {
    marginLeft: 20,
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Outfit-Medium",
  },
  stepText: {
    marginTop: 5,
    fontSize: 13,
    color: "#000",
    fontFamily: "Outfit-Regular",
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: "#D3D3D3",
    position: "absolute",
    top: -35,
  },
  deviceContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    position: "relative",
  },
  deviceImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 350 / 450,
  },
  deviceScreen: {
    position: "absolute",
    top: "1.4%",
    left: "21.2%",
    width: "57.5%", 
    height: "97%", 
    borderRadius: 33,
    overflow: "hidden",

  },
  insidePicture: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    width: 50,
    height: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HowItWorks;
