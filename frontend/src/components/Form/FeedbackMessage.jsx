import { MdError, MdCheckCircle } from "react-icons/md";

export default function FeedbackMessage({ message, type }) {
  const isError = type === "error";
  const bgColor = isError ? "bg-red-600" : "bg-green-400";
  const textColor = isError ? "text-white" : "text-black";
  const Icon = isError ? MdError : MdCheckCircle;

  return (
    <p className={`${textColor} ${bgColor} rounded p-2 flex flex-nowrap gap-2 overflow-auto`}>
      <span className="w-5 h-5 aspect-square">
        <Icon className={`${textColor} text-xl w-full h-full`} />
      </span>
      {message}
    </p>
  );
}
