//Parchita by Link/Tomate/Samuel

//Modulos
const { default: makeWASocket,
  DisconnectReason, JulsBotIncConnect, getAggregateVotesInPollMessage, delay, makeCacheableSignalKeyStore, useMultiFileAuthState,
 fetchLatestBaileysVersion,
 generateForwardMessageContent,
 prepareWAMessageMedia,
 generateWAMessageFromContent,
 generateMessageID,
  downloadContentFromMessage,
  jidDecode,
   proto } = require("baileys")
const fs = require('fs')
const { Boom } = require('@hapi/boom')
const NodeCache = require("node-cache")
const readline = require("readline")
const PhoneNumber = require('awesome-phonenumber')
const cfonts = require('cfonts');
const fetch = require('node-fetch')
const pino = require('pino')
const util = require("util")
const speed = require("performance-now");
const mimetype = require('mime-types')
const { exec, spawn, execSync } = require("child_process")
let phoneNumber = "5199999999"; // cambiar número
const axios = require("axios")
const ffmpeg = require('fluent-ffmpeg')

 //color
const chalk = require('chalk')
const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) };

 //baner
const banner = cfonts.render("Naufra| Bot| Base", {
  font: 'pallet',
  align: 'center',
  gradient: ["green","blue"]
})
      // FUNCIONES DESCARGA
const { fetchJson , getBuffer ,fetchBuffer } = require('./fuction/download/gets.js')


const {getExtension, getRandom } =require('./fuction/settings/fuctions.js')

 //Stickers
const { sendVideoAsSticker, sendImageAsSticker } = require('./fuction/sticker/rename.js');
const { sendVideoAsSticker2, sendImageAsSticker2 } = require('./fuction/sticker/rename2.js');

 //Grupos js
// DEJA ESTA LÍNEA COMO ESTÁ (La que ya tienes en tu index.js):
const { MoneyOfSender, addkoin, delkoin, AddReg, checkOfReg , addLevel, addXp,levelOfsender , xpOfsender ,checkOfRegM ,addkoinM , delkoinM , MoneyOfM,Rxp, addRxp ,addRep , delRep , repUser  } = require('./settings/Grupo/Js/reg.js')

// AÑADE SOLO ESTA LÍNEA DEBAJO:
const Eco = require('./settings/economy_system.js');

           // GAMES
const  { addClaim , checkClaim , timeClaim ,expiredClaim } = require('./Games/Js/claim.js')
const { checkCasino,checkAttp,checkEmoji,checkEve, addClaimTraga, checkClaimTraga, timeClaimTraga, checkRuleta,checkMinar,addCasino,addAttp,addEmoji,addEve,addRuleta ,addMinar,expiredCasino,expiredMinar,expiredAttp,expiredEmoji,expiredEve,expiredRuleta,timeAttp,timeEmoji,timeEve,timeRuleta,timeMinar,timeCasino,expiredDayli,JsonDayli,addDayli,timeDayli,checkDayli,checkPescar,timePescar,addPescar,expiredPescar}
 = require('./Games/Js/mining.js')


// ID del grupo donde se enviarán las felicitaciones (ej: '123456789-123456@g.us')
const NOTIFY_GROUP_ID = process.env.NOTIFY_GROUP_ID || '120363406737529728@g.us';


    // Menu bot js
const Menu = require ('./settings/Bot/Js/menu.js')

//configurar ggrupos
// Antispam por grupo
const antispamPath = './settings/Grupo/Json/antispam.json';
if (!fs.existsSync('./settings/Grupo/Json')) fs.mkdirSync('./settings/Grupo/Json', { recursive: true });
if (!fs.existsSync(antispamPath)) fs.writeFileSync(antispamPath, JSON.stringify([], null, 2));
let antispamList = JSON.parse(fs.readFileSync(antispamPath, 'utf8'));

// Estructura temporal en memoria para rastrear mensajes recientes por grupo/usuario
// { [groupJid]: { [userJid]: [{ id, type, key, contentHash, ts }] } }
const recentMsgs = {};

// Guardar antispam
function saveAntispam() {
  fs.writeFileSync(antispamPath, JSON.stringify(antispamList, null, 2));
}

// Util: hash simple para contenido (texto o tipo+id para media)
function contentHashOf(info) {
  try {
    // Texto
    const text = info.message?.conversation
      || info.message?.extendedTextMessage?.text
      || info.message?.imageMessage?.caption
      || info.message?.videoMessage?.caption
      || info.message?.stickerMessage?.fileSha256
      || '';
    // Para stickers/media preferimos fileSha256 si existe
    const mediaHash = info.message?.stickerMessage?.fileSha256
      || info.message?.imageMessage?.fileSha256
      || info.message?.videoMessage?.fileSha256
      || info.message?.audioMessage?.fileSha256
      || '';
    return (mediaHash && mediaHash.toString('base64')) || String(text).trim();
  } catch (e) {
    return '';
  }
}

const pathSettings = './settings/Grupo/Json';
if (!fs.existsSync(pathSettings)) fs.mkdirSync(pathSettings, { recursive: true });

//ingresos
const ingresosPath = `${pathSettings}/ingresos.json`;
if (!fs.existsSync(ingresosPath)) fs.writeFileSync(ingresosPath, JSON.stringify([], null, 2));

let ingresos = [];
function loadIngresos() {
  try { ingresos = JSON.parse(fs.readFileSync(ingresosPath, 'utf8') || '[]'); }
  catch (e) { ingresos = []; }
}
function saveIngresos() {
  try { fs.writeFileSync(ingresosPath, JSON.stringify(ingresos, null, 2)); }
  catch (e) { console.error('Error guardando ingresos.json', e); }
}
loadIngresos();

// Welcome
const welkomPath = `${pathSettings}/welkom.json`;
if (!fs.existsSync(welkomPath)) fs.writeFileSync(welkomPath, JSON.stringify([], null, 2));
let welkomList = [];
function loadWelkom() {
  try { welkomList = JSON.parse(fs.readFileSync(welkomPath, 'utf8') || '[]'); }
  catch (e) { welkomList = []; }
}
function saveWelkom() { fs.writeFileSync(welkomPath, JSON.stringify(welkomList, null, 2)); }
loadWelkom();

// Despedida (promote / remove)
const despedidaPath = `${pathSettings}/despedida.json`;
if (!fs.existsSync(despedidaPath)) fs.writeFileSync(despedidaPath, JSON.stringify([], null, 2));
let despedidaList = [];
function loadDespedida() {
  try { despedidaList = JSON.parse(fs.readFileSync(despedidaPath, 'utf8') || '[]'); }
  catch (e) { despedidaList = []; }
}
function saveDespedida() { fs.writeFileSync(despedidaPath, JSON.stringify(despedidaList, null, 2)); }
loadDespedida();

const antilink = JSON.parse(fs.readFileSync('./settings/Grupo/Json/antilink.json'))
const bngp = JSON.parse(fs.readFileSync('./settings/Grupo/Json/grupo.json'))
const Antipv = JSON.parse(fs.readFileSync('./settings/Grupo/Json/chat.json'))
const registro = JSON.parse(fs.readFileSync('./settings/Grupo/Json/registros.json'))
const Exportion = JSON.parse(fs.readFileSync('./Games/Json/exportion.json'))
const Exportion1 = JSON.parse(fs.readFileSync('./Games/Json/exportion1.json'))
const Cuestions = JSON.parse(fs.readFileSync('./Games/Json/cuestions.json'))


// Comandos ban persistente
const commandBanPath = './settings/Grupo/Json/commandban.json';
if (!fs.existsSync('./settings/Grupo/Json')) fs.mkdirSync('./settings/Grupo/Json', { recursive: true });
if (!fs.existsSync(commandBanPath)) fs.writeFileSync(commandBanPath, JSON.stringify([], null, 2));
let commandBanList = JSON.parse(fs.readFileSync(commandBanPath, 'utf8'));

function saveCommandBan() {
  fs.writeFileSync(commandBanPath, JSON.stringify(commandBanList, null, 2));
}

function loadCommandBan() {
  try {
    commandBanList = JSON.parse(fs.readFileSync(commandBanPath, 'utf8') || '[]');
  } catch (e) {
    commandBanList = [];
  }
}

// Lista de comandos que se desactivarán con el interruptor
const comandosParaApagar = [
    'perfil', 'elegirtrabajo', 'diario', 'trabajar', 'transferir', 
    'comer', 'casino', 'comprar', 'robar', 'curar', 'arrestar', 
    'casar', 'sticker', 'emojimix', 'tomp3', 'toimg', 'kiss', 'hug', 
    'poke', 'pat'
];

// Variable de estado (Inicia encendido por defecto)
let botApagado = true;


//------------------------------------------------
//------------------------------------------------

