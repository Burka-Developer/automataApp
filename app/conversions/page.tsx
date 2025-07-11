import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConversionTool } from "@/components/conversion-tool"

export default function ConversionsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Automata Conversion Tools</h1>
      <p className="text-xl text-center mb-12 max-w-3xl mx-auto text-muted-foreground">
        Interactive tools to convert between different representations of formal languages.
      </p>

      <Tabs defaultValue="re-to-dfa" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="re-to-dfa">RE to DFA</TabsTrigger>
          <TabsTrigger value="nfa-to-dfa">NFA to DFA</TabsTrigger>
          <TabsTrigger value="dfa-to-re">DFA to RE</TabsTrigger>
          <TabsTrigger value="nfa-to-re">NFA to RE</TabsTrigger>
        </TabsList>

        <TabsContent value="re-to-dfa">
          <ConversionTool
            title="Regular Expression to DFA Converter"
            description="Convert regular expressions to deterministic finite automata using direct construction."
            type="re-to-dfa"
          />
        </TabsContent>

        <TabsContent value="nfa-to-dfa">
          <ConversionTool
            title="NFA to DFA Converter"
            description="Transform nondeterministic finite automata to deterministic using subset construction."
            type="nfa-to-dfa"
          />
        </TabsContent>

        <TabsContent value="dfa-to-re">
          <ConversionTool
            title="DFA to Regular Expression Converter"
            description="Extract regular expressions from deterministic finite automata using state elimination."
            type="dfa-to-re"
          />
        </TabsContent>

        <TabsContent value="nfa-to-re">
          <ConversionTool
            title="NFA to Regular Expression Converter"
            description="Convert NFA to regular expression through intermediate steps."
            type="nfa-to-re"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
