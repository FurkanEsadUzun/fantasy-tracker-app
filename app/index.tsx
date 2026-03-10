import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import PlayerCard from "../components/PlayerCard";
import { useFavorites } from "../hooks/useFavorites";
import { usePlayerDirectory } from "../hooks/usePlayerDirectory";
import { PlayerListItem } from "../types/nba";

type SortKey =
    | "fantasy_desc"
    | "points_desc"
    | "rebounds_desc"
    | "assists_desc"
    | "name_asc";

export default function HomeScreen() {
    const [search, setSearch] = useState("");
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [sortBy, setSortBy] = useState<SortKey>("fantasy_desc");

    const { players, loading, refreshing, error, onRefresh } = usePlayerDirectory();
    const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();

    const filteredPlayers = useMemo(() => {
        let list = [...players];

        if (showOnlyFavorites) {
            list = list.filter((player) => favoriteIds.includes(player.id));
        }

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter((player) =>
                `${player.name} ${player.team} ${player.position}`.toLowerCase().includes(q)
            );
        }

        list.sort((a: PlayerListItem, b: PlayerListItem) => {
            switch (sortBy) {
                case "points_desc":
                    return (b.points ?? 0) - (a.points ?? 0);
                case "rebounds_desc":
                    return (b.rebounds ?? 0) - (a.rebounds ?? 0);
                case "assists_desc":
                    return (b.assists ?? 0) - (a.assists ?? 0);
                case "name_asc":
                    return a.name.localeCompare(b.name);
                case "fantasy_desc":
                default:
                    return (b.fantasyScore ?? 0) - (a.fantasyScore ?? 0);
            }
        });

        return list;
    }, [players, favoriteIds, search, showOnlyFavorites, sortBy]);

    const cycleSort = () => {
        const order: SortKey[] = [
            "fantasy_desc",
            "points_desc",
            "rebounds_desc",
            "assists_desc",
            "name_asc",
        ];

        const currentIndex = order.indexOf(sortBy);
        const next = order[(currentIndex + 1) % order.length];
        setSortBy(next);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <Text style={styles.subtitle}>API’den canlı oyuncu verileri</Text>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Oyuncu ara..."
                    placeholderTextColor="#666"
                    value={search}
                    onChangeText={setSearch}
                />

                <View style={styles.actions}>
                    <Pressable
                        style={[styles.button, showOnlyFavorites && styles.buttonActive]}
                        onPress={() => setShowOnlyFavorites((prev) => !prev)}
                    >
                        <Text style={styles.buttonText}>
                            {showOnlyFavorites ? "Tüm Oyuncular" : "Favoriler"}
                        </Text>
                    </Pressable>

                    <Pressable style={styles.button} onPress={cycleSort}>
                        <Text style={styles.buttonText}>Sırala: {sortLabel(sortBy)}</Text>
                    </Pressable>
                </View>

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.helperText}>Yükleniyor...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.center}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredPlayers}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <PlayerCard
                                player={item}
                                isFavorite={isFavorite(item.id)}
                                onToggleFavorite={() => toggleFavorite(item.id)}
                            />
                        )}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

function sortLabel(sortBy: SortKey) {
    switch (sortBy) {
        case "points_desc":
            return "Sayı";
        case "rebounds_desc":
            return "Ribaund";
        case "assists_desc":
            return "Asist";
        case "name_asc":
            return "İsim";
        default:
            return "Fantasy";
    }
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#090909",
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    title: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "900",
    },
    subtitle: {
        color: "#8d8d8d",
        marginTop: 4,
        marginBottom: 14,
    },
    searchInput: {
        backgroundColor: "#111111",
        color: "#fff",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: "#222",
        marginBottom: 12,
    },
    actions: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 12,
    },
    button: {
        flex: 1,
        backgroundColor: "#141414",
        borderWidth: 1,
        borderColor: "#242424",
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: "center",
    },
    buttonActive: {
        borderColor: "#facc15",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
    },
    listContent: {
        paddingBottom: 24,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    helperText: {
        color: "#9ca3af",
        marginTop: 12,
    },
    errorText: {
        color: "#f87171",
        textAlign: "center",
        fontWeight: "700",
    },
});