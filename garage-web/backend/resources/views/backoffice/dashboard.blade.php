@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="w-full">
    <div class="mb-8">
        <h1 class="text-3xl font-bold">Tableau de bord</h1>
        <p class="text-gray-600">Vue d'ensemble de l'activité du garage</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-[#161615] rounded-lg p-6 border-l-4 border-blue-500">
            <p class="text-gray-600 text-sm font-semibold mb-2">Total Interventions</p>
            <p class="text-3xl font-bold">{{ $totalInterventions }}</p>
        </div>
        <div class="bg-white dark:bg-[#161615] rounded-lg p-6 border-l-4 border-purple-500">
            <p class="text-gray-600 text-sm font-semibold mb-2">Total Voitures</p>
            <p class="text-3xl font-bold">{{ $totalVoitures }}</p>
        </div>
        <div class="bg-white dark:bg-[#161615] rounded-lg p-6 border-l-4 border-green-500">
            <p class="text-gray-600 text-sm font-semibold mb-2">Total Catégories</p>
            <p class="text-3xl font-bold">{{ $totalCategories }}</p>
        </div>
        <div class="bg-white dark:bg-[#161615] rounded-lg p-6 border-l-4 border-orange-500">
            <p class="text-gray-600 text-sm font-semibold mb-2">Taux Complétude</p>
            <p class="text-3xl font-bold">{{ $totalInterventions > 0 ? round((($statusCounts['terminee'] + $statusCounts['payee']) / $totalInterventions) * 100) : 0 }}%</p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-[#161615] rounded-lg p-6">
            <h2 class="text-lg font-bold mb-4">Distribution par statut</h2>
            <div class="space-y-3">
                <div>
                    <div class="flex justify-between mb-1"><span class="text-sm">En attente</span><span class="text-sm">{{ $statusCounts['en_attente'] }} ({{ $statusPercentages['en_attente'] }}%)</span></div>
                    <div class="h-2 bg-gray-200 rounded"><div class="h-2 bg-yellow-500 rounded" style="width: {{ $statusPercentages['en_attente'] }}%"></div></div>
                </div>
                <div>
                    <div class="flex justify-between mb-1"><span class="text-sm">En réparation</span><span class="text-sm">{{ $statusCounts['en_reparation'] }} ({{ $statusPercentages['en_reparation'] }}%)</span></div>
                    <div class="h-2 bg-gray-200 rounded"><div class="h-2 bg-orange-500 rounded" style="width: {{ $statusPercentages['en_reparation'] }}%"></div></div>
                </div>
                <div>
                    <div class="flex justify-between mb-1"><span class="text-sm">Terminée</span><span class="text-sm">{{ $statusCounts['terminee'] }} ({{ $statusPercentages['terminee'] }}%)</span></div>
                    <div class="h-2 bg-gray-200 rounded"><div class="h-2 bg-green-500 rounded" style="width: {{ $statusPercentages['terminee'] }}%"></div></div>
                </div>
                <div>
                    <div class="flex justify-between mb-1"><span class="text-sm">Payée</span><span class="text-sm">{{ $statusCounts['payee'] }} ({{ $statusPercentages['payee'] }}%)</span></div>
                    <div class="h-2 bg-gray-200 rounded"><div class="h-2 bg-blue-500 rounded" style="width: {{ $statusPercentages['payee'] }}%"></div></div>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-[#161615] rounded-lg p-6">
            <h2 class="text-lg font-bold mb-4">Top Catégories</h2>
            @if ($interventionsByCategory->count() > 0)
                <div class="space-y-2">
                    @foreach ($interventionsByCategory as $cat)
                        <div class="flex justify-between p-2 bg-gray-50 rounded"><span>{{ $cat->nom }}</span><span class="bg-blue-100 px-2 py-1 rounded text-xs">{{ $cat->interventions_count }}</span></div>
                    @endforeach
                </div>
            @else
                <p class="text-gray-500 text-sm">Aucune catégorie</p>
            @endif
        </div>
    </div>

    <div class="bg-white dark:bg-[#161615] rounded-lg p-6">
        <h2 class="text-lg font-bold mb-4">Dernières interventions</h2>
        @if ($recentInterventions->count() > 0)
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b">
                        <th class="text-left py-2">Voiture</th>
                        <th class="text-left py-2">Type</th>
                        <th class="text-left py-2">Catégorie</th>
                        <th class="text-left py-2">Statut</th>
                        <th class="text-left py-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($recentInterventions as $int)
                        <tr class="border-b">
                            <td class="py-2"><a href="{{ route('backoffice.interventions.edit', $int) }}" class="text-blue-500">{{ $int->voiture->immatriculation }}</a></td>
                            <td class="py-2">{{ $int->typeReparation->nom ?? '—' }}</td>
                            <td class="py-2">{{ $int->categorie->nom ?? '—' }}</td>
                            <td class="py-2"><span class="px-2 py-1 rounded text-xs {{ $int->statut === 'en_attente' ? 'bg-yellow-200' : ($int->statut === 'en_reparation' ? 'bg-orange-200' : ($int->statut === 'terminee' ? 'bg-green-200' : 'bg-blue-200')) }}">{{ ucfirst(str_replace('_', ' ', $int->statut)) }}</span></td>
                            <td class="py-2">{{ $int->created_at->format('d/m/Y') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="text-gray-500 text-sm">Aucune intervention</p>
        @endif
    </div>
</div>
@endsection

        <div class="bg-white dark:bg-[#161615] rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Interventions</p>
                    <p class="text-4xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">{{ $totalInterventions }}</p>
                </div>
                <div class="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Total Voitures -->
        <div class="bg-white dark:bg-[#161615] rounded-lg shadow-lg p-6 border-t-4 border-purple-500">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Voitures</p>
                    <p class="text-4xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">{{ $totalVoitures }}</p>
                </div>
                <div class="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
                    <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Total Categories -->
        <div class="bg-white dark:bg-[#161615] rounded-lg shadow-lg p-6 border-t-4 border-green-500">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Catégories</p>
                    <p class="text-4xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">{{ $totalCategories }}</p>
                </div>
                <div class="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 9a2 2 0 11-4 0 2 2 0 014 0zm7-2a3 3 0 11-6 0 3 3 0 016 0zm1.613-2.82a10.897 10.897 0 01-7.844-7.519h-2.976A13.852 13.852 0 0020 11.08h-5.387z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Completion Rate -->
        <div class="bg-white dark:bg-[#161615] rounded-lg shadow-lg p-6 border-t-4 border-orange-500">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Taux de Complétude</p>
                    <p class="text-4xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                        {{ $totalInterventions > 0 ? round((($statusCounts['terminee'] + $statusCounts['payee']) / $totalInterventions) * 100) : 0 }}%
                    </p>
                </div>
                <div class="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3">
                    <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Status Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Status Breakdown -->
        <div class="bg-white dark:bg-[#161615] rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-6">Distribution par statut</h2>
            
            <div class="space-y-4">
                <!-- En Attente -->
                <div>
                    <div class="flex justify-between mb-2">
                        <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">En attente</span>
                        <span class="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                            {{ $statusCounts['en_attente'] }} ({{ $statusPercentages['en_attente'] }}%)
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-yellow-500 h-2 rounded-full" style="width: {{ $statusPercentages['en_attente'] }}%"></div>
                    </div>
                </div>

                <!-- En Réparation -->
                <div>
                    <div class="flex justify-between mb-2">
                        <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">En réparation</span>
                        <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">
                            {{ $statusCounts['en_reparation'] }} ({{ $statusPercentages['en_reparation'] }}%)
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-orange-500 h-2 rounded-full" style="width: {{ $statusPercentages['en_reparation'] }}%"></div>
                    </div>
                </div>

                <!-- Terminée -->
                <div>
                    <div class="flex justify-between mb-2">
                        <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Terminée</span>
                        <span class="text-sm font-semibold text-green-600 dark:text-green-400">
                            {{ $statusCounts['terminee'] }} ({{ $statusPercentages['terminee'] }}%)
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: {{ $statusPercentages['terminee'] }}%"></div>
                    </div>
                </div>

                <!-- Payée -->
                <div>
                    <div class="flex justify-between mb-2">
                        <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Payée</span>
                        <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {{ $statusCounts['payee'] }} ({{ $statusPercentages['payee'] }}%)
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: {{ $statusPercentages['payee'] }}%"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Top Categories -->
        <div class="bg-white dark:bg-[#161615] rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-6">Top Catégories</h2>
            
            @if ($interventionsByCategory->count() > 0)
                <div class="space-y-3">
                    @foreach ($interventionsByCategory as $category)
                        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            <div class="flex items-center space-x-3">
                                <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span class="font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">{{ $category->nom }}</span>
                            </div>
                            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                                {{ $category->interventions_count }}
                            </span>
                        </div>
                    @endforeach
                </div>
            @else
                <div class="text-center py-8">
                    <p class="text-gray-500 dark:text-gray-400">Aucune catégorie avec interventions</p>
                </div>
            @endif
        </div>
    </div>

    <!-- Recent Interventions -->
    <div class="bg-white dark:bg-[#161615] rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">Dernières interventions</h2>
            <a href="{{ route('backoffice.interventions') }}" class="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold">
                Voir tous →
            </a>
        </div>

        @if ($recentInterventions->count() > 0)
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th class="text-left py-3 px-4 font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Voiture</th>
                            <th class="text-left py-3 px-4 font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Type</th>
                            <th class="text-left py-3 px-4 font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Catégorie</th>
                            <th class="text-left py-3 px-4 font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Statut</th>
                            <th class="text-left py-3 px-4 font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($recentInterventions as $intervention)
                            <tr class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition">
                                <td class="py-3 px-4">
                                    <a href="{{ route('backoffice.interventions.edit', $intervention) }}" class="text-blue-500 hover:text-blue-600 font-semibold">
                                        {{ $intervention->voiture->immatriculation }}
                                    </a>
                                </td>
                                <td class="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                                    {{ $intervention->typeReparation->nom ?? '—' }}
                                </td>
                                <td class="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                                    {{ $intervention->categorie->nom ?? '—' }}
                                </td>
                                <td class="py-3 px-4">
                                    <span class="px-3 py-1 rounded-full text-xs font-semibold
                                        {{ $intervention->statut === 'en_attente' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : '' }}
                                        {{ $intervention->statut === 'en_reparation' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : '' }}
                                        {{ $intervention->statut === 'terminee' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : '' }}
                                        {{ $intervention->statut === 'payee' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : '' }}
                                    ">
                                        {{ ucfirst(str_replace('_', ' ', $intervention->statut)) }}
                                    </span>
                                </td>
                                <td class="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                                    {{ $intervention->created_at->format('d/m/Y H:i') }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">Aucune intervention enregistrée</p>
            </div>
        @endif
    </div>
</div>
@endsection
