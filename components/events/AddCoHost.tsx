"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, UserPlus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { AppApi } from "@/service/app.api";
import { SocietyMember } from "@/service/api.interface";
import ProfileAvatar from "../profile/ProfileAvatar";
import { toast } from "react-hot-toast";
import Loader from "../Loader";

interface AddCoHostModalProps {
    hosts: string[];
    setHosts: (hosts: string[]) => void;
    userId: string;
}

export const AddCoHostModal = ({ hosts, setHosts, userId }: AddCoHostModalProps) => {
    const [members, setMembers] = useState<SocietyMember[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedHosts, setSelectedHosts] = useState<string[]>(hosts);
    const [isOpen, setIsOpen] = useState(false);

    // Fetch society members when dialog opens
    const fetchSocietyMembers = async () => {
        setIsLoading(true);
        try {
            let allMembers: SocietyMember[] = [];
            let cursor: string | null = null;
            let hasMore = true;

            // Fetch all members with pagination
            let iterationCount = 0;
            const maxIterations = 100; // Prevent infinite loops
            while (hasMore) {
                if (iterationCount >= maxIterations) {
                    console.warn("Max iterations reached in pagination");
                    break;
                }
                const response = await AppApi.getSocietyMembers(userId, 30, cursor);

                if (response.success && response.data?.data) {
                    allMembers = [...allMembers, ...response.data.data];
                    cursor = response.data.nextCursor;
                    hasMore = !!response.data.nextCursor;
                } else {
                    hasMore = false;
                    if (!response.success) {
                        toast.error(
                            response.error || "Failed to fetch society members"
                        );
                    }
                }
                iterationCount++;
            }

            setMembers(allMembers);
        } catch (error) {
            console.error("Error fetching society members:", error);
            toast.error("Failed to fetch society members");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch members when dialog opens
    useEffect(() => {
        if (isOpen) {
            fetchSocietyMembers();
        }
    }, [isOpen]);

    // Update selected hosts when prop changes
    useEffect(() => {
        setSelectedHosts(hosts);
    }, [hosts]);

    // Handle host selection toggle
    const handleHostToggle = (memberId: string) => {
        setSelectedHosts((prev) => {
            if (prev.includes(memberId)) {
                return prev.filter((id) => id !== memberId);
            } else {
                return [...prev, memberId];
            }
        });
    };

    // Handle save
    const handleSave = () => {
        setHosts(selectedHosts);
        setIsOpen(false);
        toast.success(`${selectedHosts.length} co-host(s) selected`);
    };

    // Group members by designation for better organization
    const groupedMembers = members.reduce(
        (acc, member) => {
            const designation = member.designation || "Members";
            if (!acc[designation]) {
                acc[designation] = [];
            }
            acc[designation].push(member);
            return acc;
        },
        {} as Record<string, SocietyMember[]>
    );

    // Define role hierarchy for better ordering
    const roleOrder = [
        "President",
        "Vice-President",
        "Vice President",
        "Secretary General",
        "Secretary",
        "Treasurer",
        "Spokesperson",
        "Team Lead",
        "Team Leads",
        "Members",
    ];

    // Sort roles according to hierarchy
    const sortedRoles = Object.keys(groupedMembers).sort((a, b) => {
        const aIndex = roleOrder.findIndex((role) =>
            a.toLowerCase().includes(role.toLowerCase())
        );
        const bIndex = roleOrder.findIndex((role) =>
            b.toLowerCase().includes(role.toLowerCase())
        );

        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center space-x-3 text-gray-700 hover:text-gray-900">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                    </div>
                    <span>
                        Add co-host{" "}
                        {selectedHosts.length > 0 &&
                            `(${selectedHosts.length} selected)`}
                    </span>
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto hidden-scrollbar">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Add Co-Host
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                        Select society members to add as co-hosts for this event
                    </p>
                </DialogHeader>

                <div className="space-y-6">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader />
                        </div>
                    ) : members.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No society members found</p>
                            <p className="text-sm text-gray-400 mt-1">
                                You need to be part of a society to add co-hosts
                            </p>
                        </div>
                    ) : (
                        <>
                            {sortedRoles.map((role) => (
                                <div key={role}>
                                    <h3 className="text-lg font-semibold mb-3">
                                        {role}
                                    </h3>
                                    <div className="space-y-3">
                                        {groupedMembers[role].map((member) => (
                                            <div
                                                key={member._id}
                                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <ProfileAvatar
                                                        size="sm"
                                                        src={
                                                            member.profileImage ||
                                                            member.user_id
                                                                ?.profileImage ||
                                                            ""
                                                        }
                                                        userName={ member.name || member.email }
                                                        alt={
                                                            member.name ||
                                                            member.email ||
                                                            "Member"
                                                        }
                                                    />
                                                    <div>
                                                        <p className="font-medium">
                                                            {member.name ||
                                                                member.email ||
                                                                "Unknown Member"}
                                                        </p>
                                                        {member.college && (
                                                            <p className="text-sm text-gray-500">
                                                                {member.college}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        id={member._id!}
                                                        type="checkbox"
                                                        checked={selectedHosts.includes(
                                                            member._id!
                                                        )}
                                                        onChange={() =>
                                                            handleHostToggle(
                                                                member._id!
                                                            )
                                                        }
                                                        className="w-5 h-5 border-2 border-gray-300 rounded accent-accent"
                                                        aria-label={`Select ${member.name || member.email || "member"} as co-host`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                        </>
                    )}
                </div>

                <div className="flex justify-end pt-4 gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-accent hover:bg-accent/80 px-8"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        Save ({selectedHosts.length})
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
