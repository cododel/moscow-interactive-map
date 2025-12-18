import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    let dbPath = process.env.DATABASE_URI || ''
    if (dbPath.startsWith('file:')) {
      dbPath = dbPath.slice(5)
    }
    
    // If it's relative, resolve it
    if (!path.isAbsolute(dbPath)) {
        dbPath = path.resolve(process.cwd(), dbPath)
    }

    if (!fs.existsSync(dbPath)) {
      return new NextResponse('Database file not found', { status: 404 })
    }

    const fileBuffer = fs.readFileSync(dbPath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Disposition': 'attachment; filename="payload.db"',
        'Content-Type': 'application/x-sqlite3',
      },
    })
  } catch (error) {
    console.error('Export DB Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 })
    }

    let dbPath = process.env.DATABASE_URI || ''
    if (dbPath.startsWith('file:')) {
      dbPath = dbPath.slice(5)
    }
     if (!path.isAbsolute(dbPath)) {
        dbPath = path.resolve(process.cwd(), dbPath)
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Write file
    fs.writeFileSync(dbPath, buffer)

    return new NextResponse(JSON.stringify({ message: 'Database restored successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Import DB Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
