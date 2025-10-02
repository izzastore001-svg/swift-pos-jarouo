
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { colors, typography, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/(tabs)/(home)/');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Error', 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'cashier' | 'owner') => {
    if (role === 'cashier') {
      setEmail('cashier@pos.com');
      setPassword('cashier123');
    } else {
      setEmail('owner@pos.com');
      setPassword('owner123');
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <IconSymbol name="storefront" size={60} color={colors.primary} />
            </View>
            <Text style={[typography.h1, styles.title]}>POS System</Text>
            <Text style={[typography.bodySecondary, styles.subtitle]}>
              Sign in to your account
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[typography.caption, styles.label]}>Email</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[typography.caption, styles.label]}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[commonStyles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <IconSymbol
                    name={showPassword ? 'eye.slash' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[commonStyles.button, styles.loginButton, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={[commonStyles.buttonText, styles.loginButtonText]}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.demoSection}>
            <Text style={[typography.caption, styles.demoTitle]}>Demo Accounts</Text>
            <View style={styles.demoButtons}>
              <TouchableOpacity
                style={[styles.demoButton, { backgroundColor: colors.secondary }]}
                onPress={() => fillDemoCredentials('cashier')}
              >
                <IconSymbol name="person" size={20} color={colors.card} />
                <Text style={[typography.caption, styles.demoButtonText]}>Cashier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoButton, { backgroundColor: colors.accent }]}
                onPress={() => fillDemoCredentials('owner')}
              >
                <IconSymbol name="crown" size={20} color={colors.card} />
                <Text style={[typography.caption, styles.demoButtonText]}>Owner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  loginButton: {
    marginTop: 12,
    paddingVertical: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  demoSection: {
    alignItems: 'center',
  },
  demoTitle: {
    marginBottom: 16,
    fontWeight: '600',
    color: colors.text,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  demoButtonText: {
    color: colors.card,
    fontWeight: '600',
  },
});
