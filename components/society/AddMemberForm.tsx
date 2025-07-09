"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, UserPlus, X } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { AppApi } from "@/service/app.api";
import { AddMember } from "@/service/api.interface";



interface AddMemberFormProps {
    onSuccess?: () => void;
}

export const AddMemberForm = ({ onSuccess }: AddMemberFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [members, setMembers] = useState<AddMember[]>([
        {
            name: "",
            email: "",
            designation: "",
            college: "",
        },
    ]);

    const handleInputChange = (
        index: number,
        field: keyof AddMember,
        value: string
    ) => {
        setMembers((prev) =>
            prev.map((member, i) =>
                i === index ? { ...member, [field]: value } : member
            )
        );
    };

    const addAnotherMember = () => {
        setMembers((prev) => [
            ...prev,
            {
                name: "",
                email: "",
                designation: "",
                college: "",
            },
        ]);
    };

    const removeMember = (index: number) => {
        if (members.length > 1) {
            setMembers((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const validateForm = () => {
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            if (!member.name.trim()) {
                toast.error(`Member ${i + 1}: Name is required`);
                return false;
            }
            if (!member.email.trim()) {
                toast.error(`Member ${i + 1}: Email is required`);
                return false;
            }
            if (!member.designation.trim()) {
                toast.error(`Member ${i + 1}: Designation is required`);
                return false;
            }
            if (!member.college.trim()) {
                toast.error(`Member ${i + 1}: College is required`);
                return false;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(member.email)) {
                toast.error(
                    `Member ${i + 1}: Please enter a valid email address`
                );
                return false;
            }
        }
        return true;
    };

    const handleAddMembers = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Call the API with the members array
            const response = await AppApi.addSocietyMember(members);

            if (response.success) {
                toast.success(`${members.length} member(s) added successfully!`);

                // Reset form
                setMembers([
                    {
                        name: "",
                        email: "",
                        designation: "",
                        college: "",
                    },
                ]);

                // Close dialog and trigger refresh
                setIsOpen(false);
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                toast.error(response.error || "Failed to add members");
            }
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setMembers([
            {
                name: "",
                email: "",
                designation: "",
                college: "",
            },
        ]);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="p-1 rounded-full cursor-pointer hover:bg-gray-300">
                    <Plus />
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto hidden-scrollbar max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        Add Members
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {members.map((member, index) => (
                        <div
                            key={index}
                            className="relative p-6 border border-gray-200 rounded-lg bg-gray-50"
                        >
                            {/* Remove button for additional members */}
                            {members.length > 1 && (
                                <button
                                    onClick={() => removeMember(index)}
                                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    type="button"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Member {index + 1}
                            </h3>

                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="text-base font-medium text-gray-700">
                                        Name*
                                    </label>
                                    <Input
                                        className="mt-2 border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 focus:border-blue-500 focus:ring-0"
                                        value={member.name}
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter full name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-base font-medium text-gray-700">
                                        Email*
                                    </label>
                                    <Input
                                        type="email"
                                        className="mt-2 border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 focus:border-blue-500 focus:ring-0"
                                        value={member.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter email address"
                                    />
                                </div>

                                {/* Designation */}
                                <div>
                                    <label className="text-base font-medium text-gray-700">
                                        Designation*
                                    </label>
                                    <Input
                                        className="mt-2 border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 focus:border-blue-500 focus:ring-0"
                                        value={member.designation}
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                "designation",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., President, Secretary, Member"
                                    />
                                </div>

                                {/* College */}
                                <div>
                                    <label className="text-base font-medium text-gray-700">
                                        College*
                                    </label>
                                    <Input
                                        className="mt-2 border-0 border-b-2 border-gray-300 rounded-none bg-transparent px-0 focus:border-blue-500 focus:ring-0"
                                        value={member.college}
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                "college",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter college/university name"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add Another Member Button */}
                    <button
                        onClick={addAnotherMember}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                        type="button"
                        disabled={isLoading}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Another Member</span>
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end pt-6 gap-3">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                        onClick={handleAddMembers}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            "Save All"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
