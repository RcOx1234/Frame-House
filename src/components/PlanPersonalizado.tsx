import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import '../styles/PlanPersonalizado.css';
import type { Producto, PlanOption } from '../types/planTypes';

const productosData: Producto[] = [
    { id: 'prod1', nombre: 'Producto adicional 1', precio: 150 },
    { id: 'prod2', nombre: 'Producto adicional 2', precio: 300 },
    { id: 'prod3', nombre: 'Producto adicional 3', precio: 450 },
    { id: 'prod4', nombre: 'Producto adicional 4', precio: 200 },
    { id: 'prod5', nombre: 'Producto adicional 5', precio: 350 },
    { id: 'prod6', nombre: 'Producto adicional 6', precio: 500 },
];

const planesData: PlanOption[] = [
    { value: 'impulso', price: 290, name: 'Plan Impulso Digital', label: 'Plan Impulso Digital - USD 280–300 / mes' },
    { value: 'crecimiento', price: 480, name: 'Plan Crecimiento Activo', label: 'Plan Crecimiento Activo - USD 460–500 / mes' },
    { value: 'dominio', price: 715, name: 'Plan Dominio Digital', label: 'Plan Dominio Digital - USD 690–740 / mes' },
];

const WHATSAPP_E164 = '593991433792';
const WHATSAPP_DISPLAY = '099 143 3792';
const WHATSAPP_INTERNACIONAL = '+593 99 143 3792';

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
    const [missingRequired, setMissingRequired] = useState(false);
    const [planError, setPlanError] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [errorFirebase, setErrorFirebase] = useState<string | null>(null);
    const [empresaRequerida, setEmpresaRequerida] = useState(false);
    const [linkWhatsappFallback, setLinkWhatsappFallback] = useState<string | null>(null);
    const navigate = useNavigate();
    const whatsappTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

    useEffect(() => {
        return () => {
            if (whatsappTimeoutRef.current) clearTimeout(whatsappTimeoutRef.current);
        };
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
        setMensajeVisible(true);
        setTimeout(() => setMensajeVisible(false), 9000);
    };

    const productosDetalleSeleccionados = productosSeleccionados
        .map((id) => productosData.find((p) => p.id === id))
        .filter((p): p is Producto => Boolean(p));

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

_Contacto: ${WHATSAPP_DISPLAY} (${WHATSAPP_INTERNACIONAL})_`;
    };

    const construirUrlWhatsapp = (plan: PlanOption): string => {
        const base = `https://wa.me/${WHATSAPP_E164}?text=`;
        let msg = construirMensajeWhatsapp(plan);
        const maxUrlLen = 7500;
        let url = base + encodeURIComponent(msg);
        while (url.length > maxUrlLen && msg.length > 120) {
            msg = `${msg.slice(0, Math.floor(msg.length * 0.82))}…`;
            url = base + encodeURIComponent(msg);
        }
        return url;
    };

    type GuardarResultado =
        | { ok: true; docId: string }
        | { ok: false; mensaje: string };

    const guardarEnFirebase = async (plan: PlanOption): Promise<GuardarResultado> => {
        const payload = {
            tipo: 'plan_personalizado' as const,
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
            await addDoc(collection(db, 'cotizaciones'), payload);
            return { ok: true, docId: 'auto' };
        } catch (error) {
            const mensaje =
                error instanceof Error ? error.message : 'No se pudo guardar en la base de datos.';
            console.error('Error al guardar cotización:', error);
            return { ok: false, mensaje };
        }
    };

    const enviarDatos = async () => {
        setErrorFirebase(null);
        setLinkWhatsappFallback(null);
        if (whatsappTimeoutRef.current) {
            clearTimeout(whatsappTimeoutRef.current);
            whatsappTimeoutRef.current = null;
        }

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
            setErrorFirebase(resultadoFirebase.mensaje);
            return;
        }

        const urlWhatsapp = construirUrlWhatsapp(planActual);
        mostrarExito();

        whatsappTimeoutRef.current = window.setTimeout(() => {
            whatsappTimeoutRef.current = null;
            const w = window.open(urlWhatsapp, '_blank', 'noopener,noreferrer');
            if (!w) setLinkWhatsappFallback(urlWhatsapp);
        }, 3000);
    };

    return (
        <div className="plan-page">
            <button 
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

            <div className="plan-card">
                <h1 className="plan-title">Crea tu propio plan</h1>
                
                <div className="contact-fields">
                    <div className="form-group">
                        <label className="form-label">Nombre</label>
                        <input 
                            ref={nombreRef}
                            type="text" 
                            className={`form-input ${missingRequired && nombre.trim().length === 0 ? 'error-shake' : ''}`}
                            placeholder="Tu nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                            ref={emailRef}
                            type="email" 
                            className={`form-input ${missingRequired && email.trim().length === 0 ? 'error-shake' : ''}`}
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Empresa</label>
                        <input 
                            ref={empresaRef}
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

                <div className="form-group">
                    <label className="form-label">Selecciona tu plan</label>
                    <select 
                        ref={planSelectRef}
                        className={`form-select ${planError ? 'error-shake' : ''}`}
                        value={planSeleccionado}
                        onFocus={() => setPlanError(false)}
                        onChange={(e) => {
                            setPlanSeleccionado(e.target.value);
                            setPlanError(false);
                            
                        }}
                    >
                        <option value="">-- Elige un plan --</option>
                        {planesData.map(plan => (
                            <option key={plan.value} value={plan.value}>
                                {plan.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="products-section">
                    <h3 className="products-title">Productos adicionales</h3>
                    <div className="products-grid">
                        {productosData.map(prod => (
                            <div 
                                key={prod.id}
                                className={`product-item ${productosSeleccionados.includes(prod.id) ? 'selected' : ''}`}
                                onClick={() => toggleProducto(prod.id)}
                            >
                                <div className="product-info">
                                    <div className="custom-checkbox">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="11" height="11">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="product-name">{prod.nombre}</span>
                                </div>
                                <span className="product-price">${prod.precio.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="summary">
                    <div className="summary-row">
                        <span>Plan seleccionado:</span>
                        <span>{planActual?.name || 'Ninguno'}</span>
                    </div>
                    <div className="summary-row">
                        <span>Subtotal plan:</span>
                        <span>${subtotalPlan.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                        <span>Adicionales:</span>
                        <span>${subtotalProductos.toLocaleString()}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total estimado</span>
                        <span className="summary-price">${total.toLocaleString()}</span>
                    </div>
                </div>

                <button 
                    type="button" 
                    className="btn-cotizar"
                    onClick={enviarDatos}
                    disabled={enviando}
                    aria-busy={enviando}
                >
                    <span>{enviando ? 'Enviando…' : 'Enviar datos'}</span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                </button>
                {linkWhatsappFallback && (
                    <p className="plan-whatsapp-fallback" role="status">
                        El navegador bloqueó la ventana nueva.{' '}
                        <a href={linkWhatsappFallback} target="_blank" rel="noopener noreferrer">
                            Abrir WhatsApp en otra pestaña
                        </a>
                    </p>
                )}
                {errorFirebase && (
                    <p className="plan-firebase-error" role="alert">
                        No se pudo enviar a Firebase: {errorFirebase}. Revisa tu conexión y las reglas de Firestore (escritura en <code>cotizaciones</code>).
                    </p>
                )}
                {missingRequired && (
                    <p className="mt-3 text-center text-sm text-[#FF6B76]">
                        Completa nombre y email (revisa el campo resaltado arriba).
                    </p>
                )}
                {empresaRequerida && (
                    <p className="mt-3 text-center text-sm text-[#FF6B76]">
                        Indica el nombre de la empresa: así identificamos tu registro en la base de datos.
                    </p>
                )}
            </div>

            <div className={`message ${mensajeVisible ? 'show' : ''}`}>
                <div className="message-title">✅ Listo</div>
                <div className="message-text">
                    Tus datos quedaron guardados. En unos segundos se abrirá WhatsApp ({WHATSAPP_INTERNACIONAL}) en una pestaña nueva con tu mensaje. Si no se abre, permite ventanas emergentes o usa el enlace que aparece debajo del botón.
                </div>
            </div>
        </div>
    );
}