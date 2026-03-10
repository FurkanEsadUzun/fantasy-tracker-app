export function calculateFantasyScore(player: {
    points?: number;
    rebounds?: number;
    assists?: number;
    steals?: number;
    blocks?: number;
    turnovers?: number;
}) {
    const pts = player.points ?? 0;
    const reb = player.rebounds ?? 0;
    const ast = player.assists ?? 0;
    const stl = player.steals ?? 0;
    const blk = player.blocks ?? 0;
    const tov = player.turnovers ?? 0;

    return Number((pts + reb * 1.2 + ast * 1.5 + stl * 3 + blk * 3 - tov).toFixed(1));
}

export function formatStat(value?: number, digits = 1) {
    if (value === undefined || value === null || Number.isNaN(value)) return "-";
    return Number(value).toFixed(digits);
}