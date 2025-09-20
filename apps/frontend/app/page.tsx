import Image from "next/image";
import { NewArrivals } from "../modules/common/components/NewArrivals";
import ChatBubble from "@/modules/chatbot/components/Chatbubble";

export default function Home() {
  return (
    <>
      <NewArrivals />
      <ChatBubble />
    </> 

  );
}
