<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <meta name="recaptcha-site-key" content="<?php echo e(config('services.recaptcha.site_key')); ?>">
    <title>PetWord</title>
    <?php if(config('services.recaptcha.site_key')): ?>
        <script src="https://www.google.com/recaptcha/api.js?render=<?php echo e(config('services.recaptcha.site_key')); ?>"></script>
    <?php endif; ?>
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.js']); ?>
</head>
<body>
    <div id="app"></div>
</body>
</html>
<?php /**PATH C:\xampp\htdocs\renteriaUnidad2\resources\views/home.blade.php ENDPATH**/ ?>