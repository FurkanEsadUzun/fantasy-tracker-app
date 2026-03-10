export type RawStatRecord = Record<string, any>;

export type PlayerListItem = {
    id: string;
    name: string;
    team: string;
    position: string;
    jersey?: string;
    age?: number;
    games?: number;
    minutes?: number;
    points?: number;
    rebounds?: number;
    assists?: number;
    steals?: number;
    blocks?: number;
    turnovers?: number;
    fgPct?: number;
    threePct?: number;
    ftPct?: number;
    fantasyScore?: number;
    raw?: RawStatRecord;
};

export type PlayerDetail = {
    id: string;
    name: string;
    team: string;
    position: string;
    jersey?: string;
    age?: number;
    height?: string;
    weight?: string;

    games?: number;
    gamesStarted?: number;
    minutes?: number;

    points?: number;
    rebounds?: number;
    offensiveRebounds?: number;
    defensiveRebounds?: number;
    assists?: number;
    steals?: number;
    blocks?: number;
    turnovers?: number;
    fouls?: number;

    fgMade?: number;
    fgAttempted?: number;
    fgPct?: number;

    threeMade?: number;
    threeAttempted?: number;
    threePct?: number;

    ftMade?: number;
    ftAttempted?: number;
    ftPct?: number;

    plusMinus?: number;

    per?: number;
    trueShootingPct?: number;
    effectiveFgPct?: number;
    usagePct?: number;
    assistPct?: number;
    reboundPct?: number;
    offensiveRating?: number;
    defensiveRating?: number;
    netRating?: number;
    pace?: number;
    pie?: number;

    fantasyScore?: number;

    totalsRaw?: RawStatRecord;
    advancedRaw?: RawStatRecord;
};