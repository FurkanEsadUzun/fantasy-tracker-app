import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const STORAGE_KEY = "favorite_player_ids";

export function useFavorites() {
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
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

    const toggleFavorite = (id: string) => {
        setFavoriteIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const isFavorite = (id: string) => favoriteIds.includes(id);

    return {
        favoriteIds,
        loadingFavorites,
        toggleFavorite,
        isFavorite,
    };
}