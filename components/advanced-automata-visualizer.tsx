"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Play, Download, Upload, Eye, Edit3 } from "lucide-react"
import type { Automaton, State, Transition } from "@/lib/conversion-algorithms"

declare global {
  interface Window {
    cytoscape: any
  }
}

interface AdvancedAutomataVisualizerProps {
  type: "dfa" | "nfa" | "pda" | "tm"
  initialAutomaton?: Automaton
  onAutomatonChange?: (automaton: Automaton) => void
}

export function AdvancedAutomataVisualizer({
  type,
  initialAutomaton,
  onAutomatonChange,
}: AdvancedAutomataVisualizerProps) {
  const [automaton, setAutomaton] = useState<Automaton>(
    initialAutomaton || {
      states: [
        { id: "q0", isInitial: true, isAccepting: false },
        { id: "q1", isInitial: false, isAccepting: true },
      ],
      transitions: [{ from: "q0", to: "q1", symbol: "a" }],
      alphabet: ["a", "b"],
      initialState: "q0",
      acceptingStates: ["q1"],
    },
  )

  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedTransition, setSelectedTransition] = useState<number | null>(null)
  const [newStateName, setNewStateName] = useState("")
  const [newSymbol, setNewSymbol] = useState("")
  const [testString, setTestString] = useState("")
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationStep, setSimulationStep] = useState(0)
  const [mode, setMode] = useState<"edit" | "simulate">("edit")

  const cyRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize Cytoscape
  useEffect(() => {
    if (!containerRef.current || !window.cytoscape) return

    const cy = window.cytoscape({
      container: containerRef.current,
      elements: convertAutomatonToCytoscape(automaton),
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#6366F1",
            label: "data(label)",
            color: "#fff",
            "text-valign": "center",
            "text-halign": "center",
            width: 60,
            height: 60,
            "font-size": 16,
            "font-weight": "bold",
          },
        },
        {
          selector: "node[?isInitial]",
          style: {
            "border-width": 4,
            "border-color": "#10B981",
            "border-style": "solid",
          },
        },
        {
          selector: "node[?isAccepting]",
          style: {
            "border-width": 4,
            "border-color": "#EF4444",
            "border-style": "double",
          },
        },
        {
          selector: "node:selected",
          style: {
            "background-color": "#8B5CF6",
            "border-color": "#A855F7",
            "border-width": 3,
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#64748B",
            "target-arrow-color": "#64748B",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": 14,
            "text-rotation": "autorotate",
            "text-margin-y": -10,
          },
        },
        {
          selector: "edge:selected",
          style: {
            "line-color": "#8B5CF6",
            "target-arrow-color": "#8B5CF6",
            width: 4,
          },
        },
        {
          selector: ".highlighted",
          style: {
            "background-color": "#F59E0B",
            "line-color": "#F59E0B",
            "target-arrow-color": "#F59E0B",
          },
        },
      ],
      layout: {
        name: "circle",
        radius: 100,
      },
    })

    // Event handlers
    cy.on("tap", "node", (evt: any) => {
      const node = evt.target
      setSelectedState(node.id())
      setSelectedTransition(null)
    })

    cy.on("tap", "edge", (evt: any) => {
      const edge = evt.target
      const transitionIndex = Number.parseInt(edge.data("transitionIndex"), 10)
      setSelectedTransition(transitionIndex)
      setSelectedState(null)
    })

    cy.on("tap", (evt: any) => {
      if (evt.target === cy) {
        setSelectedState(null)
        setSelectedTransition(null)
      }
    })

    cyRef.current = cy

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy()
      }
    }
  }, [])

  // Update graph when automaton changes
  useEffect(() => {
    if (cyRef.current) {
      const elements = convertAutomatonToCytoscape(automaton)
      cyRef.current.elements().remove()
      cyRef.current.add(elements)
      cyRef.current.layout({ name: "circle", radius: 100 }).run()
    }
    onAutomatonChange?.(automaton)
  }, [automaton, onAutomatonChange])

  const convertAutomatonToCytoscape = (automaton: Automaton) => {
    const nodes = automaton.states.map((state) => ({
      data: {
        id: state.id,
        label: state.id,
        isInitial: state.isInitial,
        isAccepting: state.isAccepting,
      },
    }))

    const edges = automaton.transitions.map((transition, index) => ({
      data: {
        id: `edge-${index}`,
        source: transition.from,
        target: transition.to,
        label: transition.symbol,
        transitionIndex: index,
      },
    }))

    return [...nodes, ...edges]
  }

  const addState = () => {
    if (!newStateName || automaton.states.some((s) => s.id === newStateName)) return

    const newState: State = {
      id: newStateName,
      isInitial: false,
      isAccepting: false,
    }

    setAutomaton((prev) => ({
      ...prev,
      states: [...prev.states, newState],
    }))

    setNewStateName("")
  }

  const deleteState = (stateId: string) => {
    setAutomaton((prev) => ({
      ...prev,
      states: prev.states.filter((s) => s.id !== stateId),
      transitions: prev.transitions.filter((t) => t.from !== stateId && t.to !== stateId),
      initialState: prev.initialState === stateId ? prev.states[0]?.id || "" : prev.initialState,
      acceptingStates: prev.acceptingStates.filter((s) => s !== stateId),
    }))
    setSelectedState(null)
  }

  const toggleStateProperty = (stateId: string, property: "isInitial" | "isAccepting") => {
    setAutomaton((prev) => {
      const updatedStates = prev.states.map((state) => {
        if (state.id === stateId) {
          if (property === "isInitial") {
            // Only one initial state allowed
            return { ...state, isInitial: !state.isInitial }
          } else {
            return { ...state, isAccepting: !state.isAccepting }
          }
        } else if (property === "isInitial") {
          // Remove initial from other states
          return { ...state, isInitial: false }
        }
        return state
      })

      const newInitialState = updatedStates.find((s) => s.isInitial)?.id || prev.initialState
      const newAcceptingStates = updatedStates.filter((s) => s.isAccepting).map((s) => s.id)

      return {
        ...prev,
        states: updatedStates,
        initialState: newInitialState,
        acceptingStates: newAcceptingStates,
      }
    })
  }

  const addTransition = () => {
    if (!selectedState || !newSymbol) return

    // For self-loops, create transition from selected state to itself
    const toState = selectedState

    const newTransition: Transition = {
      from: selectedState,
      to: toState,
      symbol: newSymbol,
    }

    setAutomaton((prev) => ({
      ...prev,
      transitions: [...prev.transitions, newTransition],
      alphabet: Array.from(new Set([...prev.alphabet, newSymbol])),
    }))

    setNewSymbol("")
  }

  const deleteTransition = (index: number) => {
    setAutomaton((prev) => ({
      ...prev,
      transitions: prev.transitions.filter((_, i) => i !== index),
    }))
    setSelectedTransition(null)
  }

  const simulateAutomaton = () => {
    setIsSimulating(true)
    setSimulationStep(0)

    // Simple DFA/NFA simulation
    const steps = []
    let currentStates = [automaton.initialState]
    let remainingInput = testString

    steps.push({
      states: [...currentStates],
      input: remainingInput,
      description: "Initial state",
    })

    for (let i = 0; i < testString.length; i++) {
      const symbol = testString[i]
      const newStates: string[] = []

      for (const state of currentStates) {
        const transitions = automaton.transitions.filter(
          (t) => t.from === state && (t.symbol === symbol || t.symbol === "ε"),
        )
        for (const transition of transitions) {
          if (!newStates.includes(transition.to)) {
            newStates.push(transition.to)
          }
        }
      }

      currentStates = newStates.length > 0 ? newStates : []
      remainingInput = remainingInput.slice(1)

      steps.push({
        states: [...currentStates],
        input: remainingInput,
        description: `After reading '${symbol}'`,
      })

      if (currentStates.length === 0) break
    }

    const accepted = currentStates.some((state) => automaton.acceptingStates.includes(state))

    setSimulationResult({
      steps,
      accepted,
      message: accepted ? "String accepted!" : "String rejected!",
    })
  }

  const highlightCurrentStates = useCallback((states: string[]) => {
    if (!cyRef.current) return

    // Remove previous highlights
    cyRef.current.elements().removeClass("highlighted")

    // Highlight current states
    states.forEach((stateId) => {
      cyRef.current.$(`#${stateId}`).addClass("highlighted")
    })
  }, [])

  useEffect(() => {
    if (simulationResult && simulationStep < simulationResult.steps.length) {
      highlightCurrentStates(simulationResult.steps[simulationStep].states)
    }
  }, [simulationStep, simulationResult, highlightCurrentStates])

  const exportAutomaton = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(automaton, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `${type}-automaton.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const importAutomaton = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        setAutomaton(imported)
      } catch (error) {
        console.error("Failed to import automaton:", error)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant={mode === "edit" ? "default" : "outline"} size="sm" onClick={() => setMode("edit")}>
            <Edit3 className="h-4 w-4 mr-1" />
            Edit Mode
          </Button>
          <Button variant={mode === "simulate" ? "default" : "outline"} size="sm" onClick={() => setMode("simulate")}>
            <Eye className="h-4 w-4 mr-1" />
            Simulate Mode
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportAutomaton}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => document.getElementById("file-input")?.click()}>
            <Upload className="h-4 w-4 mr-1" />
            Import
          </Button>
          <input id="file-input" type="file" accept=".json" style={{ display: "none" }} onChange={importAutomaton} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Automaton Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={containerRef} className="w-full h-96 border rounded-lg bg-white dark:bg-slate-950" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {mode === "edit" ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Automaton</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Add State</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newStateName}
                      onChange={(e) => setNewStateName(e.target.value)}
                      placeholder="State name"
                    />
                    <Button size="sm" onClick={addState}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedState && (
                  <div className="space-y-2">
                    <Label>Selected State: {selectedState}</Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStateProperty(selectedState, "isInitial")}
                      >
                        Toggle Initial
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStateProperty(selectedState, "isAccepting")}
                      >
                        Toggle Accept
                      </Button>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => deleteState(selectedState)}>
                      <Minus className="h-4 w-4 mr-1" />
                      Delete State
                    </Button>
                  </div>
                )}

                <div>
                  <Label>Add Transition</Label>
                  <div className="flex gap-2">
                    <Input value={newSymbol} onChange={(e) => setNewSymbol(e.target.value)} placeholder="Symbol" />
                    <Button size="sm" onClick={addTransition} disabled={!selectedState}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedTransition !== null && (
                  <div>
                    <Label>Selected Transition</Label>
                    <p className="text-sm text-muted-foreground">
                      {automaton.transitions[selectedTransition]?.from} →{" "}
                      {automaton.transitions[selectedTransition]?.to}(
                      {automaton.transitions[selectedTransition]?.symbol})
                    </p>
                    <Button size="sm" variant="destructive" onClick={() => deleteTransition(selectedTransition)}>
                      <Minus className="h-4 w-4 mr-1" />
                      Delete Transition
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Test Automaton</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Test String</Label>
                  <Input
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    placeholder="Enter test string"
                  />
                </div>

                <Button onClick={simulateAutomaton} disabled={isSimulating}>
                  <Play className="h-4 w-4 mr-1" />
                  Test String
                </Button>

                {simulationResult && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={simulationResult.accepted ? "default" : "destructive"}>
                        {simulationResult.message}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label>Simulation Steps</Label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSimulationStep(Math.max(0, simulationStep - 1))}
                          disabled={simulationStep === 0}
                        >
                          Previous
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSimulationStep(Math.min(simulationResult.steps.length - 1, simulationStep + 1))
                          }
                          disabled={simulationStep === simulationResult.steps.length - 1}
                        >
                          Next
                        </Button>
                      </div>

                      {simulationResult.steps[simulationStep] && (
                        <div className="text-sm space-y-1">
                          <p>
                            <strong>Step {simulationStep + 1}:</strong>{" "}
                            {simulationResult.steps[simulationStep].description}
                          </p>
                          <p>
                            <strong>Current States:</strong> {simulationResult.steps[simulationStep].states.join(", ")}
                          </p>
                          <p>
                            <strong>Remaining Input:</strong> "{simulationResult.steps[simulationStep].input}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Automaton Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>States:</strong> {automaton.states.length}
              </p>
              <p>
                <strong>Transitions:</strong> {automaton.transitions.length}
              </p>
              <p>
                <strong>Alphabet:</strong> {automaton.alphabet.join(", ")}
              </p>
              <p>
                <strong>Initial State:</strong> {automaton.initialState}
              </p>
              <p>
                <strong>Accept States:</strong> {automaton.acceptingStates.join(", ")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
