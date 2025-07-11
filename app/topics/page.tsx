import { TopicCard } from "@/components/topic-card"
import {
  BookOpen,
  Code,
  Lightbulb,
  Zap,
  FileText,
  GitMerge,
  GitPullRequest,
  Layers,
  LayoutGrid,
  Puzzle,
  Server,
  Share2,
  Shuffle,
  Terminal,
  Workflow,
} from "lucide-react"

export default function TopicsPage() {
  const topics = [
    {
      title: "Finite Automata",
      description: "Learn about DFAs and NFAs, their properties, and how they recognize regular languages.",
      icon: <Zap className="h-10 w-10 text-purple-500" />,
      href: "/topics/finite-automata",
    },
    {
      title: "Regular Expressions",
      description:
        "Understand the syntax and semantics of regular expressions and their equivalence to finite automata.",
      icon: <Code className="h-10 w-10 text-indigo-500" />,
      href: "/topics/regular-expressions",
    },
    {
      title: "Pumping Lemma",
      description: "Learn how to prove that certain languages are not regular using the pumping lemma.",
      icon: <Lightbulb className="h-10 w-10 text-blue-500" />,
      href: "/topics/pumping-lemma",
    },
    {
      title: "Context-Free Grammars",
      description: "Explore the formal definition and properties of context-free grammars.",
      icon: <FileText className="h-10 w-10 text-green-500" />,
      href: "/topics/context-free-grammars",
    },
    {
      title: "Pushdown Automata",
      description: "Understand how pushdown automata recognize context-free languages.",
      icon: <Layers className="h-10 w-10 text-yellow-500" />,
      href: "/topics/pushdown-automata",
    },
    {
      title: "Turing Machines",
      description: "Learn about the most powerful computational model and its variants.",
      icon: <Terminal className="h-10 w-10 text-red-500" />,
      href: "/topics/turing-machines",
    },
    {
      title: "Chomsky Hierarchy",
      description: "Understand the classification of formal languages and their corresponding automata.",
      icon: <LayoutGrid className="h-10 w-10 text-pink-500" />,
      href: "/topics/chomsky-hierarchy",
    },
    {
      title: "Decidability",
      description: "Explore which problems can be solved algorithmically and which cannot.",
      icon: <GitMerge className="h-10 w-10 text-orange-500" />,
      href: "/topics/decidability",
    },
    {
      title: "Complexity Theory",
      description: "Learn about the classification of problems based on their computational complexity.",
      icon: <Puzzle className="h-10 w-10 text-cyan-500" />,
      href: "/topics/complexity-theory",
    },
    {
      title: "Minimization of DFA",
      description: "Understand how to minimize the number of states in a DFA.",
      icon: <GitPullRequest className="h-10 w-10 text-teal-500" />,
      href: "/topics/minimization-of-dfa",
    },
    {
      title: "Regular Grammar",
      description: "Learn about the relationship between regular grammars and finite automata.",
      icon: <BookOpen className="h-10 w-10 text-violet-500" />,
      href: "/topics/regular-grammar",
    },
    {
      title: "Closure Properties",
      description: "Explore the operations under which regular and context-free languages are closed.",
      icon: <Share2 className="h-10 w-10 text-amber-500" />,
      href: "/topics/closure-properties",
    },
    {
      title: "Parsing Techniques",
      description: "Learn about different parsing algorithms for context-free grammars.",
      icon: <Workflow className="h-10 w-10 text-lime-500" />,
      href: "/topics/parsing-techniques",
    },
    {
      title: "Computability Theory",
      description: "Understand the limits of what can be computed algorithmically.",
      icon: <Server className="h-10 w-10 text-rose-500" />,
      href: "/topics/computability-theory",
    },
    {
      title: "Automata Applications",
      description: "Explore real-world applications of automata theory in various fields.",
      icon: <Shuffle className="h-10 w-10 text-fuchsia-500" />,
      href: "/topics/automata-applications",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Automata Theory Topics</h1>
      <p className="text-xl text-center mb-12 max-w-3xl mx-auto text-muted-foreground">
        Explore our comprehensive collection of automata theory topics, from fundamental concepts to advanced
        theoretical frameworks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <TopicCard
            key={index}
            title={topic.title}
            description={topic.description}
            icon={topic.icon}
            href={topic.href}
          />
        ))}
      </div>
    </div>
  )
}
