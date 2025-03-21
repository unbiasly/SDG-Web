import React from 'react';

interface TrendingItemProps {
  title: string;
  time: string;
  readers: string;
}

const TrendingItem: React.FC<TrendingItemProps> = ({ title, time, readers }) => {
  return (
    <div className="trending-item">
      <h4 className="text-sm font-medium mb-1">{title}</h4>
      <div className="flex items-center text-xs text-gray-500">
        <span>{time}</span>
        <span className="mx-1.5">•</span>
        <span>{readers} readers</span>
      </div>
    </div>
  );
};

export const TrendingSection: React.FC = () => {
  return (
    <div className="w-64 bg-white p-4 rounded-xl border border-gray-100 animate-fade-in">
      <h3 className="text-lg font-semibold mb-1">Trending Now</h3>
      <p className="text-xs text-sdg-blue mb-4">#TheSDG story</p>
      
      <div className="space-y-4">
        <TrendingItem 
          title="Perfios acquires CreditMantri"
          time="21 mins ago"
          readers="18,188 readers"
        />
        <TrendingItem 
          title="India wins ICC Championships Trophy"
          time="23 mins ago"
          readers="18,188 readers"
        />
        <TrendingItem 
          title="States bet on regional OTT"
          time="20 mins ago"
          readers="18,188 readers"
        />
        <TrendingItem 
          title="Independent director on demand"
          time="20 mins ago"
          readers="18,188 readers"
        />
        <TrendingItem 
          title="Non-metro regional OTT"
          time="20 mins ago"
          readers="18,188 readers"
        />
        <TrendingItem 
          title="Independent directors on demand"
          time="20 mins ago"
          readers="18,188 readers"
        />
      </div>
    </div>
  );
};