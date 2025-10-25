export default function Button({ className, children, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
