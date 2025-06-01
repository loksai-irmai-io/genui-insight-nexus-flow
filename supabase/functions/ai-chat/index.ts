
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
    const { message } = await req.json();
    const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');

    console.log('AI Chat request received:', { message: message?.substring(0, 100) });

    if (!apiKey) {
      console.error('Google AI API key not configured');
      throw new Error('Google AI API key not configured');
    }

    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Making request to Google AI API...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful AI assistant for a data visualization platform called Gen-UI. The user asked: ${message}

Please provide a helpful response. If they ask about data visualization, outliers, process analysis, or specific widgets, be encouraging and suggest they try the available visualization tools.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    console.log('Google AI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google AI API error:', errorText);
      throw new Error(`Google AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Google AI API response received successfully');

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I was unable to generate a response. Please try again.';

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred while processing your request.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
