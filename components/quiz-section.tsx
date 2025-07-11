"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizSectionProps {
  title: string
  questions: Question[]
}

export function QuizSection({ title, questions }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleOptionSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedOption(index)
    }
  }

  const checkAnswer = () => {
    if (selectedOption === null) return

    setIsAnswered(true)
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setQuizCompleted(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Test your understanding of the concepts covered in this topic.</CardDescription>
      </CardHeader>
      <CardContent>
        {!quizCompleted ? (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>

            <div className="text-lg font-medium">{questions[currentQuestion].question}</div>

            <RadioGroup value={selectedOption?.toString()} className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(index)}
                    className={
                      isAnswered
                        ? index === questions[currentQuestion].correctAnswer
                          ? "text-green-500 border-green-500"
                          : index === selectedOption
                            ? "text-red-500 border-red-500"
                            : ""
                        : ""
                    }
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className={
                      isAnswered
                        ? index === questions[currentQuestion].correctAnswer
                          ? "text-green-500"
                          : index === selectedOption
                            ? "text-red-500"
                            : ""
                        : ""
                    }
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {isAnswered && (
              <Alert
                className={
                  selectedOption === questions[currentQuestion].correctAnswer
                    ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                }
              >
                <div className="flex items-center gap-2">
                  {selectedOption === questions[currentQuestion].correctAnswer ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <AlertTitle>
                    {selectedOption === questions[currentQuestion].correctAnswer ? "Correct!" : "Incorrect!"}
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-2">{questions[currentQuestion].explanation}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Quiz Completed!</h3>
            <p className="text-xl">
              Your score: {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </p>
            {score === questions.length ? (
              <p className="text-green-500">Perfect score! Excellent work!</p>
            ) : score >= questions.length * 0.7 ? (
              <p className="text-green-500">Great job! You've mastered most of the concepts.</p>
            ) : (
              <p className="text-amber-500">Keep studying! You're making progress.</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!quizCompleted ? (
          <>
            <Button variant="outline" onClick={checkAnswer} disabled={selectedOption === null || isAnswered}>
              Check Answer
            </Button>
            <Button onClick={nextQuestion} disabled={!isAnswered}>
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          </>
        ) : (
          <Button onClick={resetQuiz} className="mx-auto">
            Restart Quiz
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
