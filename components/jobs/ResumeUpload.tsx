import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface ResumeUploadCardProps {
    onFileChange: (file: File | null) => void;
    initialFile?: File | null;
}

const ResumeUploadCard: React.FC<ResumeUploadCardProps> = ({ 
    onFileChange, 
    initialFile = null 
}) => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(initialFile);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = useCallback(
        (file: File) => {
            if (file.type !== "application/pdf") {
                toast.error("Invalid file type. Please upload a PDF file only.");
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                // 10MB limit
                toast.error("File too large. Please upload a file smaller than 10MB.");
                return;
            }

            setUploadedFile(file);
            onFileChange(file);
            toast.success(`${file.name} has been uploaded.`);
        },
        [onFileChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        },
        [handleFileSelect]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        onFileChange(null);
        toast.success("Resume removed successfully.");
    };

    // Initialize file on mount
    useEffect(() => {
        if (initialFile) {
            setUploadedFile(initialFile);
        }
    }, [initialFile]);

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Resume
                </h3>
                <p className="text-sm text-gray-600">
                    Please upload your resume in PDF format (max 10MB).
                    <span className="text-red-500 ml-1">*</span>
                </p>
            </div>

            <Card className="border-2 border-gray-300 hover:border-gray-400 transition-colors">
                <CardContent className="p-8">
                    {!uploadedFile ? (
                        <div
                            className={`text-center space-y-4 ${
                                isDragging ? "bg-blue-50 border-blue-300" : ""
                            }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-gray-500" />
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-lg font-medium text-gray-900">
                                    Upload your resume
                                </h4>
                                <p className="text-sm text-gray-500">
                                    Drag and drop your PDF file here, or click
                                    to browse
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                <Button
                                    variant="outline"
                                    className="relative overflow-hidden"
                                    onClick={() =>
                                        document
                                            .getElementById("resume-upload")
                                            ?.click()
                                    }
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Choose File
                                </Button>
                                <input
                                    id="resume-upload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileInput}
                                    className="hidden"
                                />
                            </div>

                            <p className="text-xs text-gray-400">
                                Supported format: PDF • Max size: 10MB
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>

                            <div className="text-center">
                                <h4 className="text-lg font-medium text-gray-900 mb-2">
                                    Resume uploaded successfully!
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="w-6 h-6 text-red-500" />
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-gray-900 truncate max-w-40">
                                                    {uploadedFile.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {(
                                                        uploadedFile.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{" "}
                                                    MB
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={removeFile}
                                            className="h-8 w-8 p-0 hover:bg-gray-200"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "resume-upload-replace"
                                            )
                                            ?.click()
                                    }
                                >
                                    Replace File
                                </Button>
                                <input
                                    id="resume-upload-replace"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileInput}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ResumeUploadCard;
