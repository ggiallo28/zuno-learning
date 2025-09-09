// src/contexts/AssessmentContext.tsx
import * as React from "react";

export type Confidence = "certo" | "forse" | "yes" | "maybe";
export type CoachMode = "elia" | "skippy" | "lupa" | "polpo";
export type PeerVote = "A" | "B" | null;

export type AssessmentState = {
  mode: CoachMode;
  // progress / precision (0..1)
  precision: number;
  targetPrecision: number;
  // timing
  timeLimitSec: number | null;
  elapsedSec: number;
  running: boolean;
  // question / answer
  currentQuestionId: string | null;
  selectedOptionId: string | null;
  confidence: Confidence | null;
  answered: number;
  total: number;
  // tags
  tags: string[];
  // peer review
  peerVote: PeerVote;
};

const initialState: AssessmentState = {
  mode: "skippy",
  precision: 0,
  targetPrecision: 0.95,
  timeLimitSec: null,
  elapsedSec: 0,
  running: false,
  currentQuestionId: null,
  selectedOptionId: null,
  confidence: null,
  answered: 0,
  total: 0,
  tags: [],
  peerVote: null,
};

// normalize Italian ↔︎ EN literals for scoring/rules
function normalizeConfidence(c: Confidence | null): "yes" | "maybe" | null {
  if (c === "certo") return "yes";
  if (c === "forse") return "maybe";
  if (c === "yes" || c === "maybe") return c;
  return null;
}

type Action =
  | { type: "setMode"; mode: CoachMode }
  | { type: "setTargetPrecision"; value: number }
  | { type: "setTimeLimit"; seconds: number | null }
  | { type: "tick"; seconds: number }
  | { type: "start" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "reset" }
  | { type: "selectOption"; optionId: string | null }
  | { type: "setConfidence"; value: Confidence | null }
  | { type: "toggleTag"; tag: string }
  | { type: "votePeerSnippet"; vote: PeerVote }
  | { type: "updatePrecision"; delta: number }
  | {
      type: "answerSubmitted";
      correct: boolean;
      confidence?: Confidence | null;
    };

function reducer(state: AssessmentState, action: Action): AssessmentState {
  switch (action.type) {
    case "setMode":
      return { ...state, mode: action.mode };
    case "setTargetPrecision":
      return { ...state, targetPrecision: Math.min(1, Math.max(0.5, action.value)) };
    case "setTimeLimit":
      return { ...state, timeLimitSec: action.seconds };
    case "tick":
      return { ...state, elapsedSec: state.running ? state.elapsedSec + action.seconds : state.elapsedSec };
    case "start":
      return { ...state, running: true, elapsedSec: 0, answered: 0, precision: 0 };
    case "pause":
      return { ...state, running: false };
    case "resume":
      return { ...state, running: true };
    case "reset":
      return { ...initialState, tags: state.tags };
    case "selectOption":
      return { ...state, selectedOptionId: action.optionId };
    case "setConfidence":
      return { ...state, confidence: action.value };
    case "toggleTag":
      return state.tags.includes(action.tag)
        ? { ...state, tags: state.tags.filter(t => t !== action.tag) }
        : { ...state, tags: [...state.tags, action.tag] };
    case "votePeerSnippet":
      return { ...state, peerVote: action.vote };
    case "updatePrecision":
      return { 
        ...state, 
        precision: Math.max(0, Math.min(1, state.precision + action.delta))
      };
    case "answerSubmitted": {
      const conf = normalizeConfidence(action.confidence ?? state.confidence);
      
      // Enhanced precision calculation algorithm
      const answeredCount = state.answered + 1;
      
      // More aggressive base precision improvement for faster convergence
      let precisionDelta = 0.15;
      
      // Confidence weighting: confident answers provide significantly more information
      const confidenceWeight = conf === "yes" ? 1.5 : 0.7;
      precisionDelta *= confidenceWeight;
      
      // Correctness impact - correct answers provide much more precision
      if (action.correct) {
        precisionDelta *= 1.3; // Correct answers significantly increase precision gain
      } else {
        precisionDelta *= 0.5; // Incorrect answers reduce precision gain more
      }
      
      // Less aggressive diminishing returns to allow reaching threshold
      const diminishingFactor = Math.max(0.6, 1 - (answeredCount * 0.05));
      precisionDelta *= diminishingFactor;
      
      // Apply statistical confidence interval narrowing
      // Early questions provide more information in adaptive testing
      const statisticalFactor = Math.min(1.8, 1 + (answeredCount * 0.15));
      precisionDelta *= statisticalFactor;
      
      // Calculate new precision with bounds checking
      const precision = Math.max(0, Math.min(1, state.precision + precisionDelta));
      
      return {
        ...state,
        precision,
        answered: answeredCount,
        selectedOptionId: null,
        confidence: null,
      };
    }
    default:
      return state;
  }
}

