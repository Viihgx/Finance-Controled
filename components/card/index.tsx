import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
    content: ReactNode;
}

export default function Card({ content }: Props) {
    return (
        <View style={styles.card}>
            {content}
        </View>
    )
};

const styles = StyleSheet.create({
    card: {
        justifyContent: "center",
        alignItems: "center",
        width: 150,
        height: 140,
        borderRadius: 20,
        backgroundColor: "#fff"
    }
})