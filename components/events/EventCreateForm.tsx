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
import { Calendar, Upload, Plus, Ticket, X, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { AddCoHostModal } from "./AddCoHost";
import { AddTicketModal } from "./AddTicket";
import { toast } from "react-hot-toast";
import { AppApi } from "@/service/app.api";

export const CreateEvent = ({ userId }: { userId: string }) => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        description: "",
        time: "",
        type: "event" as "event" | "talk",
        ticketLink: "",
    });
    const [hosts, setHosts] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Constants from Flutter code
    const MAX_IMAGES = 5;
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".webp"];

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (selectedImages.length + files.length > MAX_IMAGES) {
            toast.error(`Maximum ${MAX_IMAGES} images allowed`);
            return;
        }

        // Validate each file
        for (const file of files) {
            // Check file size
            if (file.size > MAX_IMAGE_SIZE) {
                toast.error(
                    `Image "${file.name}" is too large. Maximum size is 5MB.`
                );
                return;
            }

            // Check file type
            const extension = "." + file.name.split(".").pop()?.toLowerCase();
            if (!ALLOWED_IMAGE_TYPES.includes(extension || "")) {
                toast.error(
                    `Invalid file type for "${file.name}". Only JPEG, PNG, and WEBP formats are allowed.`
                );
                return;
            }
        }

        // Process valid files
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = e.target?.result as string;
                setImagePreviews((prev) => [...prev, preview]);
            };
            reader.readAsDataURL(file);
        });

        setSelectedImages((prev) => [...prev, ...files]);
    };

    const handleRemoveImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleBannerClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange =
        (field: keyof typeof formData) =>
        (
            e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
        ) => {
            setFormData((prev) => ({
                ...prev,
                [field]: e.target.value,
            }));
        };

    const validateForm = () => {
        if (!formData.title.trim()) {
            toast.error("Event title is required");
            return false;
        }
        if (!formData.location.trim()) {
            toast.error("Event location is required");
            return false;
        }
        if (!formData.description.trim()) {
            toast.error("Event description is required");
            return false;
        }
        if (!formData.time) {
            toast.error("Event date and time is required");
            return false;
        }

        // Validate datetime format
        const eventDate = new Date(formData.time);
        if (isNaN(eventDate.getTime())) {
            toast.error("Please enter a valid date and time");
            return false;
        }

        // Check if event is in the future
        if (eventDate <= new Date()) {
            toast.error("Event date must be in the future");
            return false;
        }

        return true;
    };

    const handleCreateEvent = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Prepare ticket link
            let ticketLink = formData.ticketLink.trim();
            if (
                ticketLink &&
                !ticketLink.startsWith("http://") &&
                !ticketLink.startsWith("https://")
            ) {
                ticketLink = "https://" + ticketLink;
            }

            // Convert datetime to ISO string
            const eventTime = new Date(formData.time).toISOString();

            // Create FormData for multipart request
            const eventFormData = new FormData();
            eventFormData.append("title", formData.title);
            eventFormData.append("location", formData.location);
            eventFormData.append("description", formData.description);
            eventFormData.append("time", eventTime);
            eventFormData.append("type", formData.type);
            eventFormData.append("ticketLink", ticketLink);

            // Add hosts as JSON array (current user will be added automatically by backend)
            if (hosts.length > 0) {
                eventFormData.append("host", JSON.stringify(hosts));
            }

            // Add images
            selectedImages.forEach((image, index) => {
                eventFormData.append("images", image);
                console.log(
                    `   Processing image ${index + 1}/${selectedImages.length}`
                );
            });

            // Call the API
            const response = await AppApi.createEvent(eventFormData);

            if (response.success) {
                toast.success("Event created successfully!");

                // Reset form
                setFormData({
                    title: "",
                    location: "",
                    description: "",
                    time: "",
                    type: "event",
                    ticketLink: "",
                });
                setSelectedImages([]);
                setImagePreviews([]);
                setHosts([]);

                // Close dialog (you might want to add a close handler)
            } else {
                console.log("❌ Failed to create event:", response.error);

                // Provide user-friendly error messages
                let userMessage = response.error || "Failed to create event";

                if (userMessage.includes("not associated with any society")) {
                    userMessage =
                        "You need to be associated with a society to create events. Please contact your society administrator or join a society first.";
                } else if (
                    userMessage.includes("unauthorized") ||
                    userMessage.includes("Unauthorized")
                ) {
                    userMessage =
                        "You are not authorized to create events. Please log in again.";
                } else if (
                    userMessage.includes("validation") ||
                    userMessage.includes("Validation")
                ) {
                    userMessage =
                        "Please check your event details and try again.";
                }

                toast.error(userMessage);
            }
        } catch (error) {
            console.error("❌ Error in createEvent:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="p-1 rounded-full cursor-pointer hover:bg-gray-300">
                    <Plus />
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto hidden-scrollbar max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        Create an event
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Banner Upload Area */}
                    <div className="relative">
                        <div
                            className="w-full min-h-56 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors p-4"
                            onClick={handleBannerClick}
                        >
                            {imagePreviews.length > 0 ? (
                                <div className="w-full">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative group"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Event banner ${
                                                        index + 1
                                                    }`}
                                                    className="w-full h-24 object-cover rounded"
                                                />
                                                <button
                                                    aria-label="Remove image"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveImage(
                                                            index
                                                        );
                                                    }}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {selectedImages.length < MAX_IMAGES && (
                                        <p className="text-sm text-gray-500 mt-2 text-center">
                                            Click to add more images (
                                            {selectedImages.length}/{MAX_IMAGES}
                                            )
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">
                                        Upload event banners
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Click to select images (JPEG, PNG, WebP)
                                        - max 5MB each, up to {MAX_IMAGES}{" "}
                                        images
                                    </p>
                                </div>
                            )}
                        </div>
                        <input
                            aria-label="Event images"
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageSelect}
                            multiple
                            className="hidden"
                        />
                    </div>

                    {/* Event Type Selection */}
                    <div>
                        <label className="text-base font-medium text-gray-700">
                            Event Type
                        </label>
                        <select
                            aria-label="Event type"
                            value={formData.type}
                            onChange={handleInputChange("type")}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="event">Event</option>
                            <option value="talk">Talk</option>
                        </select>
                    </div>

                    {/* Event Name */}
                    <div>
                        <label
                            htmlFor="eventname"
                            className="text-base font-medium text-gray-700"
                        >
                            Event Name *
                        </label>
                        <Input
                            id="eventname"
                            className="mt-2"
                            value={formData.title}
                            onChange={handleInputChange("title")}
                            placeholder="Enter event name"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label
                            htmlFor="location"
                            className="text-base font-medium text-gray-700"
                        >
                            Location *
                        </label>
                        <Input
                            id="location"
                            className="mt-2"
                            value={formData.location}
                            onChange={handleInputChange("location")}
                            placeholder="Enter event location"
                        />
                    </div>

                    {/* Start Date & Time */}
                    <div>
                        <label
                            htmlFor="datetime"
                            className="text-base font-medium text-gray-700"
                        >
                            Start date & time *
                        </label>
                        <div className="relative mt-2">
                            <Input
                                id="datetime"
                                type="datetime-local"
                                value={formData.time}
                                onChange={handleInputChange("time")}
                            />
                        </div>
                    </div>

                    {/* Event Details */}
                    <div>
                        <label
                            htmlFor="eventdetails"
                            className="text-base font-medium text-gray-700"
                        >
                            Event Description *
                        </label>
                        <textarea
                            id="eventdetails"
                            value={formData.description}
                            onChange={handleInputChange("description")}
                            placeholder="Describe your event..."
                            className="mt-2 w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <AddCoHostModal userId={userId} hosts={hosts} setHosts={setHosts} />
                        <AddTicketModal
                            ticketLink={formData.ticketLink}
                            setTicketLink={(link) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    ticketLink: link,
                                }))
                            }
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-6 gap-3">
                    <Button variant="outline" disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-accent hover:bg-accent/80 px-6"
                        onClick={handleCreateEvent}
                        disabled={isLoading}
                    >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Post event"
                            )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
