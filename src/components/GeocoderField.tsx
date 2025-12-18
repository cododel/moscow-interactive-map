'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import React, { useCallback, useEffect, useRef } from 'react'

const GeocoderField: React.FC = () => {
  const { value, setValue } = useField<any>({ path: 'location' })
  const addressField = useFormFields(([fields]) => fields.address)
  const mapRef = useRef<HTMLDivElement>(null)
  const ymapsRef = useRef<any>(null)
  const mapInstanceRef = useRef<any>(null)
  const placemarkRef = useRef<any>(null)

  const updateCoordinates = useCallback(
    (lat: number, lng: number) => {
      setValue({ latitude: lat, longitude: lng })
    },
    [setValue],
  )

  useEffect(() => {
    const initMap = () => {
      window.ymaps.ready(() => {
        ymapsRef.current = window.ymaps
        if (!mapRef.current || mapInstanceRef.current) return

        const map = new window.ymaps.Map(mapRef.current, {
          center: [value?.latitude || 55.751244, value?.longitude || 37.618423],
          zoom: 12,
        })

        const placemark = new window.ymaps.Placemark(
          [value?.latitude || 55.751244, value?.longitude || 37.618423],
          {},
          { draggable: true },
        )

        placemark.events.add('dragend', () => {
          const coords = placemark.geometry.getCoordinates()
          updateCoordinates(coords[0], coords[1])
        })

        map.geoObjects.add(placemark)
        placemarkRef.current = placemark
        mapInstanceRef.current = map

        map.events.add('click', (e: any) => {
          const coords = e.get('coords')
          placemark.geometry.setCoordinates(coords)
          updateCoordinates(coords[0], coords[1])
        })
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
  }, [updateCoordinates, value?.latitude, value?.longitude])

  const handleGeocode = async () => {
    if (!ymapsRef.current || !addressField?.value) return
    const res = await ymapsRef.current.geocode(addressField.value)
    const firstGeoObject = res.geoObjects.get(0)
    if (firstGeoObject) {
      const coords = firstGeoObject.geometry.getCoordinates()
      placemarkRef.current.geometry.setCoordinates(coords)
      ymapsRef.current.panTo(coords)
      updateCoordinates(coords[0], coords[1])
    }
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <button
        type="button"
        onClick={handleGeocode}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '10px',
        }}
      >
        Geocode Address
      </button>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '300px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}
      />
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Drag the marker or click on the map to adjust coordinates.
      </div>
    </div>
  )
}

export default GeocoderField
