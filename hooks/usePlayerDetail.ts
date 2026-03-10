import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchSinglePlayerStats } from "../services/nbaApi";
import { PlayerDetail, RawStatRecord } from "../types/nba";
import { calculateFantasyScore } from "../utils/fantasyScore";

const mergePlayerDetail = (totalsRow?: RawStatRecord, advancedRow?: RawStatRecord): PlayerDetail => {
    const row = totalsRow ?? advancedRow ?? {};

    const player: PlayerDetail = {
        id: String(row.playerId ?? ""),
        name: String(row.playerName ?? "Unknown Player"),
        team: String(row.team ?? "-"),
        position: String(row.position ?? "-"),
        age: typeof row.age === "number" ? row.age : undefined,

        games: typeof row.games === "number" ? row.games : undefined,
        gamesStarted: typeof row.gamesStarted === "number" ? row.gamesStarted : undefined,
        minutes: typeof row.minutesPg === "number" ? row.minutesPg : undefined,

        points: typeof row.points === "number" ? row.points : undefined,
        rebounds: typeof row.totalRb === "number" ? row.totalRb : undefined,
        offensiveRebounds: typeof row.offensiveRb === "number" ? row.offensiveRb : undefined,
        defensiveRebounds: typeof row.defensiveRb === "number" ? row.defensiveRb : undefined,
        assists: typeof row.assists === "number" ? row.assists : undefined,
        steals: typeof row.steals === "number" ? row.steals : undefined,
        blocks: typeof row.blocks === "number" ? row.blocks : undefined,
        turnovers: typeof row.turnovers === "number" ? row.turnovers : undefined,
        fouls: typeof row.personalFouls === "number" ? row.personalFouls : undefined,

        fgMade: typeof row.fieldGoals === "number" ? row.fieldGoals : undefined,
        fgAttempted: typeof row.fieldAttempts === "number" ? row.fieldAttempts : undefined,
        fgPct: typeof row.fieldPercent === "number" ? Number((row.fieldPercent * 100).toFixed(1)) : undefined,

        threeMade: typeof row.threeFg === "number" ? row.threeFg : undefined,
        threeAttempted: typeof row.threeAttempts === "number" ? row.threeAttempts : undefined,
        threePct: typeof row.threePercent === "number" ? Number((row.threePercent * 100).toFixed(1)) : undefined,

        ftMade: typeof row.ft === "number" ? row.ft : undefined,
        ftAttempted: typeof row.ftAttempts === "number" ? row.ftAttempts : undefined,
        ftPct: typeof row.ftPercent === "number" ? Number((row.ftPercent * 100).toFixed(1)) : undefined,

        effectiveFgPct:
            typeof row.effectFgPercent === "number"
                ? Number((row.effectFgPercent * 100).toFixed(1))
                : undefined,

        totalsRaw: totalsRow,
        advancedRaw: advancedRow,
    };

    player.fantasyScore = calculateFantasyScore(player);
    return player;
};

export function usePlayerDetail(playerId: string) {
    const [player, setPlayer] = useState<PlayerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { totalsRow, advancedRow } = await fetchSinglePlayerStats(playerId);
            setPlayer(mergePlayerDetail(totalsRow, advancedRow));
        } catch (err: any) {
            setError(err?.message ?? "Oyuncu detayları alınamadı");
        } finally {
            setLoading(false);
        }
    }, [playerId]);

    useEffect(() => {
        if (!playerId) return;
        load();
    }, [load, playerId]);

    return useMemo(
        () => ({
            player,
            loading,
            error,
            reload: load,
        }),
        [player, loading, error, load]
    );
}