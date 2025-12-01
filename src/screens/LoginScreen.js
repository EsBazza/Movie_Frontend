import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Alert, 
    TouchableOpacity, 
    ActivityIndicator,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { apiEndpoints } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/Constants';
import styles from '../styles/LoginScreen.styles';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please enter both username and password.");
            return;
        }

        setLoading(true);
        try {
            const response = await apiEndpoints.auth.login(username, password);
            const accessToken = response.data?.access;
            
            if (accessToken) {
                signIn(accessToken);
            } else {
                Alert.alert("Login Failed", "No access token received.");
            }
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message || error);
            Alert.alert("Login Failed", "Invalid username or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND_DARK} />
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <Text style={styles.logoIcon}>🎬</Text>
                    <Text style={styles.title}>CINESTACK</Text>
                    <Text style={styles.subtitle}>Track your movie journey</Text>
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            placeholderTextColor={COLORS.TEXT_MUTED}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor={COLORS.TEXT_MUTED}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.button, loading && styles.buttonDisabled]} 
                        onPress={handleLogin} 
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.TEXT_LIGHT} />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
                        <Text style={styles.signupLink}> Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;