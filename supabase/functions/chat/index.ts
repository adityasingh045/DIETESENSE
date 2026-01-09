// import { serve } from 'https://deno.land/std/http/server.ts';

// serve(async (req) => {
//   const { message } = await req.json();

//   // Fetch recipes from DB (simplified)
//   const recipesRes = await fetch(
//     `${Deno.env.get('SUPABASE_URL')}/rest/v1/recipes?select=name,meal_type,description`,
//     {
//       headers: {
//         apikey: Deno.env.get('SUPABASE_ANON_KEY'),
//         Authorization: `Bearer ${Deno.env.get('SERVICE_ROLE_KEY')}`,
//       },
//     }
//   );

//   const recipes = await recipesRes.json();

//   const prompt = `
// You are a food assistant.

// User question: "${message}"

// Available recipes:
// ${recipes.map(r => `- ${r.name} (${r.meal_type})`).join('\n')}

// Answer helpfully.
// `;

//   const aiRes = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }]
//       })
//     }
//   );

//   const aiData = await aiRes.json();

//   return new Response(
//     JSON.stringify({
//       reply: aiData.candidates[0].content.parts[0].text
//     }),
//     { headers: { 'Content-Type': 'application/json' } }
//   );
// });
