"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"

interface CodeExampleProps {
  title: string
  language: string
  code: string
  output?: string
}

export function CodeExample({ title, language, code, output }: CodeExampleProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="output" disabled={!output}>
              Output
            </TabsTrigger>
          </TabsList>
          <TabsContent value="code">
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto">
              <code>{code}</code>
            </pre>
          </TabsContent>
          {output && (
            <TabsContent value="output">
              <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto">
                <code>{output}</code>
              </pre>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
