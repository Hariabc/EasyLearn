import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

// ✅ Language list
const languages = [
  { id: 50, name: "C", ext: "c", monaco: "c", template: `#include <stdio.h>\n\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}` },
  { id: 54, name: "C++", ext: "cpp", monaco: "cpp", template: `#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, World!\\n";\n  return 0;\n}` },
  { id: 71, name: "Python", ext: "py", monaco: "python", template: `print("Hello, World!")` },
  { id: 62, name: "Java", ext: "java", monaco: "java", template: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}` },
  { id: 63, name: "JavaScript", ext: "js", monaco: "javascript", template: `console.log("Hello, World!");` },
  { id: 51, name: "C#", ext: "cs", monaco: "csharp", template: `using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, World!");\n  }\n}` },
  { id: 72, name: "Ruby", ext: "rb", monaco: "ruby", template: `puts "Hello, World!"` },
  { id: 88, name: "Swift", ext: "swift", monaco: "swift", template: `print("Hello, World!")` },
  { id: 74, name: "TypeScript", ext: "ts", monaco: "typescript", template: `console.log("Hello, World!");` },
  { id: 60, name: "Go", ext: "go", monaco: "go", template: `package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello, World!")\n}` },
  { id: 78, name: "Kotlin", ext: "kt", monaco: "kotlin", template: `fun main() {\n  println("Hello, World!")\n}` }
];

export default function CodeEditor() {
  const [langId, setLangId] = useState(50);
  const [code, setCode] = useState(languages.find(l => l.id === 50).template);
  const [out, setOut] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const selectedLang = languages.find(l => l.id === langId);
    setCode(selectedLang.template);
    setOut("");
  }, [langId]);

  const lang = languages.find(l => l.id === langId);

  const runCode = async () => {
    setOut("Running...");
    setIsError(false);
    try {
      const res = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
        {
          language_id: langId,
          source_code: btoa(unescape(encodeURIComponent(code)))
        },
        {
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
            "Content-Type": "application/json"
          }
        }
      );

      const d = res.data;
      const decode = s => decodeURIComponent(escape(atob(s || "")));
      const result = d.stdout ? decode(d.stdout) : d.stderr ? decode(d.stderr) : d.compile_output ? decode(d.compile_output) : "No output";
      setIsError(!!(d.stderr || d.compile_output));
      setOut(result);
    } catch (e) {
      setIsError(true);
      setOut(e.response?.data?.error || e.message);
    }
  };

  const clearEditor = () => setCode("");
  const clearOutput = () => setOut("");
  const copyCode = () => navigator.clipboard.writeText(code).then(() => alert("Code copied!"));
  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `main.${lang.ext}`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-10 tracking-wide text-white">
        EasyLearn - Code Editor
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Editor Section */}
        <div className="w-full lg:w-1/2 bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-wrap justify-between items-center p-4 bg-slate-700 border-b border-slate-600 gap-3">
            <span className="text-white font-medium">main.{lang.ext}</span>
            <div className="flex flex-wrap gap-2">
              <select
                className="px-3 py-1 rounded-lg bg-slate-600 text-white border border-slate-500"
                value={langId}
                onChange={e => setLangId(+e.target.value)}
              >
                {languages.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              {[["Run Code", runCode], ["Copy Code", copyCode], ["Clear Code", clearEditor], ["Download Code", downloadCode]].map(([label, fn]) => (
                <button
                  key={label}
                  onClick={fn}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Editor
            height="calc(80vh)"
            language={lang.monaco}
            theme="vs-dark"
            value={code}
            onChange={value => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false
            }}
          />
        </div>

        {/* Output Section */}
        <div className="w-full lg:w-1/2 bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-slate-700 border-b border-slate-600">
            <span className="text-white font-medium">Output</span>
            <button
              onClick={clearOutput}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
            >
              Clear
            </button>
          </div>
          <pre
            className={`p-4 flex-1 overflow-y-auto whitespace-pre-wrap font-semibold text-sm ${isError ? "text-red-400" : "text-green-300"}`}
            style={{ height: "calc(80vh - 48px)", backgroundColor: "#1e293b" }}
          >
            {out}
          </pre>
        </div>
      </div>
    </div>
  );
}
