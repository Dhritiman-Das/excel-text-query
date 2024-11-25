// lib/openai.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSQLQuery(userQuery: string): Promise<string> {
  const prompt = `
    Given the following table structure for used car listings:
    
    Table: CarListing
    Columns:
    - id (Int)
    - brand (String, nullable) - Example: Honda, Toyota
    - model (String, nullable) - Example: City, Innova
    - year (Int, nullable) - Example: 2001, 2009
    - age (Int, nullable) - Example: 23, 15
    - kmDriven (String, nullable) - Example: "98,000 km", "190000.0 km"
    - transmission (String, nullable) - Example: Manual
    - owner (String, nullable) - Example: first, second
    - fuelType (String, nullable) - Example: Petrol, Diesel 
    - postedDate (String, nullable) - Example: Nov-24, Jul-24
    - description (String, nullable)
    - askPrice (String, nullable) - Example: "₹ 1,95,000". Notice a space between ₹ and the price.
    - askPriceInInt (Int, nullable) - Example: 195000. This is the asking price in int. For querying purposes use this field. \`askPrice\` ₹ 17,25,000 will be converted to \`askPriceInInt\` ₹ 17,25,000

    Convert this natural language query to SQL:
    "${userQuery}"
    
    Keep the following points in mind:
    - Mention the table name and the property names explicitly in double quotes for example: SELECT * FROM "CarListing" ORDER BY year DESC LIMIT 1;
    - Return at max 25 results.
    - The table has indexes on [brand, model], [brand, fuelType], and [askPrice]
    - All fields are nullable, so use appropriate NULL handling
    - kmDriven and askPrice are stored as strings with their units/currency symbols
    
    Return only the SQL query without any explanation.
    `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4",
    temperature: 0.2, // Lower temperature for more consistent SQL generation
  });

  return completion.choices[0].message.content || "";
}

export async function streamOutputResponse(query: string, results: any) {
  const prompt = `User message: "${query}" and the Prisma ORM results: ${JSON.stringify(
    results
  )}, provide a response.`;

  const stream = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a helper function who will receive an user message and a prisma ORM result for that response. The result might be an error too. Return a human like response.",
      },
      { role: "user", content: prompt },
    ],
    stream: true,
    temperature: 0.7, // Balanced temperature for natural responses
  });

  return stream;
}
