"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import RoleCard from "@/components/login/RoleCard";
import { AppApi } from "@/service/app.api";
import { UserRole } from "@/service/api.interface";
import toast from "react-hot-toast";

const Page = () => {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [roles, setRoles] = useState<UserRole[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                const response = await AppApi.getRole();

                // Based on your API response, data is directly in response.data
                const rolesData: UserRole[] = response.data.data || [];
                setRoles(rolesData);
            } catch (error) {
                console.error("Error fetching roles:", error);
                setRoles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    const handleContinue = async () => {
        if (!selectedRole) {
            console.warn("No role selected");
            return;
        }

        try {
            console.log("Updating role with ID:", selectedRole._id);
            const response = await fetch("/api", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role_id: selectedRole._id }),
            });


            if (!response.ok) {
                console.error("Failed to update role");
                toast.error("Failed to update role");
                return;
            }

            const data = await response.json();
            if (data.success) {
                toast.success("Role updated successfully!");
                document.cookie = "onboarding-completed=true; path=/; max-age=31536000"; // 1 year
                window.location.href = "/"; // or wherever you want to redirect after onboarding
            }
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("An error occurred while updating role");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-slate-700">
                        What describes you
                        <br />
                        the best?
                    </h1>
                    <p className="text-gray-600 text-lg">
                        This helps us to personalize your experience
                    </p>
                </div>

                {/* Roles */}
                <div className="space-y-3 flex flex-col">
                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-24 bg-gray-200 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : roles.length > 0 ? (
                        roles.map((role) => (
                            <RoleCard
                                key={role._id}
                                role={role}
                                selectedRole={selectedRole}
                                clickFunc={() => {
                                    console.log("Role selected:", role.name);
                                    setSelectedRole(role);
                                }}
                            />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            <p className="text-lg">No roles available</p>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="mt-4"
                            >
                                Refresh Page
                            </Button>
                        </div>
                    )}
                </div>

                {/* Continue Button */}
                <div className="pt-4">
                    <Button
                        onClick={handleContinue}
                        className={`w-full py-4 text-lg font-medium rounded-2xl transition-all duration-200 ${
                            selectedRole
                                ? "bg-slate-700 hover:bg-slate-800 text-white shadow-lg"
                                : "bg-slate-300 text-slate-500 cursor-not-allowed"
                        }`}
                        disabled={!selectedRole}
                    >
                        {selectedRole
                            ? "Continue"
                            : "Select a role to continue"}
                    </Button>
                </div>

                {/* Selected role indicator */}
                {selectedRole && (
                    <div className="text-center text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                        ✓ Selected: {selectedRole.name}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
