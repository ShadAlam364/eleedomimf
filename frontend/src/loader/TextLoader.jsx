// export default TextLoader;

const TextLoader = () => {
  return (
    <div className="loader  bg-slate-50 bg-opacity-50 max-h-fit w-auto ">
    <div className="flex-col gap-4 w-full max-h-auto h-[56rem] flex items-center justify-center">
      <div className="md:w-20 md:h-20 md:border-4 w-16 h-16 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-500 rounded-full">
        <div className="md:w-12 md:h-12 md:border-4 w-12 h-12 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-600 rounded-full"></div>
      </div>
    </div>
  </div>
  );
};

export default TextLoader;

