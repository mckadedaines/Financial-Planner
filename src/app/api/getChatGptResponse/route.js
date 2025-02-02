/**
 * API route for interacting with OpenAI's ChatGPT
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Fetch a response from ChatGPT with retry mechanism
 * @param {string} question - The user's question
 * @param {number} retries - Number of retry attempts remaining
 * @returns {Promise<string>} ChatGPT's response
 * @throws {Error} If the request fails after all retries
 */
async function fetchChatGptResponse(question, retries = 3) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }],
      max_tokens: 150,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    if (error.code === "insufficient_quota" && retries > 0) {
      // Wait 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchChatGptResponse(question, retries - 1);
    }
    throw error;
  }
}

/**
 * POST endpoint handler for ChatGPT API requests
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with ChatGPT's answer or error message
 */
export async function POST(request) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { message: "Question is required" },
        { status: 400 }
      );
    }

    const response = await fetchChatGptResponse(question);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error);

    let errorMessage = "Error fetching ChatGPT response";
    let statusCode = 500;

    if (error.code === "insufficient_quota") {
      errorMessage =
        "You have exceeded your quota for OpenAI API usage. Please check your plan and billing details.";
      statusCode = 429;
    } else if (error.code === "model_not_found") {
      errorMessage =
        "The model specified does not exist or you do not have access to it.";
      statusCode = 404;
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  }
}
