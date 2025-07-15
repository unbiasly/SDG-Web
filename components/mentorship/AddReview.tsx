"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { AppApi } from "@/service/app.api";

const AddReview = ({ mentorId, onSuccess }: { mentorId: string; onSuccess: () => void }) => {
    const [review, setReview] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!review.trim() || mentorId.trim() === "") {
            return; // Prevent submission if review is empty
        }


        const response = await AppApi.addMentorReview(mentorId, review);
        if (response.success) {
            onSuccess(); // Call the success callback to refresh reviews
            setReview(""); // Clear the review input after submission
            setIsOpen(false); // Close the dialog
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="w-full">
                <div className=" flex flex-1 gap-1 px-4 py-2 border-b text-accent hover:underline  w-full cursor-pointer">
                    <Plus className="stroke-2 stroke-accent" />
                    Add Review
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience with this mentor.
                    </DialogDescription>
                </DialogHeader>
                {/* Form content goes here */}
                <form className="space-y-4 flex flex-col " onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <textarea
                            className="border p-2 rounded"
                            placeholder="Write your review here..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <Button type="submit">Submit Review</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddReview;
