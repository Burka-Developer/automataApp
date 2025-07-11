import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, GitCompare, Lightbulb, Zap } from "lucide-react"
import { TopicCard } from "@/components/topic-card"
import { ConversionCard } from "@/components/conversion-card"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                AutomataEdu
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Master Automata Theory through interactive visualizations, step-by-step explanations, and comprehensive
                educational content.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/topics">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  Start Learning
                </Button>
              </Link>
              <Link href="/conversions">
                <Button variant="outline">Try Conversion Tools</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TopicCard
            title="Finite Automata"
            description="Learn about DFAs and NFAs, their properties, and how they recognize regular languages."
            icon={<Zap className="h-10 w-10 text-purple-500" />}
            href="/topics/finite-automata"
          />
          <TopicCard
            title="Regular Expressions"
            description="Understand the syntax and semantics of regular expressions and their equivalence to finite automata."
            icon={<Code className="h-10 w-10 text-indigo-500" />}
            href="/topics/regular-expressions"
          />
          <TopicCard
            title="Pumping Lemma"
            description="Learn how to prove that certain languages are not regular using the pumping lemma."
            icon={<Lightbulb className="h-10 w-10 text-blue-500" />}
            href="/topics/pumping-lemma"
          />
        </div>
        <div className="text-center mt-8">
          <Link href="/topics">
            <Button variant="outline">View All Topics</Button>
          </Link>
        </div>
      </section>

      <section className="py-12 bg-slate-50 dark:bg-slate-900 rounded-lg my-12 p-8">
        <h2 className="text-3xl font-bold text-center mb-12">Conversion Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConversionCard
            title="Regular Expression to DFA"
            description="Convert regular expressions to deterministic finite automata using direct construction."
            icon={<GitCompare className="h-10 w-10 text-purple-500" />}
            href="/conversions/re-to-dfa"
          />
          <ConversionCard
            title="NFA to DFA"
            description="Transform nondeterministic finite automata to deterministic using subset construction."
            icon={<GitCompare className="h-10 w-10 text-indigo-500" />}
            href="/conversions/nfa-to-dfa"
          />
          <ConversionCard
            title="DFA to Regular Expression"
            description="Extract regular expressions from deterministic finite automata using state elimination."
            icon={<GitCompare className="h-10 w-10 text-blue-500" />}
            href="/conversions/dfa-to-re"
          />
          <ConversionCard
            title="NFA to Regular Expression"
            description="Convert NFA to regular expression through intermediate steps."
            icon={<GitCompare className="h-10 w-10 text-cyan-500" />}
            href="/conversions/nfa-to-re"
          />
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">
                  Engage with interactive visualizations, step-by-step explanations, and hands-on exercises to master
                  complex concepts.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">
                  Explore 15 distinct topics covering fundamental to advanced concepts in Automata Theory.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Practical Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">
                  See how theoretical concepts apply to real-world problems with practical code examples and
                  applications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
