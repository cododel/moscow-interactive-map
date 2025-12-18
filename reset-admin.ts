import { getPayload } from 'payload'
import config from './src/payload.config'

async function resetAdminPassword() {
  const payload = await getPayload({ config })

  try {
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@example.com',
        },
      },
    })

    if (users.docs.length > 0) {
      const user = users.docs[0]
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          password: 'admin',
        },
      })
      console.log('Password for admin@example.com reset to "admin" successfully.')
    } else {
      // If user doesn't exist, create it
      await payload.create({
        collection: 'users',
        data: {
          email: 'admin@example.com',
          password: 'admin',
        },
      })
      console.log('User admin@example.com did not exist and was created with password "admin".')
    }
  } catch (error: any) {
    console.error('Error resetting/creating admin user:', error)
  }
  process.exit(0)
}

resetAdminPassword()
