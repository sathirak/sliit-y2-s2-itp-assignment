// File: apps/frontend/modules/chatbot/components/Chatbubble.tsx

"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, ArrowLeft } from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showMainMenu, setShowMainMenu] = useState(true);
  const [awaitingOrderID, setAwaitingOrderID] = useState(false);

  const instantAnswers: { question: string; answer: string }[] = [
    {
      question: "When will my order ship?",
      answer:
        "Your order will typically ship within 3-5 business days. You'll receive an email with tracking information once your order is on its way.",
    },
    {
      question: "Track my order",
      answer: "To see your order status, please provide your order ID.",
    },
    {
      question: "What is your contact info?",
      answer: "You can reach us at support@example.com or call +1-800-123-4567.",
    },
  ];

  const sendMessage = (text: string, sender: "user" | "bot") => {
    setMessages((prev) => [...prev, { sender, text }]);
    setShowMainMenu(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage(input, "user");
    setInput("");
    if (awaitingOrderID) {
      setAwaitingOrderID(false);
      setTimeout(() => {
        sendMessage("Thanks! We're checking your order status now.", "bot");
      }, 600);
    }
  };

  const handleInstantAnswer = (q: string, a: string) => {
    sendMessage(q, "user");
    setTimeout(() => {
      sendMessage(a, "bot");
      if (q === "Track my order") {
        setAwaitingOrderID(true);
      }
    }, 600);
  };

  const handleBack = () => {
    setMessages([]);
    setShowMainMenu(true);
    setAwaitingOrderID(false);
  };

  useEffect(() => {
    if (open && showMainMenu && messages.length === 0) {
      const trackOrder = instantAnswers.find((item) => item.question === "Track my order");
      if (trackOrder) {
        handleInstantAnswer(trackOrder.question, trackOrder.answer);
      }
    }
  }, [open]);

  return (
    <>
      {!open && (
        <button
          className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Chat</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl w-80 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {!showMainMenu && (
                <button onClick={handleBack}>
                  <ArrowLeft className="w-5 h-5 text-gray-300 hover:text-white" />
                </button>
              )}
              <p className="font-bold">CROWNUP</p>
            </div>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5 text-gray-300 hover:text-white" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-black text-white ml-auto"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Instant answers */}
          {showMainMenu && messages.length === 0 && (
            <div className="p-3 border-t bg-white">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Instant answers
              </p>
              <div className="flex flex-col gap-2">
                {instantAnswers.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleInstantAnswer(item.question, item.answer)}
                    className="w-full text-left border px-3 py-2 rounded hover:bg-gray-100"
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          {!showMainMenu && (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 p-3 border-t bg-white"
            >
              <input
                type="text"
                placeholder={awaitingOrderID ? "Enter order ID" : "Write message"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
              <button
                type="submit"
                className="bg-black text-white px-3 py-2 rounded hover:bg-gray-800 transition"
              >
                Send
              </button>
              {awaitingOrderID && (
                <button
                  type="button"
                  onClick={() => {
                    setAwaitingOrderID(false);
                    setInput("");
                  }}
                  className="text-sm text-red-500 hover:underline"
                >
                  Cancel
                </button>
              )}
            </form>
          )}
        </div>
      )}
    </>
  );
}