// Parsear dd/mm/yy o dd/mm/yyyy a Date (UTC midnight)
function parseDateDMY(str) {
  const parts = str.split('/');
  if (parts.length !== 3) return null;
  let [d, m, y] = parts.map(p => p.trim());
  if (y.length === 2) y = '20' + y; // 23 -> 2023
  const iso = `${y.padStart(4,'0')}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  const dt = new Date(iso + 'T00:00:00Z');
  return isNaN(dt.getTime()) ? null : dt;
}

// Diferencia en meses completos entre fechaInicio y ahora
function monthsBetween(startDate, now = new Date()) {
  const sy = startDate.getUTCFullYear(), sm = startDate.getUTCMonth();
  const ny = now.getUTCFullYear(), nm = now.getUTCMonth();
  const months = (ny - sy) * 12 + (nm - sm);
  // ajustar por día del mes: si el día actual es menor al día de inicio, restar 1
  if (now.getUTCDate() < startDate.getUTCDate()) return months - 1;
  return months;
}

// Formato legible dd/mm/yyyy
function formatDateDMY(date) {
  const d = String(date.getUTCDate()).padStart(2,'0');
  const m = String(date.getUTCMonth() + 1).padStart(2,'0');
  const y = String(date.getUTCFullYear());
  return `${d}/${m}/${y}`;
}

// Devuelve un texto relativo en español con dos componentes significativos
function timeAgoDetailedEnhanced(startDate, now = new Date()) {
  // normalizar a UTC
  const s = Math.floor((now.getTime() - startDate.getTime()) / 1000);
  if (s < 0) return 'en el futuro';

  if (s < 60) return s === 1 ? 'hace 1 segundo' : `hace ${s} segundos`;

  const m = Math.floor(s / 60);
  if (m < 60) return m === 1 ? 'hace 1 minuto' : `hace ${m} minutos`;

  const h = Math.floor(m / 60);
  if (h < 24) {
    const remM = m % 60;
    if (remM === 0) return h === 1 ? 'hace 1 hora' : `hace ${h} horas`;
    return `${h === 1 ? 'hace 1 hora' : `hace ${h} horas`} y ${remM === 1 ? '1 minuto' : `${remM} minutos`}`;
  }

  const daysTotal = Math.floor(h / 24);
  if (daysTotal < 7) {
    const remH = h % 24;
    if (remH === 0) return daysTotal === 1 ? 'hace 1 día' : `hace ${daysTotal} días`;
    return `${daysTotal === 1 ? 'hace 1 día' : `hace ${daysTotal} días`} y ${remH === 1 ? '1 hora' : `${remH} horas`}`;
  }

  // semanas y días
  if (daysTotal < 30) {
    const weeks = Math.floor(daysTotal / 7);
    const remDays = daysTotal % 7;
    if (remDays === 0) return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`;
    return `${weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`} y ${remDays === 1 ? '1 día' : `${remDays} días`}`;
  }

  // meses y días: calcular meses por componentes UTC para mayor precisión
  const sy = startDate.getUTCFullYear(), sm = startDate.getUTCMonth(), sd = startDate.getUTCDate();
  const ny = now.getUTCFullYear(), nm = now.getUTCMonth(), nd = now.getUTCDate();
  let months = (ny - sy) * 12 + (nm - sm);
  // ajustar por día del mes
  if (nd < sd) months -= 1;

  if (months < 12) {
    // calcular días residuales desde startDate + months
    const anchor = new Date(Date.UTC(sy, sm + months, sd, 0, 0, 0));
    let remDays = Math.floor((now.getTime() - anchor.getTime()) / (24 * 3600 * 1000));
    if (remDays < 0) remDays = 0;
    if (remDays === 0) return months === 1 ? 'hace 1 mes' : `hace ${months} meses`;
    return `${months === 1 ? 'hace 1 mes' : `hace ${months} meses`} y ${remDays === 1 ? '1 día' : `${remDays} días`}`;
  }

  // años y meses
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (remMonths === 0) return years === 1 ? 'hace 1 año' : `hace ${years} años`;
  return `${years === 1 ? 'hace 1 año' : `hace ${years} años`} y ${remMonths === 1 ? '1 mes' : `${remMonths} meses`}`;
}


//---------------------------------------------
//---------------------------------------------


// 𝚃𝙸𝙼𝙴
const moment = require("moment-timezone")
const time = moment.tz('America/Lima').format('DD/MM HH:mm:ss')
const horap = moment().format('HH')
var timeFt ='𝘽𝙪𝙚𝙣𝙖𝙨 🙋'
if (horap >= '01' && horap <= '05') {
  timeFt = '𝘽𝙪𝙚𝙣𝙤𝙨 𝙙𝙞𝙖𝙨 ✨'
} else if (horap >= '05' && horap <= '12') {
  timeFt = '𝘽𝙪𝙚𝙣𝙤𝙨 𝙙𝙞𝙖𝙨 ☀️'
} else if (horap >= '12' && horap <= '18') {
  timeFt = '𝘽𝙪𝙚𝙣𝙖𝙨 𝙩𝙖𝙧𝙙𝙚𝙨 ⛅'
} else if (horap >= '18' && horap <= '23') {
  timeFt = '𝙗𝙪𝙚𝙣𝙖𝙨 𝙣𝙤𝙘𝙝𝙚𝙨 🌑'
}



//Configuraciones

// Actividad últimos 7 días por grupo/usuario
const activityPath = './settings/Grupo/Json/activity7d.json';
if (!fs.existsSync(activityPath)) {
  fs.writeFileSync(activityPath, JSON.stringify({}, null, 2));
}
let activity7d = JSON.parse(fs.readFileSync(activityPath, 'utf8'));

// Utilidades de actividad
function saveActivity() {
  fs.writeFileSync(activityPath, JSON.stringify(activity7d, null, 2));
}

// Devuelve arreglo de las últimas 7 fechas YYYY-MM-DD (hoy incluido)
function last7DatesLima() {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    dates.push(moment.tz('America/Lima').subtract(i, 'days').format('YYYY-MM-DD'));
  }
  return dates.reverse(); // de más antigua a hoy
}

// Suma mensajes de un usuario en el grupo dentro de las últimas 7 fechas
function sumUser7d(groupJid, userJid) {
  const group = activity7d[groupJid];
  if (!group || !group[userJid] || !group[userJid].dates) return 0;
  const dates = last7DatesLima();
  return dates.reduce((acc, d) => acc + (group[userJid].dates[d] || 0), 0);
}

// Prune: deja solo las últimas 7 fechas por cada usuario en el grupo
function pruneGroup7d(groupJid) {
  const valid = new Set(last7DatesLima());
  const group = activity7d[groupJid] || {};
  for (const user of Object.keys(group)) {
    const map = group[user].dates || {};
    for (const d of Object.keys(map)) {
      if (!valid.has(d)) delete map[d];
    }
  }
}





var { creador, owner, Bot, JpgBot, API_KEY_NAUFRA } = require("./settings/settings.json");
const prefixo = ['.']// @ Prefijos



const pairingCode = true;

const useMobile = process.argv.includes("--mobile")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

function getGroupAdmins(participants) {
admins = []
for (let i of participants) {
if(i.admin == 'admin') admins.push(i.id)
if(i.admin == 'superadmin') admins.push(i.id)
}
return admins
}

async function startProo() {
  console.clear();
  console.log(banner.string);
  console.log(chalk.cyanBright("🔥 NaufraBot Base"));

  // Estado de sesión
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const msgRetryCounterCache = new NodeCache();

  // Crear socket
  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false, // Desactivado para no mostrar QR
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache,
    syncFullHistory: false,
  });
    

// intentar extraer id de comunidad desde la metadata

 
 

  // 🟢 Si no hay sesión registrada, generar el código de vinculación de 8 dígitos
  if (!sock.authState.creds.registered) {
    let number = await question(
      chalk.cyan("📱 Escribe tu número de WhatsApp con código de país (solo números): ")
    );
    rl.close();
    number = number.replace(/[^0-9]/g, "");

    if (!number) {
      console.log(chalk.red("❌ Número inválido."));
      process.exit(1);
    }

    console.log(chalk.yellow("⌛ Solicitando código de vinculación..."));
    try {
      const code = await sock.requestPairingCode(number);
      console.log(chalk.bgGreen.black("✅ CÓDIGO DE VINCULACIÓN:"), chalk.white(code));
    } catch (err) {
      console.error(chalk.red("❌ Error al generar código de vinculación:"), err.message);
      process.exit(1);
    }
  }

  // 🔄 Monitorear el estado de conexión
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log(chalk.red("❌ Sesión cerrada. Borra la carpeta 'session' y vuelve a emparejar."));
      } else {
        console.log(chalk.yellow("⚠️ Conexión cerrada, reconectando..."));
        startProo();
      }
    } else if (connection === "open") {
      console.log(chalk.greenBright("✅ Conectado exitosamente"));
      exec("rm -rf tmp && mkdir tmp");
    }
  });

  // Guardar credenciales cuando se actualicen
  sock.ev.on("creds.update", saveCreds);




// Bienvenida y despedida
sock.ev.on('group-participants.update', async (anu) => {
  try {
    // Normalizar id del grupo
    const groupId = anu.id || anu.groupId || anu.jid;
    if (!groupId) return;

    // Cargar listas en memoria (por si se modificaron externamente)
    loadWelkom();
    loadDespedida();

    // Obtener metadata solo si alguna lista requiere acción
    const needWelcome = Array.isArray(welkomList) && welkomList.includes(groupId);
    const needDespedida = Array.isArray(despedidaList) && despedidaList.includes(groupId);
    if (!needWelcome && !needDespedida) return;

    const metadata = (needWelcome || needDespedida) ? await sock.groupMetadata(groupId).catch(()=>({})) : {};
    const participants = anu.participants || [];

    // Si hay muchos participantes (p. ej. > 10) evitar spam: enviar mensaje único o limitar
    const BULK_THRESHOLD = 10;
    const bulk = participants.length > BULK_THRESHOLD;

    for (const participantJid of participants) {
      const jid = (typeof participantJid === 'string') ? participantJid : (participantJid.id || participantJid.jid || participantJid.user);
      if (!jid) continue;
      const num = jid.split('@')[0];
      const mention = jid;

      // Bienvenida: solo si el grupo tiene welcome activado y la acción es 'add'
      if (needWelcome && anu.action === 'add') {
        // Si es bulk, enviar un mensaje general y romper el loop
        if (bulk) {
          const text = `👋 Se han agregado varios miembros al grupo. ¡Bienvenidos!`;
          await sock.sendMessage(groupId, { text }).catch(err => console.error('Error welcome bulk:', err));
          break;
        }

        const sol = `
            ✦━─⌬༓༒༓⌬─━✦
𝖡𝗂𝖾𝗇𝗏𝖾𝗇𝗂𝖽@ 𝖺 *𝖶𝗂𝗇𝖽𝗌 𝖮𝖿 𝖤𝗍𝖾𝗋𝗇𝗂𝗍𝗒* ᡣ𐭩.ᐟ

⊹₊ ⋆𝖧𝗈𝗅𝖺𝖺 @${num.split('@')[0]}!!! ૮ • ﻌ - ა

ʚɞ ⁺˖ ⸝⸝𝖬𝗎𝖼𝗁𝖺𝗌 𝗀𝗋𝖺𝖼𝗂𝖺𝗌 𝗉𝗈𝗋 𝗍𝗎 𝗂𝗇𝗍𝖾𝗋𝖾𝗌 𝖾𝗇 𝖿𝗈𝗋𝗆𝖺𝗋 𝗉𝖺𝗋𝗍𝖾 𝖽𝖾 𝗇𝗎𝖾𝗌𝗍𝗋𝖺 𝖼𝗈𝗆𝗎𝗇𝗂𝖽𝖺𝖽!!₊˚⊹౨ৎ ₊˚⊹

𝖠𝗇𝗍𝖾𝗌 𝖽𝖾 𝗉𝗋𝖾𝗌𝖾𝗇𝗍𝖺𝗋𝗇𝗈𝗌 𝗒 𝗉𝗈𝖽𝖾𝗋 𝖽𝖺𝗋𝗍𝖾 𝗅𝖺 𝖻𝗂𝖾𝗇𝗏𝖾𝗇𝗂𝖽𝖺 𝖿𝗈𝗋𝗆𝖺𝗅𝗆𝖾𝗇𝗍𝖾, 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝖾 𝖾𝗌𝗍𝖺𝗌 5 𝗉𝗋𝖾𝗀𝗎𝗇𝗍𝖺𝗌 𝗊𝗎𝖾 𝗇𝗈𝗌 𝖺𝗒𝗎𝖽𝖺𝗋𝖺𝗇 𝖺 𝖼𝗈𝗇𝗈𝖼𝖾𝗋𝗍𝖾 𝗆𝖾𝗃𝗈𝗋 𝗒 𝖺𝗌𝖾𝗀𝗎𝗋𝖺𝗋𝗇𝗈𝗌 𝗊𝗎𝖾 𝖼𝗎𝗆𝗉𝗅𝖺𝗌 𝗅𝗈𝗌 𝗋𝖾𝗊𝗎𝗂𝗌𝗂𝗍𝗈𝗌 𝗉𝖺𝗋𝖺 𝖺𝗌𝗂 𝖽𝗂𝗌𝖿𝗋𝗎𝗍𝖺𝗋 𝗇𝗎𝖾𝗌𝗍𝗈 𝖾𝗇𝗍𝗈𝗋𝗇𝗈 𝗋𝖾𝗌𝗉𝖾𝗍𝗎𝗈𝗌𝗈 𝗒 𝖽𝗂𝗏𝖾𝗋𝗍𝗂𝖽𝗈!!𝅄  ׁ ˳꣑୧  ۠ ⭒



𝟣. N𝗈𝗆𝖻𝗋𝖾 𝗒 𝖾𝖽𝖺𝖽 ᡣ𐭩.ᐟ :
𝟤. A𝗉𝗈𝖽𝗈 𝖾n A𝗆𝗈𝗀 U𝗌 ᡣ𐭩.ᐟ :
𝟥. 𝖰𝗎𝗂𝖾𝗇 𝗍𝖾 𝗋𝖾𝖼𝗅𝗎𝗍𝗈? ᡣ𐭩.ᐟ :
𝟦. 𝖧𝖺𝗓 𝖿𝗈𝗋𝗆𝖺𝖽𝗈 𝗉𝖺𝗋𝗍𝖾 𝖽𝖾 𝖺𝗅𝗀𝗎𝗇𝖺 𝖼𝗈𝗆𝗎𝗇𝗂𝖽𝖺𝖽 𝖽𝖾 𝗃𝗎𝖾𝗀𝗈𝗌 𝖺𝗇𝗍𝖾𝗋𝗂𝗈𝗋𝗆𝖾𝗇𝗍𝖾? ᡣ𐭩.ᐟ :
𝟧. 𝖢𝗎𝖺𝗅 𝖾𝗌 𝗍𝗎 𝗇𝖺𝖼𝗂𝗈𝗇𝖺𝗅𝗂𝖽𝖺𝖽? ᡣ𐭩.ᐟ :

            ✦━─⌬༓༒༓⌬─━✦
`;
        await sock.sendMessage(groupId, {
          image: { url: "https://i.ibb.co/0RCGxWRC/Whats-App-Image-2025-11-24-at-8-22-03-PM.jpg" },
          caption: sol,
          mentions: [mention]
        }).catch(err => console.error('Error enviando welcome:', err));
      }

      // Despedida / Promote: si el grupo tiene despedida activada
      if (needDespedida) {
        // Promote
        if (anu.action === 'promote') {
          const promoted = jid;
          const promotedName = promoted.split('@')[0];
          const teks = `
          ✦━─┈༓༒༓┈─━✦

     *✧༺ 𝓝𝓾𝓮𝓿𝓸 𝓐𝓭𝓶𝓲𝓷 ༻✧*
