import InteractiveMap from '@/components/InteractiveMap'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const metadata = {
  title: 'Интерактивная карта Москвы',
  description: 'Интерактивная карта Москвы с отмеченными достопримечательностями.',
}

export default async function Home() {
  const payload = await getPayload({ config: configPromise })
  const { docs: locations } = await payload.find({
    collection: 'locations' as any,
    depth: 1,
  })

  // Normalize data for the map component
  const mapLocations = locations.map((loc: any) => ({
    id: loc.id,
    title: loc.title,
    slug: loc.slug,
    shortDescription: loc.shortDescription,
    location: loc.location,
    previewImage: {
      url: loc.previewImage?.url || '',
    },
  }))

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 glass-card mx-auto max-w-7xl mt-4 rounded-3xl border border-slate-200/50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 m-0">
            Интерактивная Москва
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">
            Откройте для себя сердце города через интерактивное путешествие.
          </p>
        </div>
      </header>

      {/* Hero Section with Map */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="rounded-[2.5rem] bg-white p-4 shadow-xl border border-slate-100">
          <InteractiveMap locations={mapLocations} />
        </div>
      </section>

      {/* Locations Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Популярные места</h2>
          <div className="h-px flex-1 bg-slate-200 mx-8 hidden md:block" />
          <span className="text-slate-400 font-mono text-sm uppercase tracking-widest">
            {locations.length} Мест
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {locations.map((loc: any) => (
            <a
              key={loc.id}
              href={`/locations/${loc.slug}`}
              className="group block relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200/60 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 no-underline text-inherit"
            >
              {loc.previewImage?.url ? (
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={loc.previewImage.url}
                    alt={loc.title}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ) : (
                <div className="aspect-[4/3] w-full bg-slate-100 flex items-center justify-center text-slate-300 font-medium">
                  Нет изображения
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {loc.title}
                </h3>
                <p className="text-slate-500 mb-6 line-clamp-2 text-base leading-relaxed">
                  {loc.shortDescription}
                </p>
                <div className="inline-flex items-center text-primary font-bold hover:gap-3 transition-all duration-300">
                  Подробнее{' '}
                  <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="py-16 bg-slate-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold">Карта Москвы</h3>
            <p className="text-slate-400">Интерактивный опыт ручной работы.</p>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Москва Интерактивная. Сделано на PayloadCMS 3.0.
          </p>
        </div>
      </footer>
    </main>
  )
}
