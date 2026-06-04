const AuthInput = ({
  type,
  name,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-5 py-4 bg-[#0f172a] border border-gray-700 rounded-2xl outline-none focus:border-cyan-500 transition-all text-white placeholder:text-gray-500"
    />
  )
}

export default AuthInput