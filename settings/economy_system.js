const fs = require('fs');
const dbPath = './settings/Grupo/Json/economy_data.json';

// Verificación de carpetas y archivos
if (!fs.existsSync('./settings/Grupo/Json')) { 
    fs.mkdirSync('./settings/Grupo/Json', { recursive: true }); 
}
if (!fs.existsSync(dbPath)) { 
    fs.writeFileSync(dbPath, JSON.stringify({}, null, 2)); 
}

// --- FUNCIONES DE BASE DE DATOS ---
const readDb = () => { 
    try { 
        return JSON.parse(fs.readFileSync(dbPath, 'utf8')); 
    } catch (e) { 
        return {}; 
    } 
};

const saveDb = (data) => { 
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); 
};

const getUser = (jid) => {
    const db = readDb();
    if (!db[jid]) {
        db[jid] = {
            woens: 0,
            bank: 0,
            job: null,            
            xp: 0,
            health: 100,
            last_work: 0,
            last_daily: 0,
            properties: []
        };
        saveDb(db);
    }
    return db[jid];
};

const updateUser = (jid, data) => {
    const db = readDb();
    db[jid] = data;
    saveDb(db);
};

// --- CONFIGURACIÓN ---
const jobs = {
    "minero": { salary: [500, 1000], risk: 30, minXp: 0 },
    "pescador": { salary: [200, 600], risk: 0, minXp: 0 },
    "policia": { salary: [800, 800], risk: 10, minXp: 100 },
    "doctor": { salary: [600, 1200], risk: 5, minXp: 250 },
    "leñador": { salary: [400, 700], risk: 15, minXp: 0 },
    "albañil": { salary: [600, 1300], minXp: 20 },
    "periodista": { salary: [2500, 4000], minXp: 200 } // Gana mucho, pero es peligroso
};

const properties = {
    "choza": { cost: 5000, xp_req: 0 },
    "casa": { cost: 50000, xp_req: 500 },
    "edificio": { cost: 500000, xp_req: 2000 }
};

