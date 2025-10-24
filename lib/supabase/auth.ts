import { createClient } from './client'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Función para hacer login
 * Valida credenciales y verifica si la cuenta está bloqueada
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  // 1. PRIMERO intentar login con Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    return {
      error: 'Email o contraseña incorrectos',
      data: null
    }
  }

  // 2. AHORA que estamos autenticados, obtener el perfil
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !profile) {
    // Si no hay perfil, cerrar sesión
    await supabase.auth.signOut()
    return {
      error: 'Perfil no encontrado. Contacta al administrador.',
      data: null
    }
  }

  // 3. Verificar si la cuenta está bloqueada
  if (profile.is_blocked) {
    await supabase.auth.signOut()
    return {
      error: 'Tu cuenta está bloqueada. Contacta al administrador.',
      data: null
    }
  }

  // 4. Login exitoso - resetear intentos fallidos
  await supabase
    .from('profiles')
    .update({
      failed_login_attempts: 0
    })
    .eq('id', profile.id)

  return {
    error: null,
    data: authData,
    mustChangePassword: profile.must_change_password
  }
}

/**
 * Función para cerrar sesión
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Obtener el usuario actual
 */
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { user: null, profile: null, error }
  }

  // Obtener el perfil completo
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    user,
    profile,
    error: profileError
  }
}

/**
 * Función para cambiar contraseña
 */
export async function changePassword(newPassword: string) {
  const supabase = createClient()
  
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (updateError) {
    return { error: updateError.message }
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    await supabase
      .from('profiles')
      .update({
        must_change_password: false
      })
      .eq('id', user.id)
  }

  return { error: null }
}

/**
 * SOLO ADMIN: Crear usuario con invitación
 */
export async function inviteUser(
  email: string,
  fullName: string,
  role: 'admin' | 'comercial' | 'operador' | 'readonly',
  temporaryPassword: string
) {
  const supabase = createClient()
  const { profile } = await getCurrentUser()
  
  if (!profile || profile.role !== 'admin') {
    return {
      error: 'Solo los administradores pueden invitar usuarios',
      data: null
    }
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: role
    }
  })

  if (error) {
    return { error: error.message, data: null }
  }

  await supabase
    .from('profiles')
    .update({
      must_change_password: true,
      full_name: fullName,
      role: role
    })
    .eq('id', data.user?.id)

  return { error: null, data }
}

/**
 * SOLO ADMIN: Desbloquear usuario
 */
export async function unlockUser(userId: string) {
  const supabase = createClient()
  const { profile } = await getCurrentUser()
  
  if (!profile || profile.role !== 'admin') {
    return { error: 'Solo los administradores pueden desbloquear usuarios' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      is_blocked: false,
      failed_login_attempts: 0
    })
    .eq('id', userId)

  return { error }
}

/**
 * SOLO ADMIN: Resetear contraseña de usuario
 */
export async function resetUserPassword(userId: string, newPassword: string) {
  const supabase = createClient()
  const { profile } = await getCurrentUser()
  
  if (!profile || profile.role !== 'admin') {
    return { error: 'Solo los administradores pueden resetear contraseñas' }
  }

  const { error } = await supabase.auth.admin.updateUserById(
    userId,
    { password: newPassword }
  )

  if (error) {
    return { error: error.message }
  }

  await supabase
    .from('profiles')
    .update({
      must_change_password: true
    })
    .eq('id', userId)

  return { error: null }
}
