"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { APIURL } from "@/utils/env"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "sonner"
import {
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowRight,
  Search,
  Filter,
  Star,
  Users,
  Zap,
  Shield,
  Home,
  ChevronRight,
  Grid3X3,
  List,
  SlidersHorizontal
} from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  name: string
  description: string
  type: string
  image: string
  imageUrl: string | null
  price: number
  duration: number
  isActive: boolean
  adminId: string
  createdAt: string
  updatedAt: string
}

type ViewMode = 'grid' | 'list'
type SortBy = 'name' | 'price-low' | 'price-high' | 'duration' | 'newest'

export default function ServicesPage() {
  const [services, setServices] = React.useState<Service[]>([])
  const [filteredServices, setFilteredServices] = React.useState<Service[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [selectedType, setSelectedType] = React.useState<string>("all")
  const [sortBy, setSortBy] = React.useState<SortBy>("name")
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")
  const [showFilters, setShowFilters] = React.useState<boolean>(false)
  const [rating, setRating] = React.useState<number>(4.5)
  const router = useRouter()

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${APIURL}/public/services?take=50&skip=0`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (response.ok) {
        setServices(data.services || [])
        setFilteredServices(data.services || [])
      } else {
        const errorMessage = data.error || data.message || "Failed to fetch services"
        setError(errorMessage)
        toast.error("Something went wrong", {
          description: errorMessage,
          action: {
            label: "Retry",
            onClick: () => fetchServices(),
          },
        })
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch services"
      setError(errorMessage)
      toast.error("Network error occurred", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => fetchServices(),
        },
      })
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchServices()
  }, [])

  // Filter and sort services
  React.useEffect(() => {
    let filtered = [...services]

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(service => service.type === selectedType)
    }

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'duration':
          return a.duration - b.duration
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredServices(filtered)
  }, [services, searchQuery, selectedType, sortBy])

  const handleBookService = (service: Service) => {
    if (!service.isActive) {
      toast.error("Service unavailable", {
        description: "This service is currently not available for booking."
      })
      return
    }
    router.push(`/services/${service.id}/book`)
  }

  const getUniqueTypes = () => {
    const types = services.map(service => service.type)
    return [...new Set(types)]
  }

  const ServiceCard = ({ service }: { service: Service }) => (
    <Card
      className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group ${!service.isActive ? 'opacity-75' : ''
        } ${viewMode === 'list' ? 'flex-row' : ''}`}
      onClick={() => handleBookService(service)}
    >
      <div className={`${viewMode === 'list' ? 'w-1/3' : 'aspect-video'} bg-gray-200 overflow-hidden relative`}>
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://sewamitra.up.gov.in/Upload/Service/ff974f11-4215-4b41-bb63-87f2cb358a46_.jpg";
          }}
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${service.isActive
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
              }`}
          >
            {service.isActive ? "Available" : "Unavailable"}
          </span>
        </div>
        {service.isActive && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-1">
            <div className="flex items-center space-x-1 px-2 py-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          </div>
        )}
      </div>

      <div className={`p-6 ${viewMode === 'list' ? 'w-2/3 flex flex-col justify-between' : ''}`}>
        <div>
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {service.name}
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {service.type}
            </span>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-green-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="font-bold text-lg">₹{service.price}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{service.duration} mins</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>150+ bookings</span>
            </div>

            <Button
              onClick={(e) => {
                e.stopPropagation()
                handleBookService(service)
              }}
              disabled={!service.isActive}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              size="sm"
            >
              Book Now
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-blue-100">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  <Home className="h-4 w-4" />
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="text-white font-medium">Services</li>
            </ol>
          </nav>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Professional water care services to keep your RO system running at peak performance
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="flex items-center justify-center space-x-3">
                <Shield className="h-6 w-6 text-blue-200" />
                <span className="text-blue-100">Certified Technicians</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Zap className="h-6 w-6 text-blue-200" />
                <span className="text-blue-100">Quick Service</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="h-6 w-6 text-blue-200" />
                <span className="text-blue-100">100% Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Search */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* View Toggle */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Filters Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Service Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      {getUniqueTypes().map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="price-low">Price (Low to High)</option>
                      <option value="price-high">Price (High to Low)</option>
                      <option value="duration">Duration</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>

                  {/* Results Count */}
                  <div className="flex items-end">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{filteredServices.length}</span> services found
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <span className="text-lg text-gray-600">Loading services...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Services</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button
                  onClick={fetchServices}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* No Services State */}
          {!loading && !error && filteredServices.length === 0 && services.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Services Available</h3>
                <p className="text-gray-600">Please check back later for available services.</p>
              </div>
            </div>
          )}

          {/* No Results State */}
          {!loading && !error && filteredServices.length === 0 && services.length > 0 && (
            <div className="text-center py-20">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedType("all")
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {/* Services Grid/List */}
          {!loading && !error && filteredServices.length > 0 && (
            <div className={`${viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
              }`}>
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}