🪪 *Nombre*: @${promotedName}
🌐 *Grupo*: ${metadata.subject}
💌 「 ¡Enhorabuena! 🎉 Has ascendido a la mesa de los admins en este grupo 」

         ✦━─┈༓༒༓┈─━✦
  `;
          await sock.sendMessage(groupId, {
            image: { url: "https://i.ibb.co/tTXykmgQ/Whats-App-Image-2025-11-27-at-5-45-28-PM.jpg" },
            caption: teks,
            mentions: [promoted]
          }).catch(err => console.error('Error enviando promote:', err));
        }

        // Remove (salida o expulsión)
        if (anu.action === 'remove') {
          // Si bulk, enviar mensaje general
          if (bulk) {
            const text = `👋 Varios miembros han salido o fueron expulsados.`;
            await sock.sendMessage(groupId, { text }).catch(err => console.error('Error bye bulk:', err));
            break;
          }
          const byeText = `👋 @${num} ha salido o fue expulsado del grupo.`;
          await sock.sendMessage(groupId, { text: byeText, mentions: [mention] }).catch(err => console.error('Error enviando bye:', err));
        }
      }
    }
  } catch (e) {
    console.log('Error en group-participants.update:', e);
  }


//------------------------------------

  try {
    const groupId = anu.id || anu.groupId || anu.jid;
    if (!groupId) return;
    const participants = anu.participants || [];
    // Solo manejar 'add' para registro automático
    if (anu.action !== 'add') return;

    loadIngresos(); // recargar por si cambió externamente

    for (const p of participants) {
      const jid = (typeof p === 'string') ? p : (p.id || p.jid || p.user);
      if (!jid) continue;

      // Si ya existe registro, no sobrescribir (pero podrías actualizar si quieres)
      const exists = ingresos.find(x => x.jid === jid);
      if (exists) continue;

      // Intentar obtener nombre del participante desde metadata o sock
      let name = jid.split('@')[0];
      try {
        // metadata del grupo para buscar pushName si disponible
        const meta = await sock.groupMetadata(groupId).catch(()=>({}));
        // no siempre está el nombre; usar pushName si lo tienes en info
      } catch (e) {}

      // Guardar fecha de ingreso = hoy (UTC)
      const today = new Date();
      const entry = {
        jid,
        name,
        joinedAt: today.toISOString(), // ISO
        congratulatedMonths: [] // meses ya felicitados (ej: [1,2,3])
      };
      ingresos.push(entry);
      saveIngresos();

      // Opcional: enviar mensaje de confirmación en el grupo (silencioso)
      // await sock.sendMessage(groupId, { text: `Registro: @${jid.split('@')[0]} ingresó y su fecha fue guardada.`, mentions: [jid] });
    }
  } catch (e) {
    console.error('ingreso handler error:', e);
  }
});




//------------------------------------

sock.ev.on('creds.update', saveCreds)
sock.ev.on("messages.upsert",  () => { })

sock.ev.on('messages.upsert', async m => {
  // Declaraciones únicas para evitar redeclaraciones
    let comando = '';
    let args = [];
    let q = '';
    let isCmd = false;
  

  try {
    const info = m.messages[0];
    if (!info || !info.message) return;
    if (info.key && info.key.remoteJid == "status@broadcast") return;

    // Tipo y contenido
    const altpdf = Object.keys(info.message || {});
    const type = altpdf[0] == "senderKeyDistributionMessage" ? (altpdf[1] == "messageContextInfo" ? altpdf[2] : altpdf[1]) : altpdf[0];
    const content = JSON.stringify(info.message || {});

    // Orígenes y textos
    const from = info.key.remoteJid;
    const body = (type === 'conversation') ? info.message.conversation
      : (type == 'imageMessage') ? info.message.imageMessage.caption
      : (type == 'videoMessage') ? info.message.videoMessage.caption
      : (type == 'extendedTextMessage') ? info.message.extendedTextMessage.text
      : (type == 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedButtonId
      : (type == 'listResponseMessage') ? info.message.listResponseMessage.singleSelectReply.selectedRowId
      : (type == 'templateButtonReplyMessage') ? info.message.templateButtonReplyMessage.selectedId
      : '';

    const budy = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : '';
    const pes = (type === 'conversation' && info.message.conversation) ? info.message.conversation
      : (type == 'imageMessage' && info.message.imageMessage.caption) ? info.message.imageMessage.caption
      : (type == 'videoMessage' && info.message.videoMessage.caption) ? info.message.videoMessage.caption
      : (type == 'extendedTextMessage' && info.message.extendedTextMessage.text) ? info.message.extendedTextMessage.text
      : '';

    // Validaciones tempranas
    if (!from) return;
    const isGroup = from.endsWith('@g.us');
    const sender = isGroup ? info.key.participant : from;
    if (!sender) return;
    const pushname = info.pushName || '';

    // Cargar metadatos solo si es grupo (catch para evitar crash)
    const groupMetadata = isGroup ? await sock.groupMetadata(from).catch(() => ({})) : {};
    const groupMembers = isGroup ? (groupMetadata.participants || []) : [];
    const groupAdmins = isGroup ? groupMembers.filter(p => p.admin) : [];


    // Booleanos claros (sin colisiones de nombres)
    const isSenderGroupAdmin = isGroup ? groupAdmins.some(admin => admin.id?.includes(sender)) : false;
    const isBot = info.key.fromMe ? true : false;
    const BotNumber = sock?.user?.id ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : '';
    const numerodono = [ `${owner}` ]; // ya definido arriba en tu archivo
    const isOwner = numerodono.includes(sender);

    // Texto seguro para comprobaciones
    const textToCheck = (
      info.message?.conversation ||
      info.message?.extendedTextMessage?.text ||
      info.message?.imageMessage?.caption ||
      info.message?.videoMessage?.caption ||
      ''
    ).toString();

    // ===== Incremento de actividad (últimos 7 días) =====
    try {
      if (isGroup /* && sender !== BotNumber */) {
        const today = moment.tz('America/Lima').format('YYYY-MM-DD');

        if (!activity7d[from]) activity7d[from] = {};
        if (!activity7d[from][sender]) activity7d[from][sender] = { dates: {} };

        const curr = activity7d[from][sender].dates[today] || 0;
        activity7d[from][sender].dates[today] = curr + 1;

        pruneGroup7d(from);
        saveActivity();
      }
    } catch (e) {
      console.log('Actividad7d error:', e.message);
    }

    // Helpers de warns (pegar fuera del switch)
    const warnsPath = './settings/Grupo/Json/warns.json';

    function loadWarns() {
      try {
        if (!fs.existsSync('./settings/Grupo/Json')) fs.mkdirSync('./settings/Grupo/Json', { recursive: true });
        if (!fs.existsSync(warnsPath)) fs.writeFileSync(warnsPath, JSON.stringify({ users: {} }, null, 2));
        return JSON.parse(fs.readFileSync(warnsPath, 'utf8') || '{}');
      } catch (e) {
        console.error('warns: error cargando archivo', e);
        return { users: {} };
      }
    }

    function saveWarns(data) {
      try { fs.writeFileSync(warnsPath, JSON.stringify(data, null, 2)); }
      catch (e) { console.error('warns: error guardando archivo', e); }
    }

    function addWarnToUser(userJid, groupId, reason, moderator) {
      const db = loadWarns();
      if (!db.users[userJid]) db.users[userJid] = { total: 0, records: [] };
      const rec = { group: groupId || 'unknown', reason: reason || 'Sin descripción', moderator: moderator || 'unknown', ts: Date.now() };
      db.users[userJid].records.push(rec);
      db.users[userJid].total = db.users[userJid].records.length;
      saveWarns(db);
      return db.users[userJid];
    }

    function removeWarnsFromUser(userJid, count) {
      const db = loadWarns();
      if (!db.users[userJid]) return { total: 0, records: [] };
      const removeCount = Math.max(0, Math.min(count, db.users[userJid].records.length));
      db.users[userJid].records.splice(-removeCount, removeCount);
      db.users[userJid].total = db.users[userJid].records.length;
      if (db.users[userJid].total === 0) delete db.users[userJid];
      saveWarns(db);
      return db.users[userJid] || { total: 0, records: [] };
    }

    function getUserWarns(userJid) {
      const db = loadWarns();
      return db.users[userJid] || { total: 0, records: [] };
    }

    function listAllWarns() {
      const db = loadWarns();
      return db.users || {};
    }

    function fmtTs(ts) {
      try { return moment(ts).tz('America/Lima').format('DD/MM/YYYY HH:mm'); }
      catch (e) { return new Date(ts).toLocaleString(); }
    }


    // ===== Antispam avanzado: stickers (consecutivos) y duplicados de mismo contenido =====
    try {
      // Configuración (ajusta según necesites)
      const SPAM_THRESHOLD = 3;         // cantidad de envíos para activar acción (> 3 -> elimina)
      const SPAM_WINDOW_MS = 60 * 1000; // ventana temporal en ms (ej. 60s)
      const MAX_HISTORY = 60;           // máximo de entradas a mantener por usuario (por grupo)

      // Inicializar estructuras globales
      if (!global.recentMsgs) global.recentMsgs = {};
      if (!global.lastMessageSenderPerGroup) global.lastMessageSenderPerGroup = {}; // { [groupJid]: lastSenderJid }
      if (!global._processingSpam) global._processingSpam = {};

      // Solo aplicar antispam en grupos y si está activado para el grupo
      const isAntispamActive = isGroup ? antispamList.includes(from) : false;
      if (!isGroup || !isAntispamActive) {
        // Actualizamos lastMessageSenderPerGroup para mantener coherencia (no ejecutar antispam)
        global.lastMessageSenderPerGroup[from] = sender;
      } else {
        // Exenciones configurables
        const EXCLUDE_ADMINS = false; // si true, no aplica a admins
        const EXCLUDE_OWNER = false;
        const EXCLUDE_BOT = true;

        // Ignorar reacciones
        if (info.message && (info.message.reactionMessage || Object.keys(info.message)[0] === 'reactionMessage')) {
          // no procesar reacciones
        } else {
          // Aplicar exenciones
          if (EXCLUDE_BOT && isBot) {
            // no aplicar al bot
          } else if (EXCLUDE_OWNER && isOwner) {
            // no aplicar al owner
          } else if (EXCLUDE_ADMINS && isSenderGroupAdmin) {
            // no aplicar a admins
          } else {
            const now = Date.now();
            const msgType = Object.keys(info.message || {})[0] || 'unknown';

            // Obtener hash/identificador del contenido (usa contentHashOf definida arriba)
            const contentHash = contentHashOf(info) || `${msgType}:${info.key.id}`;

            // Entrada a guardar
            const entry = {
              id: info.key.id,
              ts: now,
              type: msgType,
              hash: contentHash
            };

            // Inicializar historial por grupo/usuario
            if (!global.recentMsgs[from]) global.recentMsgs[from] = {};
            if (!global.recentMsgs[from][sender]) global.recentMsgs[from][sender] = [];

            // --- Lógica para contar solo mensajes consecutivos del mismo remitente ---
            // Si el último mensaje en el grupo fue de otra persona, reiniciamos el historial del remitente
            const lastSender = global.lastMessageSenderPerGroup[from];
            if (lastSender && lastSender !== sender) {
              // Reiniciar historial del sender: solo consideramos la entrada actual como inicio de secuencia
              global.recentMsgs[from][sender] = [entry];
            } else {
              // Mismo remitente consecutivo: añadimos la entrada
              global.recentMsgs[from][sender].push(entry);
              // Mantener solo las últimas MAX_HISTORY entradas
              if (global.recentMsgs[from][sender].length > MAX_HISTORY) {
                global.recentMsgs[from][sender].shift();
              }
            }

            // Actualizar último remitente del grupo
            global.lastMessageSenderPerGroup[from] = sender;

            // Filtrar por ventana temporal (solo para la secuencia actual del remitente)
            const recentWindow = global.recentMsgs[from][sender].filter(e => (now - e.ts) <= SPAM_WINDOW_MS);
            // Reemplazar por la lista filtrada para mantener solo la ventana activa
            global.recentMsgs[from][sender] = recentWindow;

            // 1) Caso stickers: contar solo stickers consecutivos del mismo remitente
            if (msgType === 'stickerMessage') {
              const stickerCount = recentWindow.filter(e => e.type === 'stickerMessage').length;
              if (stickerCount > SPAM_THRESHOLD) {
                const procKey = `${from}|${sender}|sticker`;
                if (!global._processingSpam[procKey]) {
                  global._processingSpam[procKey] = true;
                  try {
                    // Intentar eliminar los stickers registrados en recentWindow
                    for (const e of recentWindow.filter(e => e.type === 'stickerMessage')) {
                      try {
                        await sock.sendMessage(from, {
                          delete: { remoteJid: from, fromMe: false, id: e.id, participant: sender }
                        }).catch(()=>{});
                      } catch (err) { /* ignorar errores individuales */ }
                    }

                    // Vaciar historial del usuario en este grupo
                    global.recentMsgs[from][sender] = [];

                    // Aviso al grupo / usuario
                    try {
                      await sock.sendMessage(from, {
                        text: `⚠️ @${sender.split('@')[0]} Se detectó envío masivo de stickers consecutivos. Se eliminaron los stickers enviados recientemente. Por favor, evita enviar muchos stickers seguidos.`,
                        mentions: [sender]
                      }, { quoted: info }).catch(()=>{});
                    } catch (e) { /* ignorar */ }

                    // Notificar admins (opcional)
                    try {
                      const adminsToNotify = (groupMembers || []).filter(p => p.admin).map(p => p.id).filter(id => id !== BotNumber);
                      if (adminsToNotify.length > 0) {
                        const report = `🚨 *Antispam (stickers consecutivos)* — Grupo: *${groupMetadata?.subject || 'sin nombre'}*\nStickers eliminados: ${stickerCount}`;
                        await sock.sendMessage(from, { text: report, mentions: adminsToNotify }, { quoted: info }).catch(()=>{});
                      }
                    } catch (err) {
                      console.log('antispam-sticker - error notificando admins:', err);
                    }
                  } finally {
                    setTimeout(() => { delete global._processingSpam[procKey]; }, 1000);
                  }
                }
              }
            } else {
              // 2) Otros tipos (text, image, video, audio, document, etc.)
              // Contar cuántas veces aparece el mismo hash en la ventana (solo secuencia actual)
              const sameHashCount = recentWindow.filter(e => e.hash === contentHash).length;
              if (sameHashCount > SPAM_THRESHOLD) {
                const procKey = `${from}|${sender}|dup`;
                if (!global._processingSpam[procKey]) {
                  global._processingSpam[procKey] = true;
                  try {
                    // Eliminar solo los mensajes con el mismo hash
                    for (const e of recentWindow.filter(e => e.hash === contentHash)) {
                      try {
                        await sock.sendMessage(from, {
                          delete: { remoteJid: from, fromMe: false, id: e.id, participant: sender }
                        }).catch(()=>{});
                      } catch (err) { /* ignorar errores individuales */ }
                    }

                    // Remover entradas con ese hash del historial (mantener otras)
                    global.recentMsgs[from][sender] = global.recentMsgs[from][sender].filter(e => e.hash !== contentHash);

                    // Aviso al grupo / usuario
                    try {
                      await sock.sendMessage(from, {
                        text: `⚠️ @${sender.split('@')[0]} Se detectó envío repetido del mismo contenido. Se eliminaron los mensajes duplicados. Por favor, evita reenviar el mismo archivo/texto varias veces.`,
                        mentions: [sender]
                      }, { quoted: info }).catch(()=>{});
                    } catch (e) { /* ignorar */ }

                    // Notificar admins (opcional)
                    try {
                      const adminsToNotify = (groupMembers || []).filter(p => p.admin).map(p => p.id).filter(id => id !== BotNumber);
                      if (adminsToNotify.length > 0) {
                        const report = `🚨 *Antispam (duplicados)* — Usuario: @${sender.split('@')[0]}\nGrupo: *${groupMetadata?.subject || 'sin nombre'}*\nDuplicados eliminados: ${sameHashCount}`;
                        await sock.sendMessage(from, { text: report, mentions: adminsToNotify }, { quoted: info }).catch(()=>{});
                      }
                    } catch (err) {
                      console.log('antispam-dup - error notificando admins:', err);
                    }
                  } finally {
                    setTimeout(() => { delete global._processingSpam[procKey]; }, 1000);
                  }
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.log('antispam - error general:', err);
    }
        



    // ===== Antienlace: eliminar mensajes con links si está activo en el grupo =====
    try {
      const isAntiLink = isGroup ? antilink.includes(from) : false;
      if (isGroup && isAntiLink && !isOwner && !isBot) {
        // if (isSenderGroupAdmin) return; // descomenta si quieres excluir admins

        const linkRegex = /https?:\/\/\S+|www\.\S+|t\.me\/\S+|wa\.me\/\S+|youtu\.be\/\S+|youtube\.com\/\S+|bit\.ly\/\S+|tinyurl\.com\/\S+/i;

        if (linkRegex.test(textToCheck)) {
          try {
            await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender } }).catch(()=>{});
            await sock.sendMessage(from, { text: `🚫 Enlace detectado y eliminado. @${sender.split('@')[0]}`, mentions: [sender] }, { quoted: info }).catch(()=>{});
          } catch (err) {
            console.log('antienlace - error al eliminar o notificar:', err);
          }
          return;
        }
      }
    } catch (e) {
      console.log('antienlace - error general:', e);
    }



const groupName = isGroup ? groupMetadata.subject : ''
const groupDesc = isGroup ? groupMetadata.desc : ''
const nome = info.pushName ? info.pushName : ''
const Sadm = isGroup ? getGroupAdmins(groupAdmins) :''
const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
args = body.trim().split(/ +/).slice(1)
q = args.join(' ')
const text = args.join(' ')
isCmd = body.startsWith(prefixo)

// MULTIPREFIJO: detectar ".comando" en cualquier parte del texto
const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Asegurar que budy sea string
const rawBody = (typeof budy === 'string') ? budy : String(budy || '');

// Buscar la primera aparición de ".comando" (soporte Unicode)
let cmdMatch = null;
try {
  cmdMatch = rawBody.match(/(?:^|[\s\p{P}])\.([^\s.]+)/u);
} catch (e) {
  // Fallback si la engine no soporta \p{P}
  cmdMatch = rawBody.match(/(?:^|[\s\W])\.([^\s.]+)/);
}

let hasDotCommand = false;
let extracted = '';
if (cmdMatch && cmdMatch[1]) {
  hasDotCommand = true;
  extracted = String(cmdMatch[1]);
} else if (rawBody.startsWith('.')) {
  const after = rawBody.slice(1).trim();
  extracted = after.split(/\s+/)[0] || '';
  hasDotCommand = !!extracted;
}

// Valores temporales
let _dotCommand = '';
let _dotArgs = [];
let _dotQ = '';
let _isDotCmd = false;

if (hasDotCommand) {
  const cleaned = extracted.replace(/[^a-zA-Z0-9_\-áéíóúÁÉÍÓÚñÑüÜ]/g, '');
  _dotCommand = removeAccents(cleaned.toLowerCase());

  // Encontrar índice de la aparición y tomar lo que sigue
  let idx = -1;
  try {
    idx = rawBody.search(new RegExp(`(?:^|[\\s\\p{P}])\\.${extracted}`, 'u'));
  } catch (e) {
    idx = rawBody.search(new RegExp(`(?:^|[\\s\\W])\\.${extracted}`));
  }

  let rest = '';
  if (idx >= 0) {
    rest = rawBody.slice(idx).replace(new RegExp(`^\\.${extracted}`), '').trim();
  } else {
    rest = rawBody.split(/\s+/).slice(1).join(' ');
  }

  _dotArgs = rest ? rest.split(/ +/) : [];
  _dotQ = _dotArgs.join(' ');
  _isDotCmd = true;
}

// Asignar a las variables ya declaradas (no redeclarar)
comando = _dotCommand;
args.length = 0; args.push(..._dotArgs);
q = _dotQ;
isCmd = _isDotCmd;



// ----------------- Acciones con imágenes estáticas -----------------
const actionImageUrls = {
  hug: [
    'https://i.ibb.co/GfMGh61j/personajes-de-anime-de-disparo-medio-abrazandose.jpg',
    'https://i.ibb.co/v4xZ8M0y/vista-lateral-de-una-pareja-de-anime-abrazandose.jpg'
  ],
  kiss: [
    'https://i.ibb.co/PsvVGXcj/aniyuki-anime-kiss-image-72-1024x576.jpg',
    'https://i.ibb.co/RG9vFJKF/aniyuki-anime-kiss-image-31-1024x576.jpg'
  ],
  slap: [
    'https://i.ibb.co/BKSM7td0/top-10-anime-b-tch-slaps-v0-9eweefs8yoyc1.png',
    'https://i.ibb.co/N21S3byV/top-10-anime-b-tch-slaps-v0-zs3grdnzeo4d1.png'
  ],
  pat: [
    'https://i.ibb.co/bg17RgSt/hi02ge18phh21.png',
    'https://i.ibb.co/hRbh1N0k/headpat-itsuki-v0-u4sr59extynd1.png'
  ],
  poke: [
    'https://i.ibb.co/HDYqNBn1/Quienes-son-los-personajes-principales-de-May-I-Asked-You-for-one-Final-Thing-Es-un-isekai-3-1024x57.png'
  ]
};

if (['hug','kiss','slap','pat','poke'].includes(comando)) {
  try {
    const action = comando;

    // Determinar objetivo robustamente (reply, mentions, args)
    let targetJid = null;
    targetJid = info.message?.extendedTextMessage?.contextInfo?.participant
             || info.quoted?.key?.participant
             || null;

    const mentioned = info.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (!targetJid && mentioned.length) targetJid = mentioned[0];

    if (!targetJid && args.length) {
      const maybe = args[0];
      targetJid = maybe.includes('@') ? maybe : `${maybe}@s.whatsapp.net`;
    }

    if (!targetJid) return enviar('Menciona a alguien o responde su mensaje para usar este comando.');

    const actorNum = sender.split('@')[0];
    const targetNum = targetJid.split('@')[0];
    // Mapa acción -> frase en español (gerundio / natural)
    const actionTexts = {
        hug: 'está abrazando a',
        kiss: 'está besando a',
        slap: 'está abofeteando a',
        pat: 'está acariciando a',
        poke: 'está tocando a'
    };

    // Frases cuando el actor se aplica la acción a sí mismo
    const selfTexts = {
        hug: 'se está abrazando',
        kiss: 'se está dando un beso',
        slap: 'se está abofeteando',
        pat: 'se está acariciando',
        poke: 'se está tocando'
    };

    let caption = '';
    if (sender === targetJid) {
    // acción hacia sí mismo
        caption = selfTexts[action] ? `@${actorNum} ${selfTexts[action]}` : `@${actorNum} ${actionTexts[action] || action}`;
    } else {
    const actionText = actionTexts[action] || `está ${action}`;
    caption = `@${actorNum} ${actionText} @${targetNum}`;
    }


    // Elegir imagen aleatoria
    const urls = actionImageUrls[action] || [];
    if (!urls.length) return enviar('No hay imágenes configuradas para esta acción.');
    const imgUrl = urls[Math.floor(Math.random() * urls.length)];

    // Intento: enviar como imagen
    try {
      await sock.sendMessage(from, {
        image: { url: imgUrl },
        caption,
        mentions: [sender, targetJid]
      }, { quoted: info });
      return;
    } catch (errImage) {
      console.warn('Envio como image falló:', errImage?.message || errImage);
    }

    // Fallback: enviar como documento si image falla
    try {
      await sock.sendMessage(from, {
        document: { url: imgUrl },
        mimetype: 'application/octet-stream',
        fileName: `${action}.jpg`,
        caption,
        mentions: [sender, targetJid]
      }, { quoted: info });
      return;
    } catch (errDoc) {
      console.error('Envio como document falló:', errDoc?.message || errDoc);
      return enviar('No pude enviar la imagen. Intenta de nuevo más tarde.');
    }

  } catch (err) {
    console.error('action image error:', err);
    enviar('Ocurrió un error procesando la acción.');
  }
}
// --------------------------------------------------------




  // MULTIPREFIJO
const mentions = (teks, memberr, id) => {
(id == null || id == undefined || id == false) ? sock.sendMessage(from, {text: teks.trim(), mentions: memberr}) : sock.sendMessage(from, {text: teks.trim(), mentions: memberr})}
const quoted = info.quoted ? info.quoted : info
const mime = (quoted.info || quoted).Mimetype || ""
const sleep = async (ms) => {return new Promise(resolve => setTimeout(resolve, ms))}
const senderNumber = sender.split("@")[0]


const isBotGroupAdmins = esAdminFlexible(sock, groupAdmins.map(p => p.id));

function esAdminFlexible(sock, listaDeAdmins = []) {
  if (!sock?.authState?.creds?.me) return false;

  const botId = sock.authState.creds.me.id;   // ej: 51916525000:26@lid
  const botLid = sock.authState.creds.me.lid; // ej: 51916525000@lid

  const clean = (jid) => jid?.split(':')[0]; // elimina el ":26" si existe

  return listaDeAdmins.some(adminJid => {
    const adminBase = clean(adminJid);
    return (
      adminJid === botId ||
      adminJid === botLid ||
      adminJid === botId.replace(/:\d+/, '') || // compara sin ":xx"
      adminJid === botLid.replace(/:\d+/, '') ||
      adminBase === clean(botId) ||
      adminBase === clean(botLid)
    );
  });
}

const isUrl = (url) => { return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi')) }
const deviceType = info.key.id.length > 21 ? 'Android' : info.key.id.substring(0, 2) == '3A' ? 'IPhone' : 'WhatsApp web'
const options = { timeZone: 'America/Lima', hour12: false }
const data = new Date().toLocaleDateString('PE', { ...options, day: '2-digit', month: '2-digit', year: '2-digit' })
const hora = new Date().toLocaleTimeString('PE', options)

           // Constantes if nuevas
const iswelkom = isGroup ? (Array.isArray(welkomList) && welkomList.includes(from)) : false;
const isBanGp = isGroup ? bngp.includes(from) : false
const isAntipv = Antipv.includes('activo')
const isReg = checkOfReg(sender)
const coins = MoneyOfSender(sender)

 // 🟢 Sistema de encendido/apagado global del bot

const estadoPath = './settings/estadoBot.json'


if (!fs.existsSync(estadoPath)) {
  fs.writeFileSync(estadoPath, JSON.stringify({ activo: true }, null, 2))
}
let botActivo = JSON.parse(fs.readFileSync(estadoPath)).activo
function guardarEstadoBot(estado) {
  fs.writeFileSync(estadoPath, JSON.stringify({ activo: estado }, null, 2))
  botActivo = estado
}

//

//MODO ADMIN

const modoAdminPath = './settings/Grupo/Json/modo_admin.json';
const modoAdminList = fs.existsSync(modoAdminPath) ? JSON.parse(fs.readFileSync(modoAdminPath)) : [];
const isModoAdmin = isGroup ? modoAdminList.includes(from) : false;
const adminCommands = [
  'welcome','antienlace','antispam','modoadmin','todos','anuncio','ban',
  'antiprivado','listreg', 'bangp','boton','botoff','reiniciar',
  'topactivos','topinactivos','warn','warns','comandosban',
  'cerrarchat', 'despedida', 'apagarbot'    
];

// --- Control global de permisos para comandos admin
if (adminCommands.includes(comando)) {
  if (isModoAdmin) {
    // Modo admin activado: solo admins/owner pueden ejecutar comandos admin
    if (!isSenderGroupAdmin && !isOwner) {
      return enviar("🚫 Este comando solo puede ser usado por administradores mientras el modo admin está activo.");
    }
  }
  // Si modo admin está desactivado: cualquiera puede usar los comandos admin
}

 //Funciones nuevas
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
function DLT_FL(file) {
        try {
            fs.unlinkSync(file);
        } catch (error) {
            return;
        }
    }

 function enviar(texto) {
  sock.sendMessage(from, { text: texto }, { quoted: info });
}

 //rangos
const rangos = JSON.parse(fs.readFileSync('./settings/rangos.json'))
const YouN = levelOfsender(sender)
const Mlevel = rangos[YouN] || '🎖️𝐒𝐢𝐧 𝐑𝐚𝐧𝐠𝐨🎖️'





 const Rrxp = Rxp(sender)
 const Crxp = xpOfsender(sender)
 var Mrxp ;
 if(Crxp <= Rrxp + 50){
 var Mrxp = '*▒▒▒▒▒▒▒▒▒▒ 0%*'
 }else if(Crxp <= Rrxp + 100){
 var Mrxp = '*█▒▒▒▒▒▒▒▒▒ 10%*'
 }else if(Crxp <= Rrxp + 200){
 var Mrxp = '*██▒▒▒▒▒▒▒▒ 20%*'
 }else if(Crxp <= Rrxp + 300){
 var Mrxp = '*███▒▒▒▒▒▒▒ 30%*'
 } else if(Crxp <= Rrxp + 400){
 var Mrxp = '*████▒▒▒▒▒▒ 40%*'
 }else if(Crxp <= Rrxp + 500){
 var Mrxp = '*█████▒▒▒▒▒ 50%*'
 }else if(Crxp <= Rrxp + 600){
 var Mrxp = '*██████▒▒▒▒ 60%*'
 }else if(Crxp <= Rrxp + 700){
 var Mrxp = '*███████▒▒▒ 70%*'
 }else if(Crxp <= Rrxp + 800){
 var Mrxp = '*████████▒▒ 80%*'
 }else if(Crxp <= Rrxp + 999){
 var Mrxp = '*█████████▒ 90%*'
 } else if(Crxp >= Rrxp + 1000){
 var Mrxp = '*██████████ 100%*'
 }

             // 𝙽iveles
 // Constantes if
 const isImage = type == "imageMessage"
const isVideo = type == "videoMessage"
const isAudio = type == "audioMessage"
const isSticker = type == "stickerMessage"
const isContact = type == "contactMessage"
const isLocation = type == "locationMessage"
const isProduct = type == "productMessage"
const isMedia = (type === "imageMessage" || type === "videoMessage" || type === "audioMessage")
typeMessage = body.substr(0, 50).replace(/\n/g, "")
if (isImage) typeMessage = "Image"
else if (isVideo) typeMessage = "Video"
else if (isAudio) typeMessage = "Audio"
else if (isSticker) typeMessage = "Sticker"
else if (isContact) typeMessage = "Contact"
else if (isLocation) typeMessage = "Location"
else if (isProduct) typeMessage = "Product"
const isQuotedMsg = type === "extendedTextMessage" && content.includes("textMessage")
const isQuotedImage = type === "extendedTextMessage" && content.includes("imageMessage")
const isQuotedVideo = type === "extendedTextMessage" && content.includes("videoMessage")
const isQuotedDocument = type === "extendedTextMessage" && content.includes("documentMessage")
const isQuotedAudio = type === "extendedTextMessage" && content.includes("audioMessage")
const isQuotedSticker = type === "extendedTextMessage" && content.includes("stickerMessage")
const isQuotedContact = type === "extendedTextMessage" && content.includes("contactMessage")
const isQuotedLocation = type === "extendedTextMessage" && content.includes("locationMessage")
const isQuotedProduct = type === "extendedTextMessage" && content.includes("productMessage")


const getFileBuffer = async (mediakey, MediaType) => {
const stream = await downloadContentFromMessage(mediakey, MediaType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]) }
return buffer}



//funcion para mencionar

const obtenerMencionado = (info) => {
    const context = info.message?.extendedTextMessage?.contextInfo
        || info.message?.contextInfo
        || null;

    if (context?.mentionedJid && context.mentionedJid.length > 0) {
        return context.mentionedJid[0];
    }

    if (context?.participant) {
        return context.participant;
    }

    return null;
};

     //  Time
const runtime = function(seconds) {
    seconds = Number(seconds);
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60); // Utilizando Math.floor() para asegurar que los segundos sean enteros
    const parts = [];
    if (days > 0) {
        parts.push(days + (days === 1 ? " 𝙳𝙸𝙰" : " 𝙳𝙸𝙰𝚂"));
    }
    if (hours > 0) {
        parts.push(hours + (hours === 1 ? " 𝙷𝙾𝚁𝙰" : " 𝙷𝙾𝚁𝙰𝚂"));
    }
    if (minutes > 0) {
        parts.push(minutes + (minutes === 1 ? "  𝙼𝙸𝙽𝚄𝚃𝙾" : " 𝙼𝙸𝙽𝚄𝚃𝙾𝚂"));
    }
   if (remainingSeconds > 0) {
    parts.push(remainingSeconds + (remainingSeconds === 1 ? " 𝚂𝙴𝙶𝚄𝙽𝙳𝙾" : " 𝚂𝙴𝙶𝚄𝙽𝙳𝙾𝚂"));
    }
    return parts.join(', ');
}

  // Respuesta
     const respuesta = {
  admin: "『 🚫 No eres *Admin* 』",
  botadmin: "『 ⚠️ E𝒍 𝒃𝒐𝒕 𝒅𝒆𝒃𝒆 𝒕𝒆𝒏𝒆𝒓 𝒑𝒆𝒓𝒎𝒊𝒔𝒐 𝒅𝒆 𝒂𝒅𝒎𝒊𝒏 』",
  grupos: "『 💬 C𝒐𝒎𝒂𝒏𝒅𝒐 𝒅𝒊𝒔𝒑𝒐𝒏𝒊𝒃𝒍𝒆 𝒔𝒐𝒍𝒐 𝒆𝒏 𝒈𝒓𝒖𝒑𝒐𝒔 』",
  vacio: "『 ❓ E𝒔𝒄𝒓𝒊𝒃𝒆 𝒂𝒍𝒈𝒐, 𝒏𝒐 𝒑𝒖𝒆𝒅𝒐 𝒂𝒅𝒊𝒗𝒊𝒏𝒂𝒓 』",
  miowner: "『 ⛔ No eres *Link* 』",

  registro: `
