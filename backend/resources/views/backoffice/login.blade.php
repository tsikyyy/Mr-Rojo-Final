<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Connexion </title>
</head>
<body>

<h1>Connexion </h1>

@if ($errors->any())
  <div style="color:red;">
    {{ $errors->first() }}
  </div>
@endif

<form method="POST" action="{{ route('backoffice.login.submit') }}">
  @csrf

  <div>
    <label>Email</label><br />
    <input type="email" name="email" required />
  </div>

  <div style="margin-top:10px;">
    <label>Mot de passe</label><br />
    <input type="password" name="mot_de_passe" required />
  </div>

  <button style="margin-top:10px;" type="submit">Se connecter</button>
</form>

</body>
</html>
