
[PHP]
>> sudo apt-get update
>> sudo apt install -y php7.4 php7.4-cli php7.4-common php7.4-fpm
>> sudo apt install -y php7.4-mysql php7.4-dom php7.4-simplexml php7.4-ssh2 php7.4-xml php7.4-xmlreader php7.4-curl  php7.4-exif  php7.4-ftp php7.4-gd  php7.4-iconv php7.4-imagick php7.4-json  php7.4-mbstring php7.4-posix php7.4-sockets php7.4-tokenizer

[env-key]
>> composer install --no-dev
>> cp .env.example .env
>> php artisan key:generate //remove if key exists in .env
>> php artisan storage:link

[PermissionsOnLinux]
>> sudo chown -R $USER:www-data storage
>> sudo chown -R $USER:www-data bootstrap/cache
>> sudo chmod -R 775 storage
>> sudo chmod -R 775 bootstrap/cache

[PermissionsOnMac]
>> sudo chown -R $USER:_www storage
>> sudo chown -R $USER:_www bootstrap/cache
>> sudo chmod -R 775 storage
>> sudo chmod -R 775 bootstrap/cache
 
[migration]
>> php artisan migrate
>> php artisan passport:client --personal

[Seeding]
#>> php artisan permission:cache-reset
php artisan db:seed --class=AdminSeeder

#files
php artisan storage:link

#resetting permissions-cache
php artisan permission:cache-reset
