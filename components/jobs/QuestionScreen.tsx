import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScreeningQuestion } from "@/service/api.interface";

interface QuestionScreenProps {
    questions: ScreeningQuestion[];
    onAnswersChange: (answers: Record<string, string | number>) => void;
    initialAnswers?: Record<string, string | number>;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ 
    questions, 
    onAnswersChange, 
    initialAnswers = {} 
}) => {
    const [answers, setAnswers] = useState<Record<string, string | number>>(initialAnswers);

    const handleAnswerChange = (questionId: string, value: string | number) => {
        const updatedAnswers = {
            ...answers,
            [questionId]: value,
        };
        setAnswers(updatedAnswers);
        onAnswersChange(updatedAnswers);
    };

    // Initialize answers on mount
    useEffect(() => {
        if (Object.keys(initialAnswers).length > 0) {
            setAnswers(initialAnswers);
        }
    }, [initialAnswers]);

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
                Screening Questions
            </h3>
            <p className="text-sm text-gray-600 mb-4">
                Please answer the following questions to help us better understand your qualifications.
            </p>

            {questions.map((question) => (
                <Card key={question._id} className="border border-gray-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium text-gray-800">
                            {question.question}
                            <span className="text-red-500 ml-1">*</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {question.type === "numeric" ? (
                            <Input
                                type="number"
                                placeholder="Enter a number"
                                value={question._id ? (answers[question._id] || "") : ""}
                                onChange={(e) =>
                                    question._id && handleAnswerChange(
                                        question._id,
                                        Number(e.target.value)
                                    )
                                }
                                className="max-w-xs"
                                min="0"
                                required
                            />
                        ) : (
                            <Select
                                value={question._id ? ((answers[question._id] as string) || "") : ""}
                                onValueChange={(value) =>
                                    question._id && handleAnswerChange(question._id, value)
                                }
                                required
                            >
                                <SelectTrigger className="max-w-xs">    
                                    <SelectValue placeholder="Select an answer" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                    <SelectItem
                                        value="yes"
                                        className="hover:bg-gray-100"
                                    >
                                        Yes
                                    </SelectItem>
                                    <SelectItem
                                        value="no"
                                        className="hover:bg-gray-100"
                                    >
                                        No
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default QuestionScreen;