╔════◇          ◆             ◇════╗
💬 ❝ 𝑷𝒓𝒊𝒎𝒆𝒓𝒐 𝒅𝒆𝒃𝒆𝒔 𝒓𝒆𝒈𝒊𝒔𝒕𝒓𝒂𝒓𝒕𝒆 🤔 ¡𝑬𝒔 𝒇𝒂𝒄𝒊𝒍! 😄 ❞
💬 ❝ 𝑬𝒔𝒄𝒓𝒊𝒃𝒆:  .𝒓𝒆𝒈 ❞
╚════◇          ◆             ◇════╝
`,

  yaregistro: `
╔══════◇◆◇══════╗
 𝑳𝒐 𝒍𝒂𝒎𝒆𝒏𝒕𝒐, 𝒚𝒂 𝒆𝒔𝒕𝒂́𝒔 𝒓𝒆𝒈𝒊𝒔𝒕𝒓𝒂𝒅𝒐 🗒
╚══════◇◆◇══════╝
`,

  coins: `『 💰 ᴄᴏɪɴs ɪɴsᴜғɪᴄɪᴇɴᴛᴇs @${sender.split('@')[0]} 』`
}


   // Verificados
 const SvnC = {key : {participant : '0@s.whatsapp.net'},message : {contactMessage : {displayName : `${pushname}`}}};

  // Funciones para crear códigos de 6 Digitos

  function generarCodigo() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres.charAt(indice);
    }
    return codigo;
}

 // MENSAJES EN CONSOLA
/*
// comando pv
if (!isGroup && isCmd) console.log( '\n  ╔─━━━━ ', color(' 𝗖𝗠𝗗 「 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 」','blue'), '━━━━─╗','\n',
color(' GRUPO :','lime'),color(groupName,'cyan'),'\n',
color(' NOMBRE :','lime'),color(pushname,'cyan'),'\n',
color(' COMANDO :','lime'),color(comando,'cyan'),'\n',
color(' HORA :','lime'),color(hora,'cyan'),'\n',
color(' DATOS :','lime'),color(data,'cyan'),'\n',color(' ╚─━━━━━━ '),color ('𝗘𝗹𝗶𝘀𝘃𝗮𝗻 | 𝗥𝘆𝘂𝗸','red'), '━━━━━─╝')

//pv
if (!isCmd && !isGroup) console.log( '\n  ╔─━━━━━', color(' 𝗖𝗛𝗔𝗧 「 𝗕𝗢𝗧 」','blue'), '━━━━━─╗','\n',
color(' GRUPO :','lime'),color(groupName,'cyan'),'\n',
color(' NOMBRE :','lime'),color(pushname,'cyan'),'\n',
color(' MENSAJE :','lime'),color(budy,'cyan'),'\n',
color(' HORA :','lime'),color(hora,'cyan'),'\n',
color(' DATOS :','lime'),color(data,'cyan'),'\n',color(' ╚─━━━━━━━━ '),color ('【✔】 ','red'), '━━━━━━━━━─╝')

//comando grupo
if (isCmd && isGroup) console.log( '\n  ╔─━━━ ', color('  𝗖𝗠𝗗「 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 」','blue'), '━━━─╗','\n',
color(' GRUPO :','lime'),color(groupName,'cyan'),'\n',
color(' NOMBRE :','lime'),color(pushname,'cyan'),'\n',
color(' COMANDO :','lime'),color(comando,'cyan'),'\n',
color(' HORA :','lime'),color(hora,'cyan'),'\n',
color(' DATOS :','lime'),color(data,'cyan'),'\n',color(' ╚─━━━━━━ '),color ('𝗘𝗹𝗶𝘀𝘃𝗮𝗻 | 𝗥𝘆𝘂𝗸','red'), '━━━━━─╝')

//mensaje grupo
if (!isCmd && isGroup) console.log( '\n  ╔─━━━━━', color(' 𝗖𝗛𝗔𝗧「 𝗕𝗢𝗧 」','blue'), '━━━━━─╗','\n',
color(' GRUPO :','lime'),color(groupName,'cyan'),'\n',
color(' NOMBRE :','lime'),color(pushname,'cyan'),'\n',
color(' MENSAJE :','lime'),color(budy,'cyan'),'\n',
color(' HORA :','lime'),color(hora,'cyan'),'\n',
color(' DATOS :','lime'),color(data,'cyan'),'\n',color(' ╚─━━━━━━━━━ '),color ('【✔】 ','red'), '━━━━━━━━━─╝')
*/

   expiredClaim();
 expiredMinar()
expiredAttp()
expiredEmoji()
expiredEve()
expiredDayli()
expiredPescar()
expiredRuleta()
//ban grupo
if(isBanGp) {
return
}
      // antiprivado
if(isAntipv && !isGroup && !isOwner){
sock.updateBlockStatus(sender, 'block')
}

// Recargar lista por si fue modificada externamente
loadCommandBan();

// Si es comando y el remitente está baneado de usar comandos, bloquearlo
if (isCmd && commandBanList.includes(sender)) {
  // Opcional: notificar al usuario que está baneado de comandos
  await sock.sendMessage(from, { text: `🚫 @${sender.split('@')[0]} no tienes permiso para usar comandos.` , mentions: [sender] }, { quoted: info }).catch(()=>{});
  return; // detener procesamiento de este mensaje
}

// --- FILTRO DE COMANDOS APAGADOS (FUERA DEL SWITCH) ---
if (botApagado && comandosParaApagar.includes(comando) && !isOwner) {
    return enviar("⚠️ *MANTENIMIENTO*\n\nEste comando está desactivado temporalmente.");
}

// INICIO DE COMANDOS
//solo funciona si está activado el bot
if (!botActivo && !isOwner) return

switch(comando) {

case 'apagarbot': {
    if (!isOwner) return enviar(respuesta.miowner);
    if (!args[0]) return enviar("⚠️ Usa .apagarbot 1 para apagar o .apagarbot 0 para encender.");

    if (args[0] === '1') {
        botApagado = true;
        enviar("🚫 Comandos desactivados con éxito.");
    } else if (args[0] === '0') {
        botApagado = false;
        enviar("✅ Comandos activados con éxito.");
    }
    break;
}

// ----------------------------------


// --- NUEVOS COMANDOS DE ECONOMÍA ---

case 'perfil': {
    const user = Eco.getUser(sender);
    
    // Crear barra de salud visual
    const hp = user.health;
    const barLength = 10;
    const filled = Math.round((hp / 100) * barLength);
    const hpBar = '🟩'.repeat(Math.max(0, Math.floor(user.health / 10))) + '⬛'.repeat(Math.max(0, 10 - Math.floor(user.health / 10)))

    const perfilTexto = `
