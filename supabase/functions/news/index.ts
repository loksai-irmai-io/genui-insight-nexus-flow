
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category = 'general', country = 'us' } = await req.json();
    const apiKey = Deno.env.get('NEWS_API_KEY');

    console.log('News API request:', { category, country });

    if (!apiKey) {
      throw new Error('News API key not configured');
    }

    const newsResponse = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&pageSize=10`
    );

    if (!newsResponse.ok) {
      const errorText = await newsResponse.text();
      console.error('News API error response:', errorText);
      throw new Error(`News API error: ${newsResponse.status} - ${errorText}`);
    }

    const newsData = await newsResponse.json();
    console.log('News API success:', { articleCount: newsData.articles?.length });

    return new Response(JSON.stringify(newsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('News API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
