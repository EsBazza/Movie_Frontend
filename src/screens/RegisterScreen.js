import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Alert, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { apiEndpoints } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/Constants';
import styles from '../styles/RegisterScreen.styles';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const validateForm = () => {
    if (!username.trim()) {
      Alert.alert("Validation Error", "Username is required.");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Validation Error", "Email is required.");
      return false;
    }
    if (!password) {
      Alert.alert("Validation Error", "Password is required.");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Validation Error", "Password must be at least 8 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Step 1: Register the user
      const registerResponse = await apiEndpoints.auth.register(
        username.trim(),
        email.trim(),
        password
      );

      if (registerResponse.status === 201 || registerResponse.status === 200) {
        // Step 2: Auto-login after successful registration
        try {
          const tokenResp = await apiEndpoints.auth.login(username.trim(), password);
          const accessToken = tokenResp.data?.access;
          if (accessToken) {
            signIn(accessToken);
            return;
          }
        } catch (tokenErr) {
          console.warn('Auto-login after register failed:', tokenErr.response?.data || tokenErr.message);
        }

        // Fallback: Navigate to login
        Alert.alert("Success", "Account created successfully! Please sign in.");
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      
      if (error.response?.status === 400) {
        const errors = error.response.data;
        if (errors.username) {
          Alert.alert("Registration Failed", `Username: ${errors.username[0]}`);
        } else if (errors.email) {
          Alert.alert("Registration Failed", `Email: ${errors.email[0]}`);
        } else if (errors.password) {
          Alert.alert("Registration Failed", `Password: ${errors.password[0]}`);
        } else {
          Alert.alert("Registration Failed", "Please check your input and try again.");
        }
      } else {
        Alert.alert("Registration Failed", "Could not create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.logoIcon}>🎬</Text>
          <Text style={styles.title}>CINESTACK</Text>
          <Text style={styles.subtitle}>Create your account</Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              placeholderTextColor={COLORS.TEXT_MUTED}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={COLORS.TEXT_MUTED}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 8 characters"
              placeholderTextColor={COLORS.TEXT_MUTED}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              placeholderTextColor={COLORS.TEXT_MUTED}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onSubmitEditing={handleRegister}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister} 
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.TEXT_LIGHT} />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;