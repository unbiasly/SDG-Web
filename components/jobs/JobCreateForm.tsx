import {  useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "../ui/date-picker";
import { EXPERIENCE_LEVEL, JOB_TYPE } from "@/lib/constants/index-constants";
import { JobListing, ScreeningQuestion } from "@/service/api.interface";


interface CreateJobFormProps {
    onSave: (data: JobListing) => void;
    initialData: JobListing;
}

export const CreateJobForm: React.FC<CreateJobFormProps> = ({
    onSave,
    initialData,
}) => {
    const [formData, setFormData] = useState<JobListing>(initialData);
    const [newQuestion, setNewQuestion] = useState("");
    const [questionType, setQuestionType] = useState<'numeric' | 'yes/no' | ''>('');
    const [newTag, setNewTag] = useState("");
    const [errors, setErrors] = useState<Partial<Record<keyof JobListing, string>>>({});

    const handleInputChange = (
        field: keyof JobListing,
        value: string | boolean | string[]
    ) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const addQuestion = () => {
        if (newQuestion.trim()) {
            const questionObj = {
                question: newQuestion.trim(),
                ...(questionType && { type: questionType })
            };
            
            setFormData((prev) => ({
                ...prev,
                screeningQuestions: [...prev.screeningQuestions, questionObj],
            }));
            setNewQuestion("");
            setQuestionType('');
        }
    };

    const removeQuestion = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            screeningQuestions: prev.screeningQuestions.filter((_: any, i: number) => i !== index),
        }));
    };

    const addTag = () => {
        if (newTag.trim() && newTag.length <= 30) {
            const tag = newTag.trim();
            const currentTags = formData.tags || [];
            
            // Check if tag already exists (case insensitive)
            if (!currentTags.some((existingTag: string) => existingTag.toLowerCase() === tag.toLowerCase())) {
                setFormData((prev: any) => ({
                    ...prev,
                    tags: [...currentTags, tag],
                }));
                setNewTag("");
            } else {
                toast.error("Tag already exists");
            }
        } else if (newTag.length > 30) {
            toast.error("Tag must be 30 characters or less");
        }
    };

    const removeTag = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags?.filter((_: any, i: number) => i !== index) || [],
        }));
    };

    const handleTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        } 
    };

    const validateURL = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof JobListing, string>> = {};

        // Required field validations
        if (!formData.title?.trim()) {
            newErrors.title = "Job title is required";
        }

        if (!formData.companyName?.trim()) {
            newErrors.companyName = "Company name is required";
        }

        if (!formData.location?.trim()) {
            newErrors.location = "Location is required";
        }

        if (!formData.jobType) {
            newErrors.jobType = "Job type is required";
        } else if (!['full-time', 'part-time', 'contract', 'internship'].includes(formData.jobType)) {
            newErrors.jobType = "Invalid job type";
        }

        if (!formData.salaryRange?.trim()) {
            newErrors.salaryRange = "Salary range is required";
        }

        if (!formData.experienceLevel) {
            newErrors.experienceLevel = "Experience level is required";
        } else if (!['entry', 'mid', 'senior'].includes(formData.experienceLevel)) {
            newErrors.experienceLevel = "Invalid experience level";
        }

        if (!formData.description?.trim()) {
            newErrors.description = "Job description is required";
        }

        if (!formData.applyUrl?.trim()) {
            newErrors.applyUrl = "Apply URL is required";
        } else if (!validateURL(formData.applyUrl)) {
            newErrors.applyUrl = "Please enter a valid URL";
        }

        // Optional field validations
        if (formData.companyLogo && !validateURL(formData.companyLogo)) {
            newErrors.companyLogo = "Please enter a valid company logo URL";
        }

        if (formData.expiresAt) {
            const expirationDate = new Date(formData.expiresAt);
            if (isNaN(expirationDate.getTime()) || expirationDate <= new Date()) {
                newErrors.expiresAt = "Expiration date must be in the future";
            }
        }

        setErrors(newErrors);
        
        // Show toast for first error
        const firstError = Object.values(newErrors)[0];
        if (firstError) {
            toast.error(firstError);
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        // Just save to local state for preview - no API call
        toast.success('Job details saved! Review your job posting.');
        onSave(formData);
    };

    return (
        <div className="space-y-4">
            {/* Job Title */}
            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Job Title *
                </label>
                <Input
                    id="title"
                    placeholder="Ex: Senior Frontend Developer"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`border-gray-300 ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                )}
            </div>

            {/* Company */}
            <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                    Company Name *
                </label>
                <Input
                    id="companyName"
                    placeholder="Ex: Microsoft"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className={`border-gray-300 ${errors.companyName ? "border-red-500" : ""}`}
                />
                {errors.companyName && (
                    <p className="text-sm text-red-500">{errors.companyName}</p>
                )}
            </div>

            {/* Location */}
            <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location *
                </label>
                <Input
                    id="location"
                    placeholder="Ex: New Delhi, India"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className={`border-gray-300 ${errors.location ? "border-red-500" : ""}`}
                />
                {errors.location && (
                    <p className="text-sm text-red-500">{errors.location}</p>
                )}
            </div>

            {/* Job Type */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    Job Type *
                </label>
                <Select
                    value={formData.jobType}
                    onValueChange={(value) => handleInputChange("jobType", value)}
                >
                    <SelectTrigger className={`border-gray-300 ${errors.jobType ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                        {JOB_TYPE.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.jobType && (
                    <p className="text-sm text-red-500">{errors.jobType}</p>
                )}
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
                <label htmlFor="salaryRange" className="text-sm font-medium text-gray-700">
                    Salary Range *
                </label>
                <Input
                    id="salaryRange"
                    placeholder="Ex: ₹50,000 - ₹70,000"
                    value={formData.salaryRange}
                    onChange={(e) => handleInputChange("salaryRange", e.target.value)}
                    className={`border-gray-300 ${errors.salaryRange ? "border-red-500" : ""}`}
                />
                {errors.salaryRange && (
                    <p className="text-sm text-red-500">{errors.salaryRange}</p>
                )}
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    Experience Level *
                </label>
                <Select
                    value={formData.experienceLevel}
                    onValueChange={(value) => handleInputChange("experienceLevel", value)}
                >
                    <SelectTrigger className={`border-gray-300 ${errors.experienceLevel ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                        {EXPERIENCE_LEVEL.map((level) => (
                            <SelectItem key={level} value={level}>
                                {level.charAt(0).toUpperCase() + level.slice(1)} Level
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.experienceLevel && (
                    <p className="text-sm text-red-500">{errors.experienceLevel}</p>
                )}
            </div>

            {/* Job Description */}
            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Job Description *
                </label>
                <Textarea
                    id="description"
                    placeholder="Describe the job responsibilities, requirements, and qualifications..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={`border-gray-300 min-h-[120px] resize-none ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                )}
            </div>

            {/* Apply URL */}
            <div className="space-y-2">
                <label htmlFor="applyUrl" className="text-sm font-medium text-gray-700">
                    Apply URL *
                </label>
                <Input
                    id="applyUrl"
                    placeholder="https://company.com/apply"
                    value={formData.applyUrl}
                    onChange={(e) => handleInputChange("applyUrl", e.target.value)}
                    className={`border-gray-300 ${errors.applyUrl ? "border-red-500" : ""}`}
                />
                {errors.applyUrl && (
                    <p className="text-sm text-red-500">{errors.applyUrl}</p>
                )}
            </div>

            {/* Company Logo (Optional) */}
            <div className="space-y-2">
                <label htmlFor="companyLogo" className="text-sm font-medium text-gray-700">
                    Company Logo URL (Optional)
                </label>
                <Input
                    id="companyLogo"
                    placeholder="https://company.com/logo.png"
                    value={formData.companyLogo || ''}
                    onChange={(e) => handleInputChange("companyLogo", e.target.value)}
                    className={`border-gray-300 ${errors.companyLogo ? "border-red-500" : ""}`}
                />
                {errors.companyLogo && (
                    <p className="text-sm text-red-500">{errors.companyLogo}</p>
                )}
            </div>

            {/* Tags Section */}
            <Card className="border-gray-200">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base text-accent">
                        Skills & Tags (Optional)
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Add relevant skills and tags for this position. Maximum 10 tags allowed.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Display existing tags */}
                    {formData.tags && formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                            {formData.tags.map((tag: string, index: number) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-gray-200 text-accent hover:bg-gray-200/80 transition-colors flex items-center gap-1 px-3 py-1"
                                >
                                    <span className="text-xs font-medium">{tag}</span>
                                    <button
                                        onClick={() => removeTag(index)}
                                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                        aria-label={`Remove ${tag} tag`}
                                    >
                                        <X color="black" className="h-3 w-4" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Add new tag input */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter a skill or tag (e.g., React, JavaScript, UI/UX)"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={handleTagKeyPress}
                            maxLength={30}
                            className="flex-1"
                            disabled={(formData.tags?.length || 0) >= 10}
                        />
                        <Button
                            onClick={addTag}
                            variant="outline"
                            size="sm"
                            disabled={!newTag.trim() || (formData.tags?.length || 0) >= 10}
                            className="px-4"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                        </Button>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Press Enter to add a tag</span>
                        <span>{formData.tags?.length || 0}/10</span>
                    </div>

                    {errors.tags && (
                        <p className="text-sm text-red-500">{errors.tags}</p>
                    )}
                </CardContent>
            </Card>

            {/* Expiration Date (Optional) */}
            <div className="space-y-2">
                <label htmlFor="expiresAt" className="text-sm font-medium text-gray-700">
                    Expiration Date *
                </label>
                <DatePicker
                    selected={formData.expiresAt ? new Date(formData.expiresAt) : undefined}
                    onSelect={(date) => {
                        handleInputChange("expiresAt", date ? date.toISOString() : "");
                    }}
                    placeholder="Select expiration date"
                    disabled={(date) => date < new Date()}
                    className={`w-full ${errors.expiresAt ? "border-red-500" : ""}`}
                />
                {errors.expiresAt && (
                    <p className="text-sm text-red-500">{errors.expiresAt}</p>
                )}
            </div>

            {/* Screening Questions */}
            <Card className="border-gray-200">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base text-accent">
                        Screening Questions (Optional)
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Add questions to help screen applicants. You can specify question types.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {formData.screeningQuestions.map((questionObj: ScreeningQuestion, index: number) => (
                        <div
                            key={index}
                            className="flex items-start justify-between p-3 bg-white rounded border gap-3"
                        >
                            <div className="flex-1">
                                <span className="text-sm">{questionObj.question}</span>
                                {questionObj.type && (
                                    <span className="ml-2 text-xs px-2 py-1 bg-gray-200 text-accent rounded">
                                        {questionObj.type.charAt(0).toUpperCase() + questionObj.type.slice(1)}
                                    </span>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeQuestion(index)}
                                className="text-red-500 hover:text-red-700 h-auto p-1"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    <div className="space-y-2">
                        <Input
                            placeholder="Enter a screening question"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addQuestion()}
                        />
                        <div className="flex gap-2">
                            <Select
                                value={questionType}
                                onValueChange={(value: 'numeric' | 'yes/no' | '') => setQuestionType(value)}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="select">Default</SelectItem>
                                    <SelectItem value="numeric">Numeric</SelectItem>
                                    <SelectItem value="yes/no">Yes/No</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={addQuestion}
                                variant="outline"
                                size="sm"
                                disabled={!newQuestion.trim()}
                                className="flex-1"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Question
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
                <Button
                    onClick={handleSave}
                    className="bg-accent hover:bg-accent/80 rounded-full px-8"
                >
                    Save
                </Button>
            </div>
        </div>
    );
};
