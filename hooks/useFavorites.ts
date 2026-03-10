import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const STORAGE_KEY = "favorite_player_ids";

export function useFavorites() {
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);

            if (stored) {
                setFavoriteIds(JSON.parse(stored));
            }
        } catch (error) {
            console.log("Favoriler yüklenemedi:", error);
        } finally {
            setLoadingFavorites(false);
        }
    };

    const toggleFavorite = async (playerId: number) => {
        try {
            let updated: number[] = [];

            if (favoriteIds.includes(playerId)) {
                updated = favoriteIds.filter((id) => id !== playerId);
            } else {
                updated = [...favoriteIds, playerId];
            }

            setFavoriteIds(updated);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
            console.log("Favori güncellenemedi:", error);
        }
    };

    const isFavorite = (playerId: number) => {
        return favoriteIds.includes(playerId);
    };

    return {
        favoriteIds,
        loadingFavorites,
        toggleFavorite,
        isFavorite,
    };
}