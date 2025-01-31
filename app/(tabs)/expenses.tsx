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
import { TransactionsTypes, TransactionsTypesResponse } from "@/types/transactions.types";

export default function ExpensesScreen() {
  // const [transactions, setTransactions] = useState<TransactionsTypes>({
  //   id: '', category: '', type: '', amount: '', description: ''
  // });
  const [activeTab, setActiveTab] = useState(""); 
  const [formData, setFormData] = useState<TransactionsTypes>({
    title: "",
    amount: "",
    category: "",
    description: "",
    type: ""
  });
  const [loading, setLoading] = useState(false);
  const API_URL = "http://10.0.2.2:5000";

  const handleTabChange = (type) => {
    setActiveTab(type);
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.category) {
      Alert.alert("Por favor preencha todos os campos obrigatorios!");
      return;
    }

    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync("userToken");

      await axios.post<TransactionsTypesResponse>(`${API_URL}/transactions/add`, 
        {
          ...formData,
          type: activeTab
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      };

      Alert.alert("Sucesso", "Transação adicionada com sucesso!");
      setFormData({ title: "", amount: "", category: "", description: "", type: "" });
    } catch (error) {
        console.error("Erro ao adicionar transação:", error);
        Alert.alert("Erro", "Não foi possível adicionar a transação");
      } finally {
        setLoading(false);
      }
  };

  return (
   <View style={styles.container}>
         <View style={styles.tabs}>
           <TouchableOpacity
             style={[
               styles.tabButton,
               activeTab === "income" && styles.activeTab,
             ]}
             onPress={() => {
              handleTabChange("income")
            }}
           >
             <Text style={styles.tabText}>Receita</Text>
           </TouchableOpacity>
           <TouchableOpacity
             style={[
               styles.tabButton,
               activeTab === "expense" && styles.activeTab,
             ]}
             onPress={() => handleTabChange("expense")}
           >
             <Text style={styles.tabText}>Despesa</Text>
           </TouchableOpacity>
         </View>

          {/* FORM */}
         <View style={styles.form}>
          <View style={styles.containerValue}>
            <Text style={styles.inputTextValue}>Valor</Text>
            <TextInput
              style={styles.inputValue}
              placeholder="R$ 0.00"
              keyboardType="numeric"
              value={formData.amount}
              onChangeText={(text) =>
                setFormData({ ...formData, amount: text })
              }
            />
          </View>
          <Text style={styles.inputText}>Titulo</Text>
           <TextInput
             style={styles.input}
             placeholder="Título"
             value={formData.title}
             onChangeText={(text) =>
               setFormData({ ...formData, title: text })
             }
           />
          <Text style={styles.inputText}>Descrição</Text>
           <TextInput
               style={styles.input}
               placeholder="Descrição (opcional)"
               value={formData.description}
               onChangeText={(text) =>
                 setFormData({ ...formData, description: text })
              }
           />
          <Text style={styles.inputText}>Categoria</Text>
           <TextInput
             style={styles.input}
             placeholder="Categoria (ex: Lazer ou Contas)"
             value={formData.category}
             onChangeText={(text) =>
               setFormData({ ...formData, category: text })
             }
           />
           <LinearGradient
              colors={["rgba(253,206,223,1)", "rgba(105,98,173,1)"]} // Definindo as cores do gradiente
              start={{ x: 0, y: 0 }} // Definindo a posição inicial do gradiente
              end={{ x: 3, y: 1 }} // Definindo a posição final do gradiente
              style={styles.submitButton}
          >
           <TouchableOpacity
             onPress={handleSubmit}
             disabled={loading}
             >
             <Text style={styles.submitButtonText}>
               {loading ? "Salvando..." : "Salvar"}
             </Text>
           </TouchableOpacity>
             </LinearGradient>
         </View>
       </View>
     );
   }
   
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: "#F6F6F6",
      //  padding: 20,
       paddingTop: 50,
     },
     tabs: {
       flexDirection: "row",
       justifyContent: "center",
       marginBottom: 20,
     },
     tabButton: {
       padding: 10,
       borderRadius: 20,
       backgroundColor: "#F6F6F6",
       paddingHorizontal: 50,
      //  marginHorizontal: 5,
     },
     activeTab: {
       backgroundColor: 'rgba(253,206,223,1)", "rgba(105,98,173,1)',
     },
     tabText: {
       color: "#777777",
       fontWeight: "bold",
     },
     form: {
       backgroundColor: "#fff",
       padding: 20,
       borderTopEndRadius: 50,
       borderTopStartRadius: 50,
       borderRadius: 10,
     },
     containerValue: {
       backgroundColor: "#fff",
       padding: 20,
       paddingHorizontal: 30,
       alignContent: 'center',
       justifyContent: 'center',
     },
     inputTextValue: {
      marginLeft: 11,
      fontSize: 16,
      fontWeight: "500",
      color: "#777777",
      marginBottom: 4,
     },
     inputValue: {
       height: 52,
       borderRadius: 20,
       paddingHorizontal: 15,
       fontSize: 25,
       marginBottom: 15,
       borderWidth: 1,
       borderColor: "#ddd",
     },
     input: {
       height: 45,
       backgroundColor: "#F6F6F6",
       borderRadius: 20,
       paddingHorizontal: 15,
       fontSize: 15,
       marginBottom: 15,
       borderWidth: 1,
       borderColor: "#ddd",
     },
     inputText: {
      marginLeft: 10,
      fontSize: 14,
      fontWeight: "500",
      color: "#777777",
      marginBottom: 4,
     },
     submitButton: {
       backgroundColor: "#007BFF",
       paddingVertical: 10,
       borderRadius: 20,
       alignItems: "center",
     },
     submitButtonText: {
       color: "#fff",
       fontSize: 16,
       fontWeight: "bold",
     },
   });