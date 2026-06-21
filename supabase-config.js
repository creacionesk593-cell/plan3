// supabase-config.js
import { createClient } from '@supabase/supabase-js'

// ⚠️ Reemplaza con tu URL y anon key de Supabase
const SUPABASE_URL = "https://pgrcwkxbyubluouowtdd.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncmN3a3hieXVibHVvdW93dGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNTc2MTcsImV4cCI6MjA5NzYzMzYxN30.FWoDR__WO0eCH6QE3_6hNdPfPlI--rZ3LFdBVI69FLA"

// Crear el cliente de Supabase usando el objeto global
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey)

// Función para obtener el usuario actual
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) {
            console.log('No hay usuario logueado o error:', error)
            return null
        }
        
        // Obtener el rol del usuario desde la tabla users
        const { data: userData, error: roleError } = await supabase
            .from('users')
            .select('role, active, expiration_date')
            .eq('id', user.id)
            .single()
        
        if (roleError) {
            console.error('Error al obtener rol:', roleError)
            return null
        }
        
        if (!userData) {
            console.log('Usuario no encontrado en tabla users')
            return null
        }
        
        // Verificar si el usuario está activo y no expirado
        if (!userData.active) {
            console.log('Usuario inactivo')
            return null
        }
        
        if (userData.expiration_date) {
            const expDate = new Date(userData.expiration_date)
            if (expDate < new Date()) {
                console.log('Usuario expirado')
                return null
            }
        }
        
        return {
            ...user,
            role: userData.role
        }
    } catch (error) {
        console.error('Error en getCurrentUser:', error)
        return null
    }
}

// Función para verificar permisos
export function hasPermission(user, requiredRole) {
    if (!user) return false
    
    // Admin tiene acceso a todo
    if (user.role === 'admin') return true
    
    // Verificar rol específico
    return user.role === requiredRole
}

// Exportar supabase para usarlo en otros archivos
export { supabase }