// --- MÓDULOS EXPORTADOS ---
module.exports = {
    getUser,
    updateUser,

    claimDaily: (jid) => {
        const user = getUser(jid);
        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000;
        if (now - user.last_daily < cooldown) return { status: false, time: cooldown - (now - user.last_daily) };
        
        user.woens += 300;
        user.last_daily = now;
        user.health = Math.min(100, user.health + 10);
        updateUser(jid, user);
        return { status: true, reward: 300 };
    },

    setJob: (jid, jobName) => {
        const user = getUser(jid);
        const job = jobName.toLowerCase();
        if (!jobs[job]) return { status: false, msg: "🚫 Trabajo inexistente." };
        if (user.xp < jobs[job].xp_req) return { status: false, msg: `🚫 Necesitas ${jobs[job].xp_req} XP.` };
        
        user.job = job.charAt(0).toUpperCase() + job.slice(1);
        updateUser(jid, user);
        return { status: true, msg: `✅ Ahora eres **${user.job}**.` };
    },

    
    rob: (attackerJid, victimJid) => {
        const thief = getUser(attackerJid);
        const victim = getUser(victimJid);
        if (thief.health < 40) return { status: false, msg: "🏥 Estás muy herido para robar." };
        if (victim.woens < 100) return { status: false, msg: "💸 La víctima es muy pobre." };
        
        if (Math.random() > 0.6) { 
            const stolen = Math.floor(victim.woens * 0.15);
            thief.woens += stolen; 
            victim.woens -= stolen; 
            thief.xp += 20;
            updateUser(attackerJid, thief); 
            updateUser(victimJid, victim);
            return { status: true, msg: `🥷 ¡Robaste **${stolen} Woens**!`, mentions: [victimJid] };
        } else {
            thief.health -= 30; 
            thief.woens = Math.max(0, thief.woens - 200);
            updateUser(attackerJid, thief);
            return { status: false, msg: `🚨 ¡Te atraparon! Perdiste 200 Woens y salud.` };
        }
    },

// --- FUNCIÓN INTERNA DE MUERTE (Añádela dentro de module.exports) ---
    checkDeath: (jid, user) => {
        if (user.health <= 0) {
            // Reinicio total del usuario
            const deadUser = {
                woens: 0,
                bank: 0,
                job: null,
                xp: 0,
                health: 100, // Reace con vida completa pero sin nada
                last_work: 0,
                last_daily: 0,
                properties: []
            };
            fs.writeFileSync('./settings/Grupo/Json/economy_data.json', JSON.stringify({ ...JSON.parse(fs.readFileSync('./settings/Grupo/Json/economy_data.json', 'utf8')), [jid]: deadUser }, null, 2));
            return true;
        }
        return false;
    },

    // --- ACTUALIZACIÓN DE TRABAJAR ---
    work: (jid) => {
        const user = getUser(jid);
        if (!user.job) return { status: false, msg: "⚠️ No tienes trabajo. Usa .elegirtrabajo" };
        
        const now = Date.now();
        const cooldown = 28800000; // 8 horas en milisegundos

        if (now - user.last_work < cooldown) {
                    // Calculamos cuánto tiempo falta para informar al usuario
                    const faltante = cooldown - (now - user.last_work);
                    const horas = Math.floor(faltante / (1000 * 60 * 60));
                    const minutos = Math.floor((faltante % (1000 * 60 * 60)) / (1000 * 60));
                    
                    return { 
                        status: false, 
                        msg: `🕒 Ya trabajaste tu jornada. Debes descansar. \n*Faltan:* ${horas} horas y ${minutos} minutos para volver a trabajar.` 
                    };
                }

        const jobName = user.job.toLowerCase();
        const jobInfo = jobs[jobName];
        const reward = Math.floor(Math.random() * (jobInfo.salary[1] - jobInfo.salary[0] + 1)) + jobInfo.salary[0];

        // --- SISTEMA DE RIESGOS PERSONALIZADOS ---
        let damage = 0;
        let deathMsg = "";
        let accidentMsg = "";
        let probAccidente = 0.15; // Probabilidad base (15%)

        if (jobName === "albañil") {
            probAccidente = 0.20; // 20% de riesgo
            damage = 25;
            const incidentes = ["🧱 ¡Te cayó una pared encima!", "👟 ¡Te clavaste un clavo en el pie!", "🏗️ Te caíste de un andamio."];
            accidentMsg = incidentes[Math.floor(Math.random() * incidentes.length)];
            deathMsg = "💀 **ACCIDENTE MORTAL EN LA OBRA.** No sobreviviste a la caída del edificio.";
        } 
        else if (jobName === "periodista") {
            probAccidente = 0.50; // 50% de riesgo (MUY ALTO)
            damage = 50;
            const incidentes = ["🕵️‍♂️ Investigando la corrupción, fuiste interceptado por sicarios.", "🚫 Fuiste silenciado por revelar la verdad.", "👊 Te dieron una paliza por publicar fotos prohibidas."];
            accidentMsg = incidentes[Math.floor(Math.random() * incidentes.length)];
            deathMsg = "💀 **PERIODISTA CAÍDO.** Te arriesgaste demasiado y la mafia te encontró. Has perdido todo.";
        }
        else {
            // Riesgo genérico para otros trabajos
            damage = 20;
            accidentMsg = "⚠️ Sufriste un percance en tu jornada laboral.";
            deathMsg = "💀 Has muerto por agotamiento extremo en el trabajo.";
        }

        // --- LÓGICA DE EJECUCIÓN ---
        if (Math.random() < probAccidente) {
            user.health = Math.max(0, user.health - damage);
            
            if (user.health <= 0) {
                // RESET TOTAL (Muerte)
                const deadUser = { woens: 0, bank: 0, job: null, xp: 0, health: 100, last_work: 0, last_daily: 0, properties: [] };
                updateUser(jid, deadUser);
                return { status: false, msg: deathMsg };
            }

            user.last_work = now;
            updateUser(jid, user);
            return { status: true, msg: `${accidentMsg} Salud: ${user.health}%` };
        }

        // SI TODO SALE BIEN
        user.woens += reward;
        user.xp += 15;
        user.last_work = now;
        updateUser(jid, user);
        return { status: true, msg: `✅ Trabajaste de ${user.job} con éxito y ganaste ${reward} Woens.` };
    },
    // --- ACTUALIZACIÓN DE COMER ---
    eat: (jid, type) => {
        const user = getUser(jid);
        
        // --- MENÚ DE COMIDAS EXTENDIDO ---
        const menu = {
            "manzana": { costo: 20, salud: 10, riesgo: 5, msg: "🍎 Una manzana algo arrugada." },
            "taco": { costo: 80, salud: 25, riesgo: 15, msg: "🌮 Un taco de dudosa procedencia en la esquina." },
            "hamburguesa": { costo: 250, salud: 45, riesgo: 5, msg: "🍔 Una Burger Deluxe con papas." },
            "pizza": { costo: 400, salud: 60, riesgo: 2, msg: "🍕 Una pizza familiar completa." },
            "banquete": { costo: 1200, salud: 100, riesgo: 0, msg: "🍱 Un banquete real. ¡Salud al máximo y 0 riesgo!" },
            "basura": { costo: 0, salud: 5, riesgo: 60, msg: "🗑️ Escarbaste en los contenedores..." }
        };

        // Si no pone el tipo o el tipo no existe, muestra el menú
        if (!type || !menu[type.toLowerCase()]) {
            let menuTxt = "🍴 *Menú de ParcWillChef* 🍴\n\n";
            for (let item in menu) {
                menuTxt += `*${item.toUpperCase()}*\n`;
                menuTxt += `  💰 Precio: ${menu[item].costo} Woens\n`;
                menuTxt += `  ❤️ Recupera: +${menu[item].salud} HP\n`;
                menuTxt += `  ⚠️ Riesgo: ${menu[item].riesgo}%\n\n`;
            }
            menuTxt += "_Uso: .comer pizza_";
            return { status: false, msg: menuTxt };
        }

        const comida = menu[type.toLowerCase()];

        // Verificación de dinero
        if (user.woens < comida.costo) {
            return { status: false, msg: `❌ No tienes suficientes Woens. Necesitas ${comida.costo}.` };
        }

        // Cobrar la comida
        user.woens -= comida.costo;

        // Lógica de Riesgo (Probabilidad de intoxicación)
        if (Math.random() * 100 < comida.riesgo) {
            // El daño por intoxicación ahora es aleatorio entre 30 y 60
            let daño = Math.floor(Math.random() * 31) + 30;
            user.health = Math.max(0, user.health - daño);

            if (user.health <= 0) {
                const deadUser = { woens: 0, bank: 0, job: null, xp: 0, health: 100, last_work: 0, last_daily: 0, properties: [] };
                updateUser(jid, deadUser);
                return { status: true, msg: `☠️ **MUERTE POR INTOXICACIÓN**\n\n${comida.msg}\nEstaba en mal estado. Has muerto y perdido todo tu progreso.` };
            }

            updateUser(jid, user);
            return { status: true, msg: `🤢 **¡TE SENTÓ MAL!**\n\n${comida.msg}\nTe dio una infección estomacal. Perdiste ${daño}% de salud.` };
        }

        // Lógica de éxito (Recuperar salud)
        if (user.health >= 100) {
            updateUser(jid, user); // Guardar el dinero restado
            return { status: true, msg: "✨ Ya tienes la salud al máximo, pero disfrutaste el sabor." };
        }

        user.health = Math.min(100, user.health + comida.salud);
        updateUser(jid, user);
        return { status: true, msg: `😋 **¡QUÉ RICO!**\n\n${comida.msg}\nRecuperaste ${comida.salud}% de salud. Salud actual: ${user.health}%` };
    },

    // --- ACTUALIZACIÓN DE ARRESTAR (Para el policía) ---
    arrest: (policeJid, criminalJid) => {
        const police = getUser(policeJid);
        const criminal = getUser(criminalJid);

        if (police.job !== "Policia") return { status: false, msg: "🚫 Solo los Policías pueden arrestar." };
        
        if (Math.random() > 0.5) {
            police.woens += 500; 
            police.xp += 30; 
            criminal.health = Math.max(0, criminal.health - 90); // O el valor que prefieras
            updateUser(policeJid, police); 
            updateUser(criminalJid, criminal);
            return { status: true, msg: `👮‍♂️ Arrestaste a @${criminalJid.split('@')[0]}. Bono: 500 Woens.`, mentions: [criminalJid] };
        } else {
            police.health = Math.max(0, police.health - 40); // Daño por el enfrentamiento
            if (police.health <= 0) {
                const deadUser = { woens: 0, bank: 0, job: null, xp: 0, health: 100, last_work: 0, last_daily: 0, properties: [] };
                updateUser(policeJid, deadUser);
                return { status: false, msg: "💀 **CAÍDO EN EL DEBER.** El criminal te disparó y has muerto. Has perdido tu placa y todos tus bienes." };
            }
            updateUser(policeJid, police);
            return { status: false, msg: "🏃‍♂️ El criminal escapó y te hirió gravemente." };
        }
    },

    transfer: (fromJid, toJid, amount) => {
        const userFrom = getUser(fromJid);
        const userTo = getUser(toJid);
        if (userFrom.woens < amount) return "🚫 Woens insuficientes.";
        
        userFrom.woens -= amount; 
        userTo.woens += amount;
        updateUser(fromJid, userFrom); 
        updateUser(toJid, userTo);
        return `✅ Enviados **${amount} Woens**`;
    },

    buyProperty: (jid, propName) => {
        const user = getUser(jid);
        const prop = propName.toLowerCase();
        if (!properties[prop]) return { status: false, msg: "🚫 No existe." };
        if (user.woens < properties[prop].cost || user.xp < properties[prop].xp_req) {
            return { status: false, msg: "🚫 No cumples los requisitos de dinero o XP." };
        }
        
        user.woens -= properties[prop].cost; 
        user.properties.push(prop);
        updateUser(jid, user);
        return { status: true, msg: `🏠 Compraste ${prop}.` };
    },

    
// --- NUEVA FUNCIÓN CURAR ---
    heal: (doctorJid, patientJid) => {
        const doctor = getUser(doctorJid);
        const patient = getUser(patientJid);

        // Validación de trabajo
        if (doctor.job !== "Doctor") {
            return { status: false, msg: "🚫 Solo los Doctores pueden usar este comando." };
        }

        if (patient.health >= 100) {
            return { status: false, msg: "💉 El paciente ya tiene la salud al máximo." };
        }

        // Lógica de curación
        patient.health = Math.min(100, patient.health + 40);
        doctor.xp += 20; // Recompensa por curar
        doctor.woens += 100; // Pago por el servicio

        updateUser(doctorJid, doctor);
        updateUser(patientJid, patient);

        return { 
            status: true, 
            msg: `👨‍⚕️ Has curado a @${patientJid.split('@')[0]}. Recibiste 100 Woens y 20 XP.`,
            mentions: [patientJid] 
        };
    },

    casino: (jid, bet) => {
        const user = getUser(jid);
        if (user.woens < bet) return { status: false, msg: "Sin dinero suficiente." };
        user.woens -= bet;
        if (Math.random() > 0.7) {
            user.woens += bet * 3; 
            updateUser(jid, user);
            return { status: true, msg: `🎰 ¡Ganaste ${bet * 3} Woens!` };
        }
        updateUser(jid, user);
        return { status: false, msg: "🎰 Perdiste en el casino." };
    }
}; // <--- ESTA ES LA LLAVE QUE CIERRA TODO EL MÓDULO
