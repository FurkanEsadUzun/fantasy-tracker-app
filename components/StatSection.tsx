import React from "react";
import { StyleSheet, Text, View } from "react-native";
import StatPill from "./StatPill";

type Props = {
    title: string;
    items: { label: string; value: string }[];
};

export default function StatSection({ title, items }: Props) {
    return (
        <View style={styles.section}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.grid}>
                {items.map((item) => (
                    <StatPill
                        key={`${title}-${item.label}`}
                        label={item.label}
                        value={item.value}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginTop: 18,
        backgroundColor: "#0f0f0f",
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: "#1f1f1f",
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 14,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
});