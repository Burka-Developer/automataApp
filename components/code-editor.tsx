"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, RotateCcw, Download } from "lucide-react"

interface CodeEditorProps {
  title: string
  initialCode?: string
  language?: string
  examples?: { name: string; code: string; description: string }[]
}

export function CodeEditor({ title, initialCode = "", language = "javascript", examples = [] }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [selectedExample, setSelectedExample] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Simple syntax highlighting could be added here
    // For now, we'll use a basic textarea with monospace font
  }, [code])

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")

    try {
      // Create a safe execution environment
      const logs: string[] = []
      const originalLog = console.log
      console.log = (...args) => {
        logs.push(args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" "))
      }

      // Execute the code
      if (language === "javascript") {
        // Use Function constructor for safer execution
        const func = new Function(code)
        const result = func()
        if (result !== undefined) {
          logs.push(`Return value: ${result}`)
        }
      } else if (language === "python") {
        // For Python, we'd need a Python interpreter (like Pyodide)
        // For now, show a placeholder
        logs.push("Python execution would require Pyodide integration")
      }

      console.log = originalLog
      setOutput(logs.join("\n"))
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }

    setIsRunning(false)
  }

  const resetCode = () => {
    setCode(initialCode)
    setOutput("")
  }

  const loadExample = (exampleName: string) => {
    const example = examples.find((ex) => ex.name === exampleName)
    if (example) {
      setCode(example.code)
      setOutput("")
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${language === "javascript" ? "js" : language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            {examples.length > 0 && (
              <Select
                value={selectedExample}
                onValueChange={(value) => {
                  setSelectedExample(value)
                  loadExample(value)
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Load example" />
                </SelectTrigger>
                <SelectContent>
                  {examples.map((example) => (
                    <SelectItem key={example.name} value={example.name}>
                      {example.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" size="sm" onClick={downloadCode}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Code Editor</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm bg-slate-950 text-slate-50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Write your ${language} code here...`}
                spellCheck={false}
              />
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={resetCode}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button size="sm" onClick={runCode} disabled={isRunning}>
                  <Play className="h-4 w-4 mr-1" />
                  {isRunning ? "Running..." : "Run"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="output">
            <div className="w-full h-96 p-4 bg-slate-100 dark:bg-slate-800 rounded-md font-mono text-sm overflow-auto">
              {output || "No output yet. Run your code to see results."}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
