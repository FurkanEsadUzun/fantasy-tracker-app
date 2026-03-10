import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { calculateFantasyScore, getTrendInfo } from "../utils/fantasyScore";

type Player = {
    id: number;
    name: string;
    team: string;
    pts: number;
    reb: number;
    ast: number;
    stl: number;
    blk: number;
    tov: number;
    last5Fantasy: number;
};

export default function PlayerCard({
    player,
    isFavorite,
    onToggleFavorite,
}: {
    player: Player;
    isFavorite: boolean;
    onToggleFavorite: (id: number) => void;
}) {
    const fantasyScore = calculateFantasyScore(player).toFixed(1);
    const trend = getTrendInfo(player);

    return (
        <Pressable
            style={styles.card}
            onPress={() =>
                router.push({
                    pathname: "/player/[id]",
                    params: { id: String(player.id) },
                })
            }
        >
            <View style={styles.topRow}>
                <View style={styles.leftTop}>
                    <Text style={styles.name}>{player.name}</Text>
                    <Text style={styles.team}>{player.team}</Text>

                    <View style={[styles.trendBadge, { backgroundColor: trend.color }]}>
                        <Text
                            style={[
                                styles.trendBadgeText,
                                { color: trend.shortLabel === "STABLE" ? "#000000" : "#F6F4F1" },
                            ]}
                        >
                            {trend.label}
                        </Text>
                    </View>
                </View>

                <View style={styles.rightTop}>
                    <Pressable
                        onPress={() => onToggleFavorite(player.id)}
                        style={styles.favoriteButton}
                    >
                        <Text style={styles.favoriteIcon}>{isFavorite ? "★" : "☆"}</Text>
                    </Pressable>

                    <View style={styles.scoreBox}>
                        <Text style={styles.score}>{fantasyScore}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.statsRow}>
                <Stat label="PTS" value={player.pts} />
                <Stat label="REB" value={player.reb} />
                <Stat label="AST" value={player.ast} />
                <Stat label="STL" value={player.stl} />
                <Stat label="BLK" value={player.blk} />
                <Stat label="TOV" value={player.tov} />
            </View>

            <View style={styles.last5Row}>
                <Text style={styles.last5Label}>Last 5 Fantasy Avg</Text>
                <Text style={styles.last5Value}>{player.last5Fantasy.toFixed(1)}</Text>
            </View>
        </Pressable>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <View style={styles.statBox}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#111111",
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#222222",
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    leftTop: {
        flex: 1,
        paddingRight: 12,
    },
    name: {
        color: "#F6F4F1",
        fontSize: 20,
        fontWeight: "800",
    },
    team: {
        color: "#AAAAAA",
        marginTop: 4,
        fontSize: 14,
    },
    trendBadge: {
        alignSelf: "flex-start",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginTop: 10,
    },
    trendBadgeText: {
        fontSize: 11,
        fontWeight: "800",
    },
    scoreBox: {
        backgroundColor: "#F95C4B",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        minWidth: 78,
    },
    score: {
        color: "#F6F4F1",
        fontSize: 22,
        fontWeight: "800",
    },
    statsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    statBox: {
        width: "30%",
        backgroundColor: "#1A1A1A",
        borderRadius: 14,
        paddingVertical: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    statValue: {
        color: "#F6F4F1",
        fontSize: 18,
        fontWeight: "800",
    },
    statLabel: {
        color: "#888888",
        fontSize: 12,
        marginTop: 2,
        fontWeight: "600",
    },
    last5Row: {
        marginTop: 4,
        paddingTop: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    last5Label: {
        color: "#888888",
        fontSize: 13,
        fontWeight: "600",
    },
    last5Value: {
        color: "#F6F4F1",
        fontSize: 15,
        fontWeight: "800",
    },
    rightTop: {
        alignItems: "flex-end",
    },

    favoriteButton: {
        marginBottom: 8,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },

    favoriteIcon: {
        fontSize: 24,
        color: "#F95C4B",
        fontWeight: "800",
    },
});