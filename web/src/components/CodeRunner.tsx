import { useState } from "react";

function CodeRunner() {
  const [code, setCode] = useState<string>('');
  /** Timestamp & log message */
  const [log, setLog] = useState<[number, string][]>([]);

  const addToOutput = (text: string) => {
    const logEntryId = Math.floor(Math.random() * 10000);
    setLog(d => [[logEntryId, text], ...d]);
  }

  const execute = () => {
    const codeLines = code.split('\n');
    setLog([])
    try {
      codeLines.forEach(line => {
        const result = eval(line);
        addToOutput(result);
      })
    } catch (error) {
      console.log('code error', error);
      addToOutput(`❌  ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <div>
        <div>
          <textarea onChange={(e) => { setCode(e.target.value) }}
            cols={30} rows={10} className='border-2 m-4 px-2 py-1 font-mono'></textarea>
        </div>
        <div>
          {log.map((d) => (
            <div key={d[0]}>{d[1]}</div>
          ))}
        </div>
      </div>
      <div>
        <button onClick={() => { execute() }} className="border px-4 py-2">Run code</button>
      </div>
    </div>
  );
}

export default CodeRunner;
