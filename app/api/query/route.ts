// app/api/query/route.ts
import { NextResponse } from "next/server";
import { generateSQLQuery, streamOutputResponse } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Helper function to transform BigInt values
function transformBigIntToNumber(data: any): any {
  if (data === null || data === undefined) return data;

  if (typeof data === "bigint") {
    return Number(data);
  }

  if (Array.isArray(data)) {
    return data.map(transformBigIntToNumber);
  }

  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        transformBigIntToNumber(value),
      ])
    );
  }

  return data;
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // Generate SQL query using OpenAI
    const sqlQuery = await generateSQLQuery(query);
    console.log({ sqlQuery });

    // Execute the query using Prisma's raw query capability
    // Use Prisma.sql to properly escape and format the SQL query
    const rawResults = await prisma.$queryRaw(
      Prisma.sql`${Prisma.raw(sqlQuery)}`
    );

    // Transform BigInt values to regular numbers
    const results = transformBigIntToNumber(rawResults);

    // Get the streaming response
    const stream = await streamOutputResponse(query, results);

    // Create text encoder for streaming
    const encoder = new TextEncoder();

    // Create and return a readable stream
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    // Return the streaming response
    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Query processing error:", error);
    // Enhanced error logging
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      {
        error: "Failed to process query",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
