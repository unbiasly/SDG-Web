'use client'
import Link from "next/link"
import { CircleArrowDown } from "lucide-react"
import Image from "next/image"
import { sdgGoals } from "@/lib/constants/goal-constants"
import { slugify } from "@/lib/utilities/slugify"

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
  // Find previous and next goals for navigation
  const currentIndex = sdgGoals.findIndex(g => g.id === goal.id)
  const prevGoal = currentIndex > 0 ? sdgGoals[currentIndex - 1] : null
  const nextGoal = currentIndex < sdgGoals.length - 1 ? sdgGoals[currentIndex + 1] : null

  // Generate slugs for the prev and next goals
  const prevSlug = prevGoal ? slugify(prevGoal.title) : null
  const nextSlug = nextGoal ? slugify(nextGoal.title) : null
    console.log("Goal Header", goal.color)
  return (
    <div className='goal-base  rounded-2xl aspect-[9/16] w-full flex flex-col justify-between p-3 sm:p-5 text-white relative' style={{ backgroundColor: goal.color }}>
      {/* Navigation buttons at the top with higher z-index */}
      <div className="flex justify-between mb-2 sm:mb-4 z-20 relative">
        <div>
          {prevGoal && (
            <Link 
              href={`/goals/${prevSlug}`} 
              className="border cursor-pointer border-white/50 text-white px-3 sm:px-5 py-1 sm:py-2 rounded-full text-xs sm:text-sm"
            >
              Back
            </Link>
          )}
        </div>
        <div>
          {nextGoal && (
            <Link 
              href={`/goals/${nextSlug}`} 
              className="border cursor-pointer border-white/50 text-white px-3 sm:px-5 py-1 sm:py-2 rounded-full text-xs sm:text-sm"
            >
              Next
            </Link>
          )}
        </div>
      </div>

      {/* Content section with proper responsive sizing */}
      <div className="flex-1 flex items-center px-2 sm:px-6 md:px-12 relative z-10 min-h-0">
        <div className="flex items-start justify-start space-x-2 sm:space-x-4 md:space-x-6">
          <div className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-none text-black/40">{goal.id}</div>
          <div className="flex flex-col space-y-1 sm:space-y-2 md:space-y-4">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-wide">{goal.title}</h1>
              
              <p className="text-xs sm:text-sm md:text-xl font-bold">
              {goal.subtitle}
              </p>
            <div 
              className="flex items-center mt-2 sm:mt-4 cursor-pointer hover:underline transition-colors"
              onClick={() => {
                // Find content below this component
                const goalBase = document.querySelector('.goal-base');
                const nextSection = goalBase?.nextElementSibling;
                
                if (nextSection) {
                  // Scroll to the next section
                  nextSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                } else {
                  // Fallback: scroll to the bottom of the page
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                  });
                }
              }}
            >
                <span className="text-xs sm:text-sm md:text-base">Find out more</span>
                <CircleArrowDown color="white" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Image as absolute positioned overlay with responsive height */}
      <div className={`absolute bottom-0 left-0 w-full ${goal.id === 5 ? 'h-1/4' : 'h-full'} z-0 overflow-hidden goal-image-section`}>
        <Image 
          src={goal.goal_header} 
          alt={`${goal.title} header graphic`}
          fill
          className="object-contain object-bottom"
          priority
        />
      </div>
    </div>
  )
}

