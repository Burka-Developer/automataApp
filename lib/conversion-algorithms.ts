// Regular Expression to NFA (Thompson's Construction)
export interface State {
  id: string
  isAccepting: boolean
  isInitial: boolean
}

export interface Transition {
  from: string
  to: string
  symbol: string
}

export interface Automaton {
  states: State[]
  transitions: Transition[]
  alphabet: string[]
  initialState: string
  acceptingStates: string[]
}

export class RegexToNFA {
  private stateCounter = 0

  private newState(isAccepting = false, isInitial = false): State {
    return {
      id: `q${this.stateCounter++}`,
      isAccepting,
      isInitial,
    }
  }

  public convert(regex: string): Automaton {
    this.stateCounter = 0
    const nfa = this.parseRegex(regex)

    return {
      states: nfa.states,
      transitions: nfa.transitions,
      alphabet: this.extractAlphabet(regex),
      initialState: nfa.start.id,
      acceptingStates: [nfa.end.id],
    }
  }

  private extractAlphabet(regex: string): string[] {
    const alphabet = new Set<string>()
    for (const char of regex) {
      if (char.match(/[a-zA-Z0-9]/)) {
        alphabet.add(char)
      }
    }
    return Array.from(alphabet)
  }

  private parseRegex(regex: string): { start: State; end: State; states: State[]; transitions: Transition[] } {
    return this.parseUnion(regex)
  }

  private parseUnion(regex: string): { start: State; end: State; states: State[]; transitions: Transition[] } {
    const parts = this.splitOnUnion(regex)
    if (parts.length === 1) {
      return this.parseConcat(parts[0])
    }

    const start = this.newState(false, true)
    const end = this.newState(true)
    let states = [start, end]
    let transitions: Transition[] = []

    for (const part of parts) {
      const partNFA = this.parseConcat(part)
      states = states.concat(partNFA.states)
      transitions = transitions.concat(partNFA.transitions)
      transitions.push({ from: start.id, to: partNFA.start.id, symbol: "ε" })
      transitions.push({ from: partNFA.end.id, to: end.id, symbol: "ε" })
    }

    return { start, end, states, transitions }
  }

  private parseConcat(regex: string): { start: State; end: State; states: State[]; transitions: Transition[] } {
    const parts = this.splitOnConcat(regex)
    if (parts.length === 1) {
      return this.parseKleene(parts[0])
    }

    const result = this.parseKleene(parts[0])
    for (let i = 1; i < parts.length; i++) {
      const next = this.parseKleene(parts[i])
      result.states = result.states.concat(next.states)
      result.transitions = result.transitions.concat(next.transitions)
      result.transitions.push({ from: result.end.id, to: next.start.id, symbol: "ε" })
      result.end = next.end
    }

    return result
  }

  private parseKleene(regex: string): { start: State; end: State; states: State[]; transitions: Transition[] } {
    if (regex && regex.length > 0 && regex.endsWith("*")) {
      const inner = this.parseAtom(regex.slice(0, -1))
      const start = this.newState()
      const end = this.newState()

      const states = [start, end, ...inner.states]
      const transitions = [
        ...inner.transitions,
        { from: start.id, to: inner.start.id, symbol: "ε" },
        { from: start.id, to: end.id, symbol: "ε" },
        { from: inner.end.id, to: end.id, symbol: "ε" },
        { from: inner.end.id, to: inner.start.id, symbol: "ε" },
      ]

      return { start, end, states, transitions }
    }
    return this.parseAtom(regex)
  }

  private parseAtom(regex: string): { start: State; end: State; states: State[]; transitions: Transition[] } {
    if (!regex || regex.length === 0) {
      // Handle empty string case
      const start = this.newState()
      const end = this.newState()
      const states = [start, end]
      const transitions = [{ from: start.id, to: end.id, symbol: "ε" }]
      return { start, end, states, transitions }
    }

    if (regex.startsWith("(") && regex.endsWith(")")) {
      return this.parseRegex(regex.slice(1, -1))
    }

    const start = this.newState()
    const end = this.newState()
    const states = [start, end]
    const transitions = [{ from: start.id, to: end.id, symbol: regex }]

    return { start, end, states, transitions }
  }

  private splitOnUnion(regex: string): string[] {
    // Simplified splitting - in a real implementation, need to handle parentheses
    return regex.split("|")
  }

  private splitOnConcat(regex: string): string[] {
    // Simplified splitting - in a real implementation, need proper parsing
    const parts: string[] = []
    let current = ""
    let parenCount = 0

    for (let i = 0; i < regex.length; i++) {
      const char = regex[i]
      if (char === "(") parenCount++
      if (char === ")") parenCount--

      current += char

      if (parenCount === 0 && (i === regex.length - 1 || regex[i + 1] !== "*")) {
        parts.push(current)
        current = ""
      }
    }

    return parts.filter((p) => p.length > 0)
  }
}

