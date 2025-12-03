'use server'

import prisma from '../prisma' // Ensure this path matches your project structure
import { User } from '@prisma/client'
import { hash, compare } from 'bcrypt'

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

// --- SIGN UP ACTION ---
export async function createUser(
  prevState: ActionResponse<User>,
  formData: FormData
): Promise<ActionResponse<User>> {

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let errors: ActionError[] = []

  if (!name) errors.push({ field: 'name', message: 'Name is required' })
  if (!email) errors.push({ field: 'email', message: 'Email is required' })
  if (!password) errors.push({ field: 'password', message: 'Password is required' })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email))
    errors.push({ field: 'email', message: 'Invalid email format' })

  if (errors.length > 0) {
    return {
      success: false,
      payload: null,
      message: 'Validation failed',
      errors: errors,
      input: { name, email, password }
    }
  }

  try {
    const userExist = await prisma.user.findUnique({
      where: { email: email }
    })

    if (userExist) {
      return {
        success: false,
        payload: null,
        message: 'User already exists',
        errors: [],
        input: { name, email, password }
      }
    }

    const hashedPassword = await hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    return {
      success: true,
      payload: user,
      message: 'Account created successfully',
      errors: [],
      input: { name, email }
    }
  }
  catch (error) {
    return {
      success: false,
      payload: null,
      message: 'Something went wrong',
      errors: [],
      input: { name, email, password }
    }
  }
}

// --- LOGIN ACTION ---
export async function loginUser(
  prevState: ActionResponse<User>,
  formData: FormData
): Promise<ActionResponse<User>> {

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let errors: ActionError[] = []

  if (!email) errors.push({ field: 'email', message: 'Email is required' })
  if (!password) errors.push({ field: 'password', message: 'Password is required' })

  if (errors.length > 0) {
    return {
      success: false,
      payload: null,
      message: 'Validation failed',
      errors: errors,
      input: { email } // Don't return password
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email }
    })

    if (!user) {
      // Security: Generic message to prevent email enumeration
      return {
        success: false,
        payload: null,
        message: 'Invalid email or password',
        errors: [],
        input: { email }
      }
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return {
        success: false,
        payload: null,
        message: 'Invalid email or password',
        errors: [],
        input: { email }
      }
    }

    // Login Successful!
    // TODO: Here you would typically set a session cookie.

    return {
      success: true,
      payload: user, // In production, sanitise this (remove password hash)
      message: 'Login successful',
      errors: [],
      input: { email }
    }
  } catch (error) {
    return {
      success: false,
      payload: null,
      message: 'Something went wrong',
      errors: [],
      input: { email }
    }
  }
}