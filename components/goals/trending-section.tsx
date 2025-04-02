import Link from "next/link"
import { trendingNews } from "@/constants/trending"

export default function TrendingSection() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Trending Now</h2>
      <p className="text-sm text-gray-500 mb-4">@TheSDG story</p>

      <div className="space-y-4">
        {trendingNews.map((item, index) => (
          <div key={index} className="border-b pb-2">
            <Link href="#" className="text-sm font-medium hover:underline">
              {item.title}
            </Link>
            <p className="text-xs text-gray-500">
              {item.time} ago · {item.readers} readers
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

