import { useState } from "react"

export default function Upload({ onUpload }) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFile(file) {
    if (!file || !file.name.endsWith(".pdf")) {
      setError("Please upload a PDF file")
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      onUpload(data.session_id, data.filename)
    } catch (err) {
      setError("Upload failed. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Upload a Research Paper</h2>
        <p className="text-gray-400">Upload a PDF to start asking questions</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        className={`w-full max-w-lg border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
          ${dragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-gray-500"}`}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {loading ? (
          <p className="text-gray-400">Uploading and processing...</p>
        ) : (
          <>
            <p className="text-4xl mb-3">📄</p>
            <p className="text-gray-300">Drag and drop a PDF here</p>
            <p className="text-gray-500 text-sm mt-1">or click to browse</p>
          </>
        )}
      </div>

      <input
        id="fileInput"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}