import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Redirect, router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Button,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error(error);
      Alert.alert(error.message);
      return;
    } else {
      router.replace('/(tabs)')
      console.log('Login realizado com sucesso')

    }
    setLoading(false);
    Alert.alert("Login realizado com sucesso!");
  }

  return (
    <View style={styles.Container}>
      <Text style={styles.Title}>Entre na sua conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        // keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
        autoCapitalize={"none"}
      />
      <LinearGradient
        colors={["rgba(253,206,223,1)", "rgba(105,98,173,1)"]} // Definindo as cores do gradiente
        start={{ x: 0, y: 0 }} // Definindo a posição inicial do gradiente
        end={{ x: 3, y: 1 }} // Definindo a posição final do gradiente
        style={styles.loginButton}
      >
        <TouchableOpacity>
          <Text
            disabled={loading}
            style={styles.loginButtonText}
            onPress={() => signInWithEmail()}
          >
            Entrar
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Esqueceu a senha?</Text>
        <Link href="/(tabs)" style={styles.signupLink}>
          Redefinir Senha
        </Link>
      </View>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Não tem uma conta?</Text>
        <Link href="/signup" style={styles.signupLink}>
          Criar conta
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 30,
  },
  Title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6962AD",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 45,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#111",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: "#FDCEDF",
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: "#666",
  },
  signupLink: {
    marginLeft: 5,
    color: "#6962AD",
    fontSize: 16,
    fontWeight: "bold",
  },
});