// NFA to DFA (Subset Construction)
export class NFAToDFA {
  public convert(nfa: Automaton): Automaton {
    const dfaStates: { [key: string]: string[] } = {}
    const dfaTransitions: Transition[] = []
    const dfaAcceptingStates: string[] = []
    const stateQueue: string[][] = []
    const processedStates = new Set<string>()

    // Start with epsilon closure of initial state
    const initialClosure = this.epsilonClosure(nfa, [nfa.initialState])
    const initialStateId = this.getStateId(initialClosure)
    dfaStates[initialStateId] = initialClosure
    stateQueue.push(initialClosure)

    if (initialClosure.some((s) => nfa.acceptingStates.includes(s))) {
      dfaAcceptingStates.push(initialStateId)
    }

    while (stateQueue.length > 0) {
      const currentStateSet = stateQueue.shift()!
      const currentStateId = this.getStateId(currentStateSet)

      if (processedStates.has(currentStateId)) continue
      processedStates.add(currentStateId)

      for (const symbol of nfa.alphabet) {
        const targetStates = this.getTargetStates(nfa, currentStateSet, symbol)
        if (targetStates.length === 0) continue

        const targetClosure = this.epsilonClosure(nfa, targetStates)
        const targetStateId = this.getStateId(targetClosure)

        if (!dfaStates[targetStateId]) {
          dfaStates[targetStateId] = targetClosure
          stateQueue.push(targetClosure)

          if (targetClosure.some((s) => nfa.acceptingStates.includes(s))) {
            dfaAcceptingStates.push(targetStateId)
          }
        }

        dfaTransitions.push({
          from: currentStateId,
          to: targetStateId,
          symbol: symbol,
        })
      }
    }

    const states: State[] = Object.keys(dfaStates).map((id) => ({
      id,
      isAccepting: dfaAcceptingStates.includes(id),
      isInitial: id === initialStateId,
    }))

    return {
      states,
      transitions: dfaTransitions,
      alphabet: nfa.alphabet,
      initialState: initialStateId,
      acceptingStates: dfaAcceptingStates,
    }
  }

  private epsilonClosure(nfa: Automaton, states: string[]): string[] {
    const closure = new Set(states)
    const stack = [...states]

    while (stack.length > 0) {
      const state = stack.pop()!
      const epsilonTransitions = nfa.transitions.filter((t) => t.from === state && t.symbol === "ε")

      for (const trans of epsilonTransitions) {
        if (!closure.has(trans.to)) {
          closure.add(trans.to)
          stack.push(trans.to)
        }
      }
    }

    return Array.from(closure).sort()
  }

  private getTargetStates(nfa: Automaton, states: string[], symbol: string): string[] {
    const targets = new Set<string>()

    for (const state of states) {
      const transitions = nfa.transitions.filter((t) => t.from === state && t.symbol === symbol)
      for (const trans of transitions) {
        targets.add(trans.to)
      }
    }

    return Array.from(targets)
  }

  private getStateId(states: string[]): string {
    return `{${states.sort().join(",")}}`
  }
}

// DFA to Regular Expression (State Elimination)
export class DFAToRegex {
  public convert(dfa: Automaton): string {
    // Add new start and end states
    let states = [...dfa.states]
    let transitions = [...dfa.transitions]

    const newStart = { id: "start", isAccepting: false, isInitial: false }
    const newEnd = { id: "end", isAccepting: false, isInitial: false }

    states.push(newStart, newEnd)

    // Connect new start to old start
    transitions.push({ from: newStart.id, to: dfa.initialState, symbol: "ε" })

    // Connect all accepting states to new end
    for (const acceptState of dfa.acceptingStates) {
      transitions.push({ from: acceptState, to: newEnd.id, symbol: "ε" })
    }

    // Eliminate states one by one (except start and end)
    const eliminationOrder = states.filter((s) => s.id !== newStart.id && s.id !== newEnd.id)

    for (const stateToEliminate of eliminationOrder) {
      transitions = this.eliminateState(stateToEliminate.id, transitions)
      states = states.filter((s) => s.id !== stateToEliminate.id)
    }

    // Find the transition from start to end
    const finalTransition = transitions.find((t) => t.from === newStart.id && t.to === newEnd.id)
    return finalTransition ? finalTransition.symbol : "∅"
  }

  private eliminateState(state: string, transitions: Transition[]): Transition[] {
    const newTransitions: Transition[] = []

    // Get all transitions
    const incomingTransitions = transitions.filter((t) => t.to === state)
    const outgoingTransitions = transitions.filter((t) => t.from === state)
    const selfLoop = transitions.find((t) => t.from === state && t.to === state)
    const otherTransitions = transitions.filter((t) => t.from !== state && t.to !== state)

    // Add all transitions that don't involve the eliminated state
    newTransitions.push(...otherTransitions)

    // Create new transitions for each incoming-outgoing pair
    for (const incoming of incomingTransitions) {
      for (const outgoing of outgoingTransitions) {
        if (incoming.from === outgoing.to) continue // Skip if would create self-loop

        let regex = incoming.symbol
        if (selfLoop) {
          regex += `(${selfLoop.symbol})*`
        }
        regex += outgoing.symbol

        // Check if there's already a transition between these states
        const existingIndex = newTransitions.findIndex((t) => t.from === incoming.from && t.to === outgoing.to)

        if (existingIndex >= 0) {
          // Union with existing transition
          newTransitions[existingIndex].symbol = `(${newTransitions[existingIndex].symbol}|${regex})`
        } else {
          newTransitions.push({
            from: incoming.from,
            to: outgoing.to,
            symbol: regex,
          })
        }
      }
    }

    return newTransitions
  }
}

// NFA to Regular Expression (via NFA to DFA then DFA to RE)
export class NFAToRegex {
  public convert(nfa: Automaton): string {
    const nfaToDfa = new NFAToDFA()
    const dfaToRegex = new DFAToRegex()

    const dfa = nfaToDfa.convert(nfa)
    return dfaToRegex.convert(dfa)
  }
}