╭─── 👤 *MI PERFIL* ───
│ 👤 *Usuario:* @${sender.split('@')[0]}
│ 💼 *Trabajo:* ${user.job || "Desempleado (Usa .elegirtrabajo)"}
│ 💰 *Woens:* ${user.woens} 
│ ⭐ *Nivel XP:* ${user.xp}
│
│ ❤️ *Salud:* ${hp}% 
│ ${hpBar}
│
│ 🏠 *Propiedades:* │ ${user.properties.length > 0 ? user.properties.join(', ') : "Sin techo"}
╰─────────────────────`;

    await sock.sendMessage(from, { 
        text: perfilTexto, 
        mentions: [sender] 
    }, { quoted: info });
}
break;

case 'elegirtrabajo': {
    const jobInput = args[0] ? args[0].toLowerCase() : null;

    if (!jobInput) {
        // Mensaje con la lista actualizada
        return enviar(`  🛠️ *CENTRO DE EMPLEO* 🛠️\n\n_Puedes cambiar de empleo cuando quieras, pero asegúrate de tener la XP necesaria._ \n\n` +
            `⛏️ *Minero*: (0 XP)\n` +
            `🎣 *Pescador*: (0 XP)\n` +
            `🪓 *Leñador*: (0 XP)\n` +
            `🧱 *Albañil*: (20 XP) - _Riesgo de accidentes_\n` +
            `👮‍♂️ *Policia*: (100 XP) - _Riesgo de tiroteos / Puede usar .arrestar_\n` +
            `🎤 *Periodista*: (200 XP) - _Paga ALTA / Riesgo 50%_\n` +
            `👨‍⚕️ *Doctor*: (250 XP) - _Puede usar .curar_\n\n` +
            `*Uso:* .elegirtrabajo minero`);
    }

    // Llamamos a la función del sistema de economía
    const result = Eco.setJob(sender, jobInput);
    enviar(result.msg);
    break;
}

case 'diario': {
    const res = Eco.claimDaily(sender);
    if (!res.status) {
        const hours = Math.floor(res.time / (1000 * 60 * 60));
        const mins = Math.floor((res.time % (1000 * 60 * 60)) / (1000 * 60));
        return enviar(`⏳ Vuelve en ${hours}h ${mins}m.`);
    }
    enviar(`🎁 Recibiste ${res.reward} Woens.`);
}
break;

case 'trabajar': {
    if (!isGroup) return enviar("Este comando solo funciona en grupos.");
    const res = Eco.work(sender);
    // Simplemente enviamos el mensaje que devuelve el sistema, ya sea éxito o error de tiempo
    enviar(res.msg);
}
break;

case 'transferir': {
    // Usamos 'info' en lugar de 'm' y añadimos '?' para evitar errores si no hay mención
    const ment = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] 
                 || info.message?.extendedTextMessage?.contextInfo?.participant 
                 || null;
                 
    const monto = parseInt(args[1]);

    if (!ment) return enviar("👤 Debes mencionar a alguien para transferirle Woens.\n\nUso: .transferir @usuario 500");
    if (isNaN(monto) || monto <= 0) return enviar("💰 Indica una cantidad válida de Woens.");

    const result = Eco.transfer(sender, ment, monto);
    enviar(result, { mentions: [ment, sender] });
}
break;  

case 'comer': {
    const foodType = args[0];
    const result = Eco.eat(sender, foodType);
    enviar(result.msg);
}
break;

case 'casino': {
    const bet = args[0];
    if (!bet) return enviar("🎰 Uso: .casino <cantidad>");
    const result = Eco.casino(sender, bet);
    enviar(result.msg);
}
break;

case 'comprar': {
    const item = args[0];
    if (!item) return enviar(`
