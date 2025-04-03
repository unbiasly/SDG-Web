import { sdgGoals } from "@/lib/constants/goal-constants"
import { notFound } from "next/navigation"
import GoalHeader from "@/components/goals/goal-header"
import TargetCard from "@/components/goals/target-card"

export default function GoalPage({ params }: { params: { id: string } }) {
  const goalId = Number.parseInt(params.id)
  const goal = sdgGoals.find((g) => g.id === goalId)

  if (!goal) {
    notFound()
  }

  return (
    <div className="flex flex-1 justify-center  overflow-hidden">
    <div className="p-4">
      <GoalHeader goal={goal} />

      <div className="mt-8">
        <h2 className="text-4xl font-black uppercase mb-2">{goal.subtitle}</h2>

        <p className="text-gray-800 mb-8">{goal.description}</p>

        <h3 className="text-4xl font-black mb-4">THE TARGETS</h3>

        <p className="mb-8">
          Everyone can help to make sure that we meet the Global Goals. Use these {goal.targets.length} targets to
          create action to {goal.subtitle.toLowerCase()}.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {goal.targets.map((target) => (
            <TargetCard key={target.id} target={target} color={goal.color} />
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}

