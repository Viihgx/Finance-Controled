import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useRouter } from "expo-router";
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
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = 'http://10.0.2.2:5000';

  // const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const data = await axios.post(`${API_URL}/api/login`, { email, senha });
      console.log(data.data.message)
        // Armazenando o token JWT 
         await SecureStore.setItemAsync('userToken', data.data.token);
        Alert.alert('Login realizado com sucesso!');
        router.push('/(tabs)');
    } catch (error: any) {
      console.error('Erro no login', error)
      Alert.alert('Erro no cadastro', error.data?.data?.error || error.message || 'Erro desconhecido');
    };
    setLoading(false);
  };

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
        onChangeText={(text) => setSenha(text)}
        value={senha}
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
            onPress={handleSignIn}
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
