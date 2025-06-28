
// Formal Verification for Behavioral Analysis
// Using state machines and logical constraints

export interface BehaviorState {
  gazeDirection: 'forward' | 'away' | 'suspicious';
  tabStatus: 'focused' | 'switched' | 'newWindow';
  audioLevel: 'normal' | 'elevated' | 'suspicious';
  timestamp: number;
}

export interface BehaviorTransition {
  from: BehaviorState;
  to: BehaviorState;
  event: string;
  isValid: boolean;
}

export interface CheatingPattern {
  id: string;
  name: string;
  description: string;
  conditions: (transitions: BehaviorTransition[]) => boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Formal specifications for cheating detection
export const CHEATING_PATTERNS: CheatingPattern[] = [
  {
    id: 'excessive_gaze_shift',
    name: 'Excessive Gaze Shifting',
    description: 'Student looks away from screen more than 5 times in 2 minutes',
    severity: 'medium',
    conditions: (transitions) => {
      const gazeShifts = transitions.filter(t => 
        t.from.gazeDirection === 'forward' && t.to.gazeDirection === 'away'
      );
      const timeWindow = 120000; // 2 minutes in ms
      const now = Date.now();
      const recentShifts = gazeShifts.filter(t => now - t.to.timestamp < timeWindow);
      return recentShifts.length > 5;
    }
  },
  {
    id: 'rapid_tab_switching',
    name: 'Rapid Tab Switching',
    description: 'More than 3 tab switches in 5 minutes',
    severity: 'high',
    conditions: (transitions) => {
      const tabSwitches = transitions.filter(t => 
        t.from.tabStatus === 'focused' && t.to.tabStatus === 'switched'
      );
      const timeWindow = 300000; // 5 minutes in ms
      const now = Date.now();
      const recentSwitches = tabSwitches.filter(t => now - t.to.timestamp < timeWindow);
      return recentSwitches.length > 3;
    }
  },
  {
    id: 'audio_anomaly',
    name: 'Audio Anomaly Detection',
    description: 'Suspicious audio patterns indicating multiple voices',
    severity: 'critical',
    conditions: (transitions) => {
      const audioAnomalies = transitions.filter(t => 
        t.to.audioLevel === 'suspicious'
      );
      const timeWindow = 60000; // 1 minute in ms
      const now = Date.now();
      const recentAnomalies = audioAnomalies.filter(t => now - t.to.timestamp < timeWindow);
      return recentAnomalies.length > 2;
    }
  },
  {
    id: 'combined_suspicious_activity',
    name: 'Combined Suspicious Activity',
    description: 'Multiple types of suspicious behavior occurring simultaneously',
    severity: 'critical',
    conditions: (transitions) => {
      const timeWindow = 180000; // 3 minutes in ms
      const now = Date.now();
      const recentTransitions = transitions.filter(t => now - t.to.timestamp < timeWindow);
      
      const hasGazeShift = recentTransitions.some(t => t.to.gazeDirection === 'away');
      const hasTabSwitch = recentTransitions.some(t => t.to.tabStatus === 'switched');
      const hasAudioAnomaly = recentTransitions.some(t => t.to.audioLevel === 'suspicious');
      
      return [hasGazeShift, hasTabSwitch, hasAudioAnomaly].filter(Boolean).length >= 2;
    }
  }
];

export class BehaviorAnalyzer {
  private transitions: BehaviorTransition[] = [];
  private currentState: BehaviorState = {
    gazeDirection: 'forward',
    tabStatus: 'focused',
    audioLevel: 'normal',
    timestamp: Date.now()
  };

  addTransition(newState: Partial<BehaviorState>, event: string): void {
    const nextState: BehaviorState = {
      ...this.currentState,
      ...newState,
      timestamp: Date.now()
    };

    const transition: BehaviorTransition = {
      from: { ...this.currentState },
      to: nextState,
      event,
      isValid: this.isValidTransition(this.currentState, nextState)
    };

    this.transitions.push(transition);
    this.currentState = nextState;

    // Log transition for audit
    console.log('Behavior Transition:', {
      event,
      from: this.formatState(transition.from),
      to: this.formatState(transition.to),
      valid: transition.isValid
    });
  }

