'use client'
import Link from "next/link"
import { CircleArrowDown } from "lucide-react"
import Image from "next/image"

interface GoalProps {
  goal: {
    id: number
    title: string
    subtitle: string
    color: string
    goal_header: string
  }
}

export default function GoalHeader({ goal }: GoalProps) {
  return (
    <div className="rounded-2xl h-screen p-5 text-white relative " style={{ backgroundColor: goal.color }}>
      {/* Navigation buttons at the top with higher z-index */}
      <div className="flex justify-between mb-8 z-10 relative">
        <div>
          {goal.id > 1 && (
            <Link href={`/goals/${goal.id - 1}`} className="border border-white/50 text-white px-5 py-2 rounded-full text-sm">
              Back
            </Link>
          )}
        </div>
        <div>
          {goal.id < 17 && (
            <Link href={`/goals/${goal.id + 1}`} className="border border-white/50 text-white px-5 py-2 rounded-full text-sm">
              Next
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col h-[calc(100%-120px)] justify-center items-start px-16">
        <div className="flex items-start justify-start space-x-6">
            <div className="text-8xl font-bold leading-none text-black/40">{goal.id}</div>
            <div className="flex flex-col space-y-6">
                <h1 className="text-5xl w-1/2 font-bold uppercase tracking-wide">{goal.title}</h1>
                
                <p className="text-2xl font-bold">
                {goal.subtitle}
                </p>
                
                <button 
                    className="mt-8 flex items-center gap-2 hover:underline"
                >
                    <CircleArrowDown size={20} color="white"/>
                    <span>Find out more</span>
                </button>
            </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full" >
        <Image 
          src={goal.goal_header} 
          alt={`${goal.title} header graphic`}
          width={1200}
          height={200}
          className="w-full object-contain"
        />
      </div>
    </div>
  )
}

