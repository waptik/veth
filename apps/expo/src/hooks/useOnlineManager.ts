import * as React from "react";
import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";

export function useOnlineManager() {
    React.useEffect(() => {
        const eventSubscription = Network.addNetworkStateListener((state) => {
            console.log("[useOnlineManager] >> Network state changed:", state);

            onlineManager.setOnline(
                state.isConnected != null &&
                    state.isConnected &&
                    Boolean(state.isInternetReachable),
            );
        });
        return () => {
            eventSubscription.remove();
        };
    }, []);
}
