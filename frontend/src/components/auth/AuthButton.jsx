const AuthButton = ({
  text,
  loading,
}) => {
  return (
    <button
    type="button"
      disabled={loading}
      className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50"
    >

      {
        loading
          ? 'Please wait...'
          : text
      }

    </button>
  )
}

export default AuthButton