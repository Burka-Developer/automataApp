"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AutomataGraph } from "@/components/automata-graph"
import { StepNavigator } from "@/components/step-navigator"
import { Download } from "lucide-react"
import { RegexToNFA, NFAToDFA, DFAToRegex, NFAToRegex } from "@/lib/conversion-algorithms"
import type { Automaton } from "@/lib/conversion-algorithms"

interface ConversionToolProps {
  title: string
  description: string
  type: "re-to-dfa" | "nfa-to-dfa" | "dfa-to-re" | "nfa-to-re"
}

export function ConversionTool({ title, description, type }: ConversionToolProps) {
  const [input, setInput] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [conversionSteps, setConversionSteps] = useState<any[]>([])
  const [isConverting, setIsConverting] = useState(false)

  // Example presets for each conversion type
  const examples = {
    "re-to-dfa": [
      { name: "Simple: a*b", value: "a*b" },
      { name: "Medium: (a|b)*abb", value: "(a|b)*abb" },
      { name: "Complex: (a|b)*a(a|b)(a|b)", value: "(a|b)*a(a|b)(a|b)" },
    ],
    "nfa-to-dfa": [
      {
        name: "Simple: 2-state NFA",
        value: `{
  "states": [
    { "id": "q0", "isInitial": true, "isAccepting": false },
    { "id": "q1", "isInitial": false, "isAccepting": true }
  ],
  "transitions": [
    { "from": "q0", "to": "q0", "symbol": "a" },
    { "from": "q0", "to": "q1", "symbol": "a" },
    { "from": "q0", "to": "q0", "symbol": "b" },
    { "from": "q1", "to": "q1", "symbol": "b" }
  ],
  "alphabet": ["a", "b"],
  "initialState": "q0",
  "acceptingStates": ["q1"]
}`,
      },
      {
        name: "Medium: 3-state NFA with ε-transitions",
        value: `{
  "states": [
    { "id": "q0", "isInitial": true, "isAccepting": false },
    { "id": "q1", "isInitial": false, "isAccepting": false },
    { "id": "q2", "isInitial": false, "isAccepting": true }
  ],
  "transitions": [
    { "from": "q0", "to": "q1", "symbol": "ε" },
    { "from": "q1", "to": "q2", "symbol": "a" },
    { "from": "q2", "to": "q1", "symbol": "b" },
    { "from": "q0", "to": "q2", "symbol": "a" }
  ],
  "alphabet": ["a", "b"],
  "initialState": "q0",
  "acceptingStates": ["q2"]
}`,
      },
    ],
    "dfa-to-re": [
      {
        name: "Simple: 2-state DFA",
        value: `{
  "states": [
    { "id": "q0", "isInitial": true, "isAccepting": false },
    { "id": "q1", "isInitial": false, "isAccepting": true }
  ],
  "transitions": [
    { "from": "q0", "to": "q1", "symbol": "a" },
    { "from": "q1", "to": "q0", "symbol": "b" },
    { "from": "q0", "to": "q0", "symbol": "b" },
    { "from": "q1", "to": "q1", "symbol": "a" }
  ],
  "alphabet": ["a", "b"],
  "initialState": "q0",
  "acceptingStates": ["q1"]
}`,
      },
      {
        name: "Medium: 3-state DFA",
        value: `{
  "states": [
    { "id": "q0", "isInitial": true, "isAccepting": false },
    { "id": "q1", "isInitial": false, "isAccepting": false },
    { "id": "q2", "isInitial": false, "isAccepting": true }
  ],
  "transitions": [
    { "from": "q0", "to": "q1", "symbol": "a" },
    { "from": "q0", "to": "q0", "symbol": "b" },
    { "from": "q1", "to": "q2", "symbol": "b" },
    { "from": "q1", "to": "q0", "symbol": "a" },
    { "from": "q2", "to": "q2", "symbol": "a" },
    { "from": "q2", "to": "q2", "symbol": "b" }
  ],
  "alphabet": ["a", "b"],
  "initialState": "q0",
  "acceptingStates": ["q2"]
}`,
      },
    ],
    "nfa-to-re": [
      {
        name: "Simple: 2-state NFA",
        value: `{
  "states": [
    { "id": "q0", "isInitial": true, "isAccepting": false },
    { "id": "q1", "isInitial": false, "isAccepting": true }
  ],
  "transitions": [
    { "from": "q0", "to": "q1", "symbol": "a" },
    { "from": "q0", "to": "q0", "symbol": "b" },
    { "from": "q1", "to": "q1", "symbol": "a" },
    { "from": "q1", "to": "q1", "symbol": "b" }
  ],
  "alphabet": ["a", "b"],
  "initialState": "q0",
  "acceptingStates": ["q1"]
}`,
      },
    ],
  }

  const validateAutomatonInput = (inputData: any): Automaton => {
    // Check if required fields exist
    if (!inputData.states || !Array.isArray(inputData.states)) {
      throw new Error("Missing or invalid 'states' field. Expected an array of state objects.")
    }

    if (!inputData.transitions || !Array.isArray(inputData.transitions)) {
      throw new Error("Missing or invalid 'transitions' field. Expected an array of transition objects.")
    }

    if (!inputData.alphabet || !Array.isArray(inputData.alphabet)) {
      throw new Error("Missing or invalid 'alphabet' field. Expected an array of symbols.")
    }

    if (!inputData.initialState) {
      throw new Error("Missing 'initialState' field.")
    }

    if (!inputData.acceptingStates || !Array.isArray(inputData.acceptingStates)) {
      throw new Error("Missing or invalid 'acceptingStates' field. Expected an array of state IDs.")
    }

    // Validate states format
    for (const state of inputData.states) {
      if (typeof state === "string") {
        // Convert string format to object format
        continue
      } else if (typeof state === "object" && state.id) {
        continue
      } else {
        throw new Error("Invalid state format. States should be objects with 'id' property or strings.")
      }
    }

    // Validate transitions format
    for (const transition of inputData.transitions) {
      if (!transition.from || !transition.to || !transition.symbol) {
        throw new Error("Invalid transition format. Each transition must have 'from', 'to', and 'symbol' properties.")
      }
    }

    // Convert to our internal format
    const states = inputData.states.map((state: any) => {
      if (typeof state === "string") {
        return {
          id: state,
          isInitial: state === inputData.initialState,
          isAccepting: inputData.acceptingStates.includes(state),
        }
      } else {
        return {
          id: state.id,
          isInitial: state.isInitial !== undefined ? state.isInitial : state.id === inputData.initialState,
          isAccepting:
            state.isAccepting !== undefined ? state.isAccepting : inputData.acceptingStates.includes(state.id),
        }
      }
    })

    return {
      states,
      transitions: inputData.transitions,
      alphabet: inputData.alphabet,
      initialState: inputData.initialState,
      acceptingStates: inputData.acceptingStates,
    }
  }

  const convertAutomata = () => {
    setIsConverting(true)

    try {
      const steps: any[] = []

      if (type === "re-to-dfa") {
        if (!input.trim()) {
          throw new Error("Please enter a regular expression")
        }

        const regexToNFA = new RegexToNFA()
        const nfaToDFA = new NFAToDFA()

        // Step 1: Convert RE to NFA
        const nfa = regexToNFA.convert(input.trim())
        steps.push({
          description: "Regular Expression to NFA",
          data: nfa,
          explanation: "Using Thompson's construction to convert the regular expression to an NFA.",
        })

        // Step 2: Convert NFA to DFA
        const dfa = nfaToDFA.convert(nfa)
        steps.push({
          description: "NFA to DFA",
          data: dfa,
          explanation: "Using subset construction to convert the NFA to a DFA.",
        })
      } else if (type === "nfa-to-dfa") {
        if (!input.trim()) {
          throw new Error("Please enter an NFA definition")
        }

        let inputData
        try {
          inputData = JSON.parse(input.trim())
        } catch (parseError) {
          throw new Error(
            "Invalid JSON format. Please check your input syntax. Make sure to use proper JSON with double quotes around property names and string values.",
          )
        }

        const nfa = validateAutomatonInput(inputData)
        const nfaToDFA = new NFAToDFA()
        const dfa = nfaToDFA.convert(nfa)

        steps.push({
          description: "Initial NFA",
          data: nfa,
          explanation: "The input nondeterministic finite automaton.",
        })

        steps.push({
          description: "Converted DFA",
          data: dfa,
          explanation: "The equivalent deterministic finite automaton using subset construction.",
        })
      } else if (type === "dfa-to-re") {
        if (!input.trim()) {
          throw new Error("Please enter a DFA definition")
        }

        let inputData
        try {
          inputData = JSON.parse(input.trim())
        } catch (parseError) {
          throw new Error(
            "Invalid JSON format. Please check your input syntax. Make sure to use proper JSON with double quotes around property names and string values.",
          )
        }

        const dfa = validateAutomatonInput(inputData)
        const dfaToRegex = new DFAToRegex()
        const regex = dfaToRegex.convert(dfa)

        steps.push({
          description: "Initial DFA",
          data: dfa,
          explanation: "The input deterministic finite automaton.",
        })

        steps.push({
          description: "Regular Expression",
          data: { regex, type: "regex" },
          explanation: `The equivalent regular expression: ${regex}`,
        })
      } else if (type === "nfa-to-re") {
        if (!input.trim()) {
          throw new Error("Please enter an NFA definition")
        }

        let inputData
        try {
          inputData = JSON.parse(input.trim())
        } catch (parseError) {
          throw new Error(
            "Invalid JSON format. Please check your input syntax. Make sure to use proper JSON with double quotes around property names and string values.",
          )
        }

        const nfa = validateAutomatonInput(inputData)
        const nfaToRegex = new NFAToRegex()
        const regex = nfaToRegex.convert(nfa)

        steps.push({
          description: "Initial NFA",
          data: nfa,
          explanation: "The input nondeterministic finite automaton.",
        })

        steps.push({
          description: "Regular Expression",
          data: { regex, type: "regex" },
          explanation: `The equivalent regular expression: ${regex}`,
        })
      }

      setConversionSteps(steps)
      setCurrentStep(0)
    } catch (error) {
      console.error("Conversion error:", error)
      alert(`Conversion failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsConverting(false)
    }
  }

  const handleExampleSelect = (value: string) => {
    const selectedExample = examples[type].find((ex) => ex.name === value)
    if (selectedExample) {
      setInput(selectedExample.value)
    }
  }

  const exportResult = () => {
    if (conversionSteps.length === 0) return

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(conversionSteps, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `${type}-conversion-result.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const getInputPlaceholder = () => {
    switch (type) {
      case "re-to-dfa":
        return "Enter a regular expression (e.g., a*b, (a|b)*abb)"
      case "nfa-to-dfa":
        return `Enter NFA in JSON format:
{
  "states": [
    { "id": "q0", "isInitial": true, "isAccepting": false },
    { "id": "q1", "isInitial": false, "isAccepting": true }
  ],
  "transitions": [
    { "from": "q0", "to": "q1", "symbol": "a" }
  ],
  "alphabet": ["a", "b"],
  "initialState": "q0",
  "acceptingStates": ["q1"]
}`
      case "dfa-to-re":
        return `Enter DFA in JSON format:
{
  "states": [
    { "id": "q0", "isInitial": true, "isAccepting": false },
    { "id": "q1", "isInitial": false, "isAccepting": true }
  ],
  "transitions": [
    { "from": "q0", "to": "q1", "symbol": "a" }
  ],
  "alphabet": ["a", "b"],
  "initialState": "q0",
  "acceptingStates": ["q1"]
}`
      case "nfa-to-re":
        return `Enter NFA in JSON format:
{
  "states": [
    { "id": "q0", "isInitial": true, "isAccepting": false },
    { "id": "q1", "isInitial": false, "isAccepting": true }
  ],
  "transitions": [
    { "from": "q0", "to": "q1", "symbol": "a" }
  ],
  "alphabet": ["a", "b"],
  "initialState": "q0",
  "acceptingStates": ["q1"]
}`
      default:
        return "Enter your input here..."
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="input" className="block text-sm font-medium mb-2">
                  Input {type === "re-to-dfa" ? "Regular Expression" : "Automaton (JSON format)"}
                </label>
                <Textarea
                  id="input"
                  placeholder={getInputPlaceholder()}
                  className="min-h-[300px] font-mono text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                {type !== "re-to-dfa" && (
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Tip: Use the "Load Example" button to see the correct JSON format
                  </p>
                )}
              </div>
              <div className="md:w-64">
                <label className="block text-sm font-medium mb-2">Load Example</label>
                <Select onValueChange={handleExampleSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an example" />
                  </SelectTrigger>
                  <SelectContent>
                    {examples[type].map((example) => (
                      <SelectItem key={example.name} value={example.name}>
                        {example.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-4">
                  <Button
                    onClick={convertAutomata}
                    disabled={!input || isConverting}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {isConverting ? "Converting..." : "Convert"}
                  </Button>
                </div>
                {conversionSteps.length > 0 && (
                  <div className="mt-4">
                    <Button variant="outline" onClick={exportResult} className="w-full">
                      <Download className="mr-2 h-4 w-4" /> Export Result
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {conversionSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Process</CardTitle>
            <CardDescription>
              Step {currentStep + 1} of {conversionSteps.length}: {conversionSteps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border rounded-lg p-4 min-h-[300px] flex items-center justify-center">
              <AutomataGraph data={conversionSteps[currentStep].data} />
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Explanation</h4>
              <p>{conversionSteps[currentStep].explanation}</p>
            </div>
          </CardContent>
          <CardFooter>
            <StepNavigator
              currentStep={currentStep}
              totalSteps={conversionSteps.length}
              onPrevious={() => setCurrentStep(Math.max(0, currentStep - 1))}
              onNext={() => setCurrentStep(Math.min(conversionSteps.length - 1, currentStep + 1))}
            />
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
