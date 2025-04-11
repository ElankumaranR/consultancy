import React, { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ChatPredictionWidget = ({ salesData }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const match = input.match(/predict sales for (\d{4})/i);
    if (match) {
      const year = match[1];
      setLoading(true);

      try {
        const res = await axios.post("http://localhost:5001/predict-sales", {
          sales: salesData,
          year,
        });

        const predictionData = res.data.predictions;
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: `Here is the predicted sales for ${year}.`, chart: predictionData },
        ]);
      } catch (err) {
        setMessages((prev) => [...prev, { role: "bot", text: "Error fetching prediction." }]);
      } finally {
        setLoading(false);
      }
    } else {
      setMessages((prev) => [...prev, { role: "bot", text: "Try: Predict sales for 2025" }]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border rounded-lg p-4 bg-white shadow">
      <div className="h-96 overflow-y-auto flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded ${msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"}`}>
            <p>{msg.text}</p>
            {msg.chart && (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={msg.chart}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type: Predict sales for 2025"
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded">
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatPredictionWidget;
