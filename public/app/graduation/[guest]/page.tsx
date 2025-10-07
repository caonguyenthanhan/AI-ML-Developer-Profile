import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { notFound } from "next/navigation"
import info from "@/data/info.json"
import data from "@/data/khach.json"

function normalizeGuestName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default async function GuestInvitationPage({
  params,
}: {
  params: { guest: string }
}) {
  const decodedGuestName = decodeURIComponent(params.guest)
  const normalizedParam = normalizeGuestName(decodedGuestName)

  const guest = data.guests.find((g: any) => normalizeGuestName(g.name) === normalizedParam)

  if (!guest) {
    notFound()
  }

  const defaultMessage = `Mình rất vui được mời bạn đến tham dự buổi lễ tốt nghiệp của mình. Đây là một khoảnh khắc đặc biệt và mình hy vọng có thể chia sẻ niềm vui này cùng bạn!`

  const guestImage = guest.image || (guest.gender === "female" ? "/images/women.jpg" : "/images/man.jpg")
  const message = guest.message || defaultMessage

  if (guest.special) {
    // Special guest design - more elegant and formal
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 relative overflow-hidden flex flex-col">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header */}
          <header className="flex justify-between items-center p-6 md:p-8">
            <Link
              href="/graduation"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </Link>
            <div className="relative h-16 w-16">
              <Image src="/images/logotruong.jpg" alt="Logo" fill className="object-contain opacity-90" />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col justify-center container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <Sparkles className="w-12 h-12 text-yellow-300" />
              </div>
              <h1 className="font-greatVibes text-5xl md:text-7xl text-white mb-4">Thiệp Mời Đặc Biệt</h1>
              <p className="text-blue-100 text-xl md:text-2xl">Kính gửi {guest.title}</p>
            </div>

            {/* Photos Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Graduate Photo */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-300/50 mb-4">
                  <Image src="/images/main.jpg" alt={info.graduateName} fill className="object-cover" />
                </div>
                <p className="text-white font-bold text-xl">{info.graduateName}</p>
                <p className="text-blue-200">Người tốt nghiệp</p>
              </div>

              {/* Guest Photo */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-300/50 mb-4">
                  <Image src={guestImage || "/placeholder.svg"} alt={guest.name} fill className="object-cover" />
                </div>
                <p className="text-white font-bold text-xl">{guest.name}</p>
                <p className="text-blue-200">{guest.title}</p>
              </div>
            </div>

            {/* Message Card */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-yellow-300/30">
                <div className="space-y-6 text-gray-800">
                  <p className="text-lg md:text-xl leading-relaxed">
                    <span className="font-bold text-blue-700">{guest.name}</span> kính mến,
                  </p>
                  <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">{message}</p>
                  <div className="pt-6 space-y-4 border-t-2 border-blue-200">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-blue-700">Ngày:</span>
                      <span>{info.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-blue-700">Thời gian:</span>
                      <span>{info.time}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-blue-700 flex-shrink-0">Địa điểm:</span>
                      <span>
                        {info.venue}, {info.address}
                      </span>
                    </div>
                  </div>
                  <div className="pt-6 text-right">
                    <p className="text-gray-600">Trân trọng,</p>
                    <p className="font-greatVibes text-3xl text-blue-700 mt-2">{info.graduateName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mt-12">
              <Link
                href={info.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-10 py-4 rounded-full shadow-xl transition-all hover:scale-105 text-lg"
              >
                Xem bản đồ
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Regular guest design
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 md:p-8">
        <Link
          href="/graduation"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </Link>
        <div className="relative h-16 w-16">
          <Image src="/images/logotruong.jpg" alt="Logo" fill className="object-contain" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12 w-full">
          <h1 className="font-greatVibes text-5xl md:text-6xl text-blue-600 mb-4">Thiệp Mời</h1>
          <p className="text-gray-700 text-xl md:text-2xl">
            Kính gửi <span className="font-bold text-blue-700">{guest.name}</span>
          </p>
        </div>

        {/* Photos Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto w-full">
          {/* Graduate Photo */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-2 border-blue-200 mb-4">
              <Image src="/images/main.jpg" alt={info.graduateName} fill className="object-cover" />
            </div>
            <p className="text-gray-800 font-bold text-lg">{info.graduateName}</p>
            <p className="text-gray-600">Người tốt nghiệp</p>
          </div>

          {/* Guest Photo */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-2 border-blue-200 mb-4">
              <Image src={guestImage || "/placeholder.svg"} alt={guest.name} fill className="object-cover" />
            </div>
            <p className="text-gray-800 font-bold text-lg">{guest.name}</p>
            <p className="text-gray-600">{guest.title}</p>
          </div>
        </div>

        {/* Message Card */}
        <div className="max-w-3xl mx-auto w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-blue-200 p-8 md:p-12">
            <div className="space-y-6 text-gray-800">
              <p className="text-lg md:text-xl">
                <span className="font-bold text-blue-700">{guest.name}</span> thân mến,
              </p>
              <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">{message}</p>
              <div className="pt-6 space-y-3 border-t border-blue-200">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-700">Ngày:</span>
                  <span>{info.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-700">Thời gian:</span>
                  <span>{info.time}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-700 flex-shrink-0">Địa điểm:</span>
                  <span>
                    {info.venue}, {info.address}
                  </span>
                </div>
              </div>
              <div className="pt-6 text-right">
                <p className="text-gray-600">Rất mong được gặp bạn,</p>
                <p className="font-greatVibes text-3xl text-blue-700 mt-2">{info.graduateName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-12 w-full">
          <Link
            href={info.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all hover:scale-105"
          >
            Xem bản đồ
          </Link>
        </div>
      </main>
    </div>
  )
}
