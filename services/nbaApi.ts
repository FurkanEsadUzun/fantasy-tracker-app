import { RawStatRecord } from "../types/nba";

const BASE_URL = "https://api.server.nbaapi.com";
const SEASON = "2026";

type Query = Record<string, string | number | boolean | undefined>;

const buildUrl = (path: string, query?: Query) => {
    const url = new URL(path, BASE_URL);

    const finalQuery: Query = {
        season: SEASON,
        isPlayoff: false,
        ...query,
    };

    Object.entries(finalQuery).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
        }
    });

    return url.toString();
};

async function request(path: string, query?: Query) {
    const response = await fetch(buildUrl(path, query));

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API ${response.status}: ${text}`);
    }

    return response.json();
}

function extractRows(json: any): RawStatRecord[] {
    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.data)) return json.data;
    return [];
}

async function fetchAllPages(path: string, query?: Query): Promise<RawStatRecord[]> {
    let page = 1;
    let allRows: RawStatRecord[] = [];
    let totalPages = 1;

    do {
        const json = await request(path, {
            ...query,
            page,
            pageSize: 100,
        });

        const rows = extractRows(json);
        allRows = [...allRows, ...rows];

        totalPages = Number(json?.pagination?.pages ?? 1);
        page += 1;
    } while (page <= totalPages);

    return allRows;
}

export async function fetchPlayerTotals(query?: Query): Promise<RawStatRecord[]> {
    return fetchAllPages("/api/playertotals", query);
}

export async function fetchPlayerAdvancedStats(query?: Query): Promise<RawStatRecord[]> {
    return fetchAllPages("/api/playeradvancedstats", query);
}

export async function fetchAllPlayersForDirectory() {
    return fetchPlayerTotals({
        season: SEASON,
        isPlayoff: false,
    });
}

export async function fetchSinglePlayerStats(playerId: string) {
    const [totals, advanced] = await Promise.all([
        fetchPlayerTotals({ playerId, season: SEASON, isPlayoff: false }),
        fetchPlayerAdvancedStats({ playerId, season: SEASON, isPlayoff: false }),
    ]);

    const totalsRow = totals.find((x) => String(x.playerId) === playerId) ?? totals[0];
    const advancedRow = advanced.find((x) => String(x.playerId) === playerId) ?? advanced[0];

    return { totalsRow, advancedRow };
}