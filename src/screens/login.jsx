import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Text from '../components/text';
import api from '../components/api';

import { AuthContext } from '../contexts/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const { login } = useContext(AuthContext);

  const navigation = useNavigation();

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreen');
  };

  const validateEmail = (input) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(input);
  };

  const handleEmailChange = (input) => {
    setEmail(input);
    setIsValidEmail(validateEmail(input));
  };

  const handleLogin = async () => {
    setLoading(true); // Start loading
    try {
      const response = await api.post('/login/app', new URLSearchParams({
        email,
        password,
      }));
  
      console.log('Email: ', email);
      console.log('Password: ', password);
      // console.log('Response:', response.data);
  
      if (response.data.success) {
        login(response.data);
        navigation.navigate('HomePage');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login Failed', 'An error occurred. Please try again.');
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Login to your Account 👋</Text>
        <Text style={styles.subtitle}>
          Connectez-vous à votre compte.
        </Text>
      </View>

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

      {email.length > 0 && !isValidEmail && (
        <Text style={styles.errorText}>Invalid Email Format!</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          focusedInput === 'password' && styles.focusedInputContainer,
        ]}
      >
        <Image
          source={require('../images/pw-icon.png')}
          style={[
            styles.inputIcon,
            { tintColor: password ? 'black' : 'lightgrey' },
          ]}
        />
        <TextInput
          style={[styles.input, { color: password ? 'black' : 'lightgrey' }]}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput(null)}
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
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Log in</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forget/Change password?</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don't have an account? Contact your manager to help you get set up.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 5,
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Outfit-Bold',
  },
  subtitle: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    color: 'gray',
    textAlign: 'left',
    fontWeight: '400',
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
    fontFamily: 'Outfit-Regular',
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
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center', // Center the content in the button
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPassword: {
    color: 'grey',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  footerText: {
    color: 'black',
    textAlign: 'center',
    marginTop: 100,
  },
  errorText: {
    color: 'red',
    textAlign: 'left',
    marginBottom: 4,
  },
});

export default Login;
