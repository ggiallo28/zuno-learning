import { useState, useRef, useEffect } from 'react';
import { AssessmentItem, CoachType } from '@/types/assessment';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Play, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeRunQuestionProps {
  item: AssessmentItem;
  answer: { code: string; results?: any } | null;
  onAnswerChange: (answer: { code: string; results?: any }) => void;
  disabled?: boolean;
  coachType: CoachType;
}

interface TestResult {
  testId: string;
  passed: boolean;
  output: any;
  expected: any;
  error?: string;
  executionTime: number;
}

export function CodeRunQuestion({
  item,
  answer,
  onAnswerChange,
  disabled = false,
  coachType
}: CodeRunQuestionProps) {
  const [code, setCode] = useState(answer?.code || item.codeTemplate || '');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [lastRunTime, setLastRunTime] = useState<number>(0);
  
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Web Worker for code execution sandbox
    const initWorker = () => {
      const workerCode = `
        self.onmessage = function(e) {
          const { code, tests, timeoutMs } = e.data;
          
          try {
            // Create isolated context
            const logs = [];
            const originalConsole = console;
            const sandboxConsole = {
              log: (...args) => logs.push(args.join(' ')),
              error: (...args) => logs.push('ERROR: ' + args.join(' ')),
              warn: (...args) => logs.push('WARN: ' + args.join(' '))
            };
            
            // Execute user code in isolated scope
            const startTime = performance.now();
            
            // Replace console in user code context
            const userCode = \`
              const console = \${JSON.stringify(sandboxConsole)};
              \${code}
            \`;
            
            let userFunction;
            eval(\`userFunction = (\${userCode})\`);
            
            // Run tests
            const testResults = tests.map(test => {
              try {
                const testStart = performance.now();
                const result = userFunction(...test.input);
                const testEnd = performance.now();
                
                return {
                  testId: test.id,
                  passed: JSON.stringify(result) === JSON.stringify(test.expectedOutput),
                  output: result,
                  expected: test.expectedOutput,
                  executionTime: testEnd - testStart
                };
              } catch (error) {
                return {
                  testId: test.id,
                  passed: false,
                  output: null,
                  expected: test.expectedOutput,
                  error: error.message,
                  executionTime: 0
                };
              }
            });
            
            const endTime = performance.now();
            
            self.postMessage({
              success: true,
              results: testResults,
              consoleOutput: logs,
              totalTime: endTime - startTime
            });
            
          } catch (error) {
            self.postMessage({
              success: false,
              error: error.message,
              results: [],
              consoleOutput: [],
              totalTime: 0
            });
          }
        };
      `;
      
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      return new Worker(URL.createObjectURL(blob));
    };

    workerRef.current = initWorker();
    
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const runCode = async () => {
    if (!item.tests || !workerRef.current) return;
    
    setIsRunning(true);
    setResults([]);
    setConsoleOutput([]);
    
    const startTime = Date.now();
    let timeoutId: NodeJS.Timeout | undefined;
    
    try {
      // Setup timeout
      const timeoutMs = item.timeoutMs || 5000;
      timeoutId = setTimeout(() => {
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }
        setIsRunning(false);
        setResults([{
          testId: 'timeout',
          passed: false,
          output: null,
          expected: null,
          error: 'Execution timeout',
          executionTime: timeoutMs
        }]);
      }, timeoutMs);
      
      // Handle worker response
      workerRef.current.onmessage = (e) => {
        if (timeoutId) clearTimeout(timeoutId);
        const { success, results, consoleOutput, error, totalTime } = e.data;
        
        if (success) {
          setResults(results);
          setConsoleOutput(consoleOutput);
          setLastRunTime(totalTime);
          
          // Update answer with results
          const newAnswer = {
            code,
            results: {
              testResults: results,
              consoleOutput,
              executionTime: totalTime,
              score: results.filter((r: TestResult) => r.passed).length / results.length
            }
          };
          onAnswerChange(newAnswer);
          
        } else {
          setResults([{
            testId: 'error',
            passed: false,
            output: null,
            expected: null,
            error: error || 'Unknown error',
            executionTime: 0
          }]);
        }
        
        setIsRunning(false);
      };
      
      // Send code to worker
      workerRef.current.postMessage({
        code,
        tests: item.tests,
        timeoutMs
      });
      
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      setIsRunning(false);
      setResults([{
        testId: 'error',
        passed: false,
        output: null,
        expected: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime
      }]);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onAnswerChange({ code: newCode, results: answer?.results });
  };

  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const hasResults = results.length > 0;

  const getCoachEncouragement = () => {
    if (!hasResults) return null;
    
    const ratio = passedTests / totalTests;
    
    const encouragements = {
      elia: {
        excellent: "🎯 Eccellente! Analizziamo insieme cosa rende questo codice efficace.",
        good: "👍 Buon lavoro. Considera come migliorare i test falliti.",
        needs_work: "🤔 Prendiamoci tempo per comprendere gli errori."
      },
      skippy: {
        excellent: "🚀 Fantastico! Vai al prossimo livello!",
        good: "⚡ Quasi perfetto, una spinta finale!",
        needs_work: "💪 Riprova, sei sulla strada giusta!"
      },
      lupa: {
        excellent: "🌟 Ottimo lavoro di gruppo!",
        good: "🤝 Buona collaborazione con il sistema!",
        needs_work: "🐺 Il branco ti supporta, continua!"
      },
      polpo: {
        excellent: "🐙 Adattamento perfetto!",
        good: "🎯 Strategia in evoluzione...",
        needs_work: "🔄 Adattamento in corso..."
      }
    };
    
    const level = ratio >= 0.8 ? 'excellent' : ratio >= 0.5 ? 'good' : 'needs_work';
    return encouragements[coachType][level];
  };

  return (
    <div className="space-y-4">
      {/* Code Editor */}
      <div className="space-y-2">
        <label htmlFor="code-editor" className="text-sm font-medium">
          Il tuo codice:
        </label>
        <Textarea
          id="code-editor"
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          disabled={disabled || isRunning}
          className="font-mono text-sm min-h-[200px] resize-y"
          placeholder="Scrivi il tuo codice qui..."
          aria-label="Editor di codice"
        />
      </div>
      
      {/* Run Button */}
      <div className="flex items-center gap-2">
        <Button
          onClick={runCode}
          disabled={disabled || isRunning || !code.trim()}
          className="flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Esecuzione...' : 'Esegui Test'}
        </Button>
        
        {lastRunTime > 0 && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lastRunTime.toFixed(1)}ms
          </Badge>
        )}
        
        {hasResults && (
          <Badge 
            variant={passedTests === totalTests ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {passedTests === totalTests ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {passedTests}/{totalTests} test passati
          </Badge>
        )}
      </div>
      
      {/* Test Results */}
      {hasResults && (
        <div className="space-y-4">
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-medium">Risultati Test:</h4>
            
            {results.map((result, index) => (
              <div
                key={result.testId}
                className={cn(
                  "p-3 rounded-lg border",
                  result.passed 
                    ? "bg-green-50 border-green-200" 
                    : "bg-red-50 border-red-200"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium text-sm">
                      Test {index + 1}
                    </span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {result.executionTime.toFixed(1)}ms
                  </Badge>
                </div>
                
                {!result.passed && (
                  <div className="space-y-2 text-sm">
                    {result.error && (
                      <div className="text-red-700">
                        <strong>Errore:</strong> {result.error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <strong>Output:</strong>
                        <code className="block bg-white p-1 rounded text-xs">
                          {JSON.stringify(result.output)}
                        </code>
                      </div>
                      <div>
                        <strong>Atteso:</strong>
                        <code className="block bg-white p-1 rounded text-xs">
                          {JSON.stringify(result.expected)}
                        </code>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Show test description for visible tests */}
                {item.tests?.find(t => t.id === result.testId && !t.isHidden)?.description && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {item.tests.find(t => t.id === result.testId)?.description}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          {/* Console Output */}
          {consoleOutput.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Output Console:</h4>
              <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs max-h-32 overflow-y-auto">
                {consoleOutput.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          )}
          
          {/* Coach Encouragement */}
          {getCoachEncouragement() && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {getCoachEncouragement()}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Hidden Tests Info */}
      {item.tests?.some(t => t.isHidden) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="w-4 h-4" />
          Alcuni test sono nascosti e verranno eseguiti durante la valutazione finale
        </div>
      )}
    </div>
  );
}