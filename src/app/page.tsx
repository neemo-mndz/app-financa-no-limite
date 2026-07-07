import Link from "next/link";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Shield,
  BarChart3,
  Download,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="text-center">
            {/* Badge */}
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/80 px-4 py-1.5 text-xs font-medium text-indigo-700 dark:border-indigo-800/40 dark:bg-indigo-950/30 dark:text-indigo-300">
              <Sparkles className="h-3 w-3" />
              Controle financeiro inteligente
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-7xl dark:text-white">
              Suas financas,{" "}
              <span className="gradient-primary bg-clip-text text-transparent">
                no limite
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
              Controle gastos com precisao. Limites inteligentes, categorias personalizadas e projecao de fatura em tempo real.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex h-12 items-center gap-2 rounded-xl gradient-primary px-8 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Comecar gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex h-12 items-center rounded-xl border border-zinc-200/80 bg-white/80 px-8 text-sm font-medium text-zinc-700 backdrop-blur-sm transition-all hover:bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Ja tenho conta
              </Link>
            </div>
          </div>

          {/* Floating preview mockup */}
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-2xl backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/80">
              {/* Mini dashboard preview */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <div className="flex-1" />
                <div className="h-4 w-16 rounded bg-zinc-100 dark:bg-zinc-800" />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3">
                  <div className="text-[10px] text-white/60">Gasto</div>
                  <div className="text-sm font-bold text-white">R$ 2.350</div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
                  <div className="text-[10px] text-zinc-400">Restante</div>
                  <div className="text-sm font-bold text-emerald-600">R$ 2.650</div>
                </div>
                <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
                  <div className="text-[10px] text-zinc-400">Projecao</div>
                  <div className="text-sm font-bold text-amber-600">R$ 4.200</div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { emoji: "🍽️", name: "Restaurante", value: "R$ 89,90", color: "#f97316" },
                  { emoji: "🚗", name: "Uber", value: "R$ 32,50", color: "#3b82f6" },
                  { emoji: "💳", name: "Netflix", value: "R$ 55,90", color: "#6366f1" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-zinc-50/80 p-2.5 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.emoji}</span>
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">-{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Tudo que voce precisa
          </h2>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            Ferramentas inteligentes para manter suas financas no controle
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: TrendingDown,
              title: "Controle de Gastos",
              description: "Input rapido com descricao, valor e categoria. Registre em segundos.",
              color: "#ef4444",
            },
            {
              icon: PiggyBank,
              title: "Limites Inteligentes",
              description: "Limite mensal e diario calculado automaticamente. Nunca mais perca o controle.",
              color: "#22c55e",
            },
            {
              icon: BarChart3,
              title: "Projecao de Fatura",
              description: "Saiba antecipadamente quanto sera sua fatura no final do mes.",
              color: "#f59e0b",
            },
            {
              icon: Shield,
              title: "Seguro",
              description: "Autenticacao com JWT e senhas criptografadas. Seus dados protegidos.",
              color: "#6366f1",
            },
            {
              icon: Download,
              title: "Exportar PDF & CSV",
              description: "Exporte relatorios completos para analise ou controle pessoal.",
              color: "#8b5cf6",
            },
            {
              icon: Wallet,
              title: "Categorias com Emoji",
              description: "Categorias personalizadas com cores e emojis para organizar gastos.",
              color: "#06b6d4",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-zinc-200/60 bg-white/80 p-6 backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 dark:border-zinc-800/60 dark:bg-zinc-900/80"
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-3xl gradient-primary p-10 text-center shadow-xl shadow-indigo-500/20 sm:p-16">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Comece agora. E gratis.
            </h2>
            <p className="mt-3 text-white/70 max-w-md mx-auto text-sm sm:text-base">
              Crie sua conta e tenha controle total das suas financas em minutos.
            </p>
            <Link
              href="/auth/signup"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-indigo-700 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Criar conta gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-zinc-200/50 py-8 dark:border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="text-xs text-zinc-400">
            Financa no Limite &mdash; Controle financeiro inteligente
          </p>
        </div>
      </footer>
    </div>
  );
}
