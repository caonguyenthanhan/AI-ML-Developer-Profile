import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar, Clock, Navigation } from "lucide-react"
import info from "@/data/info.json"

export default async function GraduationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Header with logo */}
      <header className="flex justify-center pt-8 pb-4">
        <div className="relative h-20 w-20">
          <Image src="/images/logotruong.jpg" alt="Logo trường" fill className="object-contain" />
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 max-w-4xl flex flex-col items-center">
          <div className="text-center space-y-6 w-full">
            <h1 className="font-greatVibes text-6xl md:text-7xl lg:text-8xl text-blue-600">Happy Graduation</h1>

            <div className="space-y-2">
              <p className="text-lg md:text-xl text-gray-700">
                Đến với <span className="font-bold text-blue-700">{info.graduateName}</span> tại
              </p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">{info.university}</p>
            </div>

            {/* Graduate Photo */}
            <div className="flex justify-center py-8">
              <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-200">
                <Image src="/images/main.jpg" alt={info.graduateName} fill className="object-cover" />
              </div>
            </div>

            <p className="text-lg md:text-xl italic text-gray-600 max-w-2xl mx-auto">"{info.quote}"</p>
          </div>
        </section>

        {/* Event Details */}
        <section className="container mx-auto px-4 py-12 max-w-4xl flex flex-col items-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-blue-200 p-8 md:p-12 space-y-8 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-8">Thông Tin Buổi Lễ</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Date & Time */}
              <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-xl">
                <Calendar className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-blue-900 mb-1">Ngày</h3>
                  <p className="text-gray-700">{info.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-xl">
                <Clock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-blue-900 mb-1">Thời gian</h3>
                  <p className="text-gray-700">{info.time}</p>
                </div>
              </div>

              {/* Location */}
              <div className="md:col-span-2 flex items-start gap-4 p-6 bg-blue-50 rounded-xl">
                <MapPin className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-blue-900 mb-1">Địa điểm</h3>
                  <p className="text-gray-700 font-medium">{info.venue}</p>
                  <p className="text-gray-600 mt-1">{info.address}</p>
                </div>
              </div>
            </div>

            {/* Map Image */}
            <div className="mt-8">
              <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/map.jpg" alt="Bản đồ hội trường" fill className="object-cover" />
              </div>
            </div>

            {/* Direction Link */}
            <div className="flex justify-center pt-4">
              <Link
                href={info.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all hover:scale-105"
              >
                <Navigation className="w-5 h-5" />
                Chỉ đường đến hội trường
              </Link>
            </div>
          </div>
        </section>

        {/* Guest List Preview */}
        <section className="container mx-auto px-4 py-12 max-w-4xl flex flex-col items-center">
          <div className="text-center space-y-6 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-700">Danh Sách Khách Mời</h2>
            <p className="text-gray-600 text-lg">Mỗi khách mời có một thiệp mời riêng tại đường dẫn:</p>
            <p className="text-blue-600 font-mono text-sm md:text-base">/graduation/[tên-khách-mời]</p>
            <p className="text-gray-500 text-sm">Ví dụ: /graduation/nguyen-thi-b</p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-12 text-gray-500">
        <p className="font-greatVibes text-3xl text-blue-600 mb-2">{info.graduateName}</p>
        <p>Graduation 2025</p>
      </footer>
    </div>
  )
}
