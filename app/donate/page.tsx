"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle, Package, Users, Heart, MapPin, Building, CreditCard, Gift, IndianRupee, Truck, Calendar, Clock, Sparkles, Upload, X, Loader2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface AIAnalysisResult {
  valid: boolean
  itemName?: string
  category?: string
  suggestedDescription?: string
  message?: string
}

interface AIImageUploadProps {
  onAnalysisComplete: (result: AIAnalysisResult) => void
}

function AIImageUpload({ onAnalysisComplete }: AIImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.")
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("Image size must be less than 5MB.")
      return
    }

    setUploadedImage(file)
    setImagePreview(URL.createObjectURL(file))
    
    // Start AI analysis
    await analyzeImage(file)
  }

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true)
    setAiAnalysis(null)

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file)
      
      const response = await fetch('/api/analyze-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to analyze image')
      }

      setAiAnalysis(result)
      onAnalysisComplete(result)

    } catch (error) {
      console.error('Error analyzing image:', error)
      const errorResult = {
        valid: false,
        message: error instanceof Error ? error.message : 'Failed to analyze image. Please try again.'
      }
      setAiAnalysis(errorResult)
      onAnalysisComplete(errorResult)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const removeImage = () => {
    setUploadedImage(null)
    setImagePreview("")
    setAiAnalysis(null)
  }

  return (
    <div className="space-y-4">
      {!uploadedImage ? (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="ai-image-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-blue-600" />
              <p className="mb-2 text-sm text-blue-700">
                <span className="font-semibold">Click to upload</span> your donation item photo
              </p>
              <p className="text-xs text-blue-600">PNG, JPG, JPEG up to 5MB</p>
            </div>
            <input
              id="ai-image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isAnalyzing}
            />
          </label>
        </div>
      ) : (
        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted max-w-md mx-auto">
            <img
              src={imagePreview}
              alt="Donation item"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-2 hover:bg-destructive/90 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* AI Analysis Status */}
      {isAnalyzing && (
        <Alert className="border-blue-200 bg-blue-50">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <AlertDescription className="text-blue-800">
            AI is analyzing your item... This may take a few seconds.
          </AlertDescription>
        </Alert>
      )}

      {aiAnalysis && !isAnalyzing && (
        <Alert className={aiAnalysis.valid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {aiAnalysis.valid ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={aiAnalysis.valid ? "text-green-800" : "text-red-800"}>
            {aiAnalysis.valid ? (
              <>
                <strong>Great!</strong> AI identified your item as: <strong>{aiAnalysis.itemName}</strong>
                <br />
                Category: {aiAnalysis.category}
                <br />
                <span className="text-xs">Form fields have been auto-filled below. You can edit them if needed.</span>
              </>
            ) : (
              <>
                <strong>Invalid Item:</strong> {aiAnalysis.message}
                <br />
                <span className="text-xs">Please upload a clear photo of a physical item suitable for donation (clothes, books, toys, etc.)</span>
              </>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

interface NGO {
  id: string
  name: string
  description: string
  email: string
  address: string | null
  phone: string | null
  website: string | null
  latitude: number
  longitude: number
  city: string
  createdAt: string
}

function DonatePageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [ngos, setNgos] = useState<NGO[]>([])
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null)
  const [showMap, setShowMap] = useState(false)

  const [donationType, setDonationType] = useState<'money' | 'items'>('money')
  const [aiFilledData, setAiFilledData] = useState<{itemName?: string, category?: string, description?: string}>({})
  const [formData, setFormData] = useState({
    // Common fields
    fullName: '',
    email: '',
    ngoId: 'general',
    
    // Money donation fields
    amount: '',
    customAmount: '',
    
    // Item donation fields
    itemName: '',
    quantity: '',
    description: '',
    category: '',
    additionalDetails: '',
    
    // Pickup service fields
    needsPickup: false,
    pickupDate: '',
    pickupTime: '',
    pickupAddress: '',
    pickupNotes: ''
  })

  // Load NGOs and handle URL parameters
  useEffect(() => {
    // Load NGOs
    fetch('/api/ngos')
      .then(res => res.json())
      .then(data => {
        setNgos(data.ngos || [])
        
        // Handle pre-selected NGO from URL
        const ngoParam = searchParams.get('ngo')
        if (ngoParam && data.ngos) {
          const preSelectedNGO = data.ngos.find((ngo: NGO) => ngo.id === ngoParam)
          if (preSelectedNGO) {
            setSelectedNGO(preSelectedNGO)
            setFormData(prev => ({ ...prev, ngoId: preSelectedNGO.id }))
          }
        }
      })
      .catch(err => console.error('Failed to load NGOs:', err))
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleNGOSelect = (ngoId: string) => {
    if (ngoId === 'general') {
      setSelectedNGO(null)
    } else {
      const ngo = ngos.find(n => n.id === ngoId)
      setSelectedNGO(ngo || null)
    }
    setFormData(prev => ({ ...prev, ngoId }))
  }

  const handleMapNGOSelect = (ngo: NGO) => {
    setSelectedNGO(ngo)
    setFormData(prev => ({ ...prev, ngoId: ngo.id }))
    setShowMap(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      setErrorMessage('You must be logged in to submit a donation.')
      setSubmitStatus('error')
      return
    }

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setErrorMessage('Please fill in your name and email.')
      setSubmitStatus('error')
      return
    }

    if (donationType === 'money') {
      const amount = formData.customAmount || formData.amount
      if (!amount || parseFloat(amount) <= 0) {
        setErrorMessage('Please select or enter a valid donation amount.')
        setSubmitStatus('error')
        return
      }
    }

    if (donationType === 'items') {
      if (!formData.category.trim()) {
        setErrorMessage('Please select a donation category.')
        setSubmitStatus('error')
        return
      }
      
      if (!formData.quantity.trim()) {
        setErrorMessage('Please provide an item name/description.')
        setSubmitStatus('error')
        return
      }
      
      // Validate pickup service if needed
      if (formData.needsPickup) {
        if (!formData.pickupDate || !formData.pickupTime || !formData.pickupAddress.trim()) {
          setErrorMessage('Please fill in all pickup service details: date, time, and address.')
          setSubmitStatus('error')
          return
        }
        
        // Validate pickup date is not in the past
        const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`)
        if (pickupDateTime < new Date()) {
          setErrorMessage('Pickup date and time cannot be in the past.')
          setSubmitStatus('error')
          return
        }
      }
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationType: donationType === 'money' ? 'MONEY' : 'ITEMS',
          ngoId: formData.ngoId === 'general' ? null : formData.ngoId,
          ...(donationType === 'money' ? {
            amount: parseFloat(formData.customAmount || formData.amount)
          } : {
            itemName: formData.quantity.trim() || formData.category, // Use quantity field as item name
            quantity: 1, // Default quantity
            description: formData.additionalDetails.trim() || formData.quantity.trim() || formData.category,
            // Include pickup service data for items
            needsPickup: formData.needsPickup,
            ...(formData.needsPickup && {
              pickupDate: formData.pickupDate,
              pickupTime: formData.pickupTime,
              pickupAddress: formData.pickupAddress,
              pickupNotes: formData.pickupNotes
            })
          })
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit donation')
      }

      setSubmitStatus('success')
      setFormData({
        fullName: '',
        email: '',
        ngoId: 'general',
        amount: '',
        customAmount: '',
        itemName: '',
        quantity: '',
        description: '',
        category: '',
        additionalDetails: '',
        needsPickup: false,
        pickupDate: '',
        pickupTime: '',
        pickupAddress: '',
        pickupNotes: ''
      })
      setSelectedNGO(null)

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error) {
      console.error('Error submitting donation:', error)
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000]  // In INR
  const donationCategories = [
    'Food & Beverages',
    'Clothing & Textiles', 
    'Books & Educational Materials',
    'Medical Supplies',
    'Electronics & Appliances',
    'Toys & Games',
    'Household Items',
    'Sports Equipment',
    'Other'
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Make a Donation</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Share your resources with those in need. Every donation makes a difference in someone's life.
        </p>
      </div>

      {/* Main Donation Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Choose Your Donation Type</CardTitle>
          <CardDescription className="text-center">
            Select how you'd like to contribute to our cause
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitStatus === 'success' && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Thank you! Your donation has been submitted successfully. You'll receive an email confirmation.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donation Type Selector */}
            <div className="space-y-4">
              <RadioGroup value={donationType} onValueChange={(value) => setDonationType(value as 'money' | 'items')} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="money" id="money" className="peer sr-only" />
                  <Label
                    htmlFor="money"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all",
                      donationType === 'money' && "border-primary bg-primary/5"
                    )}
                  >
                    <CreditCard className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">Donate Money</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="items" id="items" className="peer sr-only" />
                  <Label
                    htmlFor="items"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all",
                      donationType === 'items' && "border-primary bg-primary/5"
                    )}
                  >
                    <Gift className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">Donate Items</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Money Donation Fields */}
            {donationType === 'money' && (
              <div className="space-y-4">
                <div>
                  <Label>Donation Amount * (INR)</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {predefinedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={formData.amount === amount.toString() ? "default" : "outline"}
                        className="h-12 text-lg"
                        onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString(), customAmount: '' }))}
                        disabled={isSubmitting}
                      >
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {amount}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customAmount">Custom Amount</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="customAmount"
                      name="customAmount"
                      type="number"
                      placeholder="Enter custom amount"
                      className="pl-9"
                      value={formData.customAmount}
                      onChange={(e) => {
                        handleInputChange(e)
                        setFormData(prev => ({ ...prev, amount: '' }))
                      }}
                      min="1"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Secure payment processing powered by Stripe. Your payment information is encrypted and safe.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Items Donation Fields */}
            {donationType === 'items' && (
              <div className="space-y-6">
                {/* AI-Powered Image Upload Section */}
                <div className="space-y-4">
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        <Label className="text-base font-medium text-blue-900">
                          AI-Powered Item Recognition
                        </Label>
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          Smart
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-blue-700 mb-4">
                        Upload a photo of your donation item and our AI will automatically identify it and validate if it's suitable for donation.
                      </p>

                      <AIImageUpload 
                        onAnalysisComplete={(result) => {
                          if (result.valid) {
                            setAiFilledData({
                              itemName: result.itemName,
                              category: result.category,
                              description: result.suggestedDescription
                            })
                            setFormData(prev => ({
                              ...prev,
                              category: result.category || prev.category,
                              quantity: result.itemName || prev.quantity,
                              additionalDetails: result.suggestedDescription || prev.additionalDetails
                            }))
                          } else {
                            setAiFilledData({})
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Label htmlFor="category">Donation Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select donation category" />
                    </SelectTrigger>
                    <SelectContent>
                      {donationCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.category && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ✨ {aiFilledData.category ? 'Auto-selected by AI' : 'Manually selected'}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="quantity">Item Name/Description *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    placeholder="e.g., Blue Denim Jacket, Children's Books, Canned Food"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                  {formData.quantity && formData.quantity.length > 3 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ✨ {aiFilledData.itemName ? 'Auto-filled by AI analysis' : 'Manually entered'}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="additionalDetails">Additional Details</Label>
                  <Textarea
                    id="additionalDetails"
                    name="additionalDetails"
                    placeholder="Describe the items, condition, pickup preferences, etc."
                    value={formData.additionalDetails}
                    onChange={handleInputChange}
                    rows={4}
                    disabled={isSubmitting}
                  />
                  {formData.additionalDetails && formData.additionalDetails.length > 10 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ✨ {aiFilledData.description ? 'Enhanced by AI analysis' : 'Manually entered'}
                    </p>
                  )}
                </div>

                {/* Pickup Service Section */}
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="needsPickup" 
                      checked={formData.needsPickup}
                      onCheckedChange={(checked) => handleCheckboxChange('needsPickup', checked as boolean)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="needsPickup" className="text-sm font-medium flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      Request pickup service for donated items
                    </Label>
                  </div>
                  
                  {formData.needsPickup && (
                    <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pickupDate" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Pickup Date *
                          </Label>
                          <Input
                            id="pickupDate"
                            name="pickupDate"
                            type="date"
                            value={formData.pickupDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            required={formData.needsPickup}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pickupTime" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Pickup Time *
                          </Label>
                          <Input
                            id="pickupTime"
                            name="pickupTime"
                            type="time"
                            value={formData.pickupTime}
                            onChange={handleInputChange}
                            required={formData.needsPickup}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="pickupAddress" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Pickup Address *
                        </Label>
                        <Textarea
                          id="pickupAddress"
                          name="pickupAddress"
                          placeholder="Enter the full address where items should be picked up from"
                          value={formData.pickupAddress}
                          onChange={handleInputChange}
                          rows={2}
                          required={formData.needsPickup}
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="pickupNotes">Special Instructions (Optional)</Label>
                        <Textarea
                          id="pickupNotes"
                          name="pickupNotes"
                          placeholder="Any special instructions for pickup (e.g., gate code, floor number, best contact method)"
                          value={formData.pickupNotes}
                          onChange={handleInputChange}
                          rows={2}
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start gap-2 text-yellow-800">
                          <Truck className="h-4 w-4 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium">Pickup Service Information:</p>
                            <ul className="mt-1 space-y-1 text-xs">
                              <li>• Our team will arrive within 2 hours of scheduled time</li>
                              <li>• Someone must be present to hand over the items</li>
                              <li>• We'll call 30 minutes before arrival</li>
                              <li>• Service is free for donations worth ₹500 or more</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {formData.needsPickup 
                        ? "We'll pick up your donation at the scheduled time and location."
                        : "We'll contact you within 24 hours to arrange pickup or drop-off at one of our locations."
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 text-lg" 
              disabled={isSubmitting}
            >
              {donationType === 'money' ? (
                isSubmitting ? (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </>
                )
              ) : (
                isSubmitting ? (
                  <>
                    <Gift className="mr-2 h-4 w-4" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 h-4 w-4" />
                    Submit Item Donation
                  </>
                )
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
export default function DonatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <DonatePageContent />
    </Suspense>
  )
}