import React, { useState } from "react";

const ChatBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    // Implement your search logic here
    console.log("Searching for:", searchTerm);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="md:max-w-4xl lg:max-w-5xl mx-auto m-5 max-w-sm"
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
        <input type="search" className="border shadow block w-full p-4 ps-12 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md" placeholder="Talk to AI..." ></input>
        <button
          type="submit"
          className="text-button-primary absolute end-2.5 bottom-2.5 bg-primary hover:bg-hover-primary focus:ring-4 focus:outline-none focus:ring-focus-primary font-medium rounded-lg text-sm px-4 py-2"
        >
          Enter
        </button>
      </div>
    </form>
  );
};

export default ChatBar;
