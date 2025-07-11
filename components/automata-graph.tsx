"use client"

import { useEffect, useRef } from "react"

interface AutomataGraphProps {
  data: any
}

export function AutomataGraph({ data }: AutomataGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Handle different data types
    if (data?.type === "regex") {
      // Display regex as text
      const container = containerRef.current
      container.innerHTML = `
        <div class="flex items-center justify-center h-full">
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-2">Regular Expression:</h3>
            <code class="text-xl font-mono bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded">${data.regex}</code>
          </div>
        </div>
      `
      return
    }

    if (!data || !data.states) {
      const container = containerRef.current
      container.innerHTML = `
        <div class="flex items-center justify-center h-full text-gray-500">
          No automaton data to display
        </div>
      `
      return
    }

    // Convert automaton data to cytoscape format
    const elements = {
      nodes: data.states.map((state: any) => ({
        data: {
          id: state.id,
          label: state.id,
          isInitial: state.isInitial,
          isAccepting: state.isAccepting,
        },
      })),
      edges: data.transitions.map((transition: any, index: number) => ({
        data: {
          id: `e${index}`,
          source: transition.from,
          target: transition.to,
          label: transition.symbol,
        },
      })),
    }

    // Use cytoscape if available, otherwise show a simple representation
    if (window.cytoscape) {
      const cy = window.cytoscape({
        container: containerRef.current,
        elements: elements,
        style: [
          {
            selector: "node",
            style: {
              "background-color": "#6366F1",
              label: "data(label)",
              color: "#fff",
              "text-valign": "center",
              "text-halign": "center",
              width: 50,
              height: 50,
              "font-size": 14,
            },
          },
          {
            selector: "node[?isInitial]",
            style: {
              "border-width": 3,
              "border-color": "#10B981",
            },
          },
          {
            selector: "node[?isAccepting]",
            style: {
              "border-width": 3,
              "border-color": "#EF4444",
              "border-style": "double",
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              "line-color": "#94A3B8",
              "target-arrow-color": "#94A3B8",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
              label: "data(label)",
              "font-size": 12,
              "text-rotation": "autorotate",
            },
          },
        ],
        layout: {
          name: "circle",
        },
      })

      return () => {
        cy.destroy()
      }
    } else {
      // Fallback: simple text representation
      const container = containerRef.current
      const statesText = data.states
        .map((s: any) => `${s.id}${s.isInitial ? " (start)" : ""}${s.isAccepting ? " (accept)" : ""}`)
        .join(", ")

      const transitionsText = data.transitions.map((t: any) => `${t.from} --${t.symbol}--> ${t.to}`).join("\n")

      container.innerHTML = `
        <div class="p-4 text-sm font-mono">
          <div><strong>States:</strong> ${statesText}</div>
          <div class="mt-2"><strong>Transitions:</strong></div>
          <pre class="mt-1 whitespace-pre-wrap">${transitionsText}</pre>
        </div>
      `
    }
  }, [data])

  return <div ref={containerRef} className="w-full h-full min-h-[300px]" />
}
