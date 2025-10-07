import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="font-greatVibes text-6xl text-blue-600">Oops!</h1>
        <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy khách mời</h2>
        <p className="text-gray-600">Thiệp mời cho khách mời này không tồn tại. Vui lòng kiểm tra lại đường dẫn.</p>
        <Link
          href="/graduation"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay về trang chính
        </Link>
      </div>
    </div>
  )
}
