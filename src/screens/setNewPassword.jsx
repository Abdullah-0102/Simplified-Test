import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Alert,
} from 'react-native';
import Text from '../components/text';


const SetNewPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params; // Extracting email from route params
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [passwordError, setPasswordError] = useState(''); // State for password error

  const handleResetPassword = () => {
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The passwords do not match. Please try again.');
      return;
    }

    // Check if passwords are at least 8 characters long
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    // Add your logic to handle resetting the password
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);

    // Show success modal
    setShowSuccessModal(true);
  };

  const handleModalClose = () => {
    // Navigate back to login or previous screen after modal is closed
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Forget/Change Password</Text>
      <Text style={styles.emailText}>You are changing the password for account:</Text>
      <View style={styles.emailContainer}>
        <Image
          source={require('../images/email-logo.png')}
          style={styles.emailLogo}
          resizeMode="contain"
        />
        <Text style={styles.email}>{email}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Image
          source={require('../images/pw-icon.png')}
          style={[
            styles.inputIcon,
            { tintColor: newPassword ? 'black' : 'lightgrey' },
          ]}
        />
        <TextInput
          style={[styles.input, { color: newPassword ? 'black' : 'lightgrey' }]}
          placeholder="New Password"
          placeholderTextColor="#999"
          secureTextEntry={!passwordVisible}
          value={newPassword}
          onChangeText={text => {
            setNewPassword(text);
            setPasswordError('');
          }}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Image
            source={
              !passwordVisible
                ? require('../images/eye.png')
                : require('../images/hide-eye.png')
            }
            style={styles.eyeIconImage}
          />
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}
      <View style={styles.inputContainer}>
        <Image
          source={require('../images/pw-icon.png')}
          style={[
            styles.inputIcon,
            { tintColor: confirmPassword ? 'black' : 'lightgrey' },
          ]}
        />
        <TextInput
          style={[styles.input, { color: confirmPassword ? 'black' : 'lightgrey' }]}
          placeholder="Confirm New Password"
          placeholderTextColor="#999"
          secureTextEntry={!passwordVisible}
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
            setPasswordError('');
          }}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Image
            source={
              !passwordVisible
                ? require('../images/eye.png')
                : require('../images/hide-eye.png')
            }
            style={styles.eyeIconImage}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetPassword}
      >
        <Text style={styles.resetButtonText}>Update</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('../images/tick.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.modalText}>Password changed successfully!</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalClose}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 45,
    textAlign: 'center',
    color: 'black',
  },
  emailText: {
    fontSize: 15,
    textAlign: 'left',
    color: 'gray',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emailLogo: {
    width: 17,  // Adjust size as needed
    height: 17, // Adjust size as needed
    marginRight: 5,
  },
  email: {
    color: 'black',
    fontWeight: '600',
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
  inputIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: 'Outfit-Regular', // Apply the global font family here
    fontWeight: "400",
  },
  icon: {
    padding: 3,
  },
  eyeIconImage: {
    width: 22,
    height: 22,
    tintColor: '#999',
  },
  resetButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Success Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  checkIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  modalButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default SetNewPasswordScreen;
