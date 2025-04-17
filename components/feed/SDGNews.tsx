import { SDG_NEWS } from "@/lib/constants/index-constants";
import { formatDate } from "@/lib/utilities/formatDate";
import { formatSDGLink } from "@/lib/utilities/sdgLinkFormat";
import { ArrowRight, Bookmark, MoreVertical, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface Article {
  _id: string;
  title: string;
  publisher: string;
  link: string;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
//   imageUrl: string;
}

export const ArticleCard = ({ article }: { article: Article }) => {
    const [isActive, setIsActive] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <Link href={formatSDGLink(article.link)} target="_blank" className=" rounded-2xl overflow-hidden shadow-sm  transition-all duration-300 hover:shadow-md mb-4 flex flex-col sm:flex-row">
            {/* <div className="w-full sm:w-1/3 md:w-1/4 h-40 sm:h-auto">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div> */}
            {/* sm:w-2/3 md:w-3/4 */}
            <div className="w-full border rounded-2xl  p-4 flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-lg sm:text-xl mb-2">{article.title}</h2>
                <div className="flex items-center mb-2 font-semibold text-sm text-gray-500">
                  <span>{article.publisher}</span>
                  <span className="mx-3">•</span>
                  <span>{formatDate(article.updatedAt)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4" onClick={(e) => e.stopPropagation()}>
                <button aria-label="bookmark" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Bookmark size={20} className={`${isActive ? "fill-current text-accent" : "text-gray-500"}`} />
                </button>
                <button 
                  aria-label="more_options" 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
        </Link>
    );
};


const SDGNews = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  

  const News = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/sdgNews');
      
      if (!response.ok) {
        throw new Error('Failed to fetch SDG news');
      }
      
      const data = await response.json();
      setArticles(data.data || []);
    } catch (error) {
      console.error('Error fetching SDG news:', error);
    } finally {
      setIsLoading(false);
    }
  }

//   useEffect(() => {
//     News()
// }, []);



  
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
      articleIds.includes(article._id)
    );

    return (
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          {/* <a href="#" className="text-gray-500 flex items-center hover:text-gray-700 transition-colors">
            <span className="mr-1">See all</span>
            <ArrowRight size={16} />
          </a> */}
        </div>
        <div className="space-y-4">
          {sectionArticles.map((article, index) => (
            <ArticleCard key={`${article._id}-${index}`} article={article} />
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
              <div key={j} className="flex mb-4 bg-gray-100 rounded-2xl h-40"></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {SDG_NEWS.map((section) => (
        <NewsSection 
          key={section.id}
          title={section.title} 
          articleIds={articles.map(a => a._id)} // In a real app, you'd filter by category
          allArticles={articles}
        />
      ))}
    </div>
  );
};

export default SDGNews;