import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    label: string;
    value: string;
};

export default function StatPill({ label, value }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "31%",
        backgroundColor: "#171717",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#262626",
    },
    value: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
    },
    label: {
        color: "#a3a3a3",
        fontSize: 12,
        marginTop: 4,
    },
});