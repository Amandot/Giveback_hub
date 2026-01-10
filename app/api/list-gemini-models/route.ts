import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          success: false,
          error: 'GEMINI_API_KEY is not configured'
        },
        { status: 500 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY.trim()
    const genAI = new GoogleGenerativeAI(apiKey)

    // List available models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({
        success: false,
        error: `Failed to list models: ${response.status} ${response.statusText}`,
        details: errorText
      }, { status: response.status })
    }

    const data = await response.json()
    
    // Filter for models that support generateContent
    const availableModels = data.models?.filter((model: any) => 
      model.supportedGenerationMethods?.includes('generateContent')
    ) || []

    return NextResponse.json({
      success: true,
      models: availableModels.map((model: any) => ({
        name: model.name,
        displayName: model.displayName,
        supportedMethods: model.supportedGenerationMethods,
        description: model.description
      })),
      allModels: data.models || []
    })

  } catch (error: any) {
    console.error('Error listing models:', error)
    return NextResponse.json({
      success: false,
      error: error?.message || String(error)
    }, { status: 500 })
  }
}

