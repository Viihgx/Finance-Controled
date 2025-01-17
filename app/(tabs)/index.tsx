import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import Card from '@/components/card';
import { PieChart } from 'react-native-chart-kit';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export default function HomeScreen() {
  const [session, setSession] = useState<Session | null>(null)
  const currentyDate = new Date();

  const data = [
    {
      name: "Seoul",
      population: 21500,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Toronto",
      population: 2800,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
  ]

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // const screenWidth = Dimensions.get("window").width; // Para o grafico

  return (
    <LinearGradient 
      colors={['rgba(253,206,223,1)', 'rgba(105,98,173,1)']} 
      start={{ x: 0, y: 0 }} // Definindo a posição inicial do gradiente
      end={{ x: 3, y: 1 }}   // Definindo a posição final do gradiente
      style={styles.container}
    >
      <View style={styles.header}>
      {session && session.user && <Text>{session.user.id}</Text>}
        <Text style={styles.subtileHeader}>{currentyDate.toLocaleDateString('pt-BR')}</Text>
        <Text style={styles.titleHeader}>R$ 100,0</Text>
        <View style={styles.divider} />
        <View style={styles.infoCalculated }>
          <View style={styles.containerGraph}>
            <PieChart
                data={data}
                width={250}
                height={100}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"0"}
                center={[0, 0]}
                absolute
              />
          </View>
          <Text style={styles.subtileHeader}>Dinheiro sobrando / total</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.cardsContainer}>
          <Card content={<Text>Contas</Text>}/>
          <Card content={<Text>Lazer</Text>}/>
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
    color: '#fff',
    fontWeight: '800',
  },
  subtileHeader: {
    fontSize: 14,
    color: '#919396',
    fontWeight: '400',
  },
  header: {
    backgroundColor: 'transparent', 
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  infoCalculated: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  containerGraph: {
    // width: '50%',
  },
  content: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F6F6F6',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center'
  },
  divider: {
    borderBottomColor: 'rgba(184, 184, 184, 0.9)',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});
