"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { setupAPIInterceptor } from "@/lib/utilities/interceptor";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // Increase to 5 minutes
                        refetchOnWindowFocus: false,
                        refetchOnMount: false, // Prevent refetch on component mount
                        refetchOnReconnect: false, // Prevent refetch on network reconnect
                        retry: 1, // Reduce retry attempts
                    },
                },
            })
    );

    // Setup API interceptor once globally
    useEffect(() => {
        setupAPIInterceptor();
    }, []);

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    containerStyle={{
                        pointerEvents: "none",
                    }}
                    toastOptions={{
                        className: "bg-neutral-100 text-neutral-800 shadow-lg",
                        style: {
                            borderRadius: "10px",
                            padding: "24px",
                            fontSize: "18px",
                            pointerEvents: "auto", // Fixed: Allow clicking on toasts
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: "#737373",
                                secondary: "#FAFAFA",
                            },
                        },
                        error: {
                            duration: 3000,
                            iconTheme: {
                                primary: "#525252",
                                secondary: "#FAFAFA",
                            },
                        },
                    }}
                />
                {children}
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </QueryClientProvider>
        </Provider>
    );
}
