import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

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
  { id: 78, name: "Kotlin", ext: "kt", monaco: "kotlin", template: `fun main() {\n  println("Hello, World!")\n}` },
  { id: 68, name: "PHP", ext: "php", monaco: "php", template: `<?php\n echo "Hello, World!";\n?>` }
];

export default function CodeEditor() {
  const [langId, setLangId] = useState(50);
  const lang = languages.find(l => l.id === langId);
  const [code, setCode] = useState(lang.template);
  const [out, setOut] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
    setCode(lang.template);
    setOut("");
  }, [lang]);

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
  const copyCode = () => navigator.clipboard.writeText(code)
    .then(() => alert("Code copied to clipboard!"))
    .catch(() => alert("Failed to copy code"));
  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `main.${lang.ext}`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-70"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8 tracking-wide">
        EasyLearn - Code Editor
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Code Editor */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md flex flex-col">
          <div className="flex flex-wrap justify-between items-center p-3 bg-blue-100 gap-3">
            <span className="font-semibold">main.{lang.ext}</span>
            <div className="flex flex-wrap gap-2">
              <select
                className="px-2 py-1 rounded border border-blue-300 bg-blue-50"
                value={langId}
                onChange={e => setLangId(+e.target.value)}
              >
                {languages.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              {[
                ["Run Code", runCode],
                ["Copy Code", copyCode],
                ["Clear Code", clearEditor],
                ["Download Code", downloadCode]
              ].map(([label, fn]) => (
                <button
                  key={label}
                  onClick={fn}
                  className="px-4 py-1 bg-blue-200 border border-blue-300 rounded hover:bg-blue-300"
                >
                  <b>{label}</b>
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

        {/* Output Panel */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md flex flex-col">
          <div className="flex justify-between items-center p-3 bg-blue-100">
            <span className="font-semibold">Output</span>
            <button
              onClick={clearOutput}
              className="px-4 py-1 bg-blue-200 border border-blue-300 rounded hover:bg-blue-300"
            >
              <b>Clear Output</b>
            </button>
          </div>
          <pre
            className={`flex-1 m-0 p-4 bg-black font-bold overflow-y-auto whitespace-pre-wrap ${isError ? "text-red-500" : "text-green-300"}`}
            style={{ height: "calc(80vh - 48px)" }}
          >
            {out}
          </pre>
        </div>
      </div>
    </div>
  );
}
