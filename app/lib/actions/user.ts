'use server'

import prisma from '../prisma'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'

type ActionError = {
  field: string
  message: string
}

type ActionResponse<T = unknown> = {
  success: boolean
  payload: T | null
  message: string | null
  errors: ActionError[]
  input?: any
}

export async function createUser(
  prevState: ActionResponse<User>,
  formData: FormData
): Promise<ActionResponse<User>> {

  // Extract data
  const name = formData.get('name')
  const email = formData.get('email')
  const password = formData.get('password')

  // Validate data
  let errors: ActionError[] = []

  if (!name) errors.push({ field: 'name', message: 'Please enter your full name to create your account.' })
  if (!email) errors.push({ field: 'email', message: 'Please enter your email address. This will be used to sign in to your account.' })
  if (!password) errors.push({ field: 'password', message: 'Please create a password for your account. Choose a strong password to keep your account secure.' })

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email as string))
    errors.push({ field: 'email', message: 'Please enter a valid email address. Email addresses should be in the format: yourname@example.com' })

  if (errors.length > 0) {
    return {
      success: false,
      payload: null,
      message: null,
      errors: errors,
      input: { name, email, password }
    }
  }

  try {
    // If user already exists, fail
    const userExist = await prisma.user.findUnique({
      where: { email: email as string }
    })

    if (userExist) {
      return {
        success: false,
        payload: null,
        message: `An account with the email "${email}" already exists. Please sign in instead, or use a different email address to create a new account.`,
        errors: errors,
        input: { name, email, password }
      }
    }

    // Proceed create user
    const hashedPassword = await hash(password as string, 12)
    const user = await prisma.user.create({
      data: {
        name: name as string,
        email: email as string,
        password: hashedPassword
      }
    })

    return {
      success: true,
      payload: user,
      message: null,
      errors: errors,
      input: { name, email, password }
    }
  }
  catch (error) {
    console.error('User creation error:', error)
    return {
      success: false,
      payload: null,
      message: 'Unable to create your account at this time. This may be due to a temporary server issue. Please try again in a few moments. If the problem persists, contact support.',
      errors: errors,
      input: { name, email, password }
    }
  }
}