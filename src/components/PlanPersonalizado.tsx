import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../styles/PlanPersonalizado.css';
import { shouldUseLightAnimations } from '../lib/motion';
import type { Producto, PlanOption } from '../types/planTypes';
import {
    buildWhatsAppUrl,
    FRAMEHOUSE_WHATSAPP_DISPLAY,
    FRAMEHOUSE_WHATSAPP_INTERNATIONAL,
} from '../config/contact';

const productosData: Producto[] = [
    { id: 'prod1', nombre: 'Pack de Reels Extra', precio: 150 },
    { id: 'prod2', nombre: 'Sesión Audiovisual Express', precio: 300 },
    { id: 'prod3', nombre: 'Video Premium de Campaña', precio: 450 },
    { id: 'prod4', nombre: 'Pack de Afiches Promocionales', precio: 200 },
    { id: 'prod5', nombre: 'Landing Page para Marca', precio: 350 },
    { id: 'prod6', nombre: 'Branding Base / Identidad Visual', precio: 500 },
];

const productosDescripcion: Record<string, string> = {
    prod1: 'Videos verticales extra para campañas, promociones o lanzamientos.',
    prod2: 'Grabación ligera para generar material visual de marca.',
    prod3: 'Pieza audiovisual más cuidada para campañas de mayor impacto.',
    prod4: 'Diseños para promociones, historias, posts y anuncios visuales.',
    prod5: 'Página simple para presentar tu marca, servicio o campaña.',
    prod6: 'Base visual para que tu marca se vea más coherente y profesional.',
};

const planesData: PlanOption[] = [
    { value: 'impulso', price: 290, name: 'Plan Impulso Digital', label: 'Plan Impulso Digital - USD 280–300 / mes' },
    { value: 'crecimiento', price: 480, name: 'Plan Crecimiento Activo', label: 'Plan Crecimiento Activo - USD 460–500 / mes' },
    { value: 'dominio', price: 715, name: 'Plan Dominio Digital', label: 'Plan Dominio Digital - USD 690–740 / mes' },
];

const planMicrocopy: Record<string, string> = {
    impulso: 'Para empezar con constancia y presencia visual.',
    crecimiento: 'Para marcas que quieren vender y posicionarse mejor.',
    dominio: 'Para presencia diaria, campañas y contenido constante.',
};

function hashFnv1aHex(input: string): string {
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
}

