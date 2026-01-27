<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Créer une intervention</title>
</head>
<body>

<h1>Créer une intervention</h1>

@if ($errors->any())
    <div style="color:red;">
        <ul>
            @foreach ($errors->all() as $err)
                <li>{{ $err }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form method="POST" action="{{ route('backoffice.interventions.store') }}">
    @csrf

    <div>
        <label>Voiture</label><br>
        <select name="voiture_id" required>
            <option value="">-- Choisir une voiture --</option>
            @foreach($voitures as $v)
                <option value="{{ $v->id }}" {{ (string)old('voiture_id') === (string)$v->id ? 'selected' : '' }}>
                    #{{ $v->id }} - {{ $v->immatriculation }}
                </option>
            @endforeach
        </select>
    </div>

    <div style="margin-top:10px;">
        <label>Type de réparation</label><br>
        <select name="type_reparation_id" required>
            <option value="">-- Choisir un type --</option>
            @foreach($types as $t)
                <option value="{{ $t->id }}" {{ (string)old('type_reparation_id') === (string)$t->id ? 'selected' : '' }}>
                    #{{ $t->id }} - {{ $t->nom }} ({{ $t->prix }})
                </option>
            @endforeach
        </select>
    </div>

    <div style="margin-top:10px;">
        <label>Slot (optionnel)</label><br>
        <select name="slot_id">
            <option value="">-- Aucun slot --</option>
            @foreach($slots as $s)
                <option value="{{ $s->id }}" {{ (string)old('slot_id') === (string)$s->id ? 'selected' : '' }}>
                    #{{ $s->id }} - Slot {{ $s->numero }}
                </option>
            @endforeach
        </select>
    </div>

    <div style="margin-top:10px;">
        <label>Statut</label><br>
        <select name="statut" required>
            @php($statut = old('statut','en_attente'))
            <option value="en_attente" {{ $statut==='en_attente' ? 'selected' : '' }}>en_attente</option>
            <option value="en_reparation" {{ $statut==='en_reparation' ? 'selected' : '' }}>en_reparation</option>
            <option value="terminee" {{ $statut==='terminee' ? 'selected' : '' }}>terminee</option>
            <option value="payee" {{ $statut==='payee' ? 'selected' : '' }}>payee</option>
        </select>
    </div>

    <div style="margin-top:10px;">
        <label>Date début (optionnel)</label><br>
        <input type="datetime-local" name="date_debut" value="{{ old('date_debut') }}">
    </div>

    <div style="margin-top:10px;">
        <label>Date fin (optionnel)</label><br>
        <input type="datetime-local" name="date_fin" value="{{ old('date_fin') }}">
    </div>

    <div style="margin-top:15px;">
        <button type="submit">Enregistrer</button>
        <a href="{{ route('backoffice.interventions') }}">Annuler</a>
    </div>
</form>

</body>
</html>
