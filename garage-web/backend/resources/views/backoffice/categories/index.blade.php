@extends('layouts.app')

@section('title', 'Gestion des Catégories')

@section('content')
<div class="w-full max-w-4xl mx-auto">
    <div class="bg-white dark:bg-[#161615] rounded-lg shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold mb-2">Gestion des catégories</h1>
                <p class="text-gray-600 dark:text-gray-400">Liste de toutes les catégories de réparation</p>
            </div>
            <a
                href="{{ route('categories.create') }}"
                class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
                + Ajouter une catégorie
            </a>
        </div>

        @if (session('success'))
            <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p class="text-green-800 dark:text-green-400">{{ session('success') }}</p>
            </div>
        @endif

        @if ($categories->isEmpty())
            <div class="text-center py-12">
                <p class="text-gray-500 dark:text-gray-400 mb-4">Aucune catégorie trouvée</p>
                <a href="{{ route('categories.create') }}" class="text-blue-500 hover:underline">
                    Créer la première catégorie
                </a>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b border-[#e3e3e0] dark:border-[#3E3E3A]">
                            <th class="px-4 py-3 text-left text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                Nom
                            </th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                Description
                            </th>
                            <th class="px-4 py-3 text-left text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                Interventions
                            </th>
                            <th class="px-4 py-3 text-right text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($categories as $categorie)
                            <tr class="border-b border-[#e3e3e0] dark:border-[#3E3E3A] hover:bg-gray-50 dark:hover:bg-[#1D0002]">
                                <td class="px-4 py-3 font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                    {{ $categorie->nom }}
                                </td>
                                <td class="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                    {{ Str::limit($categorie->description, 50) ?? '-' }}
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm">
                                        {{ $categorie->interventions()->count() }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right space-x-2">
                                    <a
                                        href="{{ route('categories.edit', $categorie) }}"
                                        class="inline-block px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded transition-colors"
                                    >
                                        Éditer
                                    </a>
                                    <form
                                        action="{{ route('categories.destroy', $categorie) }}"
                                        method="POST"
                                        class="inline-block"
                                        onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?');"
                                    >
                                        @csrf
                                        @method('DELETE')
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
        @endif
    </div>
</div>
@endsection
