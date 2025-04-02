import Link from "next/link"
import { sdgGoals } from "@/lib/constants/goal-constants"
import Image from "next/image"

export default function Page() {
  return (
    <div className="flex flex-1 overflow-hidden">
        <div className="w-full pt-4">
        <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Exploring Minds &</h1>
            <h2 className="text-4xl font-bold text-gray-400">Inspiring Change</h2>
            <div className="flex justify-end">
            <div className="text-right">
                <p className="text-sm">1 Platform</p>
                <p className="text-sm">17 SDG Topics</p>
            </div>
            </div>
        </div> 

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
            {sdgGoals.map((goal) => (
            <Link key={goal.id} href={`/goals/${goal.id}`} className="aspect-square relative hover:scale-105 transition-all">
                <Image 
                    src={goal.titleCard} 
                    alt={`SDG Goal ${goal.id}: ${goal.title}`}
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                />
            </Link>
            ))}
        </div>
        </div>
    </div>
  )
}

