import React, { useState } from "react";
import ProfileAvatar from "../profile/ProfileAvatar";
import { SocietyMember } from "@/service/api.interface";
import Options from "../custom-ui/Options";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppApi } from "@/service/app.api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface SocietyMemberCardProps {
    member: SocietyMember;
    onMemberUpdate?: (updatedMember: Partial<SocietyMember> & { _id: string }) => void;
    onMemberRemove?: (memberId: string) => void;
}

const SocietyMemberCard: React.FC<SocietyMemberCardProps> = ({ 
    member, 
    onMemberUpdate,
    onMemberRemove 
}) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleRemoveMember = () => {
        if (onMemberRemove && member._id) {
            onMemberRemove(member._id);
        }
    };

    const handleEditMember = () => {
        setIsEditDialogOpen(true);
    };

    const menuOptions = [
        {
            label: "Edit Member Details",
            icon: <PencilIcon className="w-4 h-4" />,
            onClick: handleEditMember
        },
        // {
        //     label: "Remove Member",
        //     icon: <TrashIcon className="w-4 h-4" />,
        //     onClick: handleRemoveMember,
        // }
    ];

    const handleMemberUpdate = async (updatedData: Partial<SocietyMember>) => {
        if (onMemberUpdate && member._id) {
            onMemberUpdate({ ...updatedData, _id: member._id });
        }
        setIsEditDialogOpen(false);
    };

    return (
        <>
            <div 
                className="border rounded-lg p-4 mb-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <ProfileAvatar
                        size="sm"
                        src={
                            member.profileImage ||
                            member.user_id?.profileImage ||
                            ""
                        }
                        userName={member.name || member.email}
                        alt={member.name || member.email || "Member"}
                    />
                    <div>
                        <h3 className="font-semibold">
                            {member.name || member.email}
                        </h3>
                        {member.designation && (
                            <p className="text-sm text-gray-500">
                                {member.designation}
                            </p>
                        )}
                        {member.college && (
                            <p className="text-sm text-gray-400">
                                {member.college}
                            </p>
                        )}
                    </div>
                </div>
                <Options menuOptions={menuOptions} />
            </div>

            <EditMemberDialog
                member={member}
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSave={handleMemberUpdate}
            />
        </>
    );
};

export default SocietyMemberCard;

interface EditMemberDialogProps {
    member: SocietyMember;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (updatedMember: Partial<SocietyMember>) => void;
}

const EditMemberDialog: React.FC<EditMemberDialogProps> = ({
    member,
    isOpen,
    onOpenChange,
    onSave
}) => {
    const [formData, setFormData] = useState({
        name: member.name || "",
        college: member.college || "",
        designation: member.designation || ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();

    // Reset form data when dialog opens
    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                name: member.name || "",
                college: member.college || "",
                designation: member.designation || ""
            });
        }
    }, [isOpen, member]);

    const handleSave = async () => {
        if (!member._id) {
            toast.error("Member ID is missing");
            return;
        }
        
        // Validate required fields
        if (!formData.name.trim()) {
            toast.error("Name is required");
            return;
        }

        setIsLoading(true);
        try {
            // Only include fields that have changed
            const updatedFields: Partial<SocietyMember> = {};
            
            if (formData.name !== (member.name || "")) {
                updatedFields.name = formData.name;
            }
            if (formData.college !== (member.college || "")) {
                updatedFields.college = formData.college;
            }
            if (formData.designation !== (member.designation || "")) {
                updatedFields.designation = formData.designation;
            }
            // …
            // Only save if there are changes
            if (Object.keys(updatedFields).length > 0) {
                // Call the API to update the member
                const response = await AppApi.editSocietyMember(member._id, updatedFields.name, updatedFields.college, updatedFields.designation);

                if (response.success) {
                    toast.success("Member details updated successfully");
                    onSave(updatedFields);
                    queryClient.invalidateQueries({
                        queryKey: ["societyMembers"],
                        exact: false
                    });
                } else {
                    toast.error(response.error || "Failed to update member details");
                }
            } else {
                // No changes made, just close the dialog
                onOpenChange(false);
            }
        } catch (error) {
            console.error("Failed to save member changes:", error);
            toast.error("Failed to update member details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form to original values
        setFormData({
            name: member.name || "",
            college: member.college || "",
            designation: member.designation || ""
        });
        onOpenChange(false);
    };

    const handleInputChange = (field: keyof typeof formData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    // Check if form has changes
    const hasChanges = 
        formData.name !== (member.name || "") ||
        formData.college !== (member.college || "") ||
        formData.designation !== (member.designation || "");

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Member Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right font-medium">
                            Name
                        </label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange('name')}
                            className="col-span-3"
                            placeholder="Enter member name"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="college" className="text-right font-medium">
                            College
                        </label>
                        <Input
                            id="college"
                            value={formData.college}
                            onChange={handleInputChange('college')}
                            className="col-span-3"
                            placeholder="Enter college name"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="designation" className="text-right font-medium">
                            Designation
                        </label>
                        <Input
                            id="designation"
                            value={formData.designation}
                            onChange={handleInputChange('designation')}
                            className="col-span-3"
                            placeholder="Enter designation"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={!hasChanges || isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};