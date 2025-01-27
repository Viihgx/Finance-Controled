import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@/components/ui/select"
import { ChevronDownIcon } from "@/components/ui/icon";
import { Category } from "@/constants/Category";
import { Type } from "@/constants/Type";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Icon, EditIcon } from "@/components/ui/icon"

export default function ExpensesScreen() {
  const [transactions, setTransactions] = useState<TransactionsTypes>({
    id: '', category: '', type: '', amount: '', description: ''
  });
  const [loading, setLoading] = useState(false);
  const [ getTransactions, setGetTransactions ] = useState<TransactionsTypes[]>([]);
  const API_URL = "http://10.0.2.2:5000";

 useEffect(() => {
      fetchTransactionsData();
  }, []);

  const fetchTransactionsData = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const resp = await axios.get<TransactionsTypesResponse>(`${API_URL}/transactions/transctions-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetTransactions(resp.data.message);
      console.log('DataDispesas do usuarios', getTransactions)
    } catch (error) {
      console.error('Erro ao buscar dados de dispesas:', error);
    }
  };

  const handleAddSalario = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      await axios.post(`${API_URL}/transactions/add-value`, transactions , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!token) {
        Alert.alert("Erro", "Token de autenticação não encontrado.");
        return;
      };

      Alert.alert("Valor adicionado com sucesso!");
      console.log(transactions);
      setTransactions({id: '', category: '', type: '', amount: '', description: ''});
      console.log(transactions)
    } catch (error) {
      Alert.alert("Erro", "Erro ao adicionar valor");
      console.log("Noa foi possivel adicionar o valor", error);
    }
    setLoading(false);
  };

  // const handleNumberChange = (text) => {
  //   const numericValue = text.replace(/[^0-9]/g, "");
  //   setTransactions({ ...transactions, saldo_total: text}), {numericValue};
  // };

  return (
    <View style={styles.container}>
      <Text></Text>
      <Text>Valor</Text>
      {/* <TextInput
        placeholder="Adicione seu salário"
        style={styles.input}
        keyboardType="numeric"
        value={transactions.saldo_total}
        onChangeText={(text) => setTransactions({ ...transactions, saldo_total: text })}
      /> */}
      <Input
      variant="underlined"
      size="lg"
      isDisabled={false}
      isInvalid={false}
      isReadOnly={false}
    >
      <InputField placeholder="0.00" />
      <InputSlot>
        <InputIcon as={EditIcon}></InputIcon>
      </InputSlot>
    </Input>
       <Select
        selectedValue={transactions.category}
        onValueChange={(text) => setTransactions({...transactions, category: text})}
       >
        <SelectTrigger variant="rounded" size="lg">
          <SelectInput placeholder="Selecione uma categoria" />
          <SelectIcon className="" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {Category.map((items) => (    
              <SelectItem label={items.label} value={items.value} />
              ))
            }
          </SelectContent>
        </SelectPortal>
      </Select>
       <Select
        selectedValue={transactions.category}
        onValueChange={(text) => setTransactions({...transactions, category: text})}
       >
        <SelectTrigger variant="rounded" size="lg">
          <SelectInput placeholder="Selecione uma categoria" />
          <SelectIcon className="" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {Type.map((items) => (    
              <SelectItem label={items.label} value={items.value} />
              ))
            }
          </SelectContent>
        </SelectPortal>
      </Select>
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
    // justifyContent: "center",
    marginTop: 30,
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
