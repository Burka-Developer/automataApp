import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopicContent } from "@/components/topic-content"
import { QuizSection } from "@/components/quiz-section"
import { CodeExample } from "@/components/code-example"
import { AdvancedAutomataVisualizer } from "@/components/advanced-automata-visualizer"
import { ConversionDiagram } from "@/components/conversion-diagram"
import { ThompsonConstruction } from "@/components/thompson-construction"

export default function FiniteAutomataPage() {
  const conversionSteps = [
    {
      from: "Regular Expression",
      to: "NFA",
      method: "Thompson's Construction",
      description:
        "Convert regular expressions to NFAs using recursive construction rules for union, concatenation, and Kleene star.",
      complexity: "O(|R|) states and transitions",
    },
    {
      from: "NFA",
      to: "DFA",
      method: "Subset Construction",
      description:
        "Convert NFAs to DFAs by creating DFA states that represent sets of NFA states, handling ε-transitions through ε-closure.",
      complexity: "O(2^n) states in worst case",
    },
    {
      from: "DFA",
      to: "Minimized DFA",
      method: "Partition Refinement",
      description:
        "Minimize DFAs by merging equivalent states using partition refinement algorithm to find the minimal DFA.",
      complexity: "O(n log n) time",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Finite Automata</h1>
      <p className="text-xl mb-8 text-muted-foreground">
        Learn about deterministic and non-deterministic finite automata, their properties, and how they recognize
        regular languages.
      </p>

      <Tabs defaultValue="content" className="space-y-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <TopicContent
            sections={[
              {
                title: "Introduction to Finite Automata",
                content: `
                  <p>A finite automaton (FA) is a simple idealized machine used to recognize patterns within input taken from some character set (or alphabet). The job of an FA is to accept or reject an input depending on whether the pattern defined by the FA occurs in the input.</p>
                  
                  <p>There are two types of finite automata:</p>
                  <ul>
                    <li><strong>Deterministic Finite Automata (DFA)</strong>: A DFA has exactly one transition for each state and input symbol.</li>
                    <li><strong>Non-deterministic Finite Automata (NFA)</strong>: An NFA can have zero, one, or multiple transitions for each state and input symbol.</li>
                  </ul>
                `,
              },
              {
                title: "Formal Definition of a DFA",
                content: `
                  <p>A deterministic finite automaton (DFA) is a 5-tuple $$(Q, \\Sigma, \\delta, q_0, F)$$ where:</p>
                  <ul>
                    <li>$$Q$$ is a finite set of states</li>
                    <li>$$\\Sigma$$ is a finite set of symbols called the alphabet</li>
                    <li>$$\\delta: Q \\times \\Sigma \\rightarrow Q$$ is the transition function</li>
                    <li>$$q_0 \\in Q$$ is the start state</li>
                    <li>$$F \\subseteq Q$$ is the set of accept states</li>
                  </ul>
                `,
              },
              {
                title: "Formal Definition of an NFA",
                content: `
                  <p>A non-deterministic finite automaton (NFA) is a 5-tuple $$(Q, \\Sigma, \\delta, q_0, F)$$ where:</p>
                  <ul>
                    <li>$$Q$$ is a finite set of states</li>
                    <li>$$\\Sigma$$ is a finite set of symbols called the alphabet</li>
                    <li>$$\\delta: Q \\times (\\Sigma \\cup \\{\\epsilon\\}) \\rightarrow \\mathcal{P}(Q)$$ is the transition function</li>
                    <li>$$q_0 \\in Q$$ is the start state</li>
                    <li>$$F \\subseteq Q$$ is the set of accept states</li>
                  </ul>
                  <p>The key difference is that the transition function in an NFA maps to a power set of states, allowing for multiple possible transitions for a given state and input symbol.</p>
                `,
              },
              {
                title: "Equivalence of DFAs and NFAs",
                content: `
                  <p>Despite their differences, DFAs and NFAs have the same expressive power. Any language that can be recognized by an NFA can also be recognized by a DFA, and vice versa.</p>
                  
                  <p>The process of converting an NFA to a DFA is called the <strong>subset construction</strong> or <strong>powerset construction</strong>. This process creates a DFA whose states correspond to sets of states in the NFA.</p>
                `,
              },
              {
                title: "Applications of Finite Automata",
                content: `
                  <p>Finite automata have numerous applications in computer science and beyond:</p>
                  <ul>
                    <li>Lexical analysis in compilers</li>
                    <li>Pattern matching in text editors</li>
                    <li>Protocol specification in communication systems</li>
                    <li>Circuit design in digital electronics</li>
                    <li>Natural language processing</li>
                  </ul>
                `,
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="conversions">
          <div className="space-y-8">
            <ConversionDiagram title="Finite Automata Conversion Methods" steps={conversionSteps} />

            <ThompsonConstruction />
          </div>
        </TabsContent>

        <TabsContent value="visualizer">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Finite Automata Visualizer</CardTitle>
              <CardDescription>
                Create, edit, and simulate finite automata. Test input strings and see step-by-step execution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedAutomataVisualizer type="dfa" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Implementation examples of finite automata in different programming languages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="DFA Implementation in JavaScript"
                language="javascript"
                code={`
class DFA {
  constructor(states, alphabet, transitionFunction, startState, acceptStates) {
    this.states = states;
    this.alphabet = alphabet;
    this.transitionFunction = transitionFunction;
    this.startState = startState;
    this.acceptStates = acceptStates;
  }
  
  // Process an input string and determine if it's accepted
  processInput(input) {
    let currentState = this.startState;
    
    // Process each character in the input
    for (const char of input) {
      // Check if the character is in the alphabet
      if (!this.alphabet.includes(char)) {
        throw new Error(\`Character \${char} is not in the alphabet\`);
      }
      
      // Transition to the next state
      currentState = this.transitionFunction(currentState, char);
    }
    
    // Check if the final state is an accept state
    return this.acceptStates.includes(currentState);
  }
}

// Example: DFA that accepts strings ending with 'ab'
const states = ['q0', 'q1', 'q2'];
const alphabet = ['a', 'b'];

const transitionFunction = (state, char) => {
  if (state === 'q0' && char === 'a') return 'q1';
  if (state === 'q0' && char === 'b') return 'q0';
  if (state === 'q1' && char === 'a') return 'q1';
  if (state === 'q1' && char === 'b') return 'q2';
  if (state === 'q2' && char === 'a') return 'q1';
  if (state === 'q2' && char === 'b') return 'q0';
  return state; // Default case
};

const startState = 'q0';
const acceptStates = ['q2'];

const dfa = new DFA(states, alphabet, transitionFunction, startState, acceptStates);

console.log(dfa.processInput('ab'));    // true
console.log(dfa.processInput('aab'));   // false
console.log(dfa.processInput('aaab'));  // true
`}
              />

              <CodeExample
                title="NFA Implementation in Python"
                language="python"
                code={`
class NFA:
    def __init__(self, states, alphabet, transition_function, start_state, accept_states):
        self.states = states
        self.alphabet = alphabet
        self.transition_function = transition_function
        self.start_state = start_state
        self.accept_states = accept_states
    
    def epsilon_closure(self, states):
        """Compute the epsilon closure of a set of states."""
        closure = set(states)
        stack = list(states)
        
        while stack:
            state = stack.pop()
            if 'ε' in self.transition_function.get(state, {}):
                for next_state in self.transition_function[state]['ε']:
                    if next_state not in closure:
                        closure.add(next_state)
                        stack.append(next_state)
        
        return closure
    
    def process_input(self, input_string):
        """Process an input string and determine if it's accepted."""
        # Start with the epsilon closure of the start state
        current_states = self.epsilon_closure({self.start_state})
        
        # Process each character in the input
        for char in input_string:
            # Check if the character is in the alphabet
            if char not in self.alphabet:
                raise ValueError(f"Character {char} is not in the alphabet")
            
            # Compute the next set of states
            next_states = set()
            for state in current_states:
                if state in self.transition_function and char in self.transition_function[state]:
                    next_states.update(self.transition_function[state][char])
            
            # Compute the epsilon closure of the next states
            current_states = self.epsilon_closure(next_states)
        
        # Check if any of the final states is an accept state
        return any(state in self.accept_states for state in current_states)

# Example: NFA that accepts strings containing 'ab'
states = {'q0', 'q1', 'q2'}
alphabet = {'a', 'b'}

transition_function = {
    'q0': {'a': {'q1'}, 'b': {'q0'}, 'ε': {'q0'}},
    'q1': {'b': {'q2'}},
    'q2': {'a': {'q2'}, 'b': {'q2'}}
}

start_state = 'q0'
accept_states = {'q2'}

nfa = NFA(states, alphabet, transition_function, start_state, accept_states)

print(nfa.process_input('ab'))    # True
print(nfa.process_input('aab'))   # True
print(nfa.process_input('bb'))    # False
`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz">
          <QuizSection
            title="Test Your Knowledge"
            questions={[
              {
                question: "What is the main difference between a DFA and an NFA?",
                options: [
                  "A DFA has exactly one transition for each state and input symbol, while an NFA can have multiple transitions.",
                  "A DFA can only recognize regular languages, while an NFA can recognize context-free languages.",
                  "A DFA always has fewer states than an equivalent NFA.",
                  "A DFA cannot have epsilon transitions, while an NFA can.",
                ],
                correctAnswer: 0,
                explanation:
                  "A DFA (Deterministic Finite Automaton) has exactly one transition for each state and input symbol combination. An NFA (Non-deterministic Finite Automaton) can have zero, one, or multiple transitions for each state and input symbol, and can also have epsilon transitions.",
              },
              {
                question: "Which of the following is NOT true about finite automata?",
                options: [
                  "They can recognize all context-free languages.",
                  "They can be represented as directed graphs.",
                  "They have a finite number of states.",
                  "They can be used for lexical analysis in compilers.",
                ],
                correctAnswer: 0,
                explanation:
                  "Finite automata can only recognize regular languages, which are a proper subset of context-free languages. Context-free languages require more powerful computational models like pushdown automata to be recognized.",
              },
              {
                question: "What is the time complexity of simulating a DFA on an input string of length n?",
                options: ["O(n)", "O(n²)", "O(2^n)", "O(n log n)"],
                correctAnswer: 0,
                explanation:
                  "Simulating a DFA on an input string of length n takes O(n) time because for each character in the input string, the DFA makes exactly one state transition, which is a constant-time operation.",
              },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