  private isValidTransition(from: BehaviorState, to: BehaviorState): boolean {
    // Define valid state transitions based on formal specification
    const validTransitions = [
      // Gaze transitions
      { from: 'forward', to: 'away', field: 'gazeDirection' },
      { from: 'away', to: 'forward', field: 'gazeDirection' },
      { from: 'away', to: 'suspicious', field: 'gazeDirection' },
      { from: 'suspicious', to: 'forward', field: 'gazeDirection' },
      
      // Tab transitions
      { from: 'focused', to: 'switched', field: 'tabStatus' },
      { from: 'switched', to: 'focused', field: 'tabStatus' },
      { from: 'focused', to: 'newWindow', field: 'tabStatus' },
      { from: 'newWindow', to: 'focused', field: 'tabStatus' },
      
      // Audio transitions
      { from: 'normal', to: 'elevated', field: 'audioLevel' },
      { from: 'elevated', to: 'normal', field: 'audioLevel' },
      { from: 'elevated', to: 'suspicious', field: 'audioLevel' },
      { from: 'suspicious', to: 'normal', field: 'audioLevel' }
    ];

    return validTransitions.some(rule => {
      const field = rule.field as keyof BehaviorState;
      return from[field] === rule.from && to[field] === rule.to;
    });
  }

  detectCheatingPatterns(): { pattern: CheatingPattern; detected: boolean }[] {
    return CHEATING_PATTERNS.map(pattern => ({
      pattern,
      detected: pattern.conditions(this.transitions)
    }));
  }

  getTransitionHistory(): BehaviorTransition[] {
    return [...this.transitions];
  }

  getCurrentState(): BehaviorState {
    return { ...this.currentState };
  }

  private formatState(state: BehaviorState): string {
    return `gaze:${state.gazeDirection}, tab:${state.tabStatus}, audio:${state.audioLevel}`;
  }

  // Formal verification using temporal logic
  verifyTemporal(formula: string): boolean {
    // Simplified temporal logic verification
    // In a real implementation, this would use a formal verification tool
    switch (formula) {
      case 'ALWAYS(gaze_forward)':
        return this.transitions.every(t => t.to.gazeDirection === 'forward');
      case 'EVENTUALLY(tab_focused)':
        return this.transitions.some(t => t.to.tabStatus === 'focused');
      case 'NEVER(multiple_violations)':
        const violations = this.detectCheatingPatterns().filter(p => p.detected);
        return violations.length === 0;
      default:
        return false;
    }
  }

  // Generate formal model in Alloy-like syntax
  generateAlloyModel(): string {
    return `
// Formal Model for Behavioral Analysis
sig BehaviorState {
  gazeDirection: one GazeType,
  tabStatus: one TabType,
  audioLevel: one AudioType,
  timestamp: one Int
}

abstract sig GazeType {}
one sig Forward, Away, Suspicious extends GazeType {}

abstract sig TabType {}
one sig Focused, Switched, NewWindow extends TabType {}

abstract sig AudioType {}
one sig Normal, Elevated, SuspiciousAudio extends AudioType {}

// Transition constraints
pred ValidTransition[from, to: BehaviorState] {
  // Gaze transitions
  (from.gazeDirection = Forward and to.gazeDirection in Forward + Away) or
  (from.gazeDirection = Away and to.gazeDirection in Forward + Suspicious) or
  (from.gazeDirection = Suspicious and to.gazeDirection = Forward) or
  
  // Tab transitions
  (from.tabStatus = Focused and to.tabStatus in Switched + NewWindow) or
  (from.tabStatus in Switched + NewWindow and to.tabStatus = Focused) or
  
  // Audio transitions
  (from.audioLevel = Normal and to.audioLevel in Elevated) or
  (from.audioLevel = Elevated and to.audioLevel in Normal + SuspiciousAudio) or
  (from.audioLevel = SuspiciousAudio and to.audioLevel = Normal)
}

// Cheating detection predicates
pred ExcessiveGazeShift[states: seq BehaviorState] {
  #{ i: Int | i < #states and states[i].gazeDirection = Away } > 5
}

pred RapidTabSwitching[states: seq BehaviorState] {
  #{ i: Int | i < #states and states[i].tabStatus = Switched } > 3
}

// Verification assertions
assert NoInvalidTransitions {
  all s1, s2: BehaviorState | ValidTransition[s1, s2]
}

assert CheatingDetection {
  all states: seq BehaviorState | 
    ExcessiveGazeShift[states] or RapidTabSwitching[states] implies
    some s: BehaviorState | s in states and s.gazeDirection = Suspicious
}

check NoInvalidTransitions for 10
check CheatingDetection for 10
`;
  }
}

export const behaviorAnalyzer = new BehaviorAnalyzer();
