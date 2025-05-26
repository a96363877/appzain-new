"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Smartphone,
  Wifi,
  Globe,
  Zap,
  Users,
  TrendingUp,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  Cloud,
  Brain,
  Cpu,
  Satellite,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TelecommunicationsInfo() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  const telecomCompanies = [
    {
      name: "Zain Kuwait",
      description: "Leading provider of mobile communications and internet services",
      features: ["Advanced 5G network", "Digital payment services", "Comprehensive coverage", "IoT solutions"],
      color: "from-blue-500 to-blue-600",
      icon: <Smartphone className="h-6 w-6" />,
    },
    {
      name: "Ooredoo Kuwait",
      description: "Integrated telecommunications solutions for individuals and businesses",
      features: ["Ultra-fast internet", "Business services", "Advanced technologies", "Cloud solutions"],
      color: "from-teal-500 to-teal-600",
      icon: <Globe className="h-6 w-6" />,
    },
    {
      name: "stc Kuwait",
      description: "Modern telecommunications network with innovative digital services",
      features: ["5G technology", "Cloud solutions", "Cybersecurity", "AI-powered services"],
      color: "from-cyan-500 to-cyan-600",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      name: "VIVA Kuwait",
      description: "Dynamic telecommunications provider with cutting-edge solutions",
      features: ["Next-gen connectivity", "Smart city solutions", "Enterprise services", "Digital transformation"],
      color: "from-indigo-500 to-indigo-600",
      icon: <Satellite className="h-6 w-6" />,
    },
  ]

  const services = [
    {
      id: "mobile",
      title: "Mobile Services",
      icon: <Smartphone className="h-8 w-8" />,
      description: "Advanced networks supporting 5G technology with comprehensive coverage across Kuwait",
      details: [
        "5G coverage in major urban areas and expanding",
        "Flexible packages for all needs and budgets",
        "International roaming services",
        "Smart apps for account management",
        "eSIM technology support",
        "Edge computing capabilities",
      ],
    },
    {
      id: "internet",
      title: "Internet Services",
      icon: <Wifi className="h-8 w-8" />,
      description: "High-speed internet for homes and businesses with guaranteed stability and security",
      details: [
        "Speeds up to 10 Gbps for enterprise customers",
        "Advanced fiber optic network infrastructure",
        "24/7 customer service and technical support",
        "Customized solutions for businesses",
        "SD-WAN and network optimization",
        "Low-latency connections for gaming and streaming",
      ],
    },
    {
      id: "digital",
      title: "Digital Services",
      icon: <Globe className="h-8 w-8" />,
      description: "Comprehensive digital solutions including e-payments and cloud services",
      details: [
        "Secure digital wallets and payment platforms",
        "Electronic payment and fintech services",
        "Cloud storage and computing solutions",
        "Advanced information security",
        "Blockchain and cryptocurrency support",
        "Digital identity verification",
      ],
    },
    {
      id: "iot",
      title: "IoT & Smart Solutions",
      icon: <Cpu className="h-8 w-8" />,
      description: "Internet of Things solutions for smart cities and connected devices",
      details: [
        "Smart home automation systems",
        "Industrial IoT for manufacturing",
        "Smart city infrastructure solutions",
        "Connected vehicle technologies",
        "Environmental monitoring systems",
        "Asset tracking and management",
      ],
    },
    {
      id: "ai",
      title: "AI & Cloud Services",
      icon: <Brain className="h-8 w-8" />,
      description: "Artificial intelligence and cloud computing solutions for modern businesses",
      details: [
        "Machine learning and AI analytics",
        "Cloud-native application development",
        "Data center and colocation services",
        "Automated customer service solutions",
        "Predictive maintenance systems",
        "Edge AI processing capabilities",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Telecommunications in Kuwait
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore Kuwait's advanced telecommunications landscape with cutting-edge technologies and innovative digital
            services
          </p>
        </motion.div>

        {/* Enhanced Statistics Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="text-center p-4 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">5.2M+</div>
              <div className="text-sm text-gray-600">Subscribers</div>
            </CardContent>
          </Card>

          <Card className="text-center p-4 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">98%</div>
              <div className="text-sm text-gray-600">5G Coverage</div>
            </CardContent>
          </Card>

          <Card className="text-center p-4 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">10GB/s</div>
              <div className="text-sm text-gray-600">Max Speed</div>
            </CardContent>
          </Card>

          <Card className="text-center p-4 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">99.95%</div>
              <div className="text-sm text-gray-600">Reliability</div>
            </CardContent>
          </Card>

          <Card className="text-center p-4 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Cloud className="h-6 w-6 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">85%</div>
              <div className="text-sm text-gray-600">Cloud Adoption</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Telecom Companies Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Leading Telecommunications Providers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {telecomCompanies.map((company, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <CardHeader
                  className={`bg-gradient-to-r ${company.color} text-white p-6 group-hover:scale-105 transition-transform`}
                >
                  <div className="flex items-center gap-3">
                    {company.icon}
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4 text-sm">{company.description}</p>
                  <div className="space-y-2">
                    {company.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Services Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Services & Solutions</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="cursor-pointer" onClick={() => toggleCard(service.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white">
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-slate-800">{service.title}</CardTitle>
                        <p className="text-gray-600 mt-1 text-sm">{service.description}</p>
                      </div>
                    </div>
                    {expandedCard === service.id ? (
                      <ChevronUp className="h-6 w-6 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
                {expandedCard === service.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0">
                      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-3 text-slate-800">Key Features:</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {service.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Future Vision Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-blue-600 text-white p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Kuwait Vision 2035</h2>
                  <p className="text-white/90">Future of Telecommunications & Digital Transformation</p>
                </div>
              </div>
            </div>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-800">Strategic Objectives</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1 bg-blue-50">
                        1
                      </Badge>
                      <div>
                        <h4 className="font-medium">Comprehensive Digital Transformation</h4>
                        <p className="text-sm text-gray-600">Digitization of all government and private services</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1 bg-teal-50">
                        2
                      </Badge>
                      <div>
                        <h4 className="font-medium">Smart Cities Initiative</h4>
                        <p className="text-sm text-gray-600">
                          Development of intelligent and sustainable infrastructure
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1 bg-cyan-50">
                        3
                      </Badge>
                      <div>
                        <h4 className="font-medium">Digital Economy Growth</h4>
                        <p className="text-sm text-gray-600">Promoting innovation and technological entrepreneurship</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1 bg-indigo-50">
                        4
                      </Badge>
                      <div>
                        <h4 className="font-medium">Cybersecurity Excellence</h4>
                        <p className="text-sm text-gray-600">Building robust national cybersecurity infrastructure</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-800">Future Investments</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <h4 className="font-medium text-blue-800">6G Networks</h4>
                      <p className="text-sm text-blue-600 mt-1">
                        Development of next-generation communication technologies
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <h4 className="font-medium text-green-800">Artificial Intelligence</h4>
                      <p className="text-sm text-green-600 mt-1">Integration of AI across all service sectors</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                      <h4 className="font-medium text-purple-800">Internet of Things</h4>
                      <p className="text-sm text-purple-600 mt-1">Connecting smart devices and services nationwide</p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-400">
                      <h4 className="font-medium text-teal-800">Quantum Computing</h4>
                      <p className="text-sm text-teal-600 mt-1">Research and development in quantum technologies</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 via-teal-50 to-cyan-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Join the Future of Telecommunications</h3>
              <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                Discover the latest services and offers from Kuwait's leading telecommunications companies and enjoy an
                exceptional digital experience with cutting-edge technology solutions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600">
                  Explore Services
                </Button>
                <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                  Compare Plans
                </Button>
                <Button variant="outline" className="border-teal-300 text-teal-600 hover:bg-teal-50">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
