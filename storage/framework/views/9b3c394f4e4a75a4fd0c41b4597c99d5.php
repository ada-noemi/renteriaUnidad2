<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 | PetWord</title>
    <style>
        :root {
            --navy: #123a57;
            --navy-deep: #0c283e;
            --orange: #c7642a;
            --cream-soft: #f7f2e8;
            --border: #d8cbb3;
            --text: #1d3348;
            --muted: #5b6d7f;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: "Segoe UI", sans-serif;
            background: #ffffff;
            color: var(--text);
        }

        .topbar {
            height: 8px;
            background: var(--navy);
        }

        .header {
            background: var(--navy);
            color: var(--cream-soft);
            padding: 20px 16px;
            border-bottom: 1px solid rgba(239, 232, 216, 0.2);
        }

        .header-inner {
            max-width: 1180px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .header-inner img {
            width: 72px;
            height: 72px;
            object-fit: contain;
            display: block;
        }

        .brand {
            font-size: clamp(28px, 4vw, 42px);
            font-weight: 800;
            line-height: 1;
        }

        .brand span:last-child {
            color: var(--orange);
        }

        .wrapper {
            max-width: 920px;
            margin: 48px auto;
            padding: 0 16px;
        }

        .card {
            background: var(--cream-soft);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 36px 28px;
            text-align: center;
            box-shadow: 0 12px 22px rgba(12, 40, 62, 0.08);
        }

        .eyebrow {
            color: var(--orange);
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        h1 {
            margin: 14px 0 12px;
            color: var(--navy);
            font-size: clamp(48px, 10vw, 92px);
            line-height: 1;
        }

        p {
            margin: 0 auto;
            max-width: 560px;
            color: var(--muted);
            line-height: 1.75;
            font-size: 18px;
        }

        .actions {
            margin-top: 24px;
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 16px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            border: 1px solid transparent;
        }

        .button-primary {
            background: var(--orange);
            color: #ffffff;
        }

        .button-secondary {
            background: transparent;
            border-color: var(--border);
            color: var(--navy);
        }
    </style>
</head>
<body>
    <div class="topbar"></div>
    <header class="header">
        <div class="header-inner">
            <img src="/images/pertword.png" alt="PetWord">
            <div class="brand"><span>Pet</span><span>Word</span></div>
        </div>
    </header>

    <main class="wrapper">
        <section class="card">
            <div class="eyebrow">Pagina de error</div>
            <h1>404</h1>
            <p>La sección solicitada no existe o fue movida. Usa el menú principal, el mapa del sitio o vuelve al inicio para continuar navegando.</p>
            <div class="actions">
                <a class="button button-primary" href="/">Ir al inicio</a>
                <a class="button button-secondary" href="/mapa-del-sitio">Ver mapa del sitio</a>
            </div>
        </section>
    </main>
</body>
</html><?php /**PATH C:\xampp\htdocs\PetWord\petword\resources\views/errors/404.blade.php ENDPATH**/ ?>