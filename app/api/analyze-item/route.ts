import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Initialize Gemini AI client
// Will be validated in the POST handler
const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables')
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

// Utility function to add delay between retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Retry wrapper function
async function retryWithDelay<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 2000
): Promise<T> {
  let lastError: any
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} - Calling Gemini API...`)
      return await fn()
    } catch (error: any) {
      lastError = error
      console.error(`Attempt ${attempt} failed:`, error?.message || error)
      
      // Don't retry on authentication errors
      if (error?.message?.includes('API_KEY') || error?.status === 401) {
        throw error
      }
      
      // If this isn't the last attempt, wait before retrying
      if (attempt < maxRetries) {
        console.log(`Waiting ${delayMs}ms before retry...`)
        await delay(delayMs)
      }
    }
  }
  
  throw lastError
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured')
      return NextResponse.json(
        { message: 'AI service is not configured. Please check your GEMINI_API_KEY environment variable.' },
        { status: 500 }
      )
    }

    // Validate API key format (should not be empty and should have some length)
    const apiKey = process.env.GEMINI_API_KEY.trim()
    if (!apiKey || apiKey.length < 20) {
      console.error('GEMINI_API_KEY appears to be invalid (too short or empty)')
      return NextResponse.json(
        { message: 'Invalid API key format. Please check your GEMINI_API_KEY environment variable.' },
        { status: 500 }
      )
    }

    console.log('API Key configured, length:', apiKey.length)

    // Initialize Gemini AI client
    const genAI = getGenAI()

    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: 'You must be logged in to analyze items.' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'USER') {
      return NextResponse.json(
        { message: 'Only users can analyze donation items.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { imageBase64 } = body

    if (!imageBase64) {
      return NextResponse.json(
        { message: 'Image data is required.' },
        { status: 400 }
      )
    }

    // Validate base64 format
    if (!imageBase64.startsWith('data:image/')) {
      return NextResponse.json(
        { message: 'Invalid image format. Please upload a valid image.' },
        { status: 400 }
      )
    }

    // Extract the base64 data without the data URL prefix
    const base64Data = imageBase64.split(',')[1]
    if (!base64Data) {
      return NextResponse.json(
        { message: 'Invalid image data format.' },
        { status: 400 }
      )
    }

    // Get the MIME type from the data URL
    const mimeType = imageBase64.split(';')[0].split(':')[1]

    // Optimized prompt for JSON response
    const prompt = `Analyze this image for a donation platform. Determine if it shows physical items suitable for donation.

VALID donation items include:
- School supplies (pens, pencils, markers, notebooks, paper)
- Clothing and accessories
- Books and educational materials
- Toys and games
- Electronics and appliances
- Household items and furniture
- Sports equipment
- Medical supplies
- Food items (canned, packaged)

INVALID items to reject:
- Screenshots or digital content
- Memes or inappropriate images
- Severely damaged items
- Hazardous materials

Respond with this exact JSON structure:
{
  "valid": true,
  "itemName": "Brief descriptive name of the item(s)",
  "category": "Books & Educational Materials",
  "suggestedDescription": "Description including condition and details"
}

