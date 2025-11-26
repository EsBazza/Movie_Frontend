import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Alert, 
    StyleSheet, 
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND_DARK,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    
    // Logo Section
    logoSection: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: COLORS.PRIMARY_ACCENT,
        letterSpacing: 4,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.TEXT_MUTED,
        letterSpacing: 1,
    },

    // Form Section
    formSection: {
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.TEXT_LIGHT,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        height: 54,
        backgroundColor: COLORS.CARD_DARK,
        color: COLORS.TEXT_LIGHT,
        paddingHorizontal: 18,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: COLORS.CARD_DARK,
    },
    button: {
        backgroundColor: COLORS.PRIMARY_ACCENT,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
        shadowColor: COLORS.PRIMARY_ACCENT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: COLORS.TEXT_LIGHT,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.TEXT_MUTED,
        fontSize: 15,
    },
    signupLink: {
        color: COLORS.PRIMARY_ACCENT,
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default LoginScreen;