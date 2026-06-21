// supabase.js
import { createClient } from '@supabase/supabase-js'

// ⚠️ Reemplaza con tu URL y anon key de Supabase
const SUPABASE_URL = "https://pgrcwkxbyubluouowtdd.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncmN3a3hieXVibHVvdW93dGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNTc2MTcsImV4cCI6MjA5NzYzMzYxN30.FWoDR__WO0eCH6QE3_6hNdPfPlI--rZ3LFdBVI69FLA"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Login de usuario
 */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

/**
 * Registro de usuario con rol
 */
export async function register(email, password, role = "cliente") {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role } // Guardar rol en metadata
    }
  })
  if (error) throw error
  return data
}

/**
 * Recuperación de contraseña (envía enlace al correo)
 */
export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://TU-DOMINIO.com/reset-password" // página donde el usuario cambia contraseña
  })
  if (error) throw error
  return data
}

/**
 * Cambiar contraseña (cuando el usuario entra con token temporal)
 */
export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  if (error) throw error
  return data
}

/**
 * Obtener usuario actual
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}
