import { sdgGoals } from "@/lib/constants/goal-constants";
import { notFound } from "next/navigation";
import GoalHeader from "@/components/goals/goal-header";
import { slugify } from "@/lib/utilities/slugify";
import Image from "next/image";

type Params = Promise<{ slug: string[] }>;
export default async function Page({ params }: { params: Params }) {
    // Find the goal by slug
    const { slug } = await params;
    const goalSlug = Array.isArray(slug) ? slug[0] : slug;
    const goal = sdgGoals.find((g) => slugify(g.title) === goalSlug);

    if (!goal) {
        notFound();
    }

    return (
        <div className="flex flex-1 justify-center overflow-y-auto">
            <div className="w-full p-2 lg:p-0">
                <GoalHeader goal={goal} />

                <div className="my-8">
                    <h2 className="text-xl md:text-2xl font-black uppercase mb-2 md:mb-3 tracking-tight">
                        {goal.header_text}
                    </h2>

                    <p className="text-gray-800 text-base md:text-lg max-w-4xl mb-4 sm:mb-6 md:mb-8">
                        {goal.description}
                    </p>

                    <h3 className="text-xl md:text-2xl font-black mb-2 sm:mb-3 md:mb-4 tracking-tight">
                        THE TARGETS
                    </h3>

                    <p className="text-gray-800 text-base md:text-lg max-w-4xl mb-4 sm:mb-6 md:mb-8">
                        {goal.target_header}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {goal.targets.map((target) => (
                            <div
                                key={target.id}
                                className="bg-white p-4 flex flex-col rounded-lg"
                            >
                                <div className="relative aspect-[3/2] mb-3">
                                    <Image
                                        src={target.card}
                                        alt={target.id}
                                        fill
                                        className="object-contain object-left rounded-md"
                                    />
                                </div>

                                <h4 className="font-bold text-lg mb-2">
                                    {target.title}
                                </h4>
                                <p className="text-md text-gray-700">
                                    {target.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
