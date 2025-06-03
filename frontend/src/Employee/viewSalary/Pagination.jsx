/* eslint-disable react/prop-types */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const maxVisiblePages = 5; // Number of pages to show around current page
    const alwaysShowEdges = 1; // Always show this many pages at start and end
  
    // Calculate the range of pages to display
    let pages = [];
    
    // Always add first pages
    for (let i = 1; i <= Math.min(alwaysShowEdges, totalPages); i++) {
      if (!pages.includes(i)) pages.push(i);
    }
  
    // Calculate range around current page
    const lowerBound = Math.max(
      alwaysShowEdges + 1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const upperBound = Math.min(
      totalPages - alwaysShowEdges,
      currentPage + Math.floor(maxVisiblePages / 2)
    );
  
    for (let i = lowerBound; i <= upperBound; i++) {
      if (i > 0 && i <= totalPages && !pages.includes(i)) {
        pages.push(i);
      }
    }
  
    // Always add last pages
    for (let i = Math.max(totalPages - alwaysShowEdges + 1, alwaysShowEdges + 1); i <= totalPages; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
  
    // Sort and add ellipsis where needed
    pages = pages.sort((a, b) => a - b);
    const paginationItems = [];
    
    for (let i = 0; i < pages.length; i++) {
      // Add ellipsis if there's a gap
      if (i > 0 && pages[i] - pages[i - 1] > 1) {
        paginationItems.push(
          <span 
            key={`ellipsis-${i}`} 
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
          >
            ...
          </span>
        );
      }
      
      paginationItems.push(
        <button
          key={pages[i]}
          onClick={() => onPageChange(pages[i])}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
            pages[i] === currentPage 
              ? 'text-white bg-blue-500 hover:bg-blue-600' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {pages[i]}
        </button>
      );
    }
  
    return (
      <div className="w-full flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex w-full justify-between sm:hidden">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border  border-gray-300 text-sm font-medium rounded bg-white text-gray-900 hover:bg-gray-50 cursor-pointer"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded bg-white text-gray-900 hover:bg-gray-50 cursor-pointer"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:w-full sm:flex sm:items-center sm:justify-between mx-auto">
          <div>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          
          <div className="">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l border border-gray-300 bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 cursor cursor-pointer"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
  
              {paginationItems}
  
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r border border-gray-300 bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 cursor-pointer"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };
  
  export default Pagination;