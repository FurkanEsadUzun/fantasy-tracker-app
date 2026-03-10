import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import StatSection from "../../components/StatSection";
import { usePlayerDetail } from "../../hooks/usePlayerDetail";
import { formatStat } from "../../utils/fantasyScore";

export default function PlayerDetailPage() {
    const params = useLocalSearchParams<{ id: string }>();
    const playerId = Array.isArray(params.id) ? params.id[0] : params.id;

    const { player, loading, error } = usePlayerDetail(playerId ?? "");
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
    if (loading) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.helperText}>Oyuncu detayları yükleniyor...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !player) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.center}>
                    <Text style={styles.errorText}>{error ?? "Oyuncu bulunamadı"}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.hero}>
                    <Text style={styles.name}>{player.name}</Text>
                    <Text style={styles.meta}>
                        {player.team} • {player.position}
                        {player.age ? ` • ${player.age} yaş` : ""}
                    </Text>

                    <View style={styles.heroStats}>
                        <View style={styles.heroCard}>
                            <Text style={styles.heroValue}>{perGame(player.points, player.games)}</Text>
                            <Text style={styles.heroLabel}>PPG</Text>
                        </View>
                        <View style={styles.heroCard}>
                            <Text style={styles.heroValue}>{perGame(player.rebounds, player.games)}</Text>
                            <Text style={styles.heroLabel}>RPG</Text>
                        </View>
                        <View style={styles.heroCard}>
                            <Text style={styles.heroValue}>{perGame(player.assists, player.games)}</Text>
                            <Text style={styles.heroLabel}>APG</Text>
                        </View>
                        <View style={styles.heroCard}>
                            <Text style={styles.heroValue}>
                                {perGame(player.fantasyScore, player.games)}
                            </Text>
                            <Text style={styles.heroLabel}>FPG</Text>
                        </View>
                    </View>
                </View>

                <StatSection
                    title="Genel"
                    items={[
                        { label: "Yaş", value: formatStat(player.age, 0) },
                        { label: "Maç", value: formatStat(player.games, 0) },
                        { label: "İlk 5", value: formatStat(player.gamesStarted, 0) },
                        { label: "Dakika", value: formatStat(player.minutes, 0) },
                        { label: "Top Kaybı", value: formatStat(player.turnovers, 0) },
                        { label: "Faul", value: formatStat(player.fouls, 0) },
                    ]}
                />

                <StatSection
                    title="Skor"
                    items={[
                        { label: "Sayı", value: formatStat(player.points, 0) },
                        { label: "Asist", value: formatStat(player.assists, 0) },
                        { label: "Ribaund", value: formatStat(player.rebounds, 0) },
                        { label: "Top Çalma", value: formatStat(player.steals, 0) },
                        { label: "Blok", value: formatStat(player.blocks, 0) },
                        { label: "Fantasy", value: formatStat(player.fantasyScore) },
                    ]}
                />

                <StatSection
                    title="Şut"
                    items={[
                        { label: "FGM", value: formatStat(player.fgMade, 0) },
                        { label: "FGA", value: formatStat(player.fgAttempted, 0) },
                        { label: "FG%", value: formatStat(player.fgPct) },
                        { label: "3PM", value: formatStat(player.threeMade, 0) },
                        { label: "3PA", value: formatStat(player.threeAttempted, 0) },
                        { label: "3P%", value: formatStat(player.threePct) },
                        { label: "FTM", value: formatStat(player.ftMade, 0) },
                        { label: "FTA", value: formatStat(player.ftAttempted, 0) },
                        { label: "FT%", value: formatStat(player.ftPct) },
                    ]}
                />

                <StatSection
                    title="Ribaund"
                    items={[
                        { label: "Off Reb", value: formatStat(player.offensiveRebounds, 0) },
                        { label: "Def Reb", value: formatStat(player.defensiveRebounds, 0) },
                        { label: "Toplam", value: formatStat(player.rebounds, 0) },
                        { label: "eFG%", value: formatStat(player.effectiveFgPct) },
                    ]}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#090909",
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    hero: {
        backgroundColor: "#111111",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#232323",
        padding: 18,
    },
    name: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "900",
    },
    meta: {
        color: "#9ca3af",
        marginTop: 6,
        fontSize: 14,
    },
    heroStats: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 18,
    },
    heroCard: {
        width: "23%",
        backgroundColor: "#171717",
        borderRadius: 16,
        paddingVertical: 12,
        alignItems: "center",
    },
    heroValue: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "900",
    },
    heroLabel: {
        color: "#a3a3a3",
        marginTop: 4,
        fontSize: 11,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    helperText: {
        color: "#9ca3af",
        marginTop: 10,
    },
    errorText: {
        color: "#f87171",
        textAlign: "center",
        fontWeight: "700",
    },
});