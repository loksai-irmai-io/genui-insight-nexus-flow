
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsData {
  articles: NewsArticle[];
}

export const NewsWidget = () => {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'general', 'business', 'entertainment', 'health', 
    'science', 'sports', 'technology'
  ];

  const fetchNews = async (selectedCategory: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching news for category:', selectedCategory);
      const { data, error } = await supabase.functions.invoke('news', {
        body: { category: selectedCategory }
      });

      console.log('News API response:', { data, error });

      if (error) {
        console.error('News API error:', error);
        throw error;
      }
      
      if (data && data.articles) {
        setNewsData(data);
        console.log('News data set successfully:', data.articles.length, 'articles');
      } else {
        throw new Error('No articles found in response');
      }
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to fetch news data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('NewsWidget mounted, fetching initial news...');
    fetchNews(category);
  }, [category]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-white/10 border-white/20 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center">
            <Newspaper className="w-5 h-5 mr-2 text-blue-400" />
            Latest News
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchNews(category)}
            disabled={loading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={category === cat ? "default" : "outline"}
              className={`cursor-pointer capitalize ${
                category === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {loading && (
          <div className="text-center text-white/70 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
            Loading latest news...
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm p-4 bg-red-400/10 rounded border border-red-400/20">
            <div className="font-semibold mb-1">Error loading news:</div>
            {error}
          </div>
        )}

        {newsData && newsData.articles && newsData.articles.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {newsData.articles.map((article, index) => (
              <div 
                key={index}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors border border-white/10"
              >
                <div className="flex space-x-3">
                  {article.urlToImage && (
                    <img 
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm line-clamp-2 mb-2">
                      {article.title}
                    </h4>
                    {article.description && (
                      <p className="text-white/70 text-xs line-clamp-2 mb-2">
                        {article.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-white/60">
                        <span>{article.source.name}</span>
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300 h-6 px-2"
                        onClick={() => window.open(article.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {newsData && newsData.articles && newsData.articles.length === 0 && (
          <div className="text-center text-white/60 py-8">
            No news articles found for this category.
          </div>
        )}
      </div>
    </Card>
  );
};
