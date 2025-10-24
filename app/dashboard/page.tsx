'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { 
  UserPlus, 
  LayoutDashboard, 
  FileText, 
  Truck, 
  Wrench, 
  Users, 
  BarChart3, 
  CheckSquare, 
  PieChart, 
  Settings 
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setProfile(profileData)
      }
    }
    getUser()
  }, [supabase])

  const modules = [
    {
      id: 'agregar-lead',
      title: 'Agregar Lead',
      description: 'Captura rapida de nuevos prospectos',
      icon: UserPlus,
      color: 'from-blue-500 to-blue-600',
      href: '/dashboard/leads/nuevo',
      badge: 'Rapido'
    },
    {
      id: 'oportunidades',
      title: 'Panel de Oportunidades',
      description: 'Embudo de ventas tipo Kanban',
      icon: LayoutDashboard,
      color: 'from-purple-500 to-purple-600',
      href: '/dashboard/oportunidades',
      badge: 'Visual'
    },
    {
      id: 'cotizaciones',
      title: 'Cotizaciones',
      description: 'Crear, enviar y controlar propuestas',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      href: '/dashboard/cotizaciones',
      badge: 'Profesional'
    },
    {
      id: 'despacho',
      title: 'Despacho Inteligente',
      description: 'Asignacion optimizada de cargas',
      icon: Truck,
      color: 'from-orange-500 to-orange-600',
      href: '/dashboard/despacho',
      badge: 'IA'
    },
    {
      id: 'equipo',
      title: 'Control de Equipo',
      description: 'Tractores, remolques y mantenimiento',
      icon: Wrench,
      color: 'from-red-500 to-red-600',
      href: '/dashboard/equipo',
      badge: 'Critico'
    },
    {
      id: 'clientes',
      title: 'Clientes',
      description: 'Directorio completo y gestion',
      icon: Users,
      color: 'from-teal-500 to-teal-600',
      href: '/dashboard/clientes',
      badge: 'Base'
    },
    {
      id: 'analisis',
      title: 'Analisis Comercial',
      description: 'Dashboard de ventas e indicadores',
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600',
      href: '/dashboard/analisis',
      badge: 'Insights'
    },
    {
      id: 'actividades',
      title: 'Actividades',
      description: 'Tareas, llamadas y seguimiento',
      icon: CheckSquare,
      color: 'from-pink-500 to-pink-600',
      href: '/dashboard/actividades',
      badge: 'Diario'
    },
    {
      id: 'reportes',
      title: 'Reportes y KPIs',
      description: 'Metricas clave y graficas',
      icon: PieChart,
      color: 'from-yellow-500 to-yellow-600',
      href: '/dashboard/reportes',
      badge: 'Analytics'
    },
    {
      id: 'configuracion',
      title: 'Configuracion',
      description: 'Usuarios, plantillas y seguridad',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      href: '/dashboard/configuracion',
      badge: profile?.role === 'admin' ? 'Admin' : ''
    }
  ]

  return (
    <div className="h-full overflow-hidden p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Bienvenido, {profile?.full_name || 'Usuario'}
        </h1>
        <p className="text-gray-600 text-sm">
          Selecciona un modulo para comenzar a trabajar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <button
              key={module.id}
              onClick={() => router.push(module.href)}
              className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-4 text-left border border-gray-100 hover:border-transparent overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${module.color} group-hover:bg-white/20 transition-colors`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {module.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold text-white bg-black/20 rounded-full backdrop-blur-sm">
                      {module.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-white transition-colors mb-1">
                  {module.title}
                </h3>
                <p className="text-xs text-gray-600 group-hover:text-white/80 transition-colors">
                  {module.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="text-xs text-gray-600 mb-1">Leads Activos</div>
          <div className="text-2xl font-bold text-blue-600">--</div>
          <div className="text-xs text-gray-500 mt-1">Proximamente</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="text-xs text-gray-600 mb-1">Oportunidades</div>
          <div className="text-2xl font-bold text-purple-600">--</div>
          <div className="text-xs text-gray-500 mt-1">Proximamente</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="text-xs text-gray-600 mb-1">Cotizaciones</div>
          <div className="text-2xl font-bold text-green-600">--</div>
          <div className="text-xs text-gray-500 mt-1">Proximamente</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="text-xs text-gray-600 mb-1">Cargas Hoy</div>
          <div className="text-2xl font-bold text-orange-600">--</div>
          <div className="text-xs text-gray-500 mt-1">Proximamente</div>
        </div>
      </div>
    </div>
  )
}