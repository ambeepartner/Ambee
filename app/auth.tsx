import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Layout } from "@/constants/Layout";

// Firebase
import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function AuthScreen() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 SIGN-IN / SIGN-UP HANDLER
  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // 🔐 SIGN-IN FLOW
        await signInWithEmailAndPassword(auth, email.trim(), password);
        Alert.alert("Welcome!", "Login successful.");
        router.replace("/(tabs)");
      } else {
        // 🧾 SIGN-UP FLOW
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        const user = userCredential.user;

        // 🗃️ Store user info in Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date(),
        });

        Alert.alert(
          "Account Created",
          "Your account has been created successfully. Please sign in."
        );

        // Switch back to login mode instead of opening app
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
  console.error("email auth error:", error);

  // 🔍 Custom Firebase Error Messages
  switch (error.code) {
    case "auth/email-already-in-use":
      Alert.alert("Email Already Used", "Please sign in instead.");
      break;
    case "auth/invalid-email":
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      break;
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      Alert.alert("Login Failed", "Invalid email or password.");
      break;
    case "auth/weak-password":
      Alert.alert(
        "Weak Password",
        "Password should be at least 6 characters long."
      );
      break;
    case "auth/network-request-failed":
      Alert.alert("Network Error", "Please check your internet connection.");
      break;
    default:
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Try again."
      );
      break;
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔁 RESET PASSWORD HANDLER
  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Reset Password", "Enter your email to receive reset link");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert("Email sent", "Please check your inbox for reset instructions.");
    } catch (err: any) {
      console.error("reset password error:", err);
      Alert.alert("Failed to send reset email", err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>✨</Text>
            <Text style={styles.title}>Welcome to Ambee</Text>
            <Text style={styles.subtitle}>
              {isLogin ? "Sign in to continue" : "Create your account"}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={Colors.textLight}
              />
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholderTextColor={Colors.textLight}
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.authButtonText}>
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.linkText}>
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Text style={styles.linkTextBold}>
                  {isLogin ? "Sign Up" : "Sign In"}
                </Text>
              </Text>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleResetPassword}
              >
                <Text style={styles.linkText}>Forgot password?</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- STYLES BELOW (unchanged) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Layout.spacing.lg,
  },
  header: {
    alignItems: "center",
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing["2xl"],
  },
  logo: {
    fontSize: 60,
    marginBottom: Layout.spacing.md,
  },
  title: {
    fontSize: Fonts["3xl"],
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: Layout.spacing.lg,
  },
  label: {
    fontSize: Fonts.base,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    fontSize: Fonts.base,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkButton: {
    alignItems: "center",
    marginTop: Layout.spacing.md,
  },
  linkText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
  },
  linkTextBold: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  authButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    alignItems: "center",
    marginTop: Layout.spacing.lg,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    fontSize: Fonts.lg,
    fontWeight: "bold",
    color: Colors.white,
  },
});

