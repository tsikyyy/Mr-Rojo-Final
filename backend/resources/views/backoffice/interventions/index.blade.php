<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Interventions - Backoffice</title>
</head>
<body>

<h1>Interventions administratives</h1>

<p>Bienvenue dans le backoffice.</p>

@if(session('success'))
    <p style="color:green;">
        {{ session('success') }}
    </p>
@endif

<form method="POST" action="{{ route('backoffice.logout') }}">
    @csrf
    <button type="submit">Se déconnecter</button>
</form>

<hr>

<p>
    <a href="{{ route('backoffice.interventions.create') }}">
        ➕ Créer une intervention
    </a>
</p>

<h2>Liste des interventions</h2>

@if($interventions->count() > 0)
    <table border="1" cellpadding="8" cellspacing="0">
        <thead>
        <tr>
            <th>ID</th>
            <th>Voiture</th>
            <th>Type réparation</th>
            <th>Slot</th>
            <th>Statut</th>
            <th>Date début</th>
            <th>Date fin</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        @foreach($interventions as $intervention)
            <tr>
                <td>{{ $intervention->id }}</td>

                <td>
                    {{ $intervention->voiture
                        ? $intervention->voiture->immatriculation
                        : '—' }}
                </td>

                <td>
                    {{ $intervention->typeReparation
                        ? $intervention->typeReparation->nom
                        : '—' }}
                </td>

                <td>
                    {{ $intervention->slot
                        ? 'Slot ' . $intervention->slot->numero
                        : '—' }}
                </td>

                <td>{{ $intervention->statut }}</td>

                <td>
                    {{ $intervention->date_debut
                        ? $intervention->date_debut->format('d/m/Y H:i')
                        : '—' }}
                </td>

                <td>
                    {{ $intervention->date_fin
                        ? $intervention->date_fin->format('d/m/Y H:i')
                        : '—' }}
                </td>

                <td>
                    <!-- MODIFIER -->
                    <a href="{{ route('backoffice.interventions.edit', $intervention) }}">
                        Modifier
                    </a>

                    <!-- SUPPRIMER -->
                    <form method="POST"
                          action="{{ route('backoffice.interventions.destroy', $intervention) }}"
                          style="display:inline;">
                        @csrf
                        <button type="submit"
                                onclick="return confirm('Supprimer cette intervention ?')">
                            Supprimer
                        </button>
                    </form>

                    <br><br>

                    <!-- WORKFLOW STATUT -->
                    @if($intervention->statut === 'en_attente')
                        <form method="POST"
                              action="{{ route('backoffice.interventions.statut', $intervention) }}"
                              style="display:inline;">
                            @csrf
                            <input type="hidden" name="statut" value="en_reparation">
                            <button type="submit">▶ Démarrer</button>
                        </form>
                    @endif

                    @if($intervention->statut === 'en_reparation')
                        <form method="POST"
                              action="{{ route('backoffice.interventions.statut', $intervention) }}"
                              style="display:inline;">
                            @csrf
                            <input type="hidden" name="statut" value="terminee">
                            <button type="submit">✔ Terminer</button>
                        </form>
                    @endif

                    @if($intervention->statut === 'terminee')
                        <form method="POST"
                              action="{{ route('backoffice.interventions.statut', $intervention) }}"
                              style="display:inline;">
                            @csrf
                            <input type="hidden" name="statut" value="payee">
                            <button type="submit"> Payer</button>
                        </form>
                    @endif
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
@else
    <p><em>Aucune intervention pour le moment.</em></p>
@endif

</body>
</html>
