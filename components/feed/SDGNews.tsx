import { ArrowRight, Bookmark, MoreVertical, Check } from "lucide-react";
import { useEffect, useState } from "react";

interface Article {
  id: string;
  title: string;
  source: string;
  verified: boolean;
  timeToRead: string;
  imageUrl: string;
  summary: string;
}

const SDGNews = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching articles
    const mockArticles = Array(10).fill(null).map((_, index) => ({
      id: `article-${index}`,
      title: "Special Envoy Marsudi Discusses the Global Water Agenda in 2026 UN Water Conference Co-Host UAE",
      source: "The Hindu",
      verified: true,
      timeToRead: "7 mins read",
      imageUrl: "/feed/Card News.png",
      summary: "The 2026 UN Conference on Water must be concrete and action-oriented, so that it produces tangible results in increasing access to water and sanitation across the developing world."
    }));
    
    setArticles(mockArticles);
    setIsLoading(false);
  }, []);

  // News sections
  const sections = [
    { id: "trending", title: "Trending News" },
    { id: "top", title: "Top News" },
    { id: "breaking", title: "Breaking News" }
  ];

  const ArticleCard = ({ article }: { article: Article }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md mb-4">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/3 md:w-1/4 h-40 sm:h-auto">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full sm:w-2/3 md:w-3/4 p-4 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">{article.title}</h2>
            <div className="flex items-center mb-2 text-sm text-gray-500">
              <span>{article.source}</span>
              {article.verified && (
                <div className="ml-2 bg-gray-100 rounded-full p-0.5">
                  <Check size={14} className="text-gray-500" />
                </div>
              )}
              <span className="mx-3">•</span>
              <span>{article.timeToRead}</span>
            </div>
            <p className="text-gray-700 text-sm line-clamp-2">{article.summary}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Bookmark size={20} />
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const NewsSection = ({ 
    title, 
    articleIds, 
    allArticles 
  }: { 
    title: string; 
    articleIds: string[];
    allArticles: Article[];
  }) => {
    const sectionArticles = allArticles.filter(article => 
      articleIds.includes(article.id)
    ).slice(0, 2);

    return (
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <a href="#" className="text-gray-500 flex items-center hover:text-gray-700 transition-colors">
            <span className="mr-1">See all</span>
            <ArrowRight size={16} />
          </a>
        </div>
        <div className="space-y-4">
          {sectionArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-10">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            {[1, 2].map((j) => (
              <div key={j} className="flex mb-4 bg-gray-100 rounded-xl h-40"></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {sections.map((section) => (
        <NewsSection 
          key={section.id}
          title={section.title} 
          articleIds={articles.map(a => a.id)} // In a real app, you'd filter by category
          allArticles={articles}
        />
      ))}
    </div>
  );
};

export default SDGNews;