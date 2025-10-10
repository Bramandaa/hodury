import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const InputField = ({
  id,
  label,
  type = "text",
  placeholder,
  defaultValue,
  value,
  error,
  readOnly = false,
  disabled = false,
  required = false,
  autoComplete,
  autoCapitalize,
  spellCheck,
  onChange,
  toggle,
}) => (
  <div className="space-y-2 relative">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      name={id}
      type={toggle ? (toggle.show ? "text" : "password") : type}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      defaultValue={defaultValue}
      value={value}
      autoCapitalize={autoCapitalize}
      spellCheck={spellCheck}
      required={required}
      onChange={onChange}
      autoComplete={autoComplete}
      className={error ? "border-red-500" : ""}
    />
    {toggle && (
      <button
        type="button"
        onClick={toggle.setShow}
        className="absolute right-3 top-8 text-gray-500"
      >
        {toggle.show ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    )}
    {error && <p className="text-xs text-red-500">{error[0]}</p>}
  </div>
);
