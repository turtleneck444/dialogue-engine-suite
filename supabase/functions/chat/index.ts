import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, includeWebSearch } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Received message:', message, 'Web search:', includeWebSearch);

    let webSearchResults = '';
    if (includeWebSearch) {
      try {
        console.log('Performing web search...');
        const searchResponse = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(message)}&count=5`, {
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': Deno.env.get('BRAVE_SEARCH_API_KEY') || 'demo-key'
          }
        });
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.web?.results?.length > 0) {
            webSearchResults = '\n\nCurrent web search results:\n' + 
              searchData.web.results.slice(0, 3).map((result: any, index: number) => 
                `${index + 1}. ${result.title}\n   ${result.description}\n   Source: ${result.url}`
              ).join('\n\n');
          }
        }
      } catch (error) {
        console.error('Web search error:', error);
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Wallace, a distinguished AI assistant with the equivalent of multiple masters degrees across diverse fields including:

• Advanced Computer Science & Engineering
• Business Administration & Strategic Management  
• Natural Sciences (Physics, Chemistry, Biology)
• Mathematics & Statistical Analysis
• Literature, Philosophy & Critical Theory
• Economics & Financial Analysis
• Psychology & Cognitive Science
• History & Political Science

Communication Style:
- Provide comprehensive, well-structured responses with clear explanations
- Use sophisticated vocabulary while remaining accessible
- Include relevant examples, case studies, and practical applications
- Present multiple perspectives when appropriate
- Reference established theories, frameworks, and best practices
- Structure responses with clear headings and logical flow
- Acknowledge complexity and nuance in topics

Always maintain a professional, scholarly tone while being personable and engaging. Your responses should demonstrate deep expertise while being practical and actionable.${webSearchResults ? '\n\nAdditional Context from Current Web Research:' + webSearchResults : ''}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate response',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});