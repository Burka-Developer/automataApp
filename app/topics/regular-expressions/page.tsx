import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopicContent } from "@/components/topic-content"
import { QuizSection } from "@/components/quiz-section"
import { CodeExample } from "@/components/code-example"
import { CodeEditor } from "@/components/code-editor"
import { AdvancedAutomataVisualizer } from "@/components/advanced-automata-visualizer"
import { ConversionDiagram } from "@/components/conversion-diagram"
import { ThompsonConstruction } from "@/components/thompson-construction"

export default function RegularExpressionsPage() {
  const conversionSteps = [
    {
      from: "Regular Expression",
      to: "NFA",
      method: "Thompson's Construction",
      description:
        "Recursively build NFAs for basic patterns (symbols, ε) and combine them using union, concatenation, and Kleene star operations.",
      complexity: "O(|R|) states and transitions",
    },
    {
      from: "NFA",
      to: "DFA",
      method: "Subset Construction",
      description:
        "Convert the NFA to DFA by creating states that represent sets of NFA states, handling ε-closures properly.",
      complexity: "O(2^n) states in worst case",
    },
    {
      from: "DFA",
      to: "Regular Expression",
      method: "State Elimination",
      description:
        "Systematically eliminate states while updating transition labels with regular expressions until only start and accept states remain.",
      complexity: "Exponential in general",
    },
  ]

  const codeExamples = [
    {
      name: "Basic Regex Matching",
      code: `// Regular expression matching in JavaScript
const text = "The quick brown fox jumps over the lazy dog";

// Match words starting with 'th' (case insensitive)
const pattern1 = /\\bth\\w*/gi;
console.log("Words starting with 'th':", text.match(pattern1));

// Match email pattern
const email = "user@example.com";
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
console.log("Valid email:", emailPattern.test(email));

// Extract phone numbers
const phoneText = "Call me at 123-456-7890 or 987.654.3210";
const phonePattern = /\\d{3}[-.]\\d{3}[-.]\\d{4}/g;
console.log("Phone numbers:", phoneText.match(phonePattern));`,
      description: "Basic regular expression matching examples"
    },
    {
      name: "Regex Construction",
      code: `// Building regular expressions programmatically
class RegexBuilder {
  constructor() {
    this.pattern = "";
  }
  
  literal(text) {
    this.pattern += text.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    return this;
  }
  
  oneOrMore() {
    this.pattern += "+";
    return this;
  }
  
  zeroOrMore() {
    this.pattern += "*";
    return this;
  }
  
  optional() {
    this.pattern += "?";
    return this;
  }

  group(callback) {
    this.pattern += "(";
    callback();
    this.pattern += ")";
    return this;
  }
  
  alternation(options) {
    this.pattern += "(" + options.join("|") + ")";
    return this;
  }
  
  build() {
    return new RegExp(this.pattern);
  }
}

// Example usage
const builder = new RegexBuilder();
const regex = builder
  .literal("hello")
  .optional()
  .literal(" ")
  .alternation(["world", "universe"])
  .build();

console.log(regex); // /hello?\\s(world|universe)/
console.log(regex.test("hello world")); // true
console.log(regex.test("helloworld")); // false`,
      description: "Programmatic regex construction"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Regular Expressions</h1>
      <p className="text-xl mb-8 text-muted-foreground">
        Master the syntax and semantics of regular expressions and understand their equivalence to finite automata.
      </p>

      <Tabs defaultValue="content" className="space-y-8">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="editor">Code Editor</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <TopicContent
            sections={[
              {
                title: "Introduction to Regular Expressions",
                content: `
                  <p>Regular expressions (regex) are a powerful tool for pattern matching and text manipulation. They provide a concise and flexible means for matching strings of text, such as specific characters, words, or patterns of characters.</p>
                  
                  <p>A regular expression is a sequence of characters that forms a search pattern. This pattern can be used for string matching, searching, and replacing operations.</p>
                  
                  <h3>Basic Syntax Elements:</h3>
                  <ul>
                    <li><strong>Literal characters</strong>: Match themselves (e.g., 'a' matches 'a')</li>
                    <li><strong>Metacharacters</strong>: Have special meanings (e.g., '.', '*', '+', '?')</li>
                    <li><strong>Character classes</strong>: Match any character from a set (e.g., [abc])</li>
                    <li><strong>Quantifiers</strong>: Specify how many times to match (e.g., *, +, {n,m})</li>
                  </ul>
                `,
              },
              {
                title: "Regular Expression Operators",
                content: `
                  <p>Regular expressions are built using the following fundamental operators:</p>
                  
                  <h3>Basic Operators:</h3>
                  <ul>
                    <li><strong>Concatenation</strong>: ab matches 'a' followed by 'b'</li>
                    <li><strong>Union (|)</strong>: a|b matches either 'a' or 'b'</li>
                    <li><strong>Kleene Star (*)</strong>: a* matches zero or more 'a's</li>
                    <li><strong>Plus (+)</strong>: a+ matches one or more 'a's</li>
                    <li><strong>Question Mark (?)</strong>: a? matches zero or one 'a'</li>
                  </ul>
                  
                  <h3>Advanced Operators:</h3>
                  <ul>
                    <li><strong>Dot (.)</strong>: Matches any single character</li>
                    <li><strong>Brackets []</strong>: Character class</li>
                    <li><strong>Parentheses ()</strong>: Grouping</li>
                    <li><strong>Anchors (^, $)</strong>: Beginning and end of string</li>
                  </ul>
                `,
              },
              {
                title: "Formal Definition",
                content: `
                  <p>Formally, regular expressions over an alphabet Σ are defined recursively:</p>
                  
                  <h3>Base Cases:</h3>
                  <ul>
                    <li>∅ (empty set) is a regular expression</li>
                    <li>ε (empty string) is a regular expression</li>
                    <li>For each a ∈ Σ, a is a regular expression</li>
                  </ul>
                  
                  <h3>Inductive Cases:</h3>
                  <p>If R₁ and R₂ are regular expressions, then:</p>
                  <ul>
                    <li>(R₁ ∪ R₂) is a regular expression (union)</li>
                    <li>(R₁ ∘ R₂) is a regular expression (concatenation)</li>
                    <li>(R₁*) is a regular expression (Kleene star)</li>
                  </ul>
                  
                  <p>The language denoted by a regular expression R is L(R), defined as:</p>
                  <ul>
                    <li>L(∅) = ∅</li>
                    <li>L(ε) = {ε}</li>
                    <li>L(a) = {a} for a ∈ Σ</li>
                    <li>L(R₁ ∪ R₂) = L(R₁) ∪ L(R₂)</li>
                    <li>L(R₁ ∘ R₂) = L(R₁) ∘ L(R₂)</li>
                    <li>L(R₁*) = (L(R₁))*</li>
                  </ul>
                `,
              },
              {
                title: "Equivalence with Finite Automata",
                content: `
                  <p>One of the most important results in automata theory is that regular expressions and finite automata are equivalent in terms of the languages they can describe.</p>
                  
                  <h3>Kleene's Theorem:</h3>
                  <p>A language is regular if and only if it can be described by a regular expression.</p>
                  
                  <h3>Conversion Algorithms:</h3>
                  <ul>
                    <li><strong>Regular Expression → NFA</strong>: Thompson's construction</li>
                    <li><strong>NFA → DFA</strong>: Subset construction</li>
                    <li><strong>DFA → Regular Expression</strong>: State elimination method</li>
                  </ul>
                  
                  <p>This equivalence means that any pattern that can be matched by a finite automaton can also be expressed as a regular expression, and vice versa.</p>
                `,
              },
              {
                title: "Applications and Use Cases",
                content: `
                  <p>Regular expressions have numerous practical applications:</p>
                  
                  <h3>Text Processing:</h3>
                  <ul>
                    <li>Pattern searching and replacement</li>
                    <li>Data validation (email, phone numbers, etc.)</li>
                    <li>Log file analysis</li>
                    <li>Text parsing and extraction</li>
                  </ul>
                  
                  <h3>Programming Languages:</h3>
                  <ul>
                    <li>Lexical analysis in compilers</li>
                    <li>String matching in editors</li>
                    <li>Input validation in forms</li>
                    <li>URL routing in web frameworks</li>
                  </ul>
                  
                  <h3>System Administration:</h3>
                  <ul>
                    <li>File filtering and searching</li>
                    <li>Configuration file parsing</li>
                    <li>Network monitoring</li>
                    <li>Security pattern detection</li>
                  </ul>
                `,
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="conversions">
          <div className="space-y-8">
            <ConversionDiagram title="Regular Expression Conversion Methods" steps={conversionSteps} />

            <ThompsonConstruction />
          </div>
        </TabsContent>

        <TabsContent value="visualizer">
          <Card>
            <CardHeader>
              <CardTitle>Regular Expression Visualizer</CardTitle>
              <CardDescription>
                Visualize how regular expressions are converted to finite automata and test pattern matching.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedAutomataVisualizer type="nfa" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples">
          <div className="space-y-6">
            {codeExamples.map((example, index) => (
              <CodeExample key={index} title={example.name} language="javascript" code={example.code} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor">
          <CodeEditor
            title="Regular Expression Playground"
            language="javascript"
            initialCode={`// Regular Expression Playground
// Try different regex patterns and test them

const testStrings = [
  "hello world",
  "test@example.com",
  "123-456-7890",
  "The quick brown fox"
];

// Define your regular expression here
const pattern = /\\b\\w+@\\w+\\.\\w+\\b/g;

// Test the pattern against all strings
testStrings.forEach((str, index) => {
  const matches = str.match(pattern);
  console.log(\`String \${index + 1}: "\${str}"\`);
  console.log(\`Matches: \${matches ? matches.join(", ") : "None"}\`);
  console.log("---");
});`}
            examples={codeExamples}
          />
        </TabsContent>

        <TabsContent value="quiz">
          <QuizSection
            title="Regular Expressions Quiz"
            questions={[
              {
                question: "Which regular expression matches strings that start and end with the same character?",
                options: ["(.).*\\1", "(.)(.*)", "^(.).*\\1$", "\\w+\\w"],
                correctAnswer: 2,
                explanation:
                  "^(.).*\\1$ uses anchors (^$) to match the entire string, captures the first character in group 1, matches any characters in between (.*), and then matches the same character as group 1 (\\1) at the end.",
              },
              {
                question: "What does the regular expression (a|b)*abb match?",
                options: [
                  "Any string containing 'abb'",
                  "Strings of a's and b's ending with 'abb'",
                  "Only the string 'abb'",
                  "Strings starting with 'a' and ending with 'bb'",
                ],
                correctAnswer: 1,
                explanation:
                  "(a|b)* matches any sequence of a's and b's (including empty string), followed by the literal string 'abb'. So it matches strings consisting only of a's and b's that end with 'abb'.",
              },
              {
                question: "Which of the following is NOT a regular language?",
                options: [
                  "The set of all strings with equal numbers of 0s and 1s",
                  "The set of all strings ending with '101'",
                  "The set of all strings with at least one '1'",
                  "The set of all strings of even length",
                ],
                correctAnswer: 0,
                explanation:
                  "The language of strings with equal numbers of 0s and 1s is context-free but not regular. It cannot be recognized by any finite automaton because it would require infinite memory to count the 0s and 1s.",
              },
              {
                question: "What is the result of applying Kleene's theorem?",
                options: [
                  "Every NFA can be converted to a DFA",
                  "Every regular expression describes a regular language",
                  "Regular expressions and finite automata are equivalent",
                  "Every context-free language is also regular",
                ],
                correctAnswer: 2,
                explanation:
                  "Kleene's theorem states that regular expressions and finite automata are equivalent in terms of the languages they can describe. A language is regular if and only if it can be described by a regular expression.",
              },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
