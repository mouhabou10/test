export const Button = ({ children, ...props }) => (
    <button {...props} className="bg-blue-500 text-white p-2 rounded">
      {children}
    </button>
  );
  