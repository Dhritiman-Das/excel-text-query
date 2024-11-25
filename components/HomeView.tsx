"use client";
import React from "react";
import DataGrid from "./DataGrid";
import ChatInterface from "./ChatInterface";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { CarListing } from "@/lib/types";

interface HomeViewProps {
  properties: CarListing[];
}

const HomeView: React.FC<HomeViewProps> = ({ properties }) => {
  const [isChatOpen, setIsChatOpen] = React.useState(true);

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-4 relative overflow-hidden">
      <div
        className={`flex-1 transition-all duration-300 ${
          isChatOpen ? "mr-96" : "mr-0"
        }`}
      >
        <DataGrid data={properties} />
      </div>

      <motion.div
        className="absolute right-0 top-0 h-full"
        initial={{ x: 0 }}
        animate={{ x: isChatOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="absolute -left-8 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-l-lg"
        >
          {isChatOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <div className="w-96 h-full">
          <ChatInterface />
        </div>
      </motion.div>
    </div>
  );
};

export default HomeView;
