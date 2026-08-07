const { Router } = require("express");
const router = Router();
const { db } = require("../db/db");
const { usuarioAutorizado } = require("../middlewares/funcionesPassword");

// ==========================================
// 🛡️ MIDDLEWARE DE SEGURIDAD (CORREGIDO)
// ==========================================
const validarToken = async (req, res, next) => {
    // 1. Buscamos el token en Cookies O en Headers
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    
    // 2. Si no hay token, rechazamos
    if (!token) {
        return res.status(401).json({ estado: false, mensaje: "No hay sesión activa" });
    }

    // 3. Validamos el token usando tu función auxiliar
    const auth = await usuarioAutorizado(token, req);
    
    // 4. Si la validación falla (token expirado o inválido)
    if (auth.status !== 200) {
        return res.status(auth.status).json(auth);
    }
    
    // 5. Todo bien, pasamos al siguiente paso
    next();
};

// =======================================================
// 1. OBTENER DATOS (METAS + LÍMITES CON GASTO REAL)
// =======================================================
// 👇 Usamos 'validarToken' en lugar de 'usuarioAutorizado'
router.get("/presupuesto", validarToken, async (req, res) => {
    try {
        const uid = req.usuario.id;

        // A) Obtener Metas
        const metasSnap = await db.collection('metas').where('uid', '==', uid).get();
        const metas = metasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // B) Obtener Límites definidos por el usuario
        const limitesSnap = await db.collection('limites').where('uid', '==', uid).get();
        let limites = limitesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // C) CALCULAR GASTO REAL DESDE TRANSACCIONES
        const transaccionesSnap = await db.collection('transacciones')
            .where('uid', '==', uid)
            .where('tipo', '==', 'gasto')
            .get();

        const gastosPorCategoria = {};
        transaccionesSnap.forEach(doc => {
            const data = doc.data();
            const cat = data.categoria_nombre;
            const monto = Number(data.monto);
            
            if (gastosPorCategoria[cat]) {
                gastosPorCategoria[cat] += monto;
            } else {
                gastosPorCategoria[cat] = monto;
            }
        });

        // D) Mezclar Límites con Gastos Reales
        if (limites.length === 0) {
            limites = Object.keys(gastosPorCategoria).map(cat => ({
                id: `auto_${cat}`,
                category: cat,
                limit: 0,
                spent: gastosPorCategoria[cat],
                color: 'bg-gray-500', 
                glow: 'text-gray-500'
            }));
        } else {
            limites = limites.map(lim => ({
                ...lim,
                spent: gastosPorCategoria[lim.category] || 0
            }));
        }

        res.json({ estado: true, metas, limites });

    } catch (error) {
        console.error(error);
        res.status(500).json({ estado: false, mensaje: "Error al cargar presupuesto" });
    }
});

// =======================================================
// 2. CRUD METAS
// =======================================================
router.post("/meta", validarToken, async (req, res) => {
    try {
        const nuevaMeta = { ...req.body, uid: req.usuario.id, fecha: new Date().toISOString() };
        const docRef = await db.collection('metas').add(nuevaMeta);
        res.json({ estado: true, mensaje: "Meta creada", id: docRef.id });
    } catch (error) { res.status(500).json({ estado: false }); }
});

router.put("/meta/:id", validarToken, async (req, res) => {
    try {
        await db.collection('metas').doc(req.params.id).update(req.body);
        res.json({ estado: true, mensaje: "Meta actualizada" });
    } catch (error) { res.status(500).json({ estado: false }); }
});

router.delete("/meta/:id", validarToken, async (req, res) => {
    try {
        await db.collection('metas').doc(req.params.id).delete();
        res.json({ estado: true, mensaje: "Meta eliminada" });
    } catch (error) { res.status(500).json({ estado: false }); }
});

// =======================================================
// 3. CRUD LÍMITES
// =======================================================
router.post("/limite", validarToken, async (req, res) => {
    try {
        const { category, limit, color } = req.body;
        
        const existeSnap = await db.collection('limites')
            .where('uid', '==', req.usuario.id)
            .where('category', '==', category)
            .get();

        if (!existeSnap.empty) {
            const id = existeSnap.docs[0].id;
            await db.collection('limites').doc(id).update({ limit, color });
            res.json({ estado: true, mensaje: "Límite actualizado" });
        } else {
            const nuevoLimite = {
                uid: req.usuario.id,
                category,
                limit: Number(limit),
                color: color || 'bg-blue-500',
                glow: color ? color.replace('bg-', 'text-') : 'text-blue-500'
            };
            await db.collection('limites').add(nuevoLimite);
            res.json({ estado: true, mensaje: "Límite configurado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ estado: false, mensaje: "Error al guardar límite" });
    }
});

module.exports = router;