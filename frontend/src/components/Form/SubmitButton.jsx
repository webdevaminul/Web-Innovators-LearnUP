export default function SubmitButton({ isLoading, loadingLabel, label }) {
  return (
    <button
      disabled={isLoading}
      type="submit"
      className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
}
