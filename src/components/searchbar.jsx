import React, { useState } from 'react';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        // Implement your search logic here
        console.log('Searching for:', searchTerm);
    };

    return (
        <form onSubmit={handleSearch} className="md:max-w-4xl lg:max-w-5xl mx-auto m-5 max-w-sm">   
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-primary sr-only">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-icon-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="search" value={searchTerm} id="default-search" className="block w-full p-4 ps-10 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md " placeholder="Search Mockups, Logos..." required />
                <button type="submit" className="text-button-primary absolute end-2.5 bottom-2.5 bg-primary hover:bg-hover-primary focus:ring-4 focus:outline-none focus:ring-focus-primary font-medium rounded-lg text-sm px-4 py-2">Search</button>
            </div>
        </form>
    );
};

export default SearchBar;