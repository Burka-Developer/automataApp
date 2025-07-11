"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ThompsonStep {
  step: number
  operation: string
  description: string
  nfa: string
  explanation: string
}

export function ThompsonConstruction() {
  const [regex, setRegex] = useState("a*b")
  const [steps, setSteps] = useState<ThompsonStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)

  const generateSteps = (inputRegex: string) => {
    const constructionSteps: ThompsonStep[] = []

    // Simulate Thompson's construction steps
    if (inputRegex === "a*b") {
      constructionSteps.push({
        step: 1,
        operation: "Base Case: 'a'",
        description: "Create NFA for single symbol 'a'",
        nfa: "q0 --a--> q1",
        explanation: "For a single symbol, create two states with one transition labeled with that symbol.",
      })

      constructionSteps.push({
        step: 2,
        operation: "Kleene Star: 'a*'",
        description: "Apply Kleene star operation to 'a'",
        nfa: `q_start --ε--> q0 --a--> q1 --ε--> q_accept
    ↑                           ↓
    |_________ε_________________|
    ↑                           ↓  
    |_________ε_________________|`,
        explanation:
          "For Kleene star: (1) Create new start and accept states, (2) Add ε-transitions from new start to old start and new accept, (3) Add ε-transition from old accept back to old start, (4) Add ε-transition from old accept to new accept.",
      })

      constructionSteps.push({
        step: 3,
        operation: "Base Case: 'b'",
        description: "Create NFA for single symbol 'b'",
        nfa: "q2 --b--> q3",
        explanation: "Create another simple NFA for the symbol 'b'.",
      })

      constructionSteps.push({
        step: 4,
        operation: "Concatenation: 'a*b'",
        description: "Concatenate 'a*' and 'b'",
        nfa: `q_start --ε--> q0 --a--> q1 --ε--> q2 --b--> q3
    ↑                           ↓
    |_________ε_________________|`,
        explanation:
          "For concatenation: Connect the accept state of the first NFA to the start state of the second NFA with an ε-transition. The accept state of the second NFA becomes the final accept state.",
      })
    } else if (inputRegex === "(a|b)*") {
      constructionSteps.push({
        step: 1,
        operation: "Base Case: 'a'",
        description: "Create NFA for 'a'",
        nfa: "q0 --a--> q1",
        explanation: "Simple NFA for symbol 'a'.",
      })

      constructionSteps.push({
        step: 2,
        operation: "Base Case: 'b'",
        description: "Create NFA for 'b'",
        nfa: "q2 --b--> q3",
        explanation: "Simple NFA for symbol 'b'.",
      })

      constructionSteps.push({
        step: 3,
        operation: "Union: 'a|b'",
        description: "Create union of 'a' and 'b'",
        nfa: `     q0 --a--> q1
    ↗ε           ε↘
q_start           q_accept
    ↘ε           ε↗
     q2 --b--> q3`,
        explanation:
          "For union: (1) Create new start and accept states, (2) Add ε-transitions from new start to both old starts, (3) Add ε-transitions from both old accepts to new accept.",
      })

      constructionSteps.push({
        step: 4,
        operation: "Kleene Star: '(a|b)*'",
        description: "Apply Kleene star to the union",
        nfa: `q_new --ε--> q_start --ε--> q0 --a--> q1 --ε--> q_accept --ε--> q_final
  ↑                    ↘ε           ε↗                    ↓
  |                     q2 --b--> q3                     |
  |_____________________ε_________________________________|`,
        explanation: "Apply Kleene star construction to the union NFA, allowing zero or more repetitions of (a|b).",
      })
    } else if (inputRegex === "a(b|c)*") {
      constructionSteps.push({
        step: 1,
        operation: "Base Case: 'a'",
        description: "Create NFA for 'a'",
        nfa: "q0 --a--> q1",
        explanation: "Simple NFA for symbol 'a'.",
      })

      constructionSteps.push({
        step: 2,
        operation: "Base Cases: 'b' and 'c'",
        description: "Create NFAs for 'b' and 'c'",
        nfa: "q2 --b--> q3\nq4 --c--> q5",
        explanation: "Create simple NFAs for symbols 'b' and 'c'.",
      })

      constructionSteps.push({
        step: 3,
        operation: "Union: 'b|c'",
        description: "Create union of 'b' and 'c'",
        nfa: `     q2 --b--> q3
    ↗ε           ε↘
q_start           q_accept
    ↘ε           ε↗
     q4 --c--> q5`,
        explanation: "Apply union construction to combine 'b' and 'c' NFAs.",
      })

      constructionSteps.push({
        step: 4,
        operation: "Kleene Star: '(b|c)*'",
        description: "Apply Kleene star to the union",
        nfa: `q_new --ε--> q_start --ε--> q2 --b--> q3 --ε--> q_accept --ε--> q_final
  ↑                    ↘ε           ε↗                    ↓
  |                     q4 --c--> q5                     |
  |_____________________ε_________________________________|`,
        explanation: "Apply Kleene star to allow zero or more repetitions of (b|c).",
      })

      constructionSteps.push({
        step: 5,
        operation: "Concatenation: 'a(b|c)*'",
        description: "Concatenate 'a' with '(b|c)*'",
        nfa: `q0 --a--> q1 --ε--> q_new --ε--> q_start --ε--> q2 --b--> q3 --ε--> q_accept --ε--> q_final
                              ↑                    ↘ε           ε↗                    ↓
                              |                     q4 --c--> q5                     |
                              |_____________________ε_________________________________|`,
        explanation: "Connect the 'a' NFA to the '(b|c)*' NFA with an ε-transition.",
      })
    }

    setSteps(constructionSteps)
    setCurrentStep(0)
  }

  const examples = [
    { name: "a*b", description: "Kleene star followed by concatenation" },
    { name: "(a|b)*", description: "Kleene star of union" },
    { name: "a(b|c)*", description: "Concatenation with Kleene star of union" },
    { name: "(ab)*", description: "Kleene star of concatenation" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thompson's Construction: Regular Expression to NFA</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="interactive" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interactive">Interactive Construction</TabsTrigger>
            <TabsTrigger value="rules">Construction Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="interactive" className="space-y-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Regular Expression</label>
                <Input
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                  placeholder="Enter regular expression"
                />
              </div>
              <Button onClick={() => generateSteps(regex)}>Generate Steps</Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {examples.map((example) => (
                <Button
                  key={example.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRegex(example.name)
                    generateSteps(example.name)
                  }}
                >
                  {example.name}
                </Button>
              ))}
            </div>

            {steps.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Construction Steps</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>
                    <Badge variant="outline">
                      Step {currentStep + 1} of {steps.length}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      disabled={currentStep === steps.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>

                <Card className="bg-blue-50 dark:bg-blue-950">
                  <CardHeader>
                    <CardTitle className="text-lg">{steps[currentStep].operation}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{steps[currentStep].description}</p>

                    <div className="bg-white dark:bg-gray-900 p-4 rounded border font-mono text-sm">
                      <pre className="whitespace-pre-wrap">{steps[currentStep].nfa}</pre>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Explanation:</strong> {steps[currentStep].explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Base Cases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Empty String (ε)</h4>
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm mt-1">q0 --ε--> q1</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Single ε-transition</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Single Symbol (a)</h4>
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm mt-1">
                      q0 --a--&gt; q1
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Single transition labeled with the symbol
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Inductive Cases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Union (R₁ | R₂)</h4>
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm mt-1">
                      {`     NFA₁
    ↗ε    ε↘
q_new      q_accept
    ↘ε    ε↗
     NFA₂`}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      New start state with ε-transitions to both NFAs
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Concatenation (R₁R₂)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm">NFA₁ --ε--> NFA₂</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Connect accept state of NFA₁ to start state of NFA₂
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kleene Star (R*)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm">
                    {`q_new --ε--> NFA --ε--> q_accept
  ↑              ↓
  |______ε_______|`}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    New start/accept states with loop-back ε-transition
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-green-50 dark:bg-green-950">
              <CardHeader>
                <CardTitle className="text-lg text-green-800 dark:text-green-200">
                  Thompson's Construction Properties
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-700 dark:text-green-300">
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>Exactly one start state</strong> with no incoming transitions
                  </li>
                  <li>
                    • <strong>Exactly one accept state</strong> with no outgoing transitions
                  </li>
                  <li>
                    • <strong>Each state has at most two outgoing transitions</strong>
                  </li>
                  <li>
                    • <strong>Each transition is labeled with either a symbol or ε</strong>
                  </li>
                  <li>
                    • <strong>Linear size:</strong> O(|R|) states and transitions for regex R
                  </li>
                  <li>
                    • <strong>Compositional:</strong> Builds larger NFAs from smaller ones
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
