import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { gql, useApolloClient } from "@apollo/client";


// Simplify generateTask function for clarity
const generateTask = (text, ids) => {
  return `
     {
Get {
  Recipes(
    where: {
      path: ["id"],
      operator: Equal,
      valueString: "${ids}"
    }
  ) {
    
    _additional {
      id
      generate (
        groupedResult: {
      task: """
      You are a professional cook assistant AI. Assist with whatever the user is asking about the recipe. Your responses should be clear, precise, and tailored to the specific prompt without repeating any information. use only from given information about recipes.

      "prompt"

      ${text}
      """
      }
      ) {
        groupedResult
        error
      }
    }
  }
}
}
  `
}

const ChatBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const client = useApolloClient();
  const endOfMessagesRef = useRef(null);
  const formRef = React.useRef(null);
  const { id } = useParams();

  // Use effect for scrolling into view
  useEffect(() => {
    if (chat.length > 0) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);


  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchTerm("");
    formRef.current.reset();
    setIsChatOpen(true);
    setChat((prevChat) => [...prevChat, { user: "user", message: searchTerm }]);
    
    let query = generateTask(searchTerm, id);

    try {
      const { data } = await client.query({
        query: gql`${query}`,
      });

      console.log("AI response:", data);

      if(data){
        setChat((prevChat) => [...prevChat, { user: "bot", message: data.Get.Recipes[0]._additional.generate.groupedResult }]);
      }    
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((err) => {
          console.log("GraphQL error:", err.message);
        });
      }
      if (error.networkError) {
        console.log("Network error:", error.networkError.message);
      }
    }

    console.log("Searching for:", searchTerm);
  };

  const mockChat = [
    {
      user: "user",
      message: "Hello",
    },
    {
      user
      : "bot",
      message: "Hi! I'm a chatbot. How can I help you today?",
    },
    {
      user: "user",
      message: "I want to know more about this recipe",
    },
    {
      user: "bot",
      message: "Sure! What do you want to know?",
    },
  ];

  return (
    <div>
    {isChatOpen && (
      //show square chat box width of chat bar above the chat bar
      <div className="bg-white border shadow-lg mx-auto max-w-4xl rounded-lg max-h-80 overflow-auto">
        <button className="" onClick={() => setChat([])}>clear</button>
        {chat.length === 0 && <div>Start chatting!</div>}
          <div className="p-4">
            <div className="flex flex-col space-y-2">
            {chat.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.user === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.user === "user" ? "bg-blue-500" : "bg-gray-300 text-black"
                  } text-white rounded-lg p-2`}
                >
                  {message.message}
                </div>
              </div>
            ))}
            </div>
        </div>
        <div ref={endOfMessagesRef} />
      </div>
    )}
    <form
      onSubmit={handleSearch}
      ref={formRef}
      className="md:max-w-4xl lg:max-w-5xl mx-auto mb-5 max-w-sm"
    >
      <label
        htmlFor="Enter"
        className="mb-2 text-sm font-medium text-primary sr-only"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            fill="#000000"
            xmlns="http://www.w3.org/2000/svg"
            width="30px"
            height="30px"
            viewBox="0 0 100 100"
            enable-background="new 0 0 100 100"
            xml:space="preserve"
          >
            <path
              d="M49.6,25.8c7.2,0,13,5.8,13,13v3.3c-4.3-0.5-8.7-0.7-13-0.7c-4.3,0-8.7,0.2-13,0.7v-3.3
	C36.6,31.7,42.4,25.8,49.6,25.8z"
            />
            <path d="M73.2,63.8l1.3-11.4c2.9,0.5,5.1,2.9,5.1,5.6C79.6,61.2,76.7,63.8,73.2,63.8z" />
            <path d="M25.9,63.8c-3.5,0-6.4-2.6-6.4-5.8c0-2.8,2.2-5.1,5.1-5.6L25.9,63.8z" />
            <path
              d="M68.7,44.9c-6.6-0.7-12.9-1-19-1c-6.1,0-12.5,0.3-19,1h0c-2.2,0.2-3.8,2.2-3.5,4.3l2,19.4
	c0.2,1.8,1.6,3.3,3.5,3.5c5.6,0.7,11.3,1,17.1,1s11.5-0.3,17.1-1c1.8-0.2,3.3-1.7,3.5-3.5l2-19.4v0C72.4,47,70.9,45.1,68.7,44.9z
	 M38.6,62.5c-1.6,0-2.8-1.6-2.8-3.7s1.3-3.7,2.8-3.7s2.8,1.6,2.8,3.7S40.2,62.5,38.6,62.5z M55.3,66.6c0,0.2-0.1,0.4-0.2,0.5
	c-0.1,0.1-0.3,0.2-0.5,0.2h-9.9c-0.2,0-0.4-0.1-0.5-0.2c-0.1-0.1-0.2-0.3-0.2-0.5v-1.8c0-0.4,0.3-0.7,0.7-0.7h0.2
	c0.4,0,0.7,0.3,0.7,0.7v0.9h8.1v-0.9c0-0.4,0.3-0.7,0.7-0.7h0.2c0.4,0,0.7,0.3,0.7,0.7V66.6z M60.6,62.5c-1.6,0-2.8-1.6-2.8-3.7
	s1.3-3.7,2.8-3.7s2.8,1.6,2.8,3.7S62.2,62.5,60.6,62.5z"
            />
          </svg>
        </div>
        
        <input id="chatbar" className="border shadow block w-full p-4 ps-12 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md" placeholder="Talk to AI..." required onChange={(e) => setSearchTerm(e.target.value)} />
        <input
            type="checkbox"
            checked={isChatOpen}
            onChange={() => setIsChatOpen(!isChatOpen)}
            className="absolute end-[calc(100%+10px)] bottom-2.5" // Adjust positioning as needed
          />
        <button
          type="submit"
          className="text-button-primary absolute end-2.5 bottom-2.5 bg-primary hover:bg-hover-primary focus:ring-4 focus:outline-none focus:ring-focus-primary font-medium rounded-lg text-sm px-4 py-2"
        >
          Enter
        </button>
      </div>
    </form>
    </div>
  );
};

export default ChatBar;
