import React from "react";
import { cn } from "@/lib/utils";
import {
    signInWithGoogle,
    // signInWithApple,  // Assuming these are not yet implemented
    // signInWithFacebook,
    // signInWithTwitter
} from "@/lib/utilities/firebase.config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SOCIAL_AUTH_PROVIDERS } from "@/lib/constants/login-constants";
import { toast } from "react-hot-toast";

interface SocialSignInProps {
    className?: string;
    setIsLoading?: (isLoading: boolean) => void;
}

const SocialSignIn: React.FC<SocialSignInProps> = ({
    className,
    setIsLoading,
}) => {
    const router = useRouter();


    const handleSocialSignIn = async (
        provider: "google" | "apple" | "facebook" | "twitter"
    ) => {
        if (setIsLoading) {
            setIsLoading(true); // Set loading to true at the very beginning
        }

        try {
            let result;

            switch (provider) {
                case "google":
                    result = await signInWithGoogle();
                    break;
                // case 'apple':
                //   result = await signInWithApple();
                //   break;
                // case 'facebook':
                //   result = await signInWithFacebook();
                //   break;
                // case 'twitter':
                //   result = await signInWithTwitter();
                //   break;
                default:
                    toast.error("Unsupported sign-in provider.");
                    // No need to call setIsLoading(false) here, finally block will handle it
                    return; // Exit if provider is not supported
            }
            if (result) {
                // Get the Firebase ID token
                const idToken = await result.user.getIdToken();

                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: idToken,
                        device_id: "web",
                        device_token: "web",
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setIsLoading?.(false);
                    toast.error(
                        data?.error || data?.message || "Authentication failed"
                    );
                    return;
                }

                if (data.jwtToken) {
                    const cookieResponse = await fetch("/api/setCookieToken", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            jwtToken: data.jwtToken,
                            refreshToken: data.refreshToken,
                            sessionId: data.sessionId,
                            userId: data.userId,
                            ...(data.role_type && { role_type: data.role_type }),
                        }),
                        credentials: "include",
                    });

                    const cookieData = await cookieResponse.json();

                    if (cookieResponse.ok) {
                        toast.success("You are now logged in.");
                        router.push("/onboarding");
                    } else {
                        toast.error(cookieData?.error || cookieData?.message);
                        setIsLoading?.(false);
                    }
                } else {
                    toast.error(data?.error || data?.message);
                    setIsLoading?.(false);
                }
            }
        } catch (error) {
            console.error(`${provider} sign-in error:`, error);
            if (setIsLoading) {
                setIsLoading(false); // Ensure loading is set to false in case of error
            }
            toast.error(`${provider} Sign-In Error`);
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            <p className="text-sm text-center text-gray-600 mb-4">
                Continue with:
            </p>

            <div className="flex justify-center space-x-4">
                {SOCIAL_AUTH_PROVIDERS.map(({ provider, Icon }, index) => (
                    <button
                        key={index}
                        aria-label={`Sign in with ${provider}`}
                        onClick={() =>
                            handleSocialSignIn(
                                provider as
                                    | "google"
                                    | "apple"
                                    | "facebook"
                                    | "twitter"
                            )
                        }
                        className="social-button flex items-center justify-center w-18 h-10 rounded-lg border border-gray-200 bg-white p-5 cursor-pointer hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-200 animate-fade-in transition-all"
                    >
                        <Image
                            src={Icon}
                            alt="Login Icon"
                            width={100}
                            height={100}
                            className="object-contain w-fit h-fit"
                        />
                    </button>
                ))}
            </div>
            {/* <div className="divider py-4 relative text-center">
        <span className="relative z-10 bg-white px-2 text-sm text-gray-700">or</span>
      </div> */}
        </div>
    );
};

export default SocialSignIn;
