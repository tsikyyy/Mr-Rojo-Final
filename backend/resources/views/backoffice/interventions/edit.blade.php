<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Modifier intervention</title>
</head>
<body>

<h1>Modifier l’intervention #{{ $intervention->id }}</h1>

@if ($errors->any())
    <div style="color:red;">
        <ul>
            @foreach ($errors->all() as $err)
                <li>{{ $err }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form method="POST" action="{{ route('backoffice.interventions.update', $intervention) }}">
    @csrf

    <div>
        <label>Voiture</label><br>
        <select name="voiture_id" required>
            @foreach($voitures as $v)
                <option value="{{ $v->id }}" {{ (string)old('voiture_id', $intervention->voiture_id) === (string)$v->id ? 'selected' : '' }}>
                    #{{ $v->id }} - {{ $v->immatriculation }}
                </option>
            @endforeach
        </select>
    </div>

    <div style="margin-top:10px;">
        <label>Type de réparation</label><br>
        <select name="type_reparation_id" required>
            @foreach($types as $t)
                <option value="{{ $t->id }}" {{ (string)old('type_reparation_id', $intervention->type_reparation_id) === (string)$t->id ? 'selected' : '' }}>
                    #{{ $t->id }} - {{ $t->nom }}
                </option>
            @endforeach
        </select>
    </div>

    <div style="margin-top:10px;">
        <label>Slot (optionnel)</label><br>
        <select name="slot_id">
            <option value="">-- Aucun slot --</option>
            @foreach($slots as $s)
                <option value="{{ $s->id }}" {{ (string)old('slot_id', $intervention->slot_id) === (string)$s->id ? 'selected' : '' }}>
                    Slot {{ $s->numero }}
                </option>
            @endforeach
        </select>
    </div>

    <div style="margin-top:10px;">
        <label>Statut</label><br>
        <select name="statut" required>
            @foreach($statuts as $st)
                <option value="{{ $st }}" {{ old('statut', $intervention->statut) === $st ? 'selected' : '' }}>
                    {{ $st }}
                </option>
            @endforeach
        </select>
    </div>

    <div style="margin-top:10px;">
        <label>Date début (optionnel)</label><br>
        <input type="datetime-local" name="date_debut"
               value="{{ old('date_debut', $intervention->date_debut ? $intervention->date_debut->format('Y-m-d\TH:i') : '') }}">
    </div>

    <div style="margin-top:10px;">
        <label>Date fin (optionnel)</label><br>
        <input type="datetime-local" name="date_fin"
               value="{{ old('date_fin', $intervention->date_fin ? $intervention->date_fin->format('Y-m-d\TH:i') : '') }}">
    </div>

    <div style="margin-top:15px;">
        <button type="submit">Enregistrer</button>
        <a href="{{ route('backoffice.interventions') }}">Annuler</a>
    </div>
</form>

</body>
</html>