type DispatchFn = ((action: Action) => void) & {
  // method-style convenience (so both styles work)
  setMode: (mode: CoachMode) => void;
  setTargetPrecision: (value: number) => void;
  setTimeLimit: (seconds: number | null) => void;
  tick: (seconds: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  selectOption: (optionId: string | null) => void;
  setConfidence: (value: Confidence | null) => void;
  toggleTag: (tag: string) => void;
  votePeerSnippet: (vote: PeerVote) => void;
  updatePrecision: (delta: number) => void;
  submitAnswer: (correct: boolean, confidence?: Confidence | null) => void;
};

export type AssessmentAPI = {
  // direct helpers
  setMode: (mode: CoachMode) => void;
  setTargetPrecision: (value: number) => void;
  setTimeLimit: (seconds: number | null) => void;
  tick: (seconds: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  selectOption: (optionId: string | null) => void;
  setConfidence: (value: Confidence | null) => void;
  toggleTag: (tag: string) => void;
  votePeerSnippet: (vote: PeerVote) => void;
  updatePrecision: (delta: number) => void;
  submitAnswer: (correct: boolean, confidence?: Confidence | null) => void;

  // derived reads
  get precision(): number;
  get running(): boolean;

  // BACK-COMPAT for existing components:
  state: AssessmentState;
  dispatch: DispatchFn;
};

const AssessmentContext = React.createContext<AssessmentAPI | null>(null);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [state, bareDispatch] = React.useReducer(reducer, initialState);

  // build a callable dispatch that also has method helpers attached
  const dispatch: DispatchFn = Object.assign(
    ((action: Action) => bareDispatch(action)) as DispatchFn,
    {
      setMode: (mode: CoachMode) => bareDispatch({ type: "setMode", mode }),
      setTargetPrecision: (value: number) => bareDispatch({ type: "setTargetPrecision", value }),
      setTimeLimit: (seconds: number | null) => bareDispatch({ type: "setTimeLimit", seconds }),
      tick: (seconds: number) => bareDispatch({ type: "tick", seconds }),
      start: () => bareDispatch({ type: "start" }),
      pause: () => bareDispatch({ type: "pause" }),
      resume: () => bareDispatch({ type: "resume" }),
      reset: () => bareDispatch({ type: "reset" }),
      selectOption: (optionId: string | null) => bareDispatch({ type: "selectOption", optionId }),
      setConfidence: (value: Confidence | null) => bareDispatch({ type: "setConfidence", value }),
      toggleTag: (tag: string) => bareDispatch({ type: "toggleTag", tag }),
      votePeerSnippet: (vote: PeerVote) => bareDispatch({ type: "votePeerSnippet", vote }),
      updatePrecision: (delta: number) => bareDispatch({ type: "updatePrecision", delta }),
      submitAnswer: (correct: boolean, confidence?: Confidence | null) =>
        bareDispatch({ type: "answerSubmitted", correct, confidence }),
    }
  );

  const api = React.useMemo<AssessmentAPI>(() => {
    const helpers = {
      setMode: dispatch.setMode,
      setTargetPrecision: dispatch.setTargetPrecision,
      setTimeLimit: dispatch.setTimeLimit,
      tick: dispatch.tick,
      start: dispatch.start,
      pause: dispatch.pause,
      resume: dispatch.resume,
      reset: dispatch.reset,
      selectOption: dispatch.selectOption,
      setConfidence: dispatch.setConfidence,
      toggleTag: dispatch.toggleTag,
      votePeerSnippet: dispatch.votePeerSnippet,
      updatePrecision: dispatch.updatePrecision,
      submitAnswer: dispatch.submitAnswer,
      get precision() {
        return state.precision;
      },
      get running() {
        return state.running;
      },
      state,
      dispatch,
    };
    return helpers;
  }, [state, dispatch]);

  return (
    <AssessmentContext.Provider value={api}>
      {children}
    </AssessmentContext.Provider>
  );
}

// Hook to consume the context (reads the nearest Provider’s value) :contentReference[oaicite:1]{index=1}
export function useAssessment(): AssessmentAPI {
  const ctx = React.useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used inside <AssessmentProvider>");
  return ctx;
}
