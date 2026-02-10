@extends('layouts.app')

@section('title', 'Gestion des Interventions')

@section('content')
<div class="w-full max-w-6xl mx-auto">
    <div class="bg-white dark:bg-[#161615] rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold mb-2">Interventions</h1>
                <p class="text-gray-600 dark:text-gray-400">Gestion complète des réparations en atelier</p>
            </div>
            <a
                href="{{ route('backoffice.interventions.create') }}"
                class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
                + Nouvelle intervention
            </a>
        </div>

        @if (session('success'))
            <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p class="text-green-800 dark:text-green-400">{{ session('success') }}</p>
            </div>
        @endif

        @if ($interventions->isEmpty())
            <div class="text-center py-12">
                <p class="text-gray-500 dark:text-gray-400 mb-4">Aucune intervention trouvée</p>
                <a href="{{ route('backoffice.interventions.create') }}" class="text-blue-500 hover:underline">
                    Créer la première intervention
                </a>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <th class="px-4 py-3 text-left text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">ID</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Voiture</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Type</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Catégorie</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Statut</th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Dates</th>
                            <th class="px-4 py-3 text-right text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($interventions as $intervention)
                            <tr class="border-b border-[#e3e3e0] dark:border-[#3E3E3A] hover:bg-gray-50 dark:hover:bg-[#1D0002]">
                                <td class="px-4 py-3 font-medium text-[#1b1b18] dark:text-[#EDEDEC]">#{{ $intervention->id }}</td>
                                <td class="px-4 py-3 text-[#1b1b18] dark:text-[#EDEDEC]">
                                    {{ $intervention->voiture ? $intervention->voiture->immatriculation : '—' }}
                                </td>
                                <td class="px-4 py-3 text-sm">
                                    <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                        {{ $intervention->typeReparation ? $intervention->typeReparation->nom : '—' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm">
                                    {{ $intervention->categorie ? $intervention->categorie->nom : '—' }}
                                </td>
                                <td class="px-4 py-3 text-sm">
                                    <span class="px-2 py-1 rounded text-white font-semibold
                                        {{ $intervention->statut === 'en_attente' ? 'bg-yellow-500' : '' }}
                                        {{ $intervention->statut === 'en_reparation' ? 'bg-orange-500' : '' }}
                                        {{ $intervention->statut === 'terminee' ? 'bg-green-500' : '' }}
                                        {{ $intervention->statut === 'payee' ? 'bg-blue-500' : '' }}
                                    ">
                                        {{ ucfirst(str_replace('_', ' ', $intervention->statut)) }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                    @if($intervention->date_debut)
                                        <div>{{ $intervention->date_debut->format('d/m/Y') }}</div>
                                    @endif
                                </td>
                                <td class="px-4 py-3 text-right space-x-2">
                                    <a
                                        href="{{ route('backoffice.interventions.edit', $intervention) }}"
                                        class="inline-block px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded transition-colors"
                                    >
                                        Éditer
                                    </a>
                                    <form
                                        action="{{ route('backoffice.interventions.destroy', $intervention) }}"
                                        method="POST"
                                        class="inline-block"
                                        onsubmit="return confirm('Êtes-vous sûr?');"
                                    >
                                        @csrf
                                        <button
                                            type="submit"
                                            class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                                        >
                                            Supprimer
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Statuts workflow -->
            <div class="mt-8 p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg">
                <h3 class="font-semibold mb-4">Workflow de statut</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Processus de traitement d'une intervention
                </p>
                <div class="flex flex-wrap gap-2 items-center">
                    <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-sm font-semibold">En attente</span>
                    <span class="text-gray-400">→</span>
                    <span class="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded text-sm font-semibold">En réparation</span>
                    <span class="text-gray-400">→</span>
                    <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-sm font-semibold">Terminée</span>
                    <span class="text-gray-400">→</span>
                    <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm font-semibold">Payée</span>
                </div>
            </div>
        @endif
    </div>
</div>
@endsection