🏠 *INMOBILIARIA* 🏠

🔸 *Choza* (5,000 Woens) - Refugio
🔸 *Casa* (50,000 Woens) - Recuperación total
🔸 *Edificio* (500,000 Woens) - Renta Pasiva

Uso: .comprar casa`);
    
    const result = Eco.buyProperty(sender, item);
    enviar(result.msg);
}
break;

case 'robar': {
    const victim = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || null;
    if (!victim) return enviar("🥷 Menciona a quién quieres robar.");
    if (victim === sender) return enviar("❓ No puedes robarte a ti mismo.");

    const result = Eco.rob(sender, victim);
    enviar(result.msg, { mentions: result.mentions || [] });
}
break;

case 'curar': {
    // Verificar si se mencionó a alguien
    let victim = m.quoted ? m.quoted.sender : (args[0] ? args[0].replace('@', '') + '@s.whatsapp.net' : null);
    if (!victim) return enviar("⚠️ Menciona a alguien para curar.");
    
    const result = Eco.heal(sender, victim);
    enviar(result.msg, { mentions: result.mentions || [] });
    break;
}

case 'arrestar': {
    let criminal = m.quoted ? m.quoted.sender : (args[0] ? args[0].replace('@', '') + '@s.whatsapp.net' : null);
    if (!criminal) return enviar("⚠️ Menciona al criminal que deseas arrestar.");
    
    const result = Eco.arrest(sender, criminal);
    enviar(result.msg, { mentions: result.mentions || [] });
    break;
}

// --- FIN COMANDOS ECONOMÍA ---

case 'ingreso': {
  const sub = args[0] ? args[0].toString().trim() : '';
  loadIngresos();

  // Determinar target: reply -> participant, mentions -> first mention, sino el autor
  let targetJid = null;
  try {
    const ctx = info.message?.extendedTextMessage?.contextInfo;
    if (ctx && ctx.participant) targetJid = ctx.participant;
  } catch (e) {}
  if (!targetJid) {
    const mentions = info.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentions.length > 0) targetJid = mentions[0];
  }
  if (!targetJid) targetJid = sender;

  // Obtener o inicializar pushName de forma segura
  let pushName = '';
  try {
    // 1) Nombre del mensaje actual (autor del mensaje)
    if (info.pushName) pushName = info.pushName;

    // 2) Si es reply, intentar extraer nombre del mensaje citado (si existe)
    const quoted = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!pushName && quoted) {
      // algunos mensajes incluyen senderName en quotedMessage
      pushName = info.message.extendedTextMessage.contextInfo.quotedMessage.senderName || '';
    }

    // 3) Intentar obtener nombre desde la sesión/contacts (fallback a getName si tu versión lo soporta)
    if (!pushName && typeof sock.getName === 'function') {
      const nameObj = await sock.getName(targetJid).catch(()=>null);
      if (nameObj) {
        // getName puede devolver string o objeto { name: '...' }
        pushName = (typeof nameObj === 'string') ? nameObj : (nameObj.name || '');
      }
    }
  } catch (e) {
    // no hacer nada, usaremos fallback abajo
  }
  // 4) Fallback final: usar parte del JID
  if (!pushName) pushName = targetJid.split('@')[0];

  // Buscar registro existente
  let record = ingresos.find(x => x.jid === targetJid);

  // Si no se pasa fecha: mostrar fecha si existe
  if (!sub) {
    if (!record) {
      await sock.sendMessage(from, {
        text: `No tengo registrada la fecha de ingreso de @${targetJid.split('@')[0]}. Usa: .ingreso DD/MM/AA para registrarla.`,
        mentions: [targetJid]
      }, { quoted: info }).catch(()=>{});
    } else {
      const joined = new Date(record.joinedAt);
      const relative = timeAgoDetailedEnhanced(joined, new Date());
      const text = `📌 @${targetJid.split('@')[0]} ingresó el ${formatDateDMY(joined)} (${relative}).`;
      await sock.sendMessage(from, { text, mentions: [targetJid] }, { quoted: info }).catch(()=>{});

    }
    break;
  }

  // Si se pasa fecha: intentar parsear y guardar
  const parsed = parseDateDMY(sub);
  if (!parsed) {
    await sock.sendMessage(from, { text: 'Formato inválido. Usa DD/MM/AA o DD/MM/AAAA. Ej: .ingreso 01/02/23' }, { quoted: info }).catch(()=>{});
    break;
  }

  // Guardar o actualizar registro (usando pushName seguro)
  if (!record) {
    record = {
      jid: targetJid,
      name: pushName,
      joinedAt: parsed.toISOString(),
      congratulatedMonths: []
    };
    ingresos.push(record);
  } else {
    record.joinedAt = parsed.toISOString();
    // opcional: record.congratulatedMonths = [];
  }
  saveIngresos();

  await sock.sendMessage(from, {
    text: `✅ Fecha de ingreso guardada para @${targetJid.split('@')[0]}: ${formatDateDMY(parsed)}`,
    mentions: [targetJid]
  }, { quoted: info }).catch(()=>{});
  break;
}



case 'cerrarchat': {
  // args debe estar definido (por ejemplo args = body.trim().split(/\s+/).slice(1))
  const sub = args[0] ? args[0].toString().trim() : '';
  if (!isGroup) {
    await sock.sendMessage(from, { text: 'Este comando solo funciona en grupos.' }, { quoted: info }).catch(()=>{});
    break;
  }
  if (!isSenderGroupAdmin && !isOwner) {
    await sock.sendMessage(from, { text: 'Solo administradores pueden usar este comando.' }, { quoted: info }).catch(()=>{});
    break;
  }

  // sub === '1' -> cerrar (solo admins pueden enviar)
  // sub === '0' -> abrir (todos pueden enviar)
  try {
    if (sub === '1') {
      // 'announcement' pone el grupo en modo anuncio (solo admins envían)
      await sock.groupSettingUpdate(from, 'announcement').catch(err => { throw err; });
      await sock.sendMessage(from, { text: '🔒 Chat cerrado: solo administradores pueden enviar mensajes ahora.' }, { quoted: info }).catch(()=>{});
    } else if (sub === '0') {
      // 'not_announcement' permite que todos envíen mensajes
      await sock.groupSettingUpdate(from, 'not_announcement').catch(err => { throw err; });
      await sock.sendMessage(from, { text: '🔓 Chat abierto: todos pueden enviar mensajes nuevamente.' }, { quoted: info }).catch(()=>{});
    } else {
      await sock.sendMessage(from, { text: 'Uso: .cerrarchat 1 (cerrar) | .cerrarchat 0 (abrir)' }, { quoted: info }).catch(()=>{});
    }
  } catch (err) {
    console.log('cerrarchat - error:', err);
    await sock.sendMessage(from, { text: '❗ No se pudo cambiar la configuración del grupo. Asegúrate de que el bot y tú sean administradores.' }, { quoted: info }).catch(()=>{});
  }
  break;
}



case 'casar': {
  if (!isGroup) {
    await sock.sendMessage(from, { text: 'Este comando solo funciona en grupos.' }, { quoted: info });
    break;
  }

  // Obtener lista de miembros del grupo
  const members = groupMembers.map(m => m.id).filter(id => id !== BotNumber);

  // Determinar si hay reply o menciones
  let targetJid = null;
  try {
    const ctx = info.message?.extendedTextMessage?.contextInfo;
    if (ctx && ctx.participant) targetJid = ctx.participant;
  } catch (e) {}

  if (!targetJid) {
    const mentions = info.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentions.length > 0) targetJid = mentions[0];
  }

  if (targetJid) {
    // Caso dirigido: autor quiere casarse con el target
    const autor = sender;
    await sock.sendMessage(from, {
      text: `💍 @${autor.split('@')[0]} quiere casarse con @${targetJid.split('@')[0]} 💕`,
      mentions: [autor, targetJid]
    }, { quoted: info });
  } else {
    // Caso automático: elegir dos personas al azar
    if (members.length < 2) {
      await sock.sendMessage(from, { text: 'No hay suficientes miembros para elegir.' }, { quoted: info });
      break;
    }
    const shuffled = members.sort(() => 0.5 - Math.random());
    const [p1, p2] = shuffled.slice(0, 2);
    await sock.sendMessage(from, {
      text: `💍 @${p1.split('@')[0]} quiere casarse con @${p2.split('@')[0]} 💕`,
      mentions: [p1, p2]
    }, { quoted: info });
  }
  break;
}


case 'comandosban': {
  // args debe estar definido (por ejemplo args = body.trim().split(/\s+/).slice(1))
  const sub = args[0] ? args[0].toString().trim() : '';
  if (!isGroup) {
    await sock.sendMessage(from, { text: 'Este comando solo funciona en grupos.' }, { quoted: info }).catch(()=>{});
    break;
  }
  if (!isSenderGroupAdmin && !isOwner) {
    await sock.sendMessage(from, { text: 'Solo administradores pueden usar este comando.' }, { quoted: info }).catch(()=>{});
    break;
  }

  // Determinar objetivo: preferir reply, si no, usar mentions
  let targetJid = null;
  // Si es respuesta a un mensaje
  try {
    const ctx = info.message?.extendedTextMessage?.contextInfo;
    if (ctx && ctx.participant) targetJid = ctx.participant;
  } catch (e) { /* ignore */ }

  // Si no hay reply, buscar mentions en el mensaje
  if (!targetJid) {
    const mentions = info.message?.extendedTextMessage?.contextInfo?.mentionedJid
      || info.message?.conversation?.match(/@(\d+)/g) // fallback simple
      || [];
    if (Array.isArray(mentions) && mentions.length > 0) {
      targetJid = mentions[0];
    }
  }

  if (!targetJid) {
    await sock.sendMessage(from, { text: 'Debes responder al mensaje del usuario o mencionarlo para aplicar el comando.' }, { quoted: info }).catch(()=>{});
    break;
  }

  // Normalizar target (si vino sin @s.whatsapp.net)
  if (!targetJid.includes('@')) targetJid = `${targetJid}@s.whatsapp.net`;

  if (sub === '1') {
    if (!commandBanList.includes(targetJid)) {
      commandBanList.push(targetJid);
      saveCommandBan();
    }
    await sock.sendMessage(from, { text: `✅ @${targetJid.split('@')[0]} ha sido baneado de usar comandos.` , mentions: [targetJid] }, { quoted: info }).catch(()=>{});
  } else if (sub === '0') {
    const idx = commandBanList.indexOf(targetJid);
    if (idx !== -1) {
      commandBanList.splice(idx, 1);
      saveCommandBan();
    }
    await sock.sendMessage(from, { text: `✅ @${targetJid.split('@')[0]} ya puede usar comandos nuevamente.` , mentions: [targetJid] }, { quoted: info }).catch(()=>{});
  } else {
    await sock.sendMessage(from, { text: 'Uso: .comandosban 1 (banear) | .comandosban 0 (desbanear). Responde o menciona al usuario objetivo.' }, { quoted: info }).catch(()=>{});
  }
  break;
}


case 'warn': {
  try {
    let targetJid = null;
    if (info.message?.extendedTextMessage?.contextInfo?.participant) targetJid = info.message.extendedTextMessage.contextInfo.participant;
    else if (info.quoted && info.quoted.key && info.quoted.key.participant) targetJid = info.quoted.key.participant;
    const mentioned = info.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (!targetJid && mentioned.length) targetJid = mentioned[0];
    if (!targetJid && args.length) {
      const maybe = args[0];
      if (/^\d{6,}$/.test(maybe)) targetJid = `${maybe}@s.whatsapp.net`;
      else if (maybe.includes('@')) targetJid = maybe.includes('@s.whatsapp.net') ? maybe : `${maybe.split('@')[0]}@s.whatsapp.net`;
    }
    if (!targetJid) {
      const help = `Uso de warn:
