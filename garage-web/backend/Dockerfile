FROM php:8.2-fpm

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    build-essential \
    libonig-dev \
    libxml2-dev \
    zip \
    curl \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Installer les extensions PHP nécessaires pour Laravel
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mbstring \
    xml \
    bcmath

# Copier le code de l'app
WORKDIR /var/www/html

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copier les fichiers de l'app
COPY . .

# Donner les permissions appropriées
RUN chown -R www-data:www-data /var/www/html

# Exposition du port 9000 pour PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
