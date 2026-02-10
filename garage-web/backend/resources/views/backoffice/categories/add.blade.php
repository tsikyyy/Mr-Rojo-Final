@extends('layouts.app')

@section('title', 'Ajouter une Catégorie')

@section('content')
<div class="w-full max-w-2xl mx-auto">
    <div class="bg-white dark:bg-[#161615] rounded-lg shadow-lg p-6 mb-6">
        <div class="mb-8">
            <h1 class="text-3xl font-bold mb-2">Ajouter une catégorie</h1>
            <p class="text-gray-600 dark:text-gray-400">Créez une nouvelle catégorie de réparation</p>
        </div>

        @if ($errors->any())
            <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 class="font-semibold text-red-800 dark:text-red-400 mb-2">Erreurs de validation</h3>
                <ul class="list-disc list-inside text-red-700 dark:text-red-300 space-y-1">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('categories.store') }}" method="POST" class="space-y-6">
            @csrf

            <!-- Champ Nom -->
            <div>
                <label for="nom" class="block text-sm font-semibold mb-2 text-[#1b1b18] dark:text-[#EDEDEC]">
                    Nom<span class="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="nom"
                    name="nom"
                    value="{{ old('nom') }}"
                    placeholder="Ex: Vidange, Freinage, Climatisation"
                    class="w-full px-4 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                           bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]
                           @error('nom') border-red-500 @enderror"
                />
                @error('nom')
                    <p class="text-red-500 dark:text-red-400 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Champ Description -->
            <div>
                <label for="description" class="block text-sm font-semibold mb-2 text-[#1b1b18] dark:text-[#EDEDEC]">
                    Description<span class="text-gray-400 text-xs ml-1">(optionnel)</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows="5"
                    placeholder="Décrivez cette catégorie de réparation..."
                    class="w-full px-4 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                           bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]
                           @error('description') border-red-500 @enderror"
                >{{ old('description') }}</textarea>
                @error('description')
                    <p class="text-red-500 dark:text-red-400 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Boutons d'action -->
            <div class="flex gap-4 pt-4">
                <button
                    type="submit"
                    class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg
                           transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    Créer la catégorie
                </button>
                <a
                    href="{{ route('categories.index') }}"
                    class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
                           text-[#1b1b18] dark:text-[#EDEDEC] font-semibold rounded-lg
                           transition-colors duration-200 text-center"
                >
                    Annuler
                </a>
            </div>
        </form>
    </div>
</div>
@endsection
