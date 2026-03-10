export function calculateFantasyScore(player: any) {
    return (
        player.pts * 1 +
        player.reb * 1.2 +
        player.ast * 1.5 +
        player.stl * 3 +
        player.blk * 3 -
        player.tov * 1
    );
}
export function getTrendInfo(player: any) {
    const seasonFantasy = calculateFantasyScore(player);
    const diff = player.last5Fantasy - seasonFantasy;

    if (diff >= 3) {
        return {
            label: "Trending Up",
            shortLabel: "UP",
            color: "#22C55E",
        };
    }

    if (diff <= -3) {
        return {
            label: "Trending Down",
            shortLabel: "DOWN",
            color: "#F95C4B",
        };
    }

    return {
        label: "Stable",
        shortLabel: "STABLE",
        color: "#E4DED2",
    };
}