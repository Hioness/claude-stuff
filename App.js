import React, { useState } from 'react';
import useFetch from 'react-use/lib/useFetch';
import ReactMarkdown from 'react-markdown';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { get } = useFetch('https://www.anthropic.com');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await get('/haiku', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.haiku);
      } else {
        setResponse(`Error: ${res.statusText}`);
      }
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Claude Haiku API</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Generate Haiku'}
        </button>
      </form>
      {response && (
        <div>
          <h2>Haiku:</h2>
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default App;