For invalid items, respond with:
{
  "valid": false
}`

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    }

    // Call Gemini API with retry logic and model fallback
    const analysisResult = await retryWithDelay(async () => {
      console.log('Making request to Gemini API...')
      
      const apiKey = process.env.GEMINI_API_KEY!.trim()
      
      // First, try to get available models dynamically
      try {
        console.log('Fetching available models...')
        const modelsResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        )
        
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json()
          const availableModels = modelsData.models?.filter((m: any) => 
            m.supportedGenerationMethods?.includes('generateContent')
          ) || []
          
          console.log(`Found ${availableModels.length} available models`)
          
          if (availableModels.length > 0) {
            // Try models in order, prioritizing vision-capable ones
            const visionModels = availableModels.filter((m: any) => 
              m.name.toLowerCase().includes('vision') || 
              m.name.toLowerCase().includes('flash') ||
              m.name.toLowerCase().includes('1.5')
            )
            const modelsToTry = visionModels.length > 0 ? visionModels : availableModels
            
            for (const modelInfo of modelsToTry.slice(0, 3)) { // Try first 3 models
              try {
                const modelName = modelInfo.name.replace('models/', '')
                console.log(`Trying available model: ${modelName}`)
                
                const model = genAI.getGenerativeModel({ 
                  model: modelName,
                  generationConfig: {
                    temperature: 0.1,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 1024,
                  },
                })
                
                const result = await model.generateContent([prompt, imagePart])
                const response = result.response
                const text = response.text()
                
                // Parse JSON response
                let parsedResult
                try {
                  parsedResult = JSON.parse(text)
                } catch (parseError) {
                  const jsonMatch = text.match(/\{[\s\S]*\}/)
                  if (jsonMatch) {
                    parsedResult = JSON.parse(jsonMatch[0])
                  } else {
                    throw new Error('Invalid JSON response from AI')
                  }
                }
                
                console.log(`Success with model: ${modelName}`)
                return parsedResult
              } catch (modelError: any) {
                console.log(`Model ${modelInfo.name} failed:`, modelError?.message)
                continue
              }
            }
          }
        }
      } catch (listError) {
        console.log('Could not list models, using fallback names...', listError)
      }
      
      // Fallback: Try common model names
      const modelsToTry = [
        { name: "gemini-pro-vision", useJsonMode: false },
        { name: "gemini-1.5-flash", useJsonMode: false },
        { name: "gemini-pro", useJsonMode: false },
        { name: "gemini-1.5-pro", useJsonMode: false },
      ]
      
      let lastError: any
      for (const modelConfig of modelsToTry) {
        try {
          console.log(`Trying model: ${modelConfig.name} (JSON mode: ${modelConfig.useJsonMode})`)
          
          const modelConfigObj: any = {
            model: modelConfig.name,
            generationConfig: {
              temperature: 0.1,
              topK: 32,
              topP: 1,
              maxOutputTokens: 1024,
            },
          }
          
          // Only add JSON mode if supported
          if (modelConfig.useJsonMode) {
            modelConfigObj.generationConfig.responseMimeType = "application/json"
          }
          
          const model = genAI.getGenerativeModel(modelConfigObj)
          
          // Wrap the API call to catch any error format
          let result
          try {
            result = await model.generateContent([prompt, imagePart])
          } catch (apiError: any) {
            // Extract all possible error information
            const apiErrorMessage = apiError?.message || String(apiError)
            const apiErrorStatus = apiError?.status || apiError?.response?.status || apiError?.statusCode || apiError?.code
            const apiErrorStatusText = apiError?.statusText || apiError?.response?.statusText
            
            // Try to get more details from the error
            let errorDetails: any = {
              message: apiErrorMessage,
              status: apiErrorStatus,
              statusText: apiErrorStatusText,
            }
            
            // Check for Google API specific error format
            if (apiError?.response?.data) {
              errorDetails.responseData = apiError.response.data
            }
            if (apiError?.cause) {
              errorDetails.cause = apiError.cause
            }
            if (apiError?.stack) {
              errorDetails.stack = apiError.stack.split('\n').slice(0, 5).join('\n')
            }
            
            console.error(`generateContent API call failed for model ${modelConfig.name}:`, errorDetails)
            console.error('Full error object keys:', Object.keys(apiError))
            
            throw apiError
          }
          
          const response = result.response
          const text = response.text()
          
          console.log(`Success with ${modelConfig.name}! Raw response:`, text.substring(0, 200))
          
          // Parse JSON response
          let parsedResult
          try {
            parsedResult = JSON.parse(text)
          } catch (parseError) {
            // Try to extract JSON from response if it's wrapped in other text
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              parsedResult = JSON.parse(jsonMatch[0])
            } else {
              throw new Error('Invalid JSON response from AI')
            }
          }
          
          console.log('Parsed AI result:', parsedResult)
          return parsedResult
          
        } catch (error: any) {
          const errorMessage = error?.message || String(error)
          const errorStatus = error?.status || error?.response?.status || error?.statusCode
          const errorStatusText = error?.statusText || error?.response?.statusText
          
          console.error(`Model ${modelConfig.name} failed:`, errorMessage)
          console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
          console.error('Error details:', {
            status: errorStatus,
            statusText: errorStatusText,
            message: errorMessage,
            errorDetails: error?.errorDetails || error?.details,
            code: error?.code
          })
          
          lastError = error
          
          // Check for 404 in various formats
          const is404 = errorStatus === 404 || 
                       errorStatusText === 'Not Found' || 
                       errorMessage?.includes('404') ||
                       errorMessage?.includes('not found') ||
                       errorMessage?.includes('Model not found')
          
          if (is404) {
            console.log(`Model ${modelConfig.name} returned 404, trying next model...`)
            continue
          }
          
          // For API key errors, don't try other models
          if (errorMessage?.includes('API_KEY') || 
              errorMessage?.includes('API key') || 
              errorStatus === 401 ||
              errorMessage?.includes('authentication')) {
            throw error
          }
          
          // For other errors, continue to next model
          continue
        }
      }
      
      // If all models failed, throw the last error with more context
      if (lastError) {
        const errorMsg = lastError?.message || String(lastError)
        throw new Error(`All models failed. Last error: ${errorMsg}`)
      }
      throw new Error('All models failed - no error details available')
      
    }, 3, 2000) // 3 retries with 2-second delays

    // Validate the response structure
    if (typeof analysisResult.valid !== 'boolean') {
      return NextResponse.json(
        { message: 'Invalid analysis result format. Please try again.' },
        { status: 500 }
      )
    }

    // If invalid, return early
    if (!analysisResult.valid) {
      return NextResponse.json({
        valid: false,
        message: 'This image does not appear to show a physical item suitable for donation. Please upload a clear photo of the item you wish to donate.'
      })
    }

    // Validate required fields for valid items
    if (!analysisResult.itemName || !analysisResult.category || !analysisResult.suggestedDescription) {
      return NextResponse.json(
        { message: 'Incomplete analysis result. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      valid: true,
      itemName: analysisResult.itemName,
      category: analysisResult.category,
      suggestedDescription: analysisResult.suggestedDescription
    })

  } catch (error: any) {
    console.error('Error analyzing item:', error)
    const errorMessage = error?.message || String(error)
    const errorStatus = error?.status || error?.response?.status || error?.statusCode
    const errorStatusText = error?.statusText || error?.response?.statusText
    
    // Handle specific Gemini API errors
    const is404 = errorStatus === 404 || 
                 errorStatusText === 'Not Found' || 
                 errorMessage?.includes('404') ||
                 errorMessage?.includes('not found') ||
                 errorMessage?.includes('Model not found')
    
    if (is404) {
      console.error('404 Error from Gemini API:', {
        message: errorMessage,
        status: errorStatus,
        statusText: errorStatusText,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      })
      return NextResponse.json(
        { 
          message: 'AI model not available. Please verify your GEMINI_API_KEY is valid and has access to Gemini models. The API key may be invalid or the model may not be available in your region.',
          error: 'Model not found (404)'
        },
        { status: 503 }
      )
    }
    
    if (error?.status === 503 || error?.message?.includes('503')) {
      return NextResponse.json(
        { message: 'AI service temporarily overloaded. Please try again in a moment.' },
        { status: 503 }
      )
    }
    
    if (error?.message?.includes('API_KEY') || error?.message?.includes('API key') || error?.status === 401) {
      return NextResponse.json(
        { message: 'AI service configuration error. Please contact support.' },
        { status: 500 }
      )
    }
    
    if (error?.message?.includes('quota') || error?.message?.includes('limit')) {
      return NextResponse.json(
        { message: 'AI service quota exceeded. Please try again later.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { message: `Analysis failed: ${error?.message || 'Unknown error'}. Please try again.` },
      { status: 500 }
    )
  }
}