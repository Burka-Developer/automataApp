"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowDown } from "lucide-react"

interface ConversionStep {
  from: string
  to: string
  method: string
  description: string
  complexity?: string
}

interface ConversionDiagramProps {
  title: string
  steps: ConversionStep[]
  showAllPaths?: boolean
}

export function ConversionDiagram({ title, steps, showAllPaths = true }: ConversionDiagramProps) {
  const representations = ["Regular Expression", "NFA", "DFA", "Minimized DFA"]

  const getStepBetween = (from: string, to: string) => {
    return steps.find((step) => step.from === from && step.to === to)
  }

  const getNodeColor = (node: string) => {
    switch (node) {
      case "Regular Expression":
        return "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200"
      case "NFA":
        return "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200"
      case "DFA":
        return "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200"
      case "Minimized DFA":
        return "bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900 dark:border-orange-700 dark:text-orange-200"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Main conversion flow */}
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-4">
            {representations.map((rep, index) => (
              <div key={rep} className="flex items-center">
                <div className={`px-4 py-3 rounded-lg border-2 text-center min-w-[140px] ${getNodeColor(rep)}`}>
                  <div className="font-semibold text-sm">{rep}</div>
                </div>
                {index < representations.length - 1 && (
                  <div className="flex flex-col items-center mx-4">
                    <ArrowRight className="h-6 w-6 text-gray-400 hidden lg:block" />
                    <ArrowDown className="h-6 w-6 text-gray-400 lg:hidden" />
                    {(() => {
                      const step = getStepBetween(representations[index], representations[index + 1])
                      return step ? (
                        <div className="text-xs text-center mt-1 max-w-[100px]">
                          <Badge variant="outline" className="text-xs">
                            {step.method}
                          </Badge>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detailed conversion steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getNodeColor(step.from)}`}>{step.from}</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className={`px-2 py-1 rounded text-xs ${getNodeColor(step.to)}`}>{step.to}</span>
                  </div>
                  <Badge variant="secondary">{step.method}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{step.description}</p>
                {step.complexity && (
                  <div className="text-xs text-gray-500">
                    <strong>Complexity:</strong> {step.complexity}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Alternative paths */}
          {showAllPaths && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Alternative Conversion Paths</h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p>
                  • <strong>RE → DFA:</strong> RE → NFA → DFA (Thompson's + Subset Construction)
                </p>
                <p>
                  • <strong>DFA → RE:</strong> State Elimination Method
                </p>
                <p>
                  • <strong>NFA → RE:</strong> NFA → DFA → RE (Subset Construction + State Elimination)
                </p>
                <p>
                  • <strong>DFA Minimization:</strong> Partition refinement algorithm
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
