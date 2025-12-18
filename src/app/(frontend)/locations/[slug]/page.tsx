import { RenderRichText } from '@/components/RenderRichText'
import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'locations' as any,
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 1,
  })

  const location = docs[0] as any

  if (!location) {
    return notFound()
  }

  return (
    <article className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        {location.previewImage?.url && (
          <img
            src={location.previewImage.url}
            alt={location.title}
            className="h-full w-full object-cover grayscale-[0.1]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-24 max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-white/90 hover:text-white mb-8 font-bold transition-all hover:-translate-x-2"
          >
            <span className="mr-3 text-2xl">←</span> Вернуться на карту
          </Link>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight m-0 mb-4 drop-shadow-lg">
            {location.title}
          </h1>
          <div className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/20">
            <span className="text-xl">📍</span>
            <p className="text-base md:text-lg font-medium">{location.address}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="glass-card rounded-[3rem] p-8 md:p-16 border border-slate-200/50">
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-slate-600">
            <RenderRichText content={location.fullDescription} />
          </div>

          {location.location && (
            <div className="mt-20 p-8 md:p-12 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />

              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Детали местоположения</h3>
                <div className="space-y-2 opacity-80 font-mono text-sm tracking-wider">
                  <p>ШИРОТА: {location.location.latitude.toFixed(6)}</p>
                  <p>ДОЛГОТА: {location.location.longitude.toFixed(6)}</p>
                </div>
              </div>

              <a
                href={`https://yandex.ru/maps/?pt=${location.location.longitude},${location.location.latitude}&z=16&l=map`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary relative z-10 !bg-white !text-slate-900 hover:!bg-slate-100 px-10 py-5 text-lg"
              >
                Открыть в Яндекс.Картах
              </a>
            </div>
          )}
        </div>
      </div>

      <footer className="py-16 bg-slate-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold">Карта Москвы</h3>
            <p className="text-slate-400">Интерактивный опыт ручной работы.</p>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Москва Интерактивная. Сделано на PayloadCMS 3.0.
          </p>
        </div>
      </footer>
    </article>
  )
}
