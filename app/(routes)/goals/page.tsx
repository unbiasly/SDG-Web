import Link from "next/link"
import { sdgGoals } from "@/lib/constants/goal-constants"
import Image from "next/image"
import { slugify } from "@/lib/utilities/slugify"

export default function Page() {
  return (
    <div className="flex flex-1 overflow-hidden">
        <div className="w-full pt-4">
        <div className="mb-8 flex items-end justify-between px-4">
            <div className="flex flex-col">

            <h1 className="text-2xl md:text-4xl w-1/2 lg:w-full font-bold mb-2">Exploring Minds &</h1>
            <h2 className="text-2xl md:text-4xl w-1/2 lg:w-full font-bold text-gray-400">Inspiring Change</h2>
            </div>
            <div className="flex justify-end">
                <div className="text-right">
                    <p className="text-sm">1 Platform</p>
                    <p className="text-sm">17 SDG Topics</p>
                </div>
            </div>
        </div> 

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
            {sdgGoals.map((goal) => {
              const goalSlug = slugify(goal.title);
              return (
                <Link 
                  key={goal.id} 
                  href={`/goals/${goalSlug}`} 
                  className="aspect-square relative hover:scale-105 transition-all"
                >
                  <Image 
                    src={goal.titleCard} 
                    alt={`SDG Goal ${goal.id}: ${goal.title}`}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                </Link>
              )
            })}
        </div>
        </div>
    </div>
  )
}

