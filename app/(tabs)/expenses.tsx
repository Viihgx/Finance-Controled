import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Expenses {
  categoria: string;
  saldo_total: string;
  tipo: string;
  valor_ganho: string;
  valor_gasto: string;
}

export default function ExpensesScreen() {
  const [ valorGasto, setValorGasto ] = useState<Expenses>()
  const [expenses, setExpenses] = useState<Expenses>({saldo_total: '', categoria: '', tipo: '', valor_ganho: '', valor_gasto: ''});
  const [loading, setLoading] = useState(false);
  const API_URL = "http://10.0.2.2:5000";

  const handleAddSalario = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      await axios.post(`${API_URL}/expenses/add-value`, expenses , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      };

      Alert.alert("Valor adicionado com sucesso!");
      console.log(expenses);
      setExpenses({saldo_total: '', categoria: '', tipo: '', valor_ganho: '', valor_gasto: ''});
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar o valor");
      console.log("Noa foi possivel adicionar o valor", error);
    }
    setLoading(false);
  };

  const handleNumberChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setExpenses({ ...expenses, saldo_total: text}), {numericValue};
  };

  return (
    <View style={styles.container}>
      <Text>Despesas Totais / Adicionar</Text>
      <TextInput
        placeholder="Adicione seu salário"
        style={styles.input}
        keyboardType="numeric"
        value={expenses.saldo_total}
        onChangeText={(text) => setExpenses({ ...expenses, saldo_total: text })}
      />
      <TextInput
        placeholder="Valor gasto"
        style={styles.input}
        keyboardType="numeric"
        value={expenses.valor_gasto}
        onChangeText={(text) => setExpenses({ ...expenses, valor_gasto: text })}
      />
      <TextInput
        placeholder="Valor Ganho"
        style={styles.input}
        keyboardType="numeric"
        value={expenses.valor_ganho}
        onChangeText={(text) => setExpenses({ ...expenses, valor_ganho: text })}
      />
      <LinearGradient
        colors={["rgba(253,206,223,1)", "rgba(105,98,173,1)"]} // Definindo as cores do gradiente
        start={{ x: 0, y: 0 }} // Definindo a posição inicial do gradiente
        end={{ x: 3, y: 1 }} // Definindo a posição final do gradiente
        style={styles.button}
      >
        <TouchableOpacity>
          <Text 
          style={styles.buttonText} 
          onPress={handleAddSalario}
          disabled={loading}
          >
            Salvar
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 30,
  },
  input: {
    height: 45,
    backgroundColor: "#ffffff",
    borderRadius: 10,
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
  button: {
    backgroundColor: "#FDCEDF",
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
