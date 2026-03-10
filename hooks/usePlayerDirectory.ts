import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAllPlayersForDirectory } from "../services/nbaApi";
import { PlayerListItem, RawStatRecord } from "../types/nba";
import { calculateFantasyScore } from "../utils/fantasyScore";

const mapTotalsToListItem = (row: RawStatRecord): PlayerListItem => {
    const player: PlayerListItem = {
        id: String(row.playerId ?? ""),
        name: String(row.playerName ?? "Unknown Player"),
        team: String(row.team ?? "-"),
        position: String(row.position ?? "-"),
        age: typeof row.age === "number" ? row.age : undefined,
        games: typeof row.games === "number" ? row.games : undefined,
        minutes: typeof row.minutesPg === "number" ? row.minutesPg : undefined,
        points: typeof row.points === "number" ? row.points : undefined,
        rebounds: typeof row.totalRb === "number" ? row.totalRb : undefined,
        assists: typeof row.assists === "number" ? row.assists : undefined,
        steals: typeof row.steals === "number" ? row.steals : undefined,
        blocks: typeof row.blocks === "number" ? row.blocks : undefined,
        turnovers: typeof row.turnovers === "number" ? row.turnovers : undefined,
        fgPct: typeof row.fieldPercent === "number" ? Number((row.fieldPercent * 100).toFixed(1)) : undefined,
        threePct: typeof row.threePercent === "number" ? Number((row.threePercent * 100).toFixed(1)) : undefined,
        ftPct: typeof row.ftPercent === "number" ? Number((row.ftPercent * 100).toFixed(1)) : undefined,
        raw: row,
    };

    player.fantasyScore = calculateFantasyScore(player);
    return player;
};

export function usePlayerDirectory() {
    const [players, setPlayers] = useState<PlayerListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async (isRefresh = false) => {
        try {
            setError(null);
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const rows = await fetchAllPlayersForDirectory();

            const mapped = rows
                .filter((row) => String(row.season) === "2026" && row.isPlayoff === false)
                .map(mapTotalsToListItem)
                .filter((item) => item.id && item.name && item.name !== "Unknown Player");

            const unique = Array.from(new Map(mapped.map((item) => [item.id, item])).values());
            setPlayers(unique);
        } catch (err: any) {
            setError(err?.message ?? "Oyuncular alınamadı");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return useMemo(
        () => ({
            players,
            loading,
            refreshing,
            error,
            reload: () => load(false),
            onRefresh: () => load(true),
        }),
        [players, loading, refreshing, error, load]
    );
}