import { cn } from "@/lib/utils";
import Image from "next/image";

interface BentoImageGridProps {
    images: string[];
}

export function BentoImageGrid({ images }: BentoImageGridProps) {
    if (images.length === 0) return null;

    // Different layouts based on number of images
    if (images.length === 1) {
        return (
            <div className="w-full rounded-md overflow-hidden mt-2">
                <div className="relative aspect-[4/3]">
                    <Image
                        src={images[0]}
                        alt="Post image"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        );
    }

    if (images.length === 2) {
        return (
            <div className="grid grid-cols-2 gap-1 mt-2 aspect-video">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative rounded-md overflow-hidden"
                    >
                        <Image
                            src={image}
                            alt={`Post image ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
        );
    }

    if (images.length === 3) {
        return (
            <div className="grid grid-cols-2 gap-1 mt-2 aspect-video">
                <div className="relative rounded-md overflow-hidden">
                    <Image
                        src={images[0]}
                        alt="Post image 1"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="grid grid-rows-2 gap-1 h-full">
                    {images.slice(1, 3).map((image, index) => (
                        <div
                            key={index}
                            className="relative rounded-md overflow-hidden"
                        >
                            <Image
                                src={image}
                                alt={`Post image ${index + 2}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // LinkedIn-style bento grid for 4+ images
    return (
        <div className="grid grid-cols-2 gap-1 mt-2 aspect-video">
            <div className="relative rounded-md overflow-hidden">
                <Image
                    src={images[0]}
                    alt="Post image 1"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="grid grid-rows-3 gap-1 h-full">
                {images.slice(1, 4).map((image, index) => (
                    <div
                        key={index}
                        className="relative rounded-md overflow-hidden"
                    >
                        <Image
                            src={image}
                            alt={`Post image ${index + 2}`}
                            fill
                            className="object-cover"
                        />

                        {/* Show "+X" overlay on the 4th image (index 2) if there are more than 4 images */}
                        {index === 2 && images.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md">
                                <span className="text-white text-xl font-bold">
                                    +{images.length - 4}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
