import { useCallback } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { MdError } from "react-icons/md";

export default function InputField({
  icon,
  type,
  placeholder,
  name,
  register,
  validationRules,
  errors,
  showPasswordToggle,
  showPassword,
  toggleShowPassword,
  onInputChange,
  isAutoComplete = "off",
}) {
  const handleInputChange = useCallback(
    (e) => {
      onInputChange && onInputChange(e);
    },
    [onInputChange]
  );

  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        className={`flex items-center border rounded ${errors[name] ? "border-red-500" : "border-borderLight"}`}
      >
        <span className="p-2 text-xl text-text/75" aria-label={placeholder}>
          {icon}
        </span>
        <input
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          className="bg-transparent outline-none placeholder:text-text/75 p-2 w-full"
          {...register(name, { ...validationRules, onChange: handleInputChange })}
          aria-invalid={!!errors[name]}
          aria-describedby={`${name}-error`}
          autoComplete={isAutoComplete}
        />
        {showPasswordToggle && (
          <span onClick={toggleShowPassword} className="p-2 text-xl text-text/75 cursor-pointer">
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        )}
      </div>
      {errors[name] && (
        <p id={`${name}-error`} role="alert" className="text-red-500 text-sm">
          <MdError className="inline mr-1" />
          {errors[name].message}
        </p>
      )}
    </div>
  );
}
