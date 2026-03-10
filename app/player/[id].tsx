import { useLocalSearchParams } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { players } from "../../data/players";
import { useFavorites } from "../../hooks/useFavorites";
import {
    calculateFantasyScore,
    getTrendInfo,
} from "../../utils/fantasyScore";

export default function PlayerDetailScreen() {
    const { id } = useLocalSearchParams();
    const { isFavorite, toggleFavorite } = useFavorites();

    const player = players.find((item) => item.id === Number(id));

    if (!player) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Oyuncu bulunamadı</Text>
            </SafeAreaView>
        );
    }

    const fantasyScore = calculateFantasyScore(player).toFixed(1);
    const trend = getTrendInfo(player);
    const favorite = isFavorite(player.id);

    const trendLabel =
        Number(fantasyScore) >= 50
            ? "Elite"
            : Number(fantasyScore) >= 42
                ? "Strong"
                : "Solid";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerCard}>
                <View style={styles.headerTopRow}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.name}>{player.name}</Text>
                        <Text style={styles.team}>{player.team}</Text>

                        <View style={styles.badgesRow}>
                            <View style={styles.tagBox}>
                                <Text style={styles.tagText}>{trendLabel}</Text>
                            </View>

                            <View
                                style={[styles.trendBadge, { backgroundColor: trend.color }]}
                            >
                                <Text
                                    style={[
                                        styles.trendBadgeText,
                                        {
                                            color:
                                                trend.shortLabel === "STABLE" ? "#000000" : "#F6F4F1",
                                        },
                                    ]}
                                >
                                    {trend.label}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.headerRight}>
                        <Pressable
                            onPress={() => toggleFavorite(player.id)}
                            style={styles.favoriteButton}
                        >
                            <Text style={styles.favoriteIcon}>{favorite ? "★" : "☆"}</Text>
                        </Pressable>

                        <View style={styles.scoreBox}>
                            <Text style={styles.scoreLabel}>Fantasy</Text>
                            <Text style={styles.score}>{fantasyScore}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.last5Card}>
                <Text style={styles.last5Title}>Recent Form</Text>
                <View style={styles.last5Row}>
                    <Text style={styles.last5Label}>Last 5 Fantasy Avg</Text>
                    <Text style={styles.last5Value}>{player.last5Fantasy.toFixed(1)}</Text>
                </View>
                <View style={styles.last5Row}>
                    <Text style={styles.last5Label}>Season Fantasy Avg</Text>
                    <Text style={styles.last5Value}>{fantasyScore}</Text>
                </View>
            </View>

            <View style={styles.statsCard}>
                <Text style={styles.sectionTitle}>Season Stats</Text>

                <View style={styles.row}>
                    <StatItem label="PTS" value={player.pts} />
                    <StatItem label="REB" value={player.reb} />
                    <StatItem label="AST" value={player.ast} />
                </View>

                <View style={styles.row}>
                    <StatItem label="STL" value={player.stl} />
                    <StatItem label="BLK" value={player.blk} />
                    <StatItem label="TOV" value={player.tov} />
                </View>
            </View>
        </SafeAreaView>
    );
}

function StatItem({ label, value }: { label: string; value: number }) {
    return (
        <View style={styles.statBox}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        padding: 16,
    },
    errorText: {
        color: "#F6F4F1",
        fontSize: 18,
        fontWeight: "700",
    },
    headerCard: {
        backgroundColor: "#111111",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#222222",
        padding: 18,
    },
    headerTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerLeft: {
        flex: 1,
        paddingRight: 12,
    },
    headerRight: {
        alignItems: "flex-end",
    },
    name: {
        color: "#F6F4F1",
        fontSize: 26,
        fontWeight: "800",
    },
    team: {
        color: "#AAAAAA",
        fontSize: 15,
        marginTop: 6,
    },
    badgesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 14,
    },
    tagBox: {
        alignSelf: "flex-start",
        backgroundColor: "#1A1A1A",
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#222222",
    },
    tagText: {
        color: "#F95C4B",
        fontSize: 13,
        fontWeight: "700",
    },
    trendBadge: {
        alignSelf: "flex-start",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    trendBadgeText: {
        fontSize: 12,
        fontWeight: "800",
    },
    favoriteButton: {
        marginBottom: 10,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    favoriteIcon: {
        fontSize: 28,
        color: "#F95C4B",
        fontWeight: "800",
    },
    scoreBox: {
        backgroundColor: "#F95C4B",
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: "center",
        minWidth: 95,
    },
    scoreLabel: {
        color: "#F6F4F1",
        fontSize: 12,
        fontWeight: "700",
    },
    score: {
        color: "#F6F4F1",
        fontSize: 24,
        fontWeight: "800",
        marginTop: 2,
    },
    last5Card: {
        backgroundColor: "#111111",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#222222",
        padding: 18,
        marginTop: 16,
    },
    last5Title: {
        color: "#F6F4F1",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 12,
    },
    last5Row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    last5Label: {
        color: "#888888",
        fontSize: 14,
        fontWeight: "600",
    },
    last5Value: {
        color: "#F6F4F1",
        fontSize: 16,
        fontWeight: "800",
    },
    statsCard: {
        backgroundColor: "#111111",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#222222",
        padding: 18,
        marginTop: 16,
    },
    sectionTitle: {
        color: "#F6F4F1",
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 16,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    statBox: {
        width: "31%",
        backgroundColor: "#1A1A1A",
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
    },
    statValue: {
        color: "#F6F4F1",
        fontSize: 20,
        fontWeight: "800",
    },
    statLabel: {
        color: "#888888",
        fontSize: 12,
        fontWeight: "700",
        marginTop: 4,
    },
});