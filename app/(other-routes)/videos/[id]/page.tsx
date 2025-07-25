import VideoPageClient from "@/components/video/VideoPageClient";
import { Suspense, use } from "react";

type Params = Promise<{ id: string }>;

const VideoContent = async ({ params }: { params: Params }) => {
    // Await the params to get the userId
    const { id } = use(params);

    return <VideoPageClient videoId={id} />;
};

export default function Page({ params }: { params: Params }) {
    return (
        <Suspense
            fallback={
                <div className="w-full min-h-screen flex justify-center items-center">
                    <div className="animate-pulse text-xl">Loading...</div>
                </div>
            }
        >
            <VideoContent params={params} />
        </Suspense>
    );
}
