"use client";
import React, { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogTrigger 
} from "../ui/dialog";
import SocietyForm from "./ProfileForms/SocietyForm";
import StudentForm from "./ProfileForms/StudentForm";
import PublicRepresentativeForm from "./ProfileForms/PublicRepresentativeForm";

interface CompleteProfileFormProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    role? : string ;
}

const CompleteProfileForm: React.FC<CompleteProfileFormProps> = ({ 
    isOpen, 
    onOpenChange,
    role,
}) => {
    let formHeader = ''
    switch (role) {
        case 'sdg-society':
            formHeader = 'Society';
            break;
        case 'student':
            formHeader = 'Student';
            break;
        case 'public-representative':
            formHeader = 'Public Representative';
            break;
        default:
            formHeader = '';
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <div onClick={() => console.log("Second partition clicked")} className="flex-1 p-4 border-y-1  border-gray-400 cursor-pointer hover:bg-gray-50 transition-colors relative">
                    {/* <X className="absolute top-2 right-2 h-4 w-4 text-gray-400 hover:text-gray-600" /> */}
                    <h3 className="font-semibold text-accent">Complete your Profile</h3>
                    <p className="text-sm text-gray-600">Unlock All Features: Take a Moment to Complete.</p>
                </div>
            </DialogTrigger>
            
            <DialogContent className="p-6 bg-white" showDialogClose={true}>
                <DialogHeader className="text-center mb-6">
                    <DialogTitle className="text-3xl font-bold text-accent leading-tight mb-2">
                        {formHeader}<br />
                        Registration
                    </DialogTitle>
                    <DialogDescription className="text-gray-600  lg:text-base">
                        Enter your details to enjoy full experience
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 p-2 max-h-[70vh] overflow-y-auto hidden-scrollbar">
                    { role === 'sdg-society' && <SocietyForm /> }
                    { role === 'student' && <StudentForm /> }
                    { role === 'public-representative' && <PublicRepresentativeForm /> }
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CompleteProfileForm;
