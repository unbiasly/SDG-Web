import React, { useState } from "react";
import ProfileAvatar from "../profile/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { SocietyRequest } from "@/service/api.interface";
import { AppApi } from "@/service/app.api";
import { useQueryClient } from "@tanstack/react-query";

interface SocietyRequestCardProps {
    request: SocietyRequest;
}

const SocietyRequestCard: React.FC<SocietyRequestCardProps> = ({ 
    request, 
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    // Extract common logic for both approve and reject actions
    const handleRequestAction = async (action: 'accept' | 'reject') => {
        setIsLoading(true);
        try {
            const response = await AppApi.evaluateRequest(request._id, action);

            if (response.success) {
                queryClient.invalidateQueries({
                    queryKey: ["societyRequests"],
                    exact: false
                });
            } else {
                console.error(`Failed to ${action} request`);
            }
        } catch (error) {
            console.error(`Error ${action}ing request:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handlers delegate to the shared function
    const handleApprove = () => handleRequestAction('accept');
    const handleReject = () => handleRequestAction('reject');

    return (
        <div className="border rounded-lg p-4 mb-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
                <div className="flex items-start gap-4 flex-1">
                    <ProfileAvatar
                        size="md"
                        src={request.profileImage || request.user_id?.profileImage || ""}
                        userName={request.name || request.email}
                        alt={request.name || request.email}
                    />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">
                                    {request.name || request.email}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {request.email}
                                </p>
                                {request.designation && (
                                    <p className="text-sm text-gray-600 font-medium">
                                        {request.designation}
                                    </p>
                                )}
                                {request.college && (
                                    <p className="text-sm text-gray-600 font-medium">
                                        {request.college}
                                    </p>
                                )}
                            </div>   
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 justify-end">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleReject}
                        disabled={isLoading}
                        className="border-3 border-red-600 bg-white rounded-full hover:bg-red-100"
                    >
                        <X className="stroke-3 stroke-red-600"  />
                    </Button>
                    <Button
                        size="icon"
                        onClick={handleApprove}
                        disabled={isLoading}
                        className="border-3 border-green-600 bg-white rounded-full hover:bg-green-100"
                    >
                        <Check className="stroke-3 stroke-green-600" />
                    </Button>
                </div>
            </div>
            
        </div>
    );
};

export default SocietyRequestCard;