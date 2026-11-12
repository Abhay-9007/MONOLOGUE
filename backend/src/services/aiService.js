export async function askAI({system, messages}) {
  if (process.env.AI_PROVIDER !== 'gemini' || !process.env.GEMINI_API_KEY)
    throw Object.assign(new Error('AI is not configured. Add GEMINI_API_KEY and set AI_PROVIDER=gemini in backend/.env.'),{status:503});
  const model=process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const contents=messages.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]}));
  const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents,generationConfig:{temperature:0.7,maxOutputTokens:1200}})
  });
  const data=await response.json();
  if(!response.ok) throw Object.assign(new Error(data.error?.message || 'AI provider request failed.'),{status:502});
  return data.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('') || 'I could not generate a response. Please try again.';
}
