'use client'

import { useEffect, useRef } from 'react'

interface Location {
  id: string
  title: string
  slug: string
  shortDescription: string
  location: {
    latitude: number
    longitude: number
  }
  previewImage: {
    url: string
  }
}

export default function InteractiveMap({ locations }: { locations: Location[] }) {
  const mapRef = useRef<HTMLDivElement>(null)

  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    const initMap = () => {
      if (!window.ymaps || !mapRef.current || mapInstanceRef.current) return

      window.ymaps.ready(() => {
        const map = new window.ymaps.Map(mapRef.current, {
          center: [55.751244, 37.618423], // Moscow center
          zoom: 10,
          controls: [],
        })

        // Create a custom layout for the marker with an image
        const MarkerLayout = window.ymaps.templateLayoutFactory.createClass(
          `
          <div style="position: relative;">
            <div style="
              position: absolute;
              left: -18px;
              top: -43px;
              box-sizing: border-box;
              width: 36px;
              height: 36px;
              background: #0070f3;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              transform-origin: center;
              border: 2px solid #fff;
              box-shadow: 0 0 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 28px;
                height: 28px;
                border-radius: 50%;
                overflow: hidden;
                background: #f1f5f9;
                transform: rotate(45deg);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <img src="$[properties.iconImage]" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </div>
          </div>
          `,
        )

        // Create a custom layout for the balloon content
        const BalloonContentLayout = window.ymaps.templateLayoutFactory.createClass(
          `
          <div class="modern-balloon">
            <div class="balloon-image-container">
              <img src="$[properties.image]" alt="$[properties.title]" class="balloon-image" />
            </div>
            <div class="balloon-content">
              <h3 class="balloon-title">$[properties.title]</h3>
              <p class="balloon-description">$[properties.description]</p>
              <a href="$[properties.link]" class="balloon-button">
                Подробнее
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>
          </div>
          `,
        )

        locations.forEach((loc) => {
          const placemark = new window.ymaps.Placemark(
            [loc.location.latitude, loc.location.longitude],
            {
              title: loc.title,
              description: loc.shortDescription,
              image: loc.previewImage?.url || '',
              link: `/locations/${loc.slug}`,
              iconImage: loc.previewImage?.url || '',
            },
            {
              iconLayout: MarkerLayout,
              // Offset is now handled inside the layout via CSS
              iconOffset: [0, 0],
              // Explicitly define the hit area relative to the anchor point (0,0)
              iconShape: {
                type: 'Circle',
                coordinates: [0, -25], // Center of the marker body
                radius: 18,
              },
              balloonContentLayout: BalloonContentLayout,
              // Hide the default balloon header/shadow for more modern look
              balloonShadow: false,
              balloonPanelMaxMapArea: 0, // Keep balloon as a popup
            },
          )
          map.geoObjects.add(placemark)
        })

        mapInstanceRef.current = map
      })
    }

    if (window.ymaps) {
      initMap()
    } else {
      const scriptId = 'yandex-maps-script'
      let script = document.getElementById(scriptId) as HTMLScriptElement

      if (!script) {
        script = document.createElement('script')
        script.id = scriptId
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
        script.async = true
        document.body.appendChild(script)
      }

      script.addEventListener('load', initMap)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
    }
  }, [locations])

  return (
    <div className="relative w-full group">
      <div
        ref={mapRef}
        style={{ height: '600px', minHeight: '600px' }}
        className="map-container w-full bg-slate-50 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-primary/5 flex items-center justify-center"
      ></div>

      {/* Fallback info for map if API fails or no locations */}
      {locations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm rounded-[2rem] border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">
            Добавьте места в админ-панели, чтобы они появились на карте.
          </p>
        </div>
      )}
    </div>
  )
}

declare global {
  interface Window {
    ymaps: any
  }
}
