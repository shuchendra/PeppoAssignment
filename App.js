// import { useState } from "react";

// export default function App() {
//   const [prompt, setPrompt] = useState("");
//   const [videoUrl, setVideoUrl] = useState("");

//   const generateVideo = async () => {
//     const res = await fetch("http://127.0.0.1:8000/generate_video", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt }),
//     });
//     const data = await res.json();
//     setVideoUrl(data.video_url);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold">AI Video Generator</h1>
//       <input
//         className="border p-2"
//         placeholder="Enter your prompt..."
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//       />
//       <button onClick={generateVideo} className="bg-blue-500 text-white p-2 ml-2">
//         Generate
//       </button>

//       {videoUrl && (
//         <video controls autoPlay loop width="500" className="mt-4">
//           <source src={videoUrl} type="video/mp4" />
//         </video>
//       )}
//     </div>
//   );
// }
import { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateVideo = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError("");
    setVideoUrl("");

    try {
      const res = await fetch("http://127.0.0.1:8000/generate_video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok && data.video_url) {
        setVideoUrl(data.video_url);
      } else {
        setError(data.detail || "Something went wrong.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">AI Video Generator</h1>

      <input
        className="border p-2 w-80"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={generateVideo}
        className="bg-blue-500 text-white p-2 ml-2"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {videoUrl && (
        <video controls autoPlay loop width="500" className="mt-4">
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
