"use client"

import { useState, useEffect } from 'react'
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
import { CheckCircle, Package, Users, Heart, MapPin, Building, CreditCard, Gift, IndianRupee, Truck, Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Dynamically import map to avoid SSR issues
const GoogleMap = dynamic(() => import('@/components/google-map'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
})

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

export default function DonatePage() {
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
      // Description is optional, but if no additional details, use category as description
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
            itemName: formData.category,
            quantity: parseInt(formData.quantity.trim()) || 1,
            description: formData.additionalDetails.trim() || formData.category,
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
              <div className="space-y-4">
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
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity/Description</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    placeholder="e.g., 5 bags of clothes, 20 canned goods"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
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
