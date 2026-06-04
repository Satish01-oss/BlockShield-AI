const AuthCard = ({ children, title, subtitle }) => {
  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-cyan-500/10 rounded-[32px] p-8 md:p-10 shadow-2xl shadow-cyan-500/10">

      <div className="mb-8">

        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">

          {title}

        </h1>

        <p className="text-gray-400 mt-4 leading-relaxed">

          {subtitle}

        </p>

      </div>

      {children}

    </div>
  )
}

export default AuthCard