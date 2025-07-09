import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface AddTicketModalProps {
    ticketLink: string;
    setTicketLink: (link: string) => void;
}

export const AddTicketModal = ({ ticketLink, setTicketLink }: AddTicketModalProps) => {
    const [localTicketLink, setLocalTicketLink] = useState(ticketLink);
    const [isOpen, setIsOpen] = useState(false);

    // Update local state when prop changes
    useEffect(() => {
        setLocalTicketLink(ticketLink);
    }, [ticketLink]);

    const handleSave = () => {
        let formattedLink = localTicketLink.trim();
        
        // Validate URL if provided
        if (formattedLink) {
            // Add https:// if no protocol is provided
            if (!formattedLink.startsWith('http://') && !formattedLink.startsWith('https://')) {
                formattedLink = 'https://' + formattedLink;
            }
            
            // Basic URL validation
            try {
                new URL(formattedLink);
            } catch (error) {
                toast.error("Please enter a valid URL");
                return;
            }
        }
        
        setTicketLink(formattedLink);
        setIsOpen(false);
        
        if (formattedLink) {
            toast.success("Ticket link added successfully!");
        } else {
            toast.success("Ticket link removed");
        }
    };

    const handleCancel = () => {
        setLocalTicketLink(ticketLink); // Reset to original value
        setIsOpen(false);
    };

    const clearTicketLink = () => {
        setLocalTicketLink("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center space-x-3 text-gray-700 hover:text-gray-900">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Ticket className="w-4 h-4" />
                    </div>
                    <span>
                        {ticketLink ? "Edit ticket link" : "Add tickets"}
                    </span>
                    {ticketLink && (
                        <span className="text-xs text-green-600 font-medium">
                            ✓ Added
                        </span>
                    )}
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        {ticketLink ? "Edit ticket link" : "Add ticket link"}
                    </DialogTitle>
                    <p className="text-gray-600 mt-2">
                        {ticketLink 
                            ? "Update the link to your ticketing website"
                            : "Add a link to your ticketing website"
                        }
                    </p>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    <div className="space-y-3">
                        <label htmlFor="ticketUrl" className="text-sm font-medium text-gray-700">
                            Ticket URL
                        </label>
                        <div className="relative">
                            <Input
                                id="ticketUrl"
                                value={localTicketLink}
                                onChange={(e) => setLocalTicketLink(e.target.value)}
                                placeholder="https://example.com/tickets"
                                className="w-full text-lg py-6 px-6 border-2 border-gray-300 rounded-2xl pr-12"
                                type="url"
                            />
                            {localTicketLink && (
                                <button
                                    onClick={clearTicketLink}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    type="button"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        
                        {/* URL validation hints */}
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>• Enter a full URL (e.g., https://eventbrite.com/e/your-event)</p>
                            <p>• Common platforms: Eventbrite, BookMyShow, Patreon, etc.</p>
                            <p>• Leave empty if tickets are not required</p>
                        </div>
                    </div>

                    {/* Preview current link */}
                    {ticketLink && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                Current ticket link:
                            </p>
                            <p className="text-sm text-blue-600 break-all">
                                {ticketLink}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <Button 
                        variant="outline" 
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button 
                        className="bg-accent hover:bg-accent/80 px-8 py-3 text-base"
                        onClick={handleSave}
                    >
                        {ticketLink ? "Update" : "Save"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
