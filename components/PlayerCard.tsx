import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PlayerListItem } from "../types/nba";

type Props = {
    player: PlayerListItem;
    isFavorite: boolean;
    onToggleFavorite: () => void;
};
const perGame = (value?: number, games?: number, digits = 1) => {
    if (
        value === undefined ||
        value === null ||
        games === undefined ||
        games === null ||
        games === 0
    ) {
        return "-";
    }

    return (value / games).toFixed(digits);
};
export default function PlayerCard({ player, isFavorite, onToggleFavorite }: Props) {
    return (
        <Pressable
            style={styles.card}
            onPress={() => router.push(`/player/${player.id}`)}
        >
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{player.name}</Text>
                    <Text style={styles.meta}>
                        {player.team} • {player.position}
                    </Text>
                </View>

                <Pressable style={styles.favoriteButton} onPress={onToggleFavorite}>
                    <Text style={styles.favoriteText}>{isFavorite ? "★" : "☆"}</Text>
                </Pressable>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{perGame(player.points, player.games)}</Text>
                    <Text style={styles.statLabel}>PPG</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{perGame(player.rebounds, player.games)}</Text>
                    <Text style={styles.statLabel}>RPG</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{perGame(player.assists, player.games)}</Text>
                    <Text style={styles.statLabel}>APG</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{perGame(player.fantasyScore, player.games)}</Text>
                    <Text style={styles.statLabel}>FPG</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#111111",
        borderColor: "#242424",
        borderWidth: 1,
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    name: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
    },
    meta: {
        color: "#9ca3af",
        marginTop: 4,
        fontSize: 13,
    },
    favoriteButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#1a1a1a",
        alignItems: "center",
        justifyContent: "center",
    },
    favoriteText: {
        color: "#facc15",
        fontSize: 20,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statBox: {
        width: "23%",
        backgroundColor: "#171717",
        borderRadius: 14,
        paddingVertical: 10,
        alignItems: "center",
    },
    statValue: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "800",
    },
    statLabel: {
        color: "#888",
        marginTop: 4,
        fontSize: 11,
    },
});