- Responde o menciona: .warn <descripcion>  -> añade 1 warn.
- Quitar N warns: .warn -2 (respondiendo o mencionando) -> quita 2 warns.
- Ver warns de un usuario: .warn (respondiendo o mencionando).
- Ver todas las warns: .warns`;
      await sock.sendMessage(from, { text: help }, { quoted: info });
      break;
    }
    if (!targetJid.includes('@')) targetJid = `${targetJid}@s.whatsapp.net`;
    const firstArg = args[0] || '';
    const removeMatch = firstArg.match(/^-([0-9]+)$/);
    if (removeMatch) {
      const n = parseInt(removeMatch[1], 10);
      if (n <= 0) { await sock.sendMessage(from, { text: 'Número inválido para quitar warns.' }, { quoted: info }); break; }
      if (!isOwner && !isSenderGroupAdmin) { await sock.sendMessage(from, { text: 'No tienes permisos para quitar warns.' }, { quoted: info }); break; }
      const res = removeWarnsFromUser(targetJid, n);
      const totalNow = res.total || 0;
      await sock.sendMessage(from, { text: `Se quitaron ${n} warn(s). Warns actuales de @${targetJid.split('@')[0]}: ${totalNow}`, mentions: [targetJid] }, { quoted: info });
      break;
    }
    const restText = q.trim();
    if (!restText) {
      const u = getUserWarns(targetJid);
      const total = u.total || 0;
      if (total === 0) { await sock.sendMessage(from, { text: `@${targetJid.split('@')[0]} no tiene warns.`, mentions: [targetJid] }, { quoted: info }); break; }
      let txt = `Warns de @${targetJid.split('@')[0]} — Total: ${total}\n\n`;
      u.records.forEach((r, i) => { txt += `#${i+1} • ${r.reason}\n  Fecha: ${fmtTs(r.ts)}\n\n`; });
      await sock.sendMessage(from, { text: txt, mentions: [targetJid] }, { quoted: info });
      break;
    }
    if (!isOwner && !isSenderGroupAdmin) { await sock.sendMessage(from, { text: 'No tienes permisos para añadir warns.' }, { quoted: info }); break; }
    const moderator = sender;
    const added = addWarnToUser(targetJid, from, restText, moderator);
    await sock.sendMessage(from, { text: `Se añadió 1 warn a @${targetJid.split('@')[0]}. Total ahora: ${added.total}\nDescripción: ${restText}`, mentions: [targetJid] }, { quoted: info });
  } catch (e) {
    console.log('warn - error:', e);
    await sock.sendMessage(from, { text: 'Ocurrió un error procesando el comando warn.' }, { quoted: info });
  }
  break;
}

case 'warns': {
  try {
    const all = listAllWarns();
    const keys = Object.keys(all);
    if (keys.length === 0) { await sock.sendMessage(from, { text: 'No hay advertencias registradas en la base de datos.' }, { quoted: info }); break; }
    let text = '*Listado global de warns:*\n\n';
    for (const jid of keys) { const u = all[jid]; const num = u.total || 0; text += `@${jid.split('@')[0]} — ${num} warn(s)\n`; }
    const mentionsList = keys.slice(0, 50);
    await sock.sendMessage(from, { text, mentions: mentionsList }, { quoted: info });
  } catch (e) {
    console.log('warns - error:', e);
    await sock.sendMessage(from, { text: 'Ocurrió un error listando warns.' }, { quoted: info });
  }
  break;
}



case 'modoadmin': {
  if (!isGroup) return enviar(respuesta.grupos);
  if (!isSenderGroupAdmin && !isOwner) return enviar(respuesta.admin);
  if (!args[0]) return enviar('Usa: modoadmin 1 para activar o modoadmin 0 para desactivar');

  if (args[0] === '1') {
    if (modoAdminList.includes(from)) return enviar('✅ Modo admin ya está activo en este grupo.');
    modoAdminList.push(from);
    fs.writeFileSync(modoAdminPath, JSON.stringify(modoAdminList, null, 2));
    enviar('✅ Modo admin activado. Los comandos de admin ahora solo pueden ser usados por administradores.');
  } else if (args[0] === '0') {
    if (!modoAdminList.includes(from)) return enviar('⚠️ Modo admin ya estaba desactivado.');
    modoAdminList.splice(modoAdminList.indexOf(from), 1);
    fs.writeFileSync(modoAdminPath, JSON.stringify(modoAdminList, null, 2));
    enviar('🛑 Modo admin desactivado. Los comandos de admin pueden ser usados por cualquier integrante.');
  } else {
    enviar('Parámetro inválido. Usa 1 para activar o 0 para desactivar.');
  }
}
break;


case 'antispam': {
  // args debe ser un arreglo con los parámetros después del comando
  const sub = args[0] ? args[0].toString().trim() : '';
  if (!isGroup) {
    await sock.sendMessage(from, { text: 'Este comando solo funciona en grupos.' }, { quoted: info }).catch(()=>{});
    break;
  }
  if (!isSenderGroupAdmin && !isOwner) {
    await sock.sendMessage(from, { text: 'Solo administradores pueden cambiar la configuración de antispam.' }, { quoted: info }).catch(()=>{});
    break;
  }

  if (sub === '1') {
    if (!antispamList.includes(from)) {
      antispamList.push(from);
      saveAntispam();
    }
    await sock.sendMessage(from, { text: '✅ Antispam ACTIVADO en este grupo.' }, { quoted: info }).catch(()=>{});
  } else if (sub === '0') {
    const idx = antispamList.indexOf(from);
    if (idx !== -1) {
      antispamList.splice(idx, 1);
      saveAntispam();
    }
    await sock.sendMessage(from, { text: '❌ Antispam DESACTIVADO en este grupo.' }, { quoted: info }).catch(()=>{});
  } else {
    await sock.sendMessage(from, { text: 'Uso: .antispam 1 (activar) | .antispam 0 (desactivar)' }, { quoted: info }).catch(()=>{});
  }
  break;
}




case 'topactivos': {
  if (!isGroup) return enviar('⚠️ Este comando solo funciona en grupos.');

  const windowDates = last7DatesLima();
  const desde = windowDates[0];
  const hasta = windowDates[windowDates.length - 1];

  // Construir ranking con miembros del grupo
  const miembros = groupMembers.map(p => p.id).filter(id => id !== BotNumber);
  const ranking = miembros.map(jid => ({
    jid,
    nombre: groupMembers.find(p => p.id === jid)?.name || jid.split('@')[0],
    mensajes: sumUser7d(from, jid)
  }))
  .sort((a, b) => b.mensajes - a.mensajes)
  .slice(0, 10);

  if (ranking.length === 0) return enviar('No hay datos de actividad en los últimos 7 días.');

  let texto = `🏆 Top 10 más activos\n📆 Ventana: ${desde} → ${hasta}\n\n`;
  const menciones = [];
  ranking.forEach((u, i) => {
    texto += `• ${i + 1}. @${u.jid.split('@')[0]} — ${u.mensajes} mensajes\n`;
    menciones.push(u.jid);
  });

  sock.sendMessage(from, { text: texto, mentions: menciones }, { quoted: info });
}
break;

case 'topinactivos': {
  if (!isGroup) return enviar('⚠️ Este comando solo funciona en grupos.');

  const windowDates = last7DatesLima();
  const desde = windowDates[0];
  const hasta = windowDates[windowDates.length - 1];

  const miembros = groupMembers.map(p => p.id).filter(id => id !== BotNumber);
  const ranking = miembros.map(jid => ({
    jid,
    nombre: groupMembers.find(p => p.id === jid)?.name || jid.split('@')[0],
    mensajes: sumUser7d(from, jid)
  }))
  .sort((a, b) => a.mensajes - b.mensajes)
  .slice(0, 10);

  if (ranking.length === 0) return enviar('No hay datos de actividad en los últimos 7 días.');

  let texto = `🥶 Top 10 más inactivos\n📆 Ventana: ${desde} → ${hasta}\n\n`;
  const menciones = [];
  ranking.forEach((u, i) => {
    texto += `• ${i + 1}. @${u.jid.split('@')[0]} — ${u.mensajes} mensajes\n`;
    menciones.push(u.jid);
  });

  sock.sendMessage(from, { text: texto, mentions: menciones }, { quoted: info });
}
break;



//Comandos owner

case 'menu':
case 'help': {
    if (!isGroup) return;
    if (!isReg) return enviar(respuesta.registro);

    const Mnu = Menu(timeFt, Bot, sender, groupName, groupMembers);

    // Enviar imagen del menú completa
    await sock.sendMessage(from, {
        image: { url: JpgBot },
        caption: Mnu,
        mentions: [sender]
    }, { quoted: info });
}
break;

case 'antiprivado':
case 'antipv':{
if(!isOwner) return enviar(respuesta.miowner)
if(args[0]=== 'on' ){
if(isAntipv) return enviar('El anti-privado ya esta activo')
Antipv.push('activo')
fs.writeFileSync('./settings/Json/chat.json' , JSON.stringify(Antipv))
enviar('Anti-privado activado exitosamente')
} else if(args[0] === 'off'){
if(!isAntipv) return enviar('El anti-privado ya estaba desactivado')
Antipv.splice('desactivo')
fs.writeFileSync('./settings/Json/chat.json' , JSON.stringify(Antipv))
enviar('Anti-privado desactivado exitosamente')
} else {
enviar('on para activar y off para desactivar')
}
}
break



case 'rvisu': case 'revelarvisu': case 'open':
    if(!isOwner) return enviar(respuesta.miowner)
    enviar('🥱')
    try{
        if(JSON.stringify(info).includes("videoMessage")) {
            var vio = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
            var viewImage = vio?.imageMessage || info.message?.imageMessage || vio?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || vio?.viewOnceMessage?.message?.imageMessage
            var viewVideo = vio?.videoMessage || info.message?.videoMessage || vio?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || vio?.viewOnceMessage?.message?.videoMessage
            viewVideo.viewOnce = false
            viewVideo.video = {url: viewVideo.url}
            viewVideo.caption += "El vídeo fue *Revelado*"
            sock.sendMessage(from, viewVideo)
        } else {
            var vio = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
            var viewImage = vio?.imageMessage || info.message?.imageMessage || vio?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || vio?.viewOnceMessage?.message?.imageMessage
            var viewVideo = vio?.videoMessage || info.message?.videoMessage || vio?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || vio?.viewOnceMessage?.message?.videoMessage
            viewImage.viewOnce = false
            viewImage.image = {url: `${viewImage.url}`}
            viewImage.caption += "😼"
            sock.sendMessage(from, viewImage)
        }
    } catch(e){
        console.log(e)
        enviar(e)
    }
    break

case 'reiniciar': {
    console.log("=== DEBUG REINICIAR ===");
    console.log("Número que ejecuta el comando:", sender);
    console.log("Número(s) configurados como owner:", global.owner || owner || "No definido");
    console.log("¿Es owner?:", isOwner);

    if (!isOwner) return enviar(respuesta.miowner);

    enviar('𝚁𝙴𝙸𝙽𝙸𝙲𝙸𝙰𝙽𝙳𝙾, 𝙰𝙶𝚄𝙰𝚁𝙳𝙴 𝚄𝙽 𝙼𝙾𝙼𝙴𝙽𝚃𝙾 ');
    setTimeout(async () => {
        console.log("Reiniciando el bot...");
        process.exit(0);
    }, 1000);
}
break;


//AJUSTES DEL GRUPO

case 'welcome': {
  const sub = args[0] ? args[0].toString().trim() : '';
  if (!isGroup) { await sock.sendMessage(from, { text: 'Este comando solo funciona en grupos.' }, { quoted: info }); break; }
  if (!isSenderGroupAdmin && !isOwner) { await sock.sendMessage(from, { text: 'Solo administradores pueden usar este comando.' }, { quoted: info }); break; }

  loadWelkom();
  if (sub === '1') {
    if (!welkomList.includes(from)) { welkomList.push(from); saveWelkom(); }
    await sock.sendMessage(from, { text: '✅ Bienvenidas ACTIVADAS en este grupo.' }, { quoted: info }).catch(()=>{});
  } else if (sub === '0') {
    const idx = welkomList.indexOf(from);
    if (idx !== -1) { welkomList.splice(idx,1); saveWelkom(); }
    await sock.sendMessage(from, { text: '❌ Bienvenidas DESACTIVADAS en este grupo.' }, { quoted: info }).catch(()=>{});
  } else {
    await sock.sendMessage(from, { text: 'Uso: .welcome 1 (activar) | .welcome 0 (desactivar)' }, { quoted: info }).catch(()=>{});
  }
  break;
}

