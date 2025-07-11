import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopicContent } from "@/components/topic-content"
import { QuizSection } from "@/components/quiz-section"
import { CodeExample } from "@/components/code-example"
import { CodeEditor } from "@/components/code-editor"
import { AdvancedAutomataVisualizer } from "@/components/advanced-automata-visualizer"
import { ConversionDiagram } from "@/components/conversion-diagram"

export default function PumpingLemmaPage() {
  const conversionSteps = [
    {
      from: "Regular Expression",
      to: "NFA",
      method: "Thompson's Construction",
      description: "Build NFA from regex using structural induction on regex operators.",
      complexity: "O(|R|) states",
    },
    {
      from: "NFA",
      to: "DFA",
      method: "Subset Construction",
      description: "Convert NFA to equivalent DFA using powerset construction.",
      complexity: "O(2^n) states",
    },
    {
      from: "DFA",
      to: "Minimized DFA",
      method: "Partition Refinement",
      description: "Find minimal equivalent DFA by merging indistinguishable states.",
      complexity: "O(n log n)",
    },
  ]
  const codeExamples = [
    {
      name: "Pumping Lemma Checker",
      code: `// Function to check if a language might be regular using pumping lemma
function checkPumpingLemma(language, pumpingLength) {
  // Generate test strings of length >= pumping length
  const testStrings = generateTestStrings(language, pumpingLength);
  
  for (const string of testStrings) {
    console.log(\`Testing string: \${string}\`);
    
    // Try all possible decompositions xyz where |xy| <= p and |y| > 0
    for (let i = 1; i <= Math.min(pumpingLength, string.length); i++) {
      for (let j = 1; j <= pumpingLength - i + 1 && i + j <= string.length; j++) {
        const x = string.substring(0, i);
        const y = string.substring(i, i + j);
        const z = string.substring(i + j);
        
        console.log(\`  Decomposition: x="\${x}", y="\${y}", z="\${z}"\`);
        
        // Test pumping: xy^k z for k = 0, 1, 2, 3
        let pumpingWorks = true;
        for (let k = 0; k <= 3; k++) {
          const pumpedString = x + y.repeat(k) + z;
          if (!isInLanguage(pumpedString, language)) {
            console.log(\`    xy^\${k}z = "\${pumpedString}" NOT in language\`);
            pumpingWorks = false;
            break;
          } else {
            console.log(\`    xy^\${k}z = "\${pumpedString}" in language\`);
          }
        }
        
        if (pumpingWorks) {
          console.log(\`  This decomposition works for pumping\`);
        }
      }
    }
  }
}

// Example: Test the language {0^n 1^n | n >= 0}
function isEqualZerosOnes(string) {
  const zeros = (string.match(/0/g) || []).length;
  const ones = (string.match(/1/g) || []).length;
  return zeros === ones && /^0*1*$/.test(string);
}

function generateTestStrings(language, minLength) {
  const strings = [];
  // Generate strings of increasing length starting from minLength
  for (let len = minLength; len <= minLength + 3; len++) {
    if (language === "equal01") {
      // For {0^n 1^n}, generate strings like 00...0011...11
      const zeros = "0".repeat(len / 2);
      const ones = "1".repeat(len / 2);
      strings.push(zeros + ones);
    }
  }
  return strings;
}

function isInLanguage(string, language) {
  switch (language) {
    case "equal01":
      return isEqualZerosOnes(string);
    default:
      return false;
  }
}

// Test the pumping lemma for {0^n 1^n}
console.log("Testing language {0^n 1^n | n >= 0}:");
checkPumpingLemma("equal01", 4);`,
      description: "Implementation to test the pumping lemma for regular languages",
    },
    {
      name: "Non-Regular Language Proof",
      code: `// Proof that {0^n 1^n | n >= 0} is not regular using pumping lemma
function proveNonRegular() {
  console.log("Proof that L = {0^n 1^n | n >= 0} is not regular:");
  console.log("\\nAssume L is regular. Then there exists a pumping length p.");
  
  const p = 5; // Assume pumping length is 5
  const testString = "0".repeat(p) + "1".repeat(p); // 0^p 1^p
  
  console.log(\`\\nConsider string w = \${testString} (length = \${testString.length})\`);
  console.log("Since |w| >= p, w can be written as w = xyz where:");
  console.log("1. |xy| <= p");
  console.log("2. |y| > 0");
  console.log("3. xy^i z ∈ L for all i >= 0");
  
  console.log("\\nSince |xy| <= p and w starts with p zeros,");
  console.log("y must consist entirely of zeros (y = 0^k for some k > 0)");
  
  console.log("\\nNow consider xy^0z (pumping with i = 0):");
  const x = testString.substring(0, 2); // First 2 zeros
  const y = testString.substring(2, 4); // Next 2 zeros  
  const z = testString.substring(4);     // Remaining string
  
  console.log(\`x = "\${x}"\`);
  console.log(\`y = "\${y}"\`);
  console.log(\`z = "\${z}"\`);
  
  const pumpedString = x + z; // xy^0z
  console.log(\`\\nxy^0z = "\${pumpedString}"\`);
  
  const zeros = (pumpedString.match(/0/g) || []).length;
  const ones = (pumpedString.match(/1/g) || []).length;
  
  console.log(\`This string has \${zeros} zeros and \${ones} ones.\`);
  console.log(\`Since \${zeros} ≠ \${ones}, this string is NOT in L.\`);
  console.log("\\nThis contradicts the pumping lemma!");
  console.log("Therefore, L is not regular. QED");
}

proveNonRegular();`,
      description: "Step-by-step proof using the pumping lemma",
    },
    {
      name: "Palindrome Language Test",
      code: `// Test if palindromes over {0,1} form a regular language
function isPalindrome(str) {
  return str === str.split('').reverse().join('');
}

function testPalindromeLanguage() {
  console.log("Testing if palindromes over {0,1} are regular...");
  
  const p = 6; // Assumed pumping length
  const testString = "0" + "1".repeat(p-2) + "0"; // 01...10 (palindrome)
  
  console.log(\`\\nTest string: \${testString} (palindrome of length \${testString.length})\`);
  
  // Try different decompositions
  for (let xyLen = 1; xyLen <= Math.min(p, testString.length); xyLen++) {
    for (let yLen = 1; yLen <= xyLen; yLen++) {
      const x = testString.substring(0, xyLen - yLen);
      const y = testString.substring(xyLen - yLen, xyLen);
      const z = testString.substring(xyLen);
      
      console.log(\`\\nDecomposition: x="\${x}", y="\${y}", z="\${z}"\`);
      
      // Test pumping with i=0 and i=2
      for (const i of [0, 2]) {
        const pumped = x + y.repeat(i) + z;
        const isStillPalindrome = isPalindrome(pumped);
        
        console.log(\`  xy^\${i}z = "\${pumped}" - Palindrome: \${isStillPalindrome}\`);
        
        if (!isStillPalindrome) {
          console.log(\`  Found counterexample! Palindromes are not regular.\`);
          return;
        }
      }
    }
  }
  
  console.log("This test didn't find a counterexample, but palindromes are still not regular.");
  console.log("A more careful analysis with longer strings would reveal the contradiction.");
}

testPalindromeLanguage();`,
      description: "Testing whether palindromes form a regular language",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Pumping Lemma</h1>
      <p className="text-xl mb-8 text-muted-foreground">
        Learn how to prove that certain languages are not regular using the pumping lemma for regular languages.
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
                title: "Introduction to the Pumping Lemma",
                content: `
                  <p>The pumping lemma for regular languages is a powerful tool used to prove that certain languages are <strong>not regular</strong>. It provides a necessary condition that all regular languages must satisfy.</p>
                  
                  <p>The pumping lemma is particularly useful because:</p>
                  <ul>
                    <li>It gives us a way to prove negative results (that a language is not regular)</li>
                    <li>It's often easier to use than trying to construct automata</li>
                    <li>It reveals fundamental limitations of finite automata</li>
                  </ul>
                  
                  <p><strong>Important:</strong> The pumping lemma is a <em>necessary</em> condition for regularity, not a sufficient one. If a language satisfies the pumping lemma, it might still not be regular.</p>
                `,
              },
              {
                title: "Statement of the Pumping Lemma",
                content: `
                  <p><strong>Pumping Lemma for Regular Languages:</strong></p>
                  
                  <p>If L is a regular language, then there exists a positive integer p (called the <strong>pumping length</strong>) such that every string w ∈ L with |w| ≥ p can be divided into three parts w = xyz satisfying:</p>
                  
                  <ol>
                    <li><strong>|xy| ≤ p</strong> (the first two parts have length at most p)</li>
                    <li><strong>|y| > 0</strong> (the middle part is non-empty)</li>
                    <li><strong>xy<sup>i</sup>z ∈ L for all i ≥ 0</strong> (we can "pump" the middle part any number of times)</li>
                  </ol>
                  
                  <p>The intuition is that if we have a DFA with p states and we process a string of length ≥ p, we must visit some state twice. The portion of the string between these repeated visits can be "pumped" (repeated) without changing acceptance.</p>
                `,
              },
              {
                title: "How to Use the Pumping Lemma",
                content: `
                  <p>To prove that a language L is <strong>not regular</strong> using the pumping lemma:</p>
                  
                  <ol>
                    <li><strong>Assume</strong> L is regular</li>
                    <li><strong>Let p</strong> be the pumping length guaranteed by the pumping lemma</li>
                    <li><strong>Choose</strong> a specific string w ∈ L with |w| ≥ p</li>
                    <li><strong>Consider</strong> all possible ways to divide w = xyz satisfying conditions 1 and 2</li>
                    <li><strong>Show</strong> that for each such division, there exists some i ≥ 0 such that xy<sup>i</sup>z ∉ L</li>
                    <li><strong>Conclude</strong> that L is not regular (contradiction)</li>
                  </ol>
                  
                  <p><strong>Key Strategy:</strong> Choose your string w cleverly so that any valid decomposition leads to a contradiction when pumped.</p>
                `,
              },
              {
                title: "Classic Examples",
                content: `
                  <h3>Example 1: L = {0<sup>n</sup>1<sup>n</sup> | n ≥ 0}</h3>
                  
                  <p><strong>Proof that L is not regular:</strong></p>
                  <ol>
                    <li>Assume L is regular with pumping length p</li>
                    <li>Choose w = 0<sup>p</sup>1<sup>p</sup> ∈ L</li>
                    <li>Since |xy| ≤ p and w starts with p zeros, y consists only of zeros</li>
                    <li>When we pump with i = 0, we get xy<sup>0</sup>z with fewer zeros than ones</li>
                    <li>This string is not in L, contradicting the pumping lemma</li>
                  </ol>
                  
                  <h3>Example 2: L = {ww | w ∈ {0,1}*}</h3>
                  
                  <p>The language of strings that are concatenations of a string with itself is also not regular. The proof involves choosing w = 0<sup>p</sup>10<sup>p</sup>1 and showing that pumping destroys the "doubling" property.</p>
                  
                  <h3>Example 3: Palindromes over {0,1}</h3>
                  
                  <p>The set of all palindromes (strings that read the same forwards and backwards) is not regular. The proof uses the fact that pumping near the beginning of a palindrome destroys the symmetry.</p>
                `,
              },
              {
                title: "Common Mistakes and Tips",
                content: `
                  <h3>Common Mistakes:</h3>
                  <ul>
                    <li><strong>Wrong direction:</strong> Remember, the pumping lemma proves non-regularity, not regularity</li>
                    <li><strong>Bad string choice:</strong> Choose w so that ANY valid decomposition leads to contradiction</li>
                    <li><strong>Forgetting constraints:</strong> Remember |xy| ≤ p and |y| > 0</li>
                    <li><strong>Not considering all cases:</strong> You must show the contradiction works for ALL valid decompositions</li>
                  </ul>
                  
                  <h3>Helpful Tips:</h3>
                  <ul>
                    <li>Choose strings with clear structure that pumping will destroy</li>
                    <li>Often, strings with equal counts of different symbols work well</li>
                    <li>Consider what happens when you pump with i = 0 (removing y entirely)</li>
                    <li>Draw pictures to visualize the decomposition</li>
                    <li>Practice with known non-regular languages first</li>
                  </ul>
                `,
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="conversions">
          <ConversionDiagram title="Regular Language Conversion Methods" steps={conversionSteps} />
        </TabsContent>

        <TabsContent value="visualizer">
          <Card>
            <CardHeader>
              <CardTitle>Pumping Lemma Visualizer</CardTitle>
              <CardDescription>
                Visualize how the pumping lemma works with different string decompositions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedAutomataVisualizer type="dfa" />
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
            title="Pumping Lemma Playground"
            language="javascript"
            initialCode={`// Pumping Lemma Playground
// Test different languages to see if they satisfy the pumping lemma

function testLanguage(languageName, testString, pumpingLength) {
  console.log(\`Testing language: \${languageName}\`);
  console.log(\`Test string: \${testString}\`);
  console.log(\`Pumping length: \${pumpingLength}\`);
  console.log("=" .repeat(50));
  
  // Try different decompositions
  for (let xyLen = 1; xyLen <= Math.min(pumpingLength, testString.length); xyLen++) {
    for (let yLen = 1; yLen <= xyLen; yLen++) {
      const x = testString.substring(0, xyLen - yLen);
      const y = testString.substring(xyLen - yLen, xyLen);
      const z = testString.substring(xyLen);
      
      if (y.length === 0) continue; // |y| > 0 required
      
      console.log(\`\\nDecomposition: x="\${x}", y="\${y}", z="\${z}"\`);
      
      // Test pumping with different values of i
      for (let i = 0; i <= 3; i++) {
        const pumped = x + y.repeat(i) + z;
        console.log(\`  xy^\${i}z = "\${pumped}"\`);
      }
    }
  }
}

// Test the classic example: {0^n 1^n}
testLanguage("{0^n 1^n}", "000111", 4);`}
            examples={codeExamples}
          />
        </TabsContent>

        <TabsContent value="quiz">
          <QuizSection
            title="Pumping Lemma Quiz"
            questions={[
              {
                question: "What does the pumping lemma for regular languages allow us to prove?",
                options: [
                  "That a language is regular",
                  "That a language is not regular",
                  "That a language is context-free",
                  "That a language is decidable",
                ],
                correctAnswer: 1,
                explanation:
                  "The pumping lemma is used to prove that languages are NOT regular. It provides a necessary condition that all regular languages must satisfy, so if a language violates this condition, it cannot be regular.",
              },
              {
                question: "In the pumping lemma, if w = xyz with |w| ≥ p, which condition must be satisfied?",
                options: [
                  "|xy| ≥ p and |y| > 0",
                  "|xy| ≤ p and |y| ≥ 0",
                  "|xy| ≤ p and |y| > 0",
                  "|xy| < p and |y| = 0",
                ],
                correctAnswer: 2,
                explanation:
                  "The pumping lemma requires |xy| ≤ p (the first two parts have length at most p) and |y| > 0 (the middle part must be non-empty so we can actually pump it).",
              },
              {
                question: "Why is the language L = {0ⁿ1ⁿ | n ≥ 0} not regular?",
                options: [
                  "It requires infinite memory to count",
                  "It cannot be recognized by any DFA",
                  "The pumping lemma shows it's not regular",
                  "All of the above",
                ],
                correctAnswer: 3,
                explanation:
                  "All options are correct. The language requires infinite memory to count and match the number of 0s and 1s, cannot be recognized by any finite automaton, and this can be formally proven using the pumping lemma.",
              },
              {
                question: "When using the pumping lemma to prove L = {0ⁿ1ⁿ} is not regular, why do we choose w = 0ᵖ1ᵖ?",
                options: [
                  "It's the shortest string in the language",
                  "It forces y to consist only of 0s, making pumping destroy the balance",
                  "It's the only string that works",
                  "It makes the proof easier to understand",
                ],
                correctAnswer: 1,
                explanation:
                  "We choose w = 0ᵖ1ᵖ because with |xy| ≤ p, the substring xy must fall entirely within the first p characters (all 0s). This forces y to consist only of 0s, so pumping will change the number of 0s but not 1s, destroying the required balance.",
              },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
