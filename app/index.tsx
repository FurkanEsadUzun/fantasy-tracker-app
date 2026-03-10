import { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import PlayerCard from "../components/PlayerCard";
import { players } from "../data/players";
import { useFavorites } from "../hooks/useFavorites";
import { calculateFantasyScore } from "../utils/fantasyScore";

export default function HomeScreen() {
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("ALL");
    const [sortBy, setSortBy] = useState("fantasy_desc");
    const [teamModalVisible, setTeamModalVisible] = useState(false);
    const [sortModalVisible, setSortModalVisible] = useState(false);

    const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();

    const teams = useMemo(() => {
        const uniqueTeams = [...new Set(players.map((player) => player.team))];
        return ["ALL", ...uniqueTeams.sort()];
    }, []);

    const filteredPlayers = useMemo(() => {
        const query = search.toLowerCase().trim();

        let result = [...players];

        if (selectedTeam !== "ALL") {
            result = result.filter((player) => player.team === selectedTeam);
        }

        if (showOnlyFavorites) {
            result = result.filter((player) => favoriteIds.includes(player.id));
        }

        if (query) {
            result = result.filter(
                (player) =>
                    player.name.toLowerCase().includes(query) ||
                    player.team.toLowerCase().includes(query)
            );
        }

        if (sortBy === "fantasy_desc") {
            result.sort((a, b) => calculateFantasyScore(b) - calculateFantasyScore(a));
        } else if (sortBy === "fantasy_asc") {
            result.sort((a, b) => calculateFantasyScore(a) - calculateFantasyScore(b));
        } else if (sortBy === "name_asc") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [search, selectedTeam, sortBy, showOnlyFavorites, favoriteIds]);

    const sortLabel =
        sortBy === "fantasy_desc"
            ? "Fantasy ↓"
            : sortBy === "fantasy_asc"
                ? "Fantasy ↑"
                : "Name A-Z";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Fantasy Tracker</Text>
                <Text style={styles.subtitle}>Top fantasy oyuncuları</Text>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Oyuncu veya takım ara..."
                placeholderTextColor="#777777"
                value={search}
                onChangeText={setSearch}
            />

            <View style={styles.filterRow}>
                <Pressable
                    style={[styles.filterBox, styles.filterBoxSmall]}
                    onPress={() => setTeamModalVisible(true)}
                >
                    <Text style={styles.filterLabel}>Team</Text>
                    <Text style={styles.filterValue}>
                        {selectedTeam === "ALL" ? "All" : selectedTeam}
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.filterBox,
                        styles.filterBoxSmall,
                        showOnlyFavorites && styles.filterBoxActive,
                    ]}
                    onPress={() => setShowOnlyFavorites((prev) => !prev)}
                >
                    <Text
                        style={[
                            styles.filterLabel,
                            showOnlyFavorites && styles.filterLabelActive,
                        ]}
                    >
                        Filter
                    </Text>
                    <Text
                        style={[
                            styles.filterValue,
                            showOnlyFavorites && styles.filterValueActive,
                        ]}
                    >
                        {showOnlyFavorites ? "Favorites" : "All"}
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.filterBox, styles.filterBoxSmall]}
                    onPress={() => setSortModalVisible(true)}
                >
                    <Text style={styles.filterLabel}>Sort</Text>
                    <Text style={styles.filterValue}>{sortLabel}</Text>
                </Pressable>
            </View>

            <FlatList
                data={filteredPlayers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PlayerCard
                        player={item}
                        isFavorite={isFavorite(item.id)}
                        onToggleFavorite={toggleFavorite}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
                    </View>
                }
            />

            <Modal
                visible={teamModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setTeamModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setTeamModalVisible(false)}
                >
                    <Pressable style={styles.modalCard} onPress={() => { }}>
                        <Text style={styles.modalTitle}>Select Team</Text>

                        {teams.map((team) => {
                            const active = selectedTeam === team;

                            return (
                                <Pressable
                                    key={team}
                                    style={[styles.optionRow, active && styles.optionRowActive]}
                                    onPress={() => {
                                        setSelectedTeam(team);
                                        setTeamModalVisible(false);
                                    }}
                                >
                                    <Text
                                        style={[styles.optionText, active && styles.optionTextActive]}
                                    >
                                        {team === "ALL" ? "All Teams" : team}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal
                visible={sortModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSortModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setSortModalVisible(false)}
                >
                    <Pressable style={styles.modalCard} onPress={() => { }}>
                        <Text style={styles.modalTitle}>Sort By</Text>

                        <Pressable
                            style={[
                                styles.optionRow,
                                sortBy === "fantasy_desc" && styles.optionRowActive,
                            ]}
                            onPress={() => {
                                setSortBy("fantasy_desc");
                                setSortModalVisible(false);
                            }}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    sortBy === "fantasy_desc" && styles.optionTextActive,
                                ]}
                            >
                                Fantasy ↓
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.optionRow,
                                sortBy === "fantasy_asc" && styles.optionRowActive,
                            ]}
                            onPress={() => {
                                setSortBy("fantasy_asc");
                                setSortModalVisible(false);
                            }}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    sortBy === "fantasy_asc" && styles.optionTextActive,
                                ]}
                            >
                                Fantasy ↑
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.optionRow,
                                sortBy === "name_asc" && styles.optionRowActive,
                            ]}
                            onPress={() => {
                                setSortBy("name_asc");
                                setSortModalVisible(false);
                            }}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    sortBy === "name_asc" && styles.optionTextActive,
                                ]}
                            >
                                Name A-Z
                            </Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        color: "#F6F4F1",
        fontSize: 30,
        fontWeight: "800",
    },
    subtitle: {
        color: "#F95C4B",
        fontSize: 15,
        marginTop: 4,
    },
    searchInput: {
        backgroundColor: "#111111",
        borderWidth: 1,
        borderColor: "#222222",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: "#F6F4F1",
        fontSize: 15,
        marginBottom: 16,
    },
    filterRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },
    filterBox: {
        backgroundColor: "#111111",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#222222",
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    filterBoxSmall: {
        flex: 1,
    },
    filterBoxActive: {
        backgroundColor: "#F95C4B",
        borderColor: "#F95C4B",
    },
    filterLabel: {
        color: "#888888",
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 6,
    },
    filterValue: {
        color: "#F6F4F1",
        fontSize: 15,
        fontWeight: "700",
    },
    filterLabelActive: {
        color: "#F6F4F1",
    },
    filterValueActive: {
        color: "#F6F4F1",
    },
    listContent: {
        paddingBottom: 24,
    },
    emptyBox: {
        paddingTop: 40,
        alignItems: "center",
    },
    emptyText: {
        color: "#999999",
        fontSize: 15,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.72)",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    modalCard: {
        backgroundColor: "#111111",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#222222",
        padding: 18,
    },
    modalTitle: {
        color: "#F6F4F1",
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 14,
    },
    optionRow: {
        backgroundColor: "#1A1A1A",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#262626",
    },
    optionRowActive: {
        backgroundColor: "#F95C4B",
        borderColor: "#F95C4B",
    },
    optionText: {
        color: "#F6F4F1",
        fontSize: 15,
        fontWeight: "700",
    },
    optionTextActive: {
        color: "#F6F4F1",
    },
});