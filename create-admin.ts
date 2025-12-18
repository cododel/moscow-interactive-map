import { getPayload } from 'payload'
import config from './src/payload.config'

async function createAdmin() {
  const payload = await getPayload({ config })

  try {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@example.com',
        password: 'admin',
      },
    })
    console.log('Admin user created successfully:', user.email)
  } catch (error: any) {
    if (error.errors && error.errors[0].message.includes('unique')) {
      console.log('User admin@example.com already exists.')
    } else {
      console.error('Error creating admin user:', error)
    }
  }
  process.exit(0)
}

createAdmin()