export default function PlanPersonalizado() {
    const [searchParams] = useSearchParams();
    const preselectedPlan = searchParams.get('plan');
    const isValidPlan = (value: string | null): value is string => {
        if (!value) return false;
        return planesData.some((plan) => plan.value === value);
    };

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [planSeleccionado, setPlanSeleccionado] = useState(() => (
        isValidPlan(preselectedPlan) ? preselectedPlan : ''
    ));
    const [productosSeleccionados, setProductosSeleccionados] = useState<string[]>([]);
    const [mensajeVisible, setMensajeVisible] = useState(false);
    const [tipoAviso, setTipoAviso] = useState<'exito' | 'duplicado'>('exito');
    const [missingRequired, setMissingRequired] = useState(false);
    const [planError, setPlanError] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [errorFirebase, setErrorFirebase] = useState<string | null>(null);
    const [empresaRequerida, setEmpresaRequerida] = useState(false);
    const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
    const navigate = useNavigate();
    const pageRef = useRef<HTMLDivElement>(null);
    const homeBtnRef = useRef<HTMLButtonElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const builderRef = useRef<HTMLDivElement>(null);
    const summaryRef = useRef<HTMLElement>(null);
    const nombreRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const empresaRef = useRef<HTMLInputElement>(null);
    const planSelectRef = useRef<HTMLSelectElement>(null);

    const enfocarCampo = (el: HTMLElement | null) => {
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        requestAnimationFrame(() => {
            el.focus({ preventScroll: true });
        });
    };

    useEffect(() => {
        if (isValidPlan(preselectedPlan)) {
            setPlanSeleccionado(preselectedPlan);
            setPlanError(false);
        }
    }, [preselectedPlan]);

    useLayoutEffect(() => {
        const page = pageRef.current;
        const homeBtn = homeBtnRef.current;
        const hero = heroRef.current;
        const builder = builderRef.current;
        const summary = summaryRef.current;
        if (!page || !hero || !builder || !summary) return;

        const lightAnimations = shouldUseLightAnimations();

        const ctx = gsap.context(() => {
            const targets = [homeBtn, hero, builder, summary].filter(Boolean) as HTMLElement[];

            if (lightAnimations) {
                gsap.set(targets, { autoAlpha: 1, y: 0 });
                return;
            }

            gsap.set(targets, {
                autoAlpha: 0,
                y: 12,
            });

            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
            });

            tl.to(homeBtn, {
                autoAlpha: 1,
                y: 0,
                duration: 0.36,
                clearProps: 'opacity,visibility,transform',
            })
                .to(
                    hero,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.44,
                        clearProps: 'opacity,visibility,transform',
                    },
                    '-=0.2',
                )
                .to(
                    [builder, summary],
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.42,
                        stagger: 0.06,
                        clearProps: 'opacity,visibility,transform',
                    },
                    '-=0.26',
                );
        }, page);

        return () => ctx.revert();
    }, []);

    const planActual = planesData.find(p => p.value === planSeleccionado);
    const subtotalPlan = planActual?.price || 0;
    const subtotalProductos = productosSeleccionados.reduce((total, prodId) => {
        const prod = productosData.find(p => p.id === prodId);
        return total + (prod?.precio || 0);
    }, 0);
    const total = subtotalPlan + subtotalProductos;

    const toggleProducto = (id: string) => {
        setProductosSeleccionados(prev => 
            prev.includes(id) 
                ? prev.filter(p => p !== id)
                : [...prev, id]
        );
    };

    const mostrarExito = () => {
        setTipoAviso('exito');
        setMensajeVisible(true);
        setTimeout(() => setMensajeVisible(false), 9000);
    };

    const productosDetalleSeleccionados = productosSeleccionados
        .map((id) => productosData.find((p) => p.id === id))
        .filter((p): p is Producto => Boolean(p));

    // Dedupe sin lecturas: con tus Rules, `read` requiere auth; así que usamos ID determinístico.
    // Si existe el mismo ID, Firestore lo trata como `update` y lo deniega (solo allow create).
    const fingerprintEnvio = useMemo(() => {
        const normalized = {
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(),
            empresa: empresa.trim(),
            plan: planSeleccionado,
            productos: [...productosSeleccionados].sort(),
        };
        return hashFnv1aHex(JSON.stringify(normalized));
    }, [nombre, email, empresa, planSeleccionado, productosSeleccionados]);

    /** Mensaje que va en `?text=` de wa.me (*negrita* estilo WhatsApp). Sin enlace dentro para no alargar la URL. */
    const construirMensajeWhatsapp = (plan: PlanOption): string => {
        const productosTexto =
            productosDetalleSeleccionados.length > 0
                ? productosDetalleSeleccionados
                      .map((prod) => `• ${prod.nombre} — $${prod.precio.toLocaleString('es-ES')} USD`)
                      .join('\n')
                : '• Ninguno';

        return `*✨ Cotización — Plan personalizado Frame House*

*👤 Datos del cliente*
📝 Nombre: ${nombre.trim()}
✉️ Email: ${email.trim()}
🏢 Empresa: ${empresa.trim()}

*📦 Plan elegido*
${plan.name}
💵 $${plan.price.toLocaleString('es-ES')} USD — ${plan.label}

*➕ Productos adicionales*
${productosTexto}

*💰 Total estimado:* $${total.toLocaleString('es-ES')} USD

🕐 ${new Date().toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}

_Contacto: ${FRAMEHOUSE_WHATSAPP_DISPLAY} (${FRAMEHOUSE_WHATSAPP_INTERNATIONAL})_`;
    };

    const construirUrlWhatsapp = (plan: PlanOption): string =>
        buildWhatsAppUrl(construirMensajeWhatsapp(plan));

    type GuardarResultado =
        | { ok: true; docId: string }
        | { ok: false; mensaje: string };

    const guardarEnFirebase = async (plan: PlanOption): Promise<GuardarResultado> => {
        const payload = {
            tipo: 'plan_personalizado' as const,
            fingerprint: fingerprintEnvio,
            cliente: {
                nombre: nombre.trim(),
                email: email.trim().toLowerCase(),
                empresa: empresa.trim(),
            },
            plan: {
                valor: plan.value,
                nombre: plan.name,
                precioUsd: plan.price,
                etiquetaLista: plan.label,
            },
            productosAdicionales: productosDetalleSeleccionados.map((p) => ({
                id: p.id,
                nombre: p.nombre,
                precioUsd: p.precio,
            })),
            totales: {
                subtotalPlanUsd: subtotalPlan,
                subtotalAdicionalesUsd: subtotalProductos,
                totalEstimadoUsd: total,
            },
            creadoEn: serverTimestamp(),
        };

        try {
            await setDoc(doc(db, 'cotizaciones', fingerprintEnvio), payload, { merge: false });
            return { ok: true, docId: fingerprintEnvio };
        } catch (error: any) {
            const code = typeof error?.code === 'string' ? error.code : '';
            // Con tus reglas: create permitido, update NO. Si ya existe el doc => es update => permission-denied.
            if (code === 'permission-denied' || code === 'PERMISSION_DENIED') {
                return { ok: false, mensaje: '__DUPLICADO__' };
            }
            const mensaje =
                error instanceof Error ? error.message : 'No se pudo guardar en la base de datos.';
            console.error('Error al guardar cotización:', error);
            return { ok: false, mensaje };
        }
    };

    const enviarDatos = async () => {
        setErrorFirebase(null);
        setWhatsappUrl(null);

        if (!nombre.trim()) {
            setMissingRequired(true);
            setEmpresaRequerida(false);
            setPlanError(false);
            enfocarCampo(nombreRef.current);
            return;
        }
        if (!email.trim()) {
            setMissingRequired(true);
            setEmpresaRequerida(false);
            setPlanError(false);
            enfocarCampo(emailRef.current);
            return;
        }
        if (!empresa.trim()) {
            setEmpresaRequerida(true);
            setMissingRequired(false);
            setPlanError(false);
            enfocarCampo(empresaRef.current);
            return;
        }

        setMissingRequired(false);
        setEmpresaRequerida(false);

        if (!planActual) {
            setPlanError(true);
            enfocarCampo(planSelectRef.current);
            return;
        }
        setPlanError(false);

        setEnviando(true);
        const resultadoFirebase = await guardarEnFirebase(planActual);
        setEnviando(false);

        if (!resultadoFirebase.ok) {
            if (resultadoFirebase.mensaje === '__DUPLICADO__') {
                setTipoAviso('duplicado');
                setMensajeVisible(true);
                setTimeout(() => setMensajeVisible(false), 4000);
                return;
            }
            setErrorFirebase(resultadoFirebase.mensaje);
            return;
        }

        setWhatsappUrl(construirUrlWhatsapp(planActual));
        mostrarExito();
    };

    return (
        <div className="plan-page" ref={pageRef}>
            <button 
                ref={homeBtnRef}
                onClick={() => navigate('/')} 
                className="home-btn" 
                title="Volver al inicio"
                type="button"
            >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
            </button>

            <main className="plan-shell">
                <section className="plan-hero" ref={heroRef}>
                    <p className="plan-kicker">COTIZACIÓN PERSONALIZADA</p>
                    <h1 className="plan-title">Diseña un plan para tu marca.</h1>
                    <p className="plan-subtitle">
                        Elige un plan base, suma servicios adicionales y envíanos tu cotización. Guardaremos tu solicitud y abriremos WhatsApp para continuar.
                    </p>
                </section>

                <section className="plan-layout">
                    <div className="plan-builder-card" ref={builderRef}>
                        <div className="plan-section-block">
                            <div className="plan-section-heading">
                                <span>01</span>
                                <div>
                                    <h2>Datos del cliente</h2>
                                    <p>Cuéntanos quién eres para registrar tu cotización.</p>
                                </div>
                            </div>

                            <div className="contact-fields">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="plan-nombre">Nombre</label>
                                    <input 
                                        ref={nombreRef}
                                        id="plan-nombre"
                                        type="text" 
                                        className={`form-input ${missingRequired && nombre.trim().length === 0 ? 'error-shake' : ''}`}
                                        placeholder="Tu nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label" htmlFor="plan-email">Email</label>
                                    <input 
                                        ref={emailRef}
                                        id="plan-email"
                                        type="email" 
                                        className={`form-input ${missingRequired && email.trim().length === 0 ? 'error-shake' : ''}`}
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group full">
                                    <label className="form-label" htmlFor="plan-empresa">Empresa</label>
                                    <input 
                                        ref={empresaRef}
                                        id="plan-empresa"
                                        type="text" 
                                        className={`form-input ${empresaRequerida && empresa.trim().length === 0 ? 'error-shake' : ''}`}
                                        placeholder="Nombre de la empresa"
                                        value={empresa}
                                        onChange={(e) => {
                                            setEmpresa(e.target.value);
                                            setEmpresaRequerida(false);
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            {missingRequired && (
                                <p className="field-error" role="alert">
                                    Completa nombre y email (revisa el campo resaltado).
                                </p>
                            )}
                            {empresaRequerida && (
                                <p className="field-error" role="alert">
                                    Indica el nombre de la empresa: así identificamos tu registro en la base de datos.
                                </p>
                            )}
                        </div>

                        <div className="plan-section-block">
                            <div className="plan-section-heading">
                                <span>02</span>
                                <div>
                                    <h2>Plan base</h2>
                                    <p>Selecciona el punto de partida según el nivel de presencia que necesita tu marca.</p>
                                </div>
                            </div>

                            <select
                                ref={planSelectRef}
                                className="plan-select-sr-only"
                                value={planSeleccionado}
                                onChange={(e) => {
                                    setPlanSeleccionado(e.target.value);
                                    setPlanError(false);
                                }}
                                tabIndex={-1}
                                aria-hidden="true"
                            >
                                <option value="">-- Elige un plan --</option>
                                {planesData.map(plan => (
                                    <option key={plan.value} value={plan.value}>
                                        {plan.label}
                                    </option>
                                ))}
                            </select>

                            <div
                                className={`plan-options-grid ${planError ? 'error-shake' : ''}`}
                                role="radiogroup"
                                aria-label="Selecciona tu plan"
                            >
                                {planesData.map((plan) => (
                                    <button
                                        type="button"
                                        key={plan.value}
                                        role="radio"
                                        aria-checked={planSeleccionado === plan.value}
                                        onClick={() => {
                                            setPlanSeleccionado(plan.value);
                                            setPlanError(false);
                                        }}
                                        className={`plan-option-card ${planSeleccionado === plan.value ? 'selected' : ''}`}
                                    >
                                        <span className="plan-option-name">{plan.name}</span>
                                        <strong>${plan.price.toLocaleString('es-ES')} USD</strong>
                                        <small>{planMicrocopy[plan.value]}</small>
                                    </button>
                                ))}
                            </div>

                            {planError && (
                                <p className="field-error" role="alert">
                                    Selecciona un plan base para continuar.
                                </p>
                            )}
                        </div>

                        <div className="plan-section-block">
                            <div className="plan-section-heading">
                                <span>03</span>
                                <div>
                                    <h2>Servicios adicionales</h2>
                                    <p>Suma piezas o servicios extra si tu campaña necesita más fuerza visual.</p>
                                </div>
                            </div>

                            <div className="addons-grid">
                                {productosData.map(prod => (
                                    <button
                                        type="button"
                                        key={prod.id}
                                        onClick={() => toggleProducto(prod.id)}
                                        className={`addon-card ${productosSeleccionados.includes(prod.id) ? 'selected' : ''}`}
                                        aria-pressed={productosSeleccionados.includes(prod.id)}
                                    >
                                        <div className="addon-body">
                                            <span className="addon-check" aria-hidden="true">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="11" height="11">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </span>
                                            <div className="addon-text">
                                                <h3>{prod.nombre}</h3>
                                                <p>{productosDescripcion[prod.id]}</p>
                                            </div>
                                        </div>
                                        <strong>${prod.precio.toLocaleString('es-ES')}</strong>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside className="plan-summary-card" ref={summaryRef}>
                        <h2 className="summary-heading">Resumen de inversión</h2>
                        <p className="summary-intro">
                            Revisa tu selección antes de enviar. El total es estimado y puede ajustarse según el alcance final.
                        </p>

                        <div className="summary-lines">
                            <div className="summary-row">
                                <span>Plan elegido</span>
                                <span>{planActual?.name || 'Ninguno'}</span>
                            </div>
                            <div className="summary-row">
                                <span>Subtotal plan</span>
                                <span>${subtotalPlan.toLocaleString('es-ES')}</span>
                            </div>
                            {productosDetalleSeleccionados.length > 0 && (
                                <div className="summary-addons">
                                    <span className="summary-addons-label">Adicionales</span>
                                    <ul className="summary-addons-list">
                                        {productosDetalleSeleccionados.map((prod) => (
                                            <li key={prod.id}>
                                                <span>{prod.nombre}</span>
                                                <span>${prod.precio.toLocaleString('es-ES')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="summary-row">
                                <span>Subtotal adicionales</span>
                                <span>${subtotalProductos.toLocaleString('es-ES')}</span>
                            </div>
                        </div>

                        <div className="summary-total">
                            <span>Total estimado</span>
                            <strong>${total.toLocaleString('es-ES')}</strong>
                        </div>

                        <button 
                            type="button" 
                            className="submit-btn"
                            onClick={enviarDatos}
                            disabled={enviando}
                            aria-busy={enviando}
                        >
                            {enviando ? 'Enviando...' : 'Enviar cotización'}
                        </button>

                        {whatsappUrl && (
                            <a
                                className="whatsapp-btn"
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Continuar por WhatsApp
                            </a>
                        )}

                        {errorFirebase && (
                            <p className="plan-firebase-error" role="alert">
                                No se pudo enviar a Firebase: {errorFirebase}. Revisa tu conexión y las reglas de Firestore (escritura en <code>cotizaciones</code>).
                            </p>
                        )}
                    </aside>
                </section>
            </main>

            <div className={`message ${mensajeVisible ? 'show' : ''}`}>
                <div className="message-title">✅ Listo</div>
                <div className="message-text">
                    {tipoAviso === 'duplicado'
                        ? 'Tu información ya se encuentra registrada.'
                        : 'Datos guardados correctamente. Si deseas, contáctanos por WhatsApp.'}
                </div>
            </div>
        </div>
    );
}
