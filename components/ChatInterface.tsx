import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { IQuickMessage } from "@/lib/types";

interface ChatInterfaceProps {
  onQueryResult?: (data: any) => void;
}

interface Message {
  type: "user" | "system";
  content: string;
  id: string;
}

const QUICK_MESSAGES: IQuickMessage[] = [
  {
    text: "Which is cheapest Toyota car from 2019?",
    description: "Filter cars by brand and year",
  },
  {
    text: "What is the most expensive car?",
    description: "Find the highest priced listing",
  },
  {
    text: "How many petrol vehicles do you have?",
    description: "Filter by fuel type",
  },
  {
    text: "Which brand has the most listings?",
    description: "Get brand statistics",
  },
];

export default function ChatInterface({ onQueryResult }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const processQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: queryText,
    };

    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      type: "system",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, systemMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.type === "system") {
            lastMessage.content = accumulatedContent;
          }
          return newMessages;
        });
      }

      if (onQueryResult) {
        onQueryResult({ userQuery: queryText, response: accumulatedContent });
      }
    } catch (error) {
      console.error("Error processing query:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.type === "system") {
          lastMessage.content =
            "Sorry, there was an error processing your request.";
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processQuery(input);
  };

  const handleQuickMessage = async (message: IQuickMessage) => {
    await processQuery(message.text);
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-white shadow-lg">
      <div className="flex-1 p-4 overflow-auto space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4"
          >
            <MessageSquare size={48} className="text-blue-500" />
            <p className="text-center">
              Ask any questions about the car database!
            </p>
          </motion.div>
        )}
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.content ||
                  (isLoading && !msg.content ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  ) : (
                    "No response"
                  ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="border-t p-4">
        {messages.length === 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {QUICK_MESSAGES.map((message, index) => (
              <button
                key={index}
                onClick={() => handleQuickMessage(message)}
                className="inline-flex flex-col items-start bg-gray-50 hover:bg-gray-100 rounded-md p-2 transition-colors text-sm"
              >
                <span className="font-medium text-gray-800">
                  {message.text}
                </span>
                <span className="text-gray-500 text-xs">
                  {message.description}
                </span>
              </button>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the cars..."
            disabled={isLoading}
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
