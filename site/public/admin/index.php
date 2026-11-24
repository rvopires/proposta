<?php
/**
 * Página de envio de propostas (uso interno da TecnoCursos).
 *
 * - Cria o link de cada cliente a partir do nome + PDF.
 * - Troca o PDF de um cliente (o link continua o mesmo).
 * - Apaga um cliente.
 *
 * Os dados ficam em:  ../c/<slug>.json   (nome do cliente + caminho do PDF)
 *                     ../propostas/<slug>-<codigo>.pdf
 * A senha fica em admin/config.php (copie config.exemplo.php e troque a senha).
 */
declare(strict_types=1);

session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',
    'secure'   => !empty($_SERVER['HTTPS']),
]);
session_start();

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');

$raiz      = dirname(__DIR__);
$dirDados  = $raiz . '/c';
$dirPdf    = $raiz . '/propostas';
$arqConfig = __DIR__ . '/config.php';
$arqTent   = __DIR__ . '/.tentativas.json';

function h(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

function pagina(string $titulo, string $corpo): void {
    echo '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
       . '<meta name="viewport" content="width=device-width,initial-scale=1">'
       . '<meta name="robots" content="noindex,nofollow"><title>' . h($titulo) . '</title>'
       . '<style>
        :root{--navy:#1B2848;--blue:#005C8B;--green:#32AD78;--mint:#6ABB8C}
        *{box-sizing:border-box}
        body{margin:0;font-family:Poppins,system-ui,Segoe UI,Arial,sans-serif;background:#f3f6f9;color:#1b2848}
        .topo{background:var(--navy);color:#fff;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px}
        .topo b{font-size:18px}.topo form{margin:0}
        main{max-width:960px;margin:0 auto;padding:24px 16px 64px}
        .cartao{background:#fff;border-radius:14px;padding:20px;margin-bottom:20px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
        h1,h2{margin:0 0 12px}h2{font-size:18px}
        label{display:block;font-weight:600;margin:12px 0 6px;font-size:14px}
        input[type=text],input[type=password],input[type=file]{width:100%;padding:10px 12px;border:1px solid #c7d0dc;border-radius:10px;font:inherit;background:#fff}
        button,.btn{background:var(--green);color:#fff;border:0;border-radius:10px;padding:10px 18px;font-weight:600;font-size:15px;font-family:inherit;cursor:pointer}
        button:hover{filter:brightness(1.07)}
        .sec{background:#e8eef4;color:var(--navy)}.perigo{background:#c0392b}
        .ok{background:#e6f6ee;border:1px solid var(--green);padding:10px 14px;border-radius:10px;margin-bottom:16px}
        .erro{background:#fdecea;border:1px solid #c0392b;padding:10px 14px;border-radius:10px;margin-bottom:16px}
        table{width:100%;border-collapse:collapse;font-size:14px}
        th,td{text-align:left;padding:10px 8px;border-bottom:1px solid #e3e9f0;vertical-align:top}
        .link{font-family:ui-monospace,Consolas,monospace;font-size:12px;word-break:break-all}
        .acoes{display:flex;flex-wrap:wrap;gap:6px}.acoes form{margin:0}
        small{color:#5b6b82}details summary{cursor:pointer;color:var(--blue);font-weight:600}
        .login{max-width:380px;margin:12vh auto}
       </style></head><body>' . $corpo . '</body></html>';
}

// ---------- configuração ----------
if (!is_file($arqConfig)) {
    pagina('Falta configurar', '<main><div class="cartao"><h1>Falta criar o config.php</h1>'
        . '<p>Copie o arquivo <b>admin/config.exemplo.php</b> para <b>admin/config.php</b> e troque a senha dentro dele.</p></div></main>');
    exit;
}
$cfg   = require $arqConfig;
$senha = (string)($cfg['senha'] ?? '');
$maxMb = (int)($cfg['tamanho_max_mb'] ?? 50);
if ($senha === '' || strpos($senha, 'TROQUE') === 0 || strlen($senha) < 8) {
    pagina('Troque a senha', '<main><div class="cartao"><h1>Troque a senha</h1>'
        . '<p>Em <b>admin/config.php</b>, troque a senha por uma forte (mínimo de 8 caracteres) antes de usar.</p></div></main>');
    exit;
}

// ---------- utilidades ----------
function ip(): string { return (string)($_SERVER['REMOTE_ADDR'] ?? '0'); }

function ler_tentativas(string $arq): array {
    $j = is_file($arq) ? json_decode((string)file_get_contents($arq), true) : [];
    return is_array($j) ? $j : [];
}
function bloqueado(string $arq): bool {
    $agora = time();
    $t = array_filter(ler_tentativas($arq)[ip()] ?? [], fn($x) => $x > $agora - 900);
    return count($t) >= 5;
}
function registrar_falha(string $arq): void {
    $agora = time();
    $todas = ler_tentativas($arq);
    foreach ($todas as $k => $lista) {
        $todas[$k] = array_values(array_filter((array)$lista, fn($x) => $x > $agora - 900));
        if (!$todas[$k]) unset($todas[$k]);
    }
    $todas[ip()][] = $agora;
    file_put_contents($arq, json_encode($todas), LOCK_EX);
}

function csrf(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
    return $_SESSION['csrf'];
}
function csrf_ok(): bool {
    return isset($_POST['csrf'], $_SESSION['csrf']) && hash_equals($_SESSION['csrf'], (string)$_POST['csrf']);
}
function campo_csrf(): string { return '<input type="hidden" name="csrf" value="' . h(csrf()) . '">'; }

function slugify(string $s): string {
    $de = ['á'=>'a','à'=>'a','â'=>'a','ã'=>'a','ä'=>'a','é'=>'e','è'=>'e','ê'=>'e','ë'=>'e','í'=>'i','ì'=>'i','î'=>'i','ï'=>'i',
           'ó'=>'o','ò'=>'o','ô'=>'o','õ'=>'o','ö'=>'o','ú'=>'u','ù'=>'u','û'=>'u','ü'=>'u','ç'=>'c','ñ'=>'n',
           'Á'=>'a','À'=>'a','Â'=>'a','Ã'=>'a','Ä'=>'a','É'=>'e','È'=>'e','Ê'=>'e','Ë'=>'e','Í'=>'i','Ì'=>'i','Î'=>'i','Ï'=>'i',
           'Ó'=>'o','Ò'=>'o','Ô'=>'o','Õ'=>'o','Ö'=>'o','Ú'=>'u','Ù'=>'u','Û'=>'u','Ü'=>'u','Ç'=>'c','Ñ'=>'n'];
    $s = strtolower(strtr($s, $de));
    $s = trim((string)preg_replace('/[^a-z0-9]+/', '-', $s), '-');
    $s = substr($s, 0, 40);
    return trim($s, '-') ?: 'cliente';
}
function slug_valido(string $s): bool { return (bool)preg_match('/^[a-z0-9-]{3,80}$/', $s); }

function base_url(): string {
    $esq  = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http';
    $host = (string)($_SERVER['HTTP_HOST'] ?? 'localhost');
    $dir  = rtrim(str_replace('\\', '/', dirname(dirname((string)($_SERVER['SCRIPT_NAME'] ?? '/admin/index.php')))), '/');
    return $esq . '://' . $host . $dir . '/';
}

function erro_upload(array $f, int $maxMb): ?string {
    $cod = $f['error'] ?? UPLOAD_ERR_NO_FILE;
    if ($cod === UPLOAD_ERR_NO_FILE) return 'Escolha o arquivo PDF.';
    if ($cod === UPLOAD_ERR_INI_SIZE || $cod === UPLOAD_ERR_FORM_SIZE) {
        return 'O arquivo é maior que o limite do servidor (upload_max_filesize = ' . ini_get('upload_max_filesize')
             . ', post_max_size = ' . ini_get('post_max_size') . '). Comprima o PDF ou aumente o limite no hPanel.';
    }
    if ($cod !== UPLOAD_ERR_OK) return 'Falha no envio do arquivo (código ' . (int)$cod . '). Tente de novo.';
    if (($f['size'] ?? 0) > $maxMb * 1024 * 1024) return 'O PDF passa de ' . $maxMb . ' MB. Comprima antes de enviar.';
    if (!is_uploaded_file($f['tmp_name'])) return 'Arquivo inválido.';
    $ini = (string)file_get_contents($f['tmp_name'], false, null, 0, 5);
    if ($ini !== '%PDF-') return 'Esse arquivo não é um PDF.';
    return null;
}

function salvar_pdf(array $f, string $slug, string $dirPdf): string {
    if (!is_dir($dirPdf)) mkdir($dirPdf, 0755, true);
    $nome = $slug . '-' . bin2hex(random_bytes(3)) . '.pdf';
    if (!move_uploaded_file($f['tmp_name'], $dirPdf . '/' . $nome)) throw new RuntimeException('Não consegui gravar o PDF. Veja as permissões da pasta propostas/.');
    @chmod($dirPdf . '/' . $nome, 0644);
    return 'propostas/' . $nome;
}

function ler_cliente(string $dirDados, string $slug): ?array {
    $arq = $dirDados . '/' . $slug . '.json';
    if (!slug_valido($slug) || !is_file($arq)) return null;
    $j = json_decode((string)file_get_contents($arq), true);
    return is_array($j) ? $j : null;
}
function gravar_cliente(string $dirDados, string $slug, array $dados): void {
    if (!is_dir($dirDados)) mkdir($dirDados, 0755, true);
    $ok = file_put_contents($dirDados . '/' . $slug . '.json', json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT), LOCK_EX);
    if ($ok === false) throw new RuntimeException('Não consegui gravar os dados. Veja as permissões da pasta c/.');
}
function apagar_pdf(string $raiz, ?string $caminho): void {
    if ($caminho && preg_match('/^propostas\/[\w.-]+\.pdf$/', $caminho) && is_file($raiz . '/' . $caminho)) @unlink($raiz . '/' . $caminho);
}

// ---------- login / sair ----------
$acao = (string)($_POST['acao'] ?? '');
$msg  = (string)($_SESSION['msg'] ?? '');  unset($_SESSION['msg']);
$err  = (string)($_SESSION['err'] ?? '');  unset($_SESSION['err']);

if (empty($_SESSION['ok'])) {
    $erroLogin = '';
    if ($acao === 'entrar') {
        if (bloqueado($arqTent)) {
            $erroLogin = 'Muitas tentativas. Aguarde 15 minutos e tente de novo.';
        } elseif (csrf_ok() && hash_equals($senha, (string)($_POST['senha'] ?? ''))) {
            session_regenerate_id(true);
            $_SESSION['ok'] = true;
            header('Location: ./');
            exit;
        } else {
            registrar_falha($arqTent);
            $erroLogin = 'Senha incorreta.';
        }
    }
    pagina('Entrar', '<main class="login"><div class="cartao"><h1>Propostas</h1><p><small>Área restrita da TecnoCursos.</small></p>'
        . ($erroLogin ? '<div class="erro">' . h($erroLogin) . '</div>' : '')
        . '<form method="post">' . campo_csrf() . '<input type="hidden" name="acao" value="entrar">'
        . '<label for="s">Senha</label><input id="s" type="password" name="senha" autocomplete="current-password" autofocus required>'
        . '<p><button type="submit">Entrar</button></p></form></div></main>');
    exit;
}

// ---------- ações (já logado) ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (!csrf_ok()) throw new RuntimeException('Sessão expirada. Atualize a página e tente de novo.');

        if ($acao === 'sair') {
            $_SESSION = [];
            session_destroy();
            header('Location: ./');
            exit;
        }

        if ($acao === 'criar') {
            $nome = trim(strip_tags((string)($_POST['cliente'] ?? '')));
            if ($nome === '' || strlen($nome) > 80) throw new RuntimeException('Digite o nome do cliente (até 80 letras).');
            if ($e = erro_upload($_FILES['pdf'] ?? [], $maxMb)) throw new RuntimeException($e);
            $slug = slugify($nome) . '-' . substr(bin2hex(random_bytes(4)), 0, 6);
            $pdf  = salvar_pdf($_FILES['pdf'], $slug, $dirPdf);
            gravar_cliente($dirDados, $slug, ['cliente' => $nome, 'pdf' => $pdf, 'criado' => date('c'), 'atualizado' => date('c')]);
            $_SESSION['msg'] = 'Pronto! Link de ' . $nome . ': ' . base_url() . '?c=' . $slug;
        } elseif ($acao === 'trocar') {
            $slug = (string)($_POST['slug'] ?? '');
            $dados = ler_cliente($dirDados, $slug);
            if (!$dados) throw new RuntimeException('Cliente não encontrado.');
            if ($e = erro_upload($_FILES['pdf'] ?? [], $maxMb)) throw new RuntimeException($e);
            $novo = salvar_pdf($_FILES['pdf'], $slug, $dirPdf);
            $antigo = (string)($dados['pdf'] ?? '');
            $dados['pdf'] = $novo;
            $dados['atualizado'] = date('c');
            gravar_cliente($dirDados, $slug, $dados);
            apagar_pdf($raiz, $antigo);
            $_SESSION['msg'] = 'PDF de ' . ($dados['cliente'] ?? $slug) . ' atualizado. O link continua o mesmo.';
        } elseif ($acao === 'apagar') {
            $slug = (string)($_POST['slug'] ?? '');
            $dados = ler_cliente($dirDados, $slug);
            if (!$dados) throw new RuntimeException('Cliente não encontrado.');
            apagar_pdf($raiz, (string)($dados['pdf'] ?? ''));
            @unlink($dirDados . '/' . $slug . '.json');
            $_SESSION['msg'] = 'Cliente ' . ($dados['cliente'] ?? $slug) . ' apagado.';
        }
    } catch (Throwable $e) {
        $_SESSION['err'] = $e->getMessage();
    }
    header('Location: ./');
    exit;
}

// ---------- tela principal ----------
$clientes = [];
foreach (glob($dirDados . '/*.json') ?: [] as $arq) {
    $slug = basename($arq, '.json');
    $d = ler_cliente($dirDados, $slug);
    if ($d) $clientes[] = ['slug' => $slug] + $d;
}
usort($clientes, fn($a, $b) => strcmp((string)($b['atualizado'] ?? ''), (string)($a['atualizado'] ?? '')));
$base = base_url();

$linhas = '';
foreach ($clientes as $c) {
    $link = $base . '?c=' . $c['slug'];
    $data = isset($c['atualizado']) ? date('d/m/Y H:i', (int)strtotime((string)$c['atualizado'])) : '';
    $linhas .= '<tr><td><b>' . h((string)($c['cliente'] ?? '')) . '</b><br><small>' . h($data) . '</small></td>'
        . '<td class="link"><a href="' . h($link) . '" target="_blank" rel="noopener">' . h($link) . '</a></td>'
        . '<td><div class="acoes">'
        . '<button type="button" class="sec" data-copiar="' . h($link) . '">Copiar link</button>'
        . '<a class="btn sec" style="text-decoration:none" href="../' . h((string)($c['pdf'] ?? '')) . '" target="_blank" rel="noopener">Ver PDF</a>'
        . '</div>'
        . '<details style="margin-top:8px"><summary>Trocar PDF</summary>'
        . '<form method="post" enctype="multipart/form-data">' . campo_csrf()
        . '<input type="hidden" name="acao" value="trocar"><input type="hidden" name="slug" value="' . h($c['slug']) . '">'
        . '<input type="file" name="pdf" accept="application/pdf" required style="margin:8px 0"><button type="submit">Enviar novo PDF</button></form></details>'
        . '<form method="post" onsubmit="return confirm(\'Apagar este cliente e o PDF? O link vai parar de funcionar.\')" style="margin-top:8px">' . campo_csrf()
        . '<input type="hidden" name="acao" value="apagar"><input type="hidden" name="slug" value="' . h($c['slug']) . '">'
        . '<button type="submit" class="perigo">Apagar</button></form>'
        . '</td></tr>';
}
if ($linhas === '') $linhas = '<tr><td colspan="3"><small>Nenhum cliente ainda. Crie o primeiro acima.</small></td></tr>';

pagina('Propostas · TecnoCursos',
    '<div class="topo"><b>Propostas · TecnoCursos</b><form method="post">' . campo_csrf()
    . '<input type="hidden" name="acao" value="sair"><button type="submit" class="sec">Sair</button></form></div><main>'
    . ($msg ? '<div class="ok">' . h($msg) . '</div>' : '')
    . ($err ? '<div class="erro">' . h($err) . '</div>' : '')
    . '<div class="cartao"><h2>Novo cliente</h2>'
    . '<form method="post" enctype="multipart/form-data">' . campo_csrf() . '<input type="hidden" name="acao" value="criar">'
    . '<label for="n">Nome do cliente (aparece só na mensagem do WhatsApp)</label><input id="n" type="text" name="cliente" maxlength="80" required>'
    . '<label for="p">Proposta em PDF</label><input id="p" type="file" name="pdf" accept="application/pdf" required>'
    . '<p><small>Máximo ' . h((string)$maxMb) . ' MB (limite do servidor: ' . h((string)ini_get('upload_max_filesize')) . '). Dica: comprima o PDF para 5 a 10 MB.</small></p>'
    . '<p><button type="submit">Criar link</button></p></form></div>'
    . '<div class="cartao"><h2>Clientes (' . count($clientes) . ')</h2>'
    . '<table><thead><tr><th>Cliente</th><th>Link</th><th>Ações</th></tr></thead><tbody>' . $linhas . '</tbody></table></div></main>'
    . '<script>document.addEventListener("click",function(e){var b=e.target.closest("[data-copiar]");if(!b)return;'
    . 'navigator.clipboard.writeText(b.dataset.copiar).then(function(){var t=b.textContent;b.textContent="Copiado!";setTimeout(function(){b.textContent=t},1500)})})</script>');
