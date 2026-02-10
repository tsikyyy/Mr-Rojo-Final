@extends('layouts.app')

@section('title', 'Modifier une Intervention')

@section('content')
<div class="w-full max-w-2xl mx-auto">
    <div class="bg-white dark:bg-[#161615] rounded-lg shadow-lg p-6 mb-6">
        <div class="mb-8">
            <h1 class="text-3xl font-bold mb-2">Modifier l'intervention</h1>
            <p class="text-gray-600 dark:text-gray-400">
                Voiture: <strong>{{ $intervention->voiture->immatriculation }}</strong>
            </p>
        </div>

        <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700 space-y-1 text-sm">
            <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Créée le:</span>
                <span class="font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">{{ $intervention->created_at->format('d/m/Y H:i') }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Dernière modification:</span>
                <span class="font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">{{ $intervention->updated_at->format('d/m/Y H:i') }}</span>
            </div>
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

        <form action="{{ route('backoffice.interventions.update', $intervention) }}" method="POST" class="space-y-6">
            @csrf
            @method('PUT')

            <!-- Voiture -->
            <div>
                <label for="voiture_id" class="block text-sm font-semibold mb-2 text-[#1b1b18] dark:text-[#EDEDEC]">
                    Voiture<span class="text-red-500">*</span>
                </label>
                <select
                    id="voiture_id"
                    name="voiture_id"
                    required
                    class="w-full px-4 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                           bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]
                           @error('voiture_id') border-red-500 @enderror"
                >
                    <option value="">-- Sélectionner une voiture --</option>
                    @foreach($voitures as $v)
                        <option value="{{ $v->id }}" {{ old('voiture_id', $intervention->voiture_id) == $v->id ? 'selected' : '' }}>
                            {{ $v->immatriculation }} - {{ $v->marque }} {{ $v->modele }}
                        </option>
                    @endforeach
                </select>
                @error('voiture_id')
                    <p class="text-red-500 dark:text-red-400 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Type de réparation -->
            <div>
                <label for="type_reparation_id" class="block text-sm font-semibold mb-2 text-[#1b1b18] dark:text-[#EDEDEC]">
                    Type de réparation<span class="text-red-500">*</span>
                </label>
                <select
                    id="type_reparation_id"
                    name="type_reparation_id"
                    required
                    class="w-full px-4 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                           bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]
                           @error('type_reparation_id') border-red-500 @enderror"
                >
                    <option value="">-- Sélectionner un type --</option>
                    @foreach($types as $t)
                        <option value="{{ $t->id }}" {{ old('type_reparation_id', $intervention->type_reparation_id) == $t->id ? 'selected' : '' }}>
                            {{ $t->nom }} - {{ number_format($t->prix, 2) }} €
                        </option>
                    @endforeach
                </select>
                @error('type_reparation_id')
                    <p class="text-red-500 dark:text-red-400 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Catégorie -->
            <div>
                <label for="categorie_id" class="block text-sm font-semibold mb-2 text-[#1b1b18] dark:text-[#EDEDEC]">
                    Catégorie<span class="text-gray-400 text-xs ml-1">(optionnel)</span>
                </label>
                <select
                    id="categorie_id"
                    name="categorie_id"
                    class="w-full px-4 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                           bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]
                           @error('categorie_id') border-red-500 @enderror"
                >
                    <option value="">-- Pas de catégorie --</option>
                    @foreach($categories as $c)
                        <option value="{{ $c->id }}" {{ old('categorie_id', $intervention->categorie_id) == $c->id ? 'selected' : '' }}>
                            {{ $c->nom }}
                        </option>
                    @endforeach
                </select>
                @error('categorie_id')
                    <p class="text-red-500 dark:text-red-400 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Slot -->
            <div>
                <label for="slot_id" class="block text-sm font-semibold mb-2 text-[#1b1b18] dark:text-[#EDEDEC]">
                    Slot de garage<span class="text-gray-400 text-xs ml-1">(optionnel)</span>
                </label>
                <select
                    id="slot_id"
                    name="slot_id"
                    class="w-full px-4 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                           bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]"
                >
                    <option value="">-- Pas de slot --</option>
                    @foreach($slots as $s)
                        <option value="{{ $s->id }}" {{ old('slot_id', $intervention->slot_id) == $s->id ? 'selected' : '' }}>
                            Slot {{ $s->numero }}
                        </option>
                    @endforeach
                </select>
            </div>

            <!-- Statut -->
            <div>
                <label for="statut" class="block text-sm font-semibold mb-2 text-[#1b1b18] dark:text-[#EDEDEC]">
                    Statut<span class="text-red-500">*</span>
                </label>
                <select
                    id="statut"
                    name="statut"
                    required
                    class="w-full px-4 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                           bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]
                           @error('statut') border-red-500 @enderror"
                >
                    <option value="">-- Sélectionner un statut --</option>
                    @foreach($statuts as $s)
                        <option value="{{ $s }}" {{ old('statut', $intervention->statut) == $s ? 'selected' : '' }}>
                            {{ ucfirst(str_replace('_', ' ', $s)) }}
                        </option>
                    @endforeach
                </select>
                @error('statut')
                    <p class="text-red-500 dark:text-red-400 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="date_debut" class="block text-sm font-semibold mb-2 text-[#1b1b18] dark:text-[#EDEDEC]">
                        Date de début<span class="text-gray-400 text-xs ml-1">(optionnel)</span>
                    </label>
                    <input
                        type="datetime-local"
                        id="date_debut"
                        name="date_debut"
                        value="{{ old('date_debut', $intervention->date_debut?->format('Y-m-d\TH:i')) }}"
                        class="w-full px-4 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                               bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]
                               @error('date_debut') border-red-500 @enderror"
                    />
                    @error('date_debut')
                        <p class="text-red-500 dark:text-red-400 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label for="date_fin" class="block text-sm font-semibold mb-2 text-[#1b1b18] dark:text-[#EDEDEC]">
                        Date de fin<span class="text-gray-400 text-xs ml-1">(optionnel)</span>
                    </label>
                    <input
                        type="datetime-local"
                        id="date_fin"
                        name="date_fin"
                        value="{{ old('date_fin', $intervention->date_fin?->format('Y-m-d\TH:i')) }}"
                        class="w-full px-4 py-2 border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
                               bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]
                               @error('date_fin') border-red-500 @enderror"
                    />
                    @error('date_fin')
                        <p class="text-red-500 dark:text-red-400 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>
            </div>

            <!-- Boutons -->
            <div class="flex gap-4 pt-4">
                <button
                    type="submit"
                    class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg
                           transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    Enregistrer les modifications
                </button>
                <a
                    href="{{ route('backoffice.interventions') }}"
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
