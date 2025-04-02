import Image from "next/image"

interface TargetProps {
  target: {
    id: string
    title: string
    description: string
  }
  color: string
}

export default function TargetCard({ target, color }: TargetProps) {
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <div className="w-16 h-16 flex items-center justify-center text-white" style={{ backgroundColor: color }}>
          <div className="text-center">
            <div className="text-xs">TARGET</div>
            <div className="text-sm font-bold">{target.id}</div>
          </div>
        </div>
        {/* <div className="w-16 h-16 flex items-center justify-center bg-gray-200">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt={target.title}
            width={40}
            height={40}
            className="opacity-70"
          />
        </div> */}
      </div>

      <h4 className="font-bold text-lg mb-2">{target.title}</h4>
      <p className="text-md text-gray-700">{target.description}</p>
    </div>
  )
}

