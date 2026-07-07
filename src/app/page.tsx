import Link from "next/link";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Shield,
  BarChart3,
  Download,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/20 dark:via-zinc-950 dark:to-purple-950/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
              Finança no{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Limite
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Controle seus gastos com precisão. Defina limites, categorize
              despesas e acompanhe sua projeção de fatura em tempo real.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-8 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-xl"
              >
                Começar Grátis
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-8 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Tudo que você precisa
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Ferramentas inteligentes para manter suas finanças sob controle
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: TrendingDown,
              title: "Controle de Gastos",
              description:
                "Registre cada despesa com descrição, valor e categoria. Input rápido e intuitivo.",
            },
            {
              icon: PiggyBank,
              title: "Limites Mensais",
              description:
                "Defina seu limite mensal e acompanhe quanto já gastou e quanto ainda pode gastar.",
            },
            {
              icon: BarChart3,
              title: "Projeção de Fatura",
              description:
                "Saiba antecipadamente quanto será sua fatura no final do mês com projeções inteligentes.",
            },
            {
              icon: Shield,
              title: "Seguro e Privado",
              description:
                "Autenticação segura com Supabase. Seus dados financeiros protegidos.",
            },
            {
              icon: Download,
              title: "Exportar Relatórios",
              description:
                "Exporte suas transações em CSV para análise externa ou controle pessoal.",
            },
            {
              icon: Wallet,
              title: "Categorias Personalizadas",
              description:
                "Crie e edite categorias com cores para organizar seus gastos do seu jeito.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                <feature.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-zinc-500">
            © 2024 Finança no Limite. Controle financeiro inteligente.
          </p>
        </div>
      </footer>
    </div>
  );
}
