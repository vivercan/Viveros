"use client"

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Bienvenido a FX27 CRM
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Leads
          </h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Prospectos nuevos
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Oportunidades
          </h3>
          <p className="text-3xl font-bold text-green-600">0</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            En proceso
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Clientes
          </h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Clientes activos
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          🎉 ¡Sistema de autenticación completado!
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Has iniciado sesión exitosamente. Próximamente agregaremos los módulos del CRM.
        </p>
      </div>
    </div>
  )
}
