export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(222_47%_5%)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[200px] bg-violet-600/8 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md px-4">{children}</div>
    </div>
  )
}
