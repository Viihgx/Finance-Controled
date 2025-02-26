import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Card from "@/components/card";
import * as SecureStore from "expo-secure-store";
import { router, useFocusEffect } from "expo-router";
import axios from "axios";
import { TransactionsTypes, TransactionsTypesResponse } from "@/types/transactions.types";

export default function HomeScreen() {
  const currentyDate = new Date();
  const [ userName, setUserName ] = useState<string>('');
  const [ getTransactions, setGetTransactions ] = useState<TransactionsTypes[]>([]);
  const API_URL = 'http://10.0.2.2:5000';
  const sumData = getTransactions.reduce((acc, trans) => {
    if (trans.type === "income") return acc + Number(trans.amount);
    if (trans.type === "expense") return acc - Number(trans.amount);
    return acc;
  }, 0);

  useEffect(() => {
      fetchUserData();
      fetchDataSum();
      console.log('Dispesas do usuario', getTransactions)
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado");
          router.push("/");
          return;
        }
        
        const userResponse = await axios.get(`${API_URL}/user/user-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUserName(userResponse.data.nome);
        console.log('nome:', userName)
        
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
      }
    }

  const fetchDataSum = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const resp = await axios.get<TransactionsTypesResponse>(`${API_URL}/transactions/transctions-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetTransactions(resp.data.message);
      console.log('Dispesas do usuarios', getTransactions)
    } catch (error) {
      console.error('Erro ao buscar dados de dispesas:', error);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    Alert.alert('Sucesso', 'Token removido com sucesso!');
    router.push('/');
  };

  return (
    <LinearGradient
      colors={["rgba(253,206,223,1)", "rgba(105,98,173,1)"]}
      start={{ x: 0, y: 0 }} // Definindo a posição inicial do gradiente
      end={{ x: 3, y: 1 }} // Definindo a posição final do gradiente
      style={styles.container}
      >
      <View style={styles.header}>
        <View style={styles.topHeader}>
            <Text>{userName}</Text>
            <TouchableOpacity>
              <Text style={styles.buttonText} onPress={handleLogout}>Sair</Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.subtileHeader}>
          {currentyDate.toLocaleDateString("pt-BR")}
        </Text>
            <Text style={styles.titleHeader}>{sumData.toFixed(2)}</Text>
        <View style={styles.divider} />
        <View style={styles.infoCalculated}>
          <View style={styles.containerGraph}>
          </View>
          <Text style={styles.subtileHeader}>Dinheiro sobrando / total</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.cardsContainer}>
          <Card content={<Text>Cartoão de Crédito</Text>} />
          <Card content={<Text>Lazer</Text>} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  titleHeader: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "800",
  },
  subtileHeader: {
    fontSize: 14,
    color: "#919396",
    fontWeight: "400",
  },
  header: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  topHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCalculated: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  containerGraph: {
    // width: '50%',
  },
  content: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "#F6F6F6",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
  },
  divider: {
    borderBottomColor: "rgba(184, 184, 184, 0.9)",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});
