
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Monitor, Volume2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { behaviorAnalyzer, BehaviorState, CheatingPattern } from '@/utils/formalVerification';
import { toast } from '@/hooks/use-toast';

interface BehaviorMonitorProps {
  examStarted: boolean;
  onViolationDetected: (pattern: CheatingPattern) => void;
}

const BehaviorMonitor = ({ examStarted, onViolationDetected }: BehaviorMonitorProps) => {
  const [currentState, setCurrentState] = useState<BehaviorState>(behaviorAnalyzer.getCurrentState());
  const [detectedPatterns, setDetectedPatterns] = useState<{ pattern: CheatingPattern; detected: boolean }[]>([]);
  const [transitionCount, setTransitionCount] = useState(0);
  const [formalVerificationResults, setFormalVerificationResults] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!examStarted) return;

    const interval = setInterval(() => {
      // Update current state
      const state = behaviorAnalyzer.getCurrentState();
      setCurrentState(state);

      // Check for cheating patterns
      const patterns = behaviorAnalyzer.detectCheatingPatterns();
      setDetectedPatterns(patterns);

      // Notify about new violations
      patterns.forEach(({ pattern, detected }) => {
        if (detected) {
          onViolationDetected(pattern);
        }
      });

      // Update transition count
      setTransitionCount(behaviorAnalyzer.getTransitionHistory().length);

      // Run formal verification checks
      const verificationResults = {
        'ALWAYS(gaze_forward)': behaviorAnalyzer.verifyTemporal('ALWAYS(gaze_forward)'),
        'EVENTUALLY(tab_focused)': behaviorAnalyzer.verifyTemporal('EVENTUALLY(tab_focused)'),
        'NEVER(multiple_violations)': behaviorAnalyzer.verifyTemporal('NEVER(multiple_violations)')
      };
      setFormalVerificationResults(verificationResults);
    }, 1000);

    return () => clearInterval(interval);
  }, [examStarted, onViolationDetected]);

  const simulateBehavior = (type: 'gaze' | 'tab' | 'audio') => {
    switch (type) {
      case 'gaze':
        behaviorAnalyzer.addTransition({ gazeDirection: 'away' }, 'simulated_gaze_shift');
        setTimeout(() => {
          behaviorAnalyzer.addTransition({ gazeDirection: 'forward' }, 'simulated_gaze_return');
        }, 2000);
        break;
      case 'tab':
        behaviorAnalyzer.addTransition({ tabStatus: 'switched' }, 'simulated_tab_switch');
        setTimeout(() => {
          behaviorAnalyzer.addTransition({ tabStatus: 'focused' }, 'simulated_tab_return');
        }, 1000);
        break;
      case 'audio':
        behaviorAnalyzer.addTransition({ audioLevel: 'suspicious' }, 'simulated_audio_anomaly');
        setTimeout(() => {
          behaviorAnalyzer.addTransition({ audioLevel: 'normal' }, 'simulated_audio_normal');
        }, 3000);
        break;
    }
    
    toast({
      title: "Behavior Simulated",
      description: `Simulated ${type} anomaly for testing`,
    });
  };

  const getStateColor = (value: string) => {
    const normalStates = ['forward', 'focused', 'normal'];
    const suspiciousStates = ['suspicious', 'switched', 'elevated'];
    
    if (normalStates.includes(value)) return 'default';
    if (suspiciousStates.includes(value)) return 'destructive';
    return 'secondary';
  };

  const exportAlloyModel = () => {
    const model = behaviorAnalyzer.generateAlloyModel();
    const blob = new Blob([model], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'behavior_model.als';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Alloy Model Exported",
      description: "Formal verification model downloaded successfully",
    });
  };

  return (
    <div className="space-y-4">
      {/* Current Behavior State */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Current Behavior State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Gaze</span>
            </div>
            <Badge variant={getStateColor(currentState.gazeDirection)}>
              {currentState.gazeDirection}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Tab Status</span>
            </div>
            <Badge variant={getStateColor(currentState.tabStatus)}>
              {currentState.tabStatus}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Audio</span>
            </div>
            <Badge variant={getStateColor(currentState.audioLevel)}>
              {currentState.audioLevel}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground pt-2">
            Total Transitions: {transitionCount}
          </div>
        </CardContent>
      </Card>

      {/* Cheating Pattern Detection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Pattern Detection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {detectedPatterns.map(({ pattern, detected }) => (
            <div key={pattern.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {detected ? (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <span className="text-xs">{pattern.name}</span>
              </div>
              <Badge variant={detected ? 'destructive' : 'secondary'} className="text-xs">
                {pattern.severity}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Formal Verification Results */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Formal Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(formalVerificationResults).map(([formula, result]) => (
            <div key={formula} className="flex items-center justify-between">
              <span className="text-xs font-mono">{formula}</span>
              {result ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Testing Controls */}
      {examStarted && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Testing Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => simulateBehavior('gaze')}
                className="text-xs"
              >
                Gaze Test
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => simulateBehavior('tab')}
                className="text-xs"
              >
                Tab Test
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => simulateBehavior('audio')}
                className="text-xs"
              >
                Audio Test
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={exportAlloyModel}
              className="w-full text-xs"
            >
              Export Alloy Model
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Violations Alert */}
      {detectedPatterns.some(p => p.detected) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {detectedPatterns.filter(p => p.detected).length} suspicious behavior pattern(s) detected
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BehaviorMonitor;
