import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import ErrorModal from '../components/errorModal';
import Text from '../components/text';


const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const validateEmail = (input) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(input);
  };

  const handleEmailChange = (input) => {
    setEmail(input);
    setIsValidEmail(validateEmail(input));
  };

  const handleContinuePress = async () => {
    if (!isValidEmail) {
      setIsErrorModalVisible(true);
      setErrorModalMessage('Invalid Email Format. Please enter a valid email address.');
      return;
    }

    try {
      // Simulate sending reset password email (replace with your actual API call)
      // Navigate to password reset confirmation screen
      navigation.navigate('SetNewPasswordScreen', { email });
    } catch (error) {
      console.error('Error sending reset password email:', error);
      setIsErrorModalVisible(true);
      setErrorModalMessage('Failed to send reset password email. Please try again later.');
    }
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalVisible(false);
    setErrorModalMessage('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Forget/Change Password</Text>
      <Text style={styles.description}>
        Enter the email address associated with your account and we'll send
        you a link to reset your password.
      </Text>
      <View
        style={[
          styles.inputContainer,
          focusedInput === 'email' && styles.focusedInputContainer,
        ]}
      >
        <Image
          source={require('../images/email-logo.png')}
          style={[
            styles.inputIcon,
            { tintColor: email ? 'black' : 'lightgrey' },
          ]}
        />
        <TextInput
          style={[styles.input, { color: email ? 'black' : 'lightgrey' }]}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinuePress}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
      <ErrorModal
        isVisible={isErrorModalVisible}
        errorMessage={errorModalMessage}
        onClose={handleCloseErrorModal}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'flex-start',
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'left',
    color: 'black',
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 20,
    textAlign: 'left',
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
  },
  focusedInputContainer: {
    borderColor: 'black',
    borderWidth: 2,
  },
  inputIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Outfit-Regular', // Apply the global font family here
    fontWeight: "400",
  },
  continueButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ForgotPasswordScreen;
