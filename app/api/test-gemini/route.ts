import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          success: false,
          error: 'GEMINI_API_KEY is not configured',
          message: 'Please add GEMINI_API_KEY to your .env.local file'
        },
        { status: 500 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY.trim()
    console.log('Testing API key, length:', apiKey.length)

    // Initialize Gemini AI client
    const genAI = new GoogleGenerativeAI(apiKey)

    // Try the simplest model first - gemini-pro (text only, but should work)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 100,
      },
    })

    // Make a simple test request
    const result = await model.generateContent("Say 'Hello' in one word")
    const response = result.response
    const text = response.text()

    return NextResponse.json({
      success: true,
      message: 'API key is valid and working!',
      testResponse: text,
      model: 'gemini-pro'
    })

  } catch (error: any) {
    const errorMessage = error?.message || String(error)
    const errorStatus = error?.status || error?.response?.status || error?.statusCode || error?.code
    const errorStatusText = error?.statusText || error?.response?.statusText

    console.error('Gemini API test failed:', {
      message: errorMessage,
      status: errorStatus,
      statusText: errorStatusText,
      error: error
    })

    return NextResponse.json({
      success: false,
      error: 'API key test failed',
      message: errorMessage,
      status: errorStatus,
      statusText: errorStatusText,
      details: error?.response?.data || error?.cause || 'No additional details'
    }, { status: 500 })
  }
}

