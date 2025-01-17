import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, AppState, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignupScreen() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ loading, setLoading ] = useState(false);

    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error
        } = await supabase.auth.signUp({
            email: email,
            password: password,
          })
          if (error) Alert.alert(error.message)
            if (!session) Alert.alert('Please check your inbox for email verification!')
            setLoading(false)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro</Text>
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
                autoCapitalize={'none'}
            />
            <LinearGradient 
                colors={['rgba(253,206,223,1)', 'rgba(105,98,173,1)']} // Definindo as cores do gradiente
                start={{ x: 0, y: 0 }} // Definindo a posição inicial do gradiente
                end={{ x: 3, y: 1 }}   // Definindo a posição final do gradiente
                style={styles.loginButton}
            >
                <TouchableOpacity>
                    <Text disabled={loading} style={styles.loginButtonText} onPress={() => signUpWithEmail()}>Cadastrar</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F6F6F6',
        paddingHorizontal: 30
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#6962AD',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        height: 45,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#111',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
      loginButton: {
        backgroundColor: '#FDCEDF',
        paddingVertical: 10,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 10,
      },
      loginButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
      },
})