case 'despedida': {
  const sub = args[0] ? args[0].toString().trim() : '';
  if (!isGroup) { await sock.sendMessage(from, { text: 'Este comando solo funciona en grupos.' }, { quoted: info }); break; }
  if (!isSenderGroupAdmin && !isOwner) { await sock.sendMessage(from, { text: 'Solo administradores pueden usar este comando.' }, { quoted: info }); break; }

  loadDespedida();
  if (sub === '1') {
    if (!despedidaList.includes(from)) { despedidaList.push(from); saveDespedida(); }
    await sock.sendMessage(from, { text: '✅ Despedidas ACTIVADAS (promote/remove) en este grupo.' }, { quoted: info }).catch(()=>{});
  } else if (sub === '0') {
    const idx = despedidaList.indexOf(from);
    if (idx !== -1) { despedidaList.splice(idx,1); saveDespedida(); }
    await sock.sendMessage(from, { text: '❌ Despedidas DESACTIVADAS en este grupo.' }, { quoted: info }).catch(()=>{});
  } else {
    await sock.sendMessage(from, { text: 'Uso: .despedida 1 (activar) | .despedida 0 (desactivar)' }, { quoted: info }).catch(()=>{});
  }
  break;
}




case 'bangp':{
  if (!isGroup) return
  if(!isOwner) return enviar(respuesta.miowner)
  if(!isBanGp) { // antes estaba al revés
    const JsonGp = './settings/Grupo/Json/grupo.json';
    bngp.push(from)
    fs.writeFileSync(JsonGp, JSON.stringify(bngp));
    enviar('✅ GRUPO BANEADO EXITOSAMENTE')
  } else {
    enviar('⚠️ El GRUPO YA SE ENCUENTRA BANEADO')
  }
}
break

case 'unbangp':{
  if (!isGroup) return
  if(!isOwner) return enviar(respuesta.miowner)
  if(isBanGp) { // antes también estaba al revés
    const JsonGp = './settings/Grupo/Json/grupo.json';
    bngp = bngp.filter(g => g !== from)
    fs.writeFileSync(JsonGp, JSON.stringify(bngp));
    enviar('✅ GRUPO DESBANEADO EXITOSAMENTE')
  } else {
    enviar('⚠️ El GRUPO YA SE ENCUENTRA DESBANEADO')
  }
}
break



case 'todos':
case 'revivir': {
  if (!isReg) return enviar(respuesta.registro);
  if (!isGroup) return enviar('No se puede invocar en chat *individual*');

  const textoBase = (args.length > 1) ? body.slice(8).trim() : '';
  let teks = `${textoBase}\n\n𝐓𝐎𝐓𝐀𝐋 : ${groupMembers.length}\n`;
  let nu = 0;

  // Inicializar el array de menciones antes de usarlo
  const members_id = [];

  for (let mem of groupMembers) {
    teks += ` ➫ @${mem.id.split('@')[0]}\n`;
    members_id.push(mem.id);
  }

  // Llamada a la función de menciones (usa members_id)
  mentions(
    `⇒   ¡𝑳𝑳𝒂𝒎𝒂𝒅𝒂 𝒂 𝒕𝒐𝒅𝒐 𝑬𝒍 𝑴𝒖𝒏𝒅𝒐!   ⇐\n ◆━━━━━━━▣✦▣━━━━━━━━◆${teks}`,
    members_id,
    true
  );
}
break;

case 'anuncio': {
  if (!isGroup) return enviar('No se puede invocar en chat *individual*');

  const men = [];
  let num = 0;

  let teks = `
⇒⇒  𝑨𝒕𝒆𝒏𝒄𝒊𝒐𝒏 𝒂 𝒆𝒔𝒕𝒆 𝑨𝒏𝒖𝒏𝒄𝒊𝒐. ⇐⇐
   ◆━━━━━━━▣✦▣━━━━━━━━◆


 ❝ ${q || ''} ❞  

   ◆━━━━━━━▣✦▣━━━━━━━━◆

𝐓𝐎𝐓𝐀𝐋 : ${groupMembers.length}\n`;

  for (const m of groupMembers) {
    teks += `• @${m.id.split('@')[0]}\n`;
    men.push(m.id);
  }

  mentions(teks, men, true);
}
break;

case 'kick' :
case 'ban' :
case 'largate' :{
if (!isGroup) return

if(!isBotGroupAdmins) return enviar (respuesta.botadmin)
let mentioned = obtenerMencionado(info);
    if (!mentioned) return enviar("⚠️ Debes mencionar a alguien para usar este comando.");

if(mentioned === BotNumber || mentioned === owner) return enviar('🤨')
await sock.groupParticipantsUpdate(from, [mentioned] , 'remove')
enviar('Accion realizada exitosamente')
}
break




// ⚙️ Comando para activar/desactivar antienlace

case 'antienlace': {
  if (!isGroup) return enviar('⚠️ Este comando solo funciona en grupos.');
  if (!isBotGroupAdmins) return enviar(respuesta.botadmin);
  if (!args[0]) return enviar('Usa: antienlace 1 para activar o antienlace 0 para desactivar');

  const pathAntilink = './settings/Grupo/Json/antilink.json';

  if (args[0] === '1') {
    if (antilink.includes(from)) return enviar('✅ Antienlace ya está activo en este grupo.');
    antilink.push(from);
    fs.writeFileSync(pathAntilink, JSON.stringify(antilink, null, 2));
    enviar('✅ Antienlace activado. Se eliminarán mensajes con enlaces.');
  } else if (args[0] === '0') {
    if (!antilink.includes(from)) return enviar('⚠️ Antienlace ya estaba desactivado.');
    antilink.splice(antilink.indexOf(from), 1);
    fs.writeFileSync(pathAntilink, JSON.stringify(antilink, null, 2));
    enviar('🛑 Antienlace desactivado.');
  } else {
    enviar('Parámetro inválido. Usa 1 para activar o 0 para desactivar.');
  }
}
break;


// STICKERS
case 's':
case 'sticker':
  if(!isReg) return enviar(respuesta.registro)
  if(coins < 1) return enviar(respuesta.coins)
var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
var boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage
var boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage
if(boij2){
enviar(`Creando tu sticker❤️`)
var pack = `
👑 Dueño 👑
 ✅Parchita
⭐𝐂𝐫𝐞𝐚𝐝𝐨 𝐩𝐨𝐫 :
 ${pushname} `
var author2 = `
🤖 𝐁𝐨𝐭 🤖
 ⃟Parchita
💐 𝐆𝐫𝐮𝐩𝐨💐
${groupName} `
owgi = await getFileBuffer(boij2, 'image')
let encmediaa = await sendImageAsSticker2(sock, from, owgi, info, { packname:pack, author:author2})
await DLT_FL(encmediaa)
await addXp(sender,1)
await delkoin(sender,1)
} else if(boij && boij.seconds < 11){
enviar(`Creando tu Sticker ${pushname}`)
var pack = `
👑 Dueño 👑
 ✅Parchita
⭐𝐂𝐫𝐞𝐚𝐝𝐨 𝐩𝐨𝐫 :
 ${pushname} `
var author2 = `
🤖 𝐁𝐨𝐭 🤖
 ⃟Parchita
💐 𝐆𝐫𝐮𝐩𝐨💐
${groupName} `
owgi = await getFileBuffer(boij, 'video')
let encmedia = await sendVideoAsSticker2(sock, from, owgi, info, { packname:pack, author:author2})
await DLT_FL(encmedia)
await addXp(sender,1)
await delkoin(sender,1)
} else {
return enviar(`Marque una imagen o \nUn vídeo máximo de 10 segundos ⏲️`)
}
break

case 'emojimix': {
    if (!isReg) return enviar(respuesta.registro);
    if (coins < 1) return enviar(respuesta.coins);

    if (!q) return enviar(`
🔁𝑪𝒐𝒎𝒃𝒊𝒏𝒂 𝒆𝒎𝒐𝒋𝒊𝒔 𝒚 𝒅𝒆𝒔𝒄𝒖𝒃𝒓𝒆 𝒏𝒖𝒆𝒗𝒂𝒔 𝒄𝒓𝒆𝒂𝒄𝒊𝒐𝒏𝒆𝒔‼️
☑️𝑬𝒔𝒄𝒓𝒊𝒃𝒆 𝒆𝒍 𝒄𝒐𝒎𝒂𝒏𝒅𝒐 𝒂𝒔í:
👉 *emojimix 😊+😂*`);

    enviar('`🔁 𝑴𝒆𝒛𝒄𝒍𝒂𝒏𝒅𝒐...`');

    try {
        let [emoji1, emoji2] = q.split`+`;
        var em = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&
            contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`);

        for (let res of em.results) {
            let templateMessage = {
                image: { url: `${res.url}`, quoted: info }
            };
            sock.sendMessage(from, templateMessage, { quoted: info });

            // Reducir 1 moneda y agregar 1 de experiencia
            await delkoin(sender, 1);
            await addXp(sender, 1);
        }

    } catch (err) {
        enviar('❌ Ocurrió un error, intenta con otros emojis.');
        console.log(err);
    }
}
break;


///////////////////HERRAMIENTAS///////////

case 'amp3':
case 'tomp3':
  if(!isReg) return enviar(respuesta.registro)
if(!isQuotedVideo) return enviar (`[❗] ${sender.split('@')[0]}, Marque un video `)
enviar('`Creando....`')
tomp = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage , 'video')
	sock.sendMessage(from,{audio :  tomp, mimetype: 'audio/mpeg'},{ quoted: info })
		await addXp(sender,6)
		await delkoin(sender,3)
				break


case 'toimg':
  if(!isReg) return enviar(respuesta.registro)
if(!isQuotedSticker) return enviar('[❗]• 𝗠𝗔𝗥𝗤𝗨𝗘 𝗨𝗡 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 •')
try {
enviar('`Creando....`')
buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker')
sock.sendMessage(from, {image: buff , caption : ` [❗] *${pushname}*, Aquí tienes tu pedido `},{quoted : info }).catch(e => {
console.log(e);
enviar('Nose pudo convertir a imagen verifica que sea un sticker y no un gif ❌')
})
await addXp(sender,3)
await delkoin(sender,2)
} catch {
enviar('ocurrio un error ')
}
break



// Función que revisa y felicita
async function checkMonthlyCongratulate() {
  try {
    loadIngresos();
    const now = new Date();
    for (const rec of ingresos) {
      try {
        if (!rec.joinedAt) continue;
        const joined = new Date(rec.joinedAt);
        const months = monthsBetween(joined, now);
        if (months >= 1) {
          rec.congratulatedMonths = rec.congratulatedMonths || [];
          if (!rec.congratulatedMonths.includes(months)) {
            const jid = rec.jid;
            const mention = jid;
            const text = `🎉 ¡Felicidades @${jid.split('@')[0]}! Hoy cumples ${months} mes(es) desde que te uniste a la comunidad (${formatDateDMY(joined)}). ¡Gracias por estar aquí!`;

            // Intentar enviar al grupo configurado primero
            let sent = false;
            if (NOTIFY_GROUP_ID && NOTIFY_GROUP_ID !== 'TU_GRUPO_ID_AQUI') {
              try {
                await sock.sendMessage(NOTIFY_GROUP_ID, { text, mentions: [mention] });
                sent = true;
              } catch (e) {
                console.error('No se pudo enviar a NOTIFY_GROUP_ID, intentando groupId del registro:', e);
              }
            }

            // Si no se envió, intentar al groupId donde se registró el ingreso
            if (!sent && rec.groupId) {
              try {
                await sock.sendMessage(rec.groupId, { text, mentions: [mention] });
                sent = true;
              } catch (e) {
                console.error('No se pudo enviar al groupId del registro, intentando privado:', e);
              }
            }

            // Fallback: enviar privado al usuario
            if (!sent) {
              try {
                await sock.sendMessage(jid, { text, mentions: [mention] });
                sent = true;
              } catch (e) {
                console.error('No se pudo enviar felicitación privada a', jid, e);
              }
            }

            // Registrar que felicitamos por este mes aunque el envío haya fallado (evita reintentos infinitos)
            rec.congratulatedMonths.push(months);
            saveIngresos();
          }
        }
      } catch (e) {
        console.error('Error procesando registro ingreso:', rec, e);
      }
    }
  } catch (e) {
    console.error('checkMonthlyCongratulate error:', e);
  }
}

// Ejecutar al iniciar y luego cada 24 horas
checkMonthlyCongratulate().catch(()=>{});
setInterval(checkMonthlyCongratulate, 24 * 60 * 60 * 1000); // cada 24h






// COMANDOS SIN PREFIJO
default:


/// COMPATIBILIDAD LID/JID

const { jidNormalizedUser } = require("baileys")
const texto = (budy || "").toLowerCase()


   if (budy.startsWith('=>Duueño')) {
    if (!isOwner) return enviar(respuesta.miowner)
        function Return(sul) {
             sat = JSON.stringify(sul, null, 2)
                  bang = util.format(sat)
                       if (sat == undefined) {
                            bang = util.format(sul)
                            }
                            enviar(bang)
                    }
                    try {
                        enviar(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
                    } catch (e) {
                        enviar(String(e))
                    }
                }




}

 } catch (e) {

 e = String(e)
if (!e.includes("this.isZero") && !e.includes("Could not find MIME for Buffer <null>") && !e.includes("Cannot read property 'conversation' of null") && !e.includes("Cannot read property 'contextInfo' of undefined") && !e.includes("Cannot set property 'mtype' of undefined") && !e.includes("jid is not defined")) {
console.log('Error : %s', color(e, 'red'))
}

 }







    })



}
///////////MODIFIC INDEX
startProo()
fs.watchFile('./index.js', (curr, prev) => {
if (curr.mtime.getTime() !== prev.mtime.getTime()) {
console.log(color('  [❗] El archivo Index fue modificada',"blue"));
process.exit()
}